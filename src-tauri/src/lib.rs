mod keyboard;
mod settings;

use std::sync::atomic::{AtomicIsize, Ordering};
use std::sync::{LazyLock, Mutex};
use std::time::Duration;

use arboard::Clipboard;
use serde::Serialize;
use tauri::menu::{CheckMenuItemBuilder, MenuBuilder, MenuItemBuilder, PredefinedMenuItem};
use tauri::tray::TrayIconBuilder;
use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_autostart::ManagerExt;
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};
use winapi::shared::windef::POINT;
use winapi::um::winuser::{
    GetCursorPos, GetForegroundWindow, GetMonitorInfoW, MonitorFromPoint,
    SetForegroundWindow, MONITORINFO, MONITOR_DEFAULTTONEAREST,
};

/// Stores the HWND of the window that was focused before our popup appeared.
static PREV_WINDOW: AtomicIsize = AtomicIsize::new(0);

/// Stores original clipboard content for preservation mode.
static ORIGINAL_CLIPBOARD: LazyLock<Mutex<String>> =
    LazyLock::new(|| Mutex::new(String::new()));

const POPUP_WIDTH: i32 = 420;
const POPUP_HEIGHT: i32 = 560;

#[derive(Clone, Serialize)]
struct PopupPayload {
    text: String,
}

#[derive(Clone, Serialize)]
struct UpdatePayload {
    version: String,
    body: String,
}

/// Called when the global shortcut is pressed.
fn handle_shortcut(app: &AppHandle) {
    // Toggle: if popup is already visible, hide it
    if let Some(window) = app.get_webview_window("popup") {
        if window.is_visible().unwrap_or(false) {
            let _ = window.hide();
            return;
        }
    }

    let app = app.clone();
    std::thread::spawn(move || {
        let s = settings::load(&app);

        // 1. Save the currently focused window
        let hwnd = unsafe { GetForegroundWindow() };
        PREV_WINDOW.store(hwnd as isize, Ordering::SeqCst);

        // 2. If preserving clipboard, save current content first
        if s.preserve_clipboard {
            if let Ok(mut cb) = Clipboard::new() {
                let original = cb.get_text().unwrap_or_default();
                *ORIGINAL_CLIPBOARD.lock().unwrap() = original;
            }
        }

        // 3. Simulate Ctrl+C to copy the selected text
        //    (release_modifiers is called inside simulate_copy)
        keyboard::simulate_copy();
        std::thread::sleep(Duration::from_millis(250));

        // 4. Read clipboard
        let text = Clipboard::new()
            .and_then(|mut c| c.get_text())
            .unwrap_or_default();

        // 5. Get cursor position for popup placement
        let mut cursor = POINT { x: 0, y: 0 };
        unsafe {
            GetCursorPos(&mut cursor);
        }

        // 6. Get the work area of the monitor where the cursor is
        let hmonitor = unsafe { MonitorFromPoint(cursor, MONITOR_DEFAULTTONEAREST) };
        let mut mi: MONITORINFO = unsafe { std::mem::zeroed() };
        mi.cbSize = std::mem::size_of::<MONITORINFO>() as u32;
        unsafe { GetMonitorInfoW(hmonitor, &mut mi) };
        let work = mi.rcWork;

        // Clamp so popup stays within the monitor's work area (handles multi-monitor)
        let x = cursor.x.max(work.left).min(work.right - POPUP_WIDTH);
        let y = cursor.y.max(work.top).min(work.bottom - POPUP_HEIGHT);

        // 7. Position and show the popup
        if let Some(window) = app.get_webview_window("popup") {
            let _ = window.set_position(tauri::PhysicalPosition::new(x, y));
            let _ = window.show();
            let _ = window.set_focus();
            let _ = window.emit("show-popup", PopupPayload { text });
        }
    });
}

/// Tauri command: Apply the selected font style.
/// Writes converted text to clipboard, hides popup, restores previous window, pastes.
#[tauri::command]
fn apply_font(app: AppHandle, text: String) {
    let s = settings::load(&app);

    // Write converted text to clipboard
    if let Ok(mut clipboard) = Clipboard::new() {
        let _ = clipboard.set_text(&text);
    }

    // Hide popup
    if let Some(window) = app.get_webview_window("popup") {
        let _ = window.hide();
    }

    // Auto paste
    if s.auto_paste {
        let prev = PREV_WINDOW.load(Ordering::SeqCst);
        let preserve = s.preserve_clipboard;
        if prev != 0 {
            std::thread::spawn(move || {
                unsafe {
                    SetForegroundWindow(prev as winapi::shared::windef::HWND);
                }
                std::thread::sleep(Duration::from_millis(150));
                keyboard::simulate_paste();

                // If preserving clipboard, restore original content after paste completes
                if preserve {
                    std::thread::sleep(Duration::from_millis(300));
                    let original = ORIGINAL_CLIPBOARD.lock().unwrap().clone();
                    if !original.is_empty() {
                        if let Ok(mut cb) = Clipboard::new() {
                            let _ = cb.set_text(&original);
                        }
                    }
                }
            });
        }
    }
}

/// Tauri command: Dismiss popup without pasting.
#[tauri::command]
fn dismiss_popup(app: AppHandle) {
    if let Some(window) = app.get_webview_window("popup") {
        let _ = window.hide();
    }
    // Restore clipboard if preserving
    let s = settings::load(&app);
    if s.preserve_clipboard {
        let original = ORIGINAL_CLIPBOARD.lock().unwrap().clone();
        if !original.is_empty() {
            if let Ok(mut cb) = Clipboard::new() {
                let _ = cb.set_text(&original);
            }
        }
    }
}

/// Tauri command: Get current settings.
#[tauri::command]
fn get_settings(app: AppHandle) -> settings::Settings {
    settings::load(&app)
}

/// Tauri command: Save settings.
#[tauri::command]
fn save_settings(app: AppHandle, new_settings: settings::Settings) {
    let old_settings = settings::load(&app);
    settings::save(&app, &new_settings);

    // Sync autostart with OS if setting changed
    if old_settings.auto_start != new_settings.auto_start {
        sync_autostart(&app, new_settings.auto_start);
    }
}

/// Enable or disable OS-level autostart registration.
fn sync_autostart(app: &AppHandle, enable: bool) {
    let manager = app.autolaunch();
    if enable {
        if let Err(e) = manager.enable() {
            eprintln!("Failed to enable autostart: {e}");
        }
    } else {
        if let Err(e) = manager.disable() {
            eprintln!("Failed to disable autostart: {e}");
        }
    }
}

/// Check for updates in the background and emit event to frontend if available.
fn check_for_updates(app: AppHandle) {
    use tauri_plugin_updater::UpdaterExt;

    let handle = app.clone();
    tauri::async_runtime::spawn(async move {
        // Delay a few seconds after startup to not block initial UI
        tauri::async_runtime::spawn_blocking(|| {
            std::thread::sleep(Duration::from_secs(5));
        })
        .await
        .ok();

        match handle.updater() {
            Ok(updater) => {
                match updater.check().await {
                    Ok(Some(update)) => {
                        let version = update.version.clone();
                        let body = update.body.clone().unwrap_or_default();
                        eprintln!("Update available: {version}");
                        let _ = handle.emit("update-available", UpdatePayload { version, body });
                    }
                    Ok(None) => {
                        eprintln!("No update available.");
                    }
                    Err(e) => {
                        eprintln!("Update check failed: {e}");
                    }
                }
            }
            Err(e) => {
                eprintln!("Updater init failed: {e}");
            }
        }
    });
}

/// Tauri command: Manually trigger update check from frontend.
#[tauri::command]
async fn check_update(app: AppHandle) -> Result<Option<String>, String> {
    use tauri_plugin_updater::UpdaterExt;

    let updater = app.updater().map_err(|e| e.to_string())?;
    match updater.check().await {
        Ok(Some(update)) => Ok(Some(update.version)),
        Ok(None) => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}

/// Parse a shortcut string like "Ctrl+Shift+F" into a Shortcut struct.
fn parse_shortcut(s: &str) -> Option<Shortcut> {
    let parts: Vec<&str> = s.split('+').map(|p| p.trim()).collect();
    if parts.is_empty() {
        return None;
    }

    let mut modifiers = Modifiers::empty();
    for part in &parts[..parts.len() - 1] {
        match part.to_lowercase().as_str() {
            "ctrl" | "control" => modifiers |= Modifiers::CONTROL,
            "shift" => modifiers |= Modifiers::SHIFT,
            "alt" => modifiers |= Modifiers::ALT,
            "super" | "win" | "meta" => modifiers |= Modifiers::META,
            _ => {}
        }
    }

    let key_str = parts.last()?;
    let code = match key_str.to_lowercase().as_str() {
        "a" => Code::KeyA, "b" => Code::KeyB, "c" => Code::KeyC, "d" => Code::KeyD,
        "e" => Code::KeyE, "f" => Code::KeyF, "g" => Code::KeyG, "h" => Code::KeyH,
        "i" => Code::KeyI, "j" => Code::KeyJ, "k" => Code::KeyK, "l" => Code::KeyL,
        "m" => Code::KeyM, "n" => Code::KeyN, "o" => Code::KeyO, "p" => Code::KeyP,
        "q" => Code::KeyQ, "r" => Code::KeyR, "s" => Code::KeyS, "t" => Code::KeyT,
        "u" => Code::KeyU, "v" => Code::KeyV, "w" => Code::KeyW, "x" => Code::KeyX,
        "y" => Code::KeyY, "z" => Code::KeyZ,
        "0" => Code::Digit0, "1" => Code::Digit1, "2" => Code::Digit2, "3" => Code::Digit3,
        "4" => Code::Digit4, "5" => Code::Digit5, "6" => Code::Digit6, "7" => Code::Digit7,
        "8" => Code::Digit8, "9" => Code::Digit9,
        "f1" => Code::F1, "f2" => Code::F2, "f3" => Code::F3, "f4" => Code::F4,
        "f5" => Code::F5, "f6" => Code::F6, "f7" => Code::F7, "f8" => Code::F8,
        "f9" => Code::F9, "f10" => Code::F10, "f11" => Code::F11, "f12" => Code::F12,
        "space" => Code::Space, "enter" => Code::Enter, "tab" => Code::Tab,
        _ => return None,
    };

    let mods = if modifiers.is_empty() { None } else { Some(modifiers) };
    Some(Shortcut::new(mods, code))
}

/// Tauri command: Update global shortcut at runtime.
#[tauri::command]
fn update_shortcut(app: AppHandle, shortcut: String) -> Result<(), String> {
    let new = parse_shortcut(&shortcut).ok_or("Invalid shortcut format")?;

    // Unregister all existing shortcuts
    let _ = app.global_shortcut().unregister_all();

    // Register new shortcut
    app.global_shortcut()
        .register(new)
        .map_err(|e| e.to_string())?;

    // Save to settings
    let mut s = settings::load(&app);
    s.shortcut = shortcut;
    settings::save(&app, &s);

    Ok(())
}

/// Tauri command: Download and install available update.
#[tauri::command]
async fn install_update(app: AppHandle) -> Result<(), String> {
    use tauri_plugin_updater::UpdaterExt;

    let updater = app.updater().map_err(|e| e.to_string())?;
    let update = updater.check().await.map_err(|e| e.to_string())?;

    if let Some(update) = update {
        update
            .download_and_install(
                |_chunk_length, _content_length| {},
                || {},
            )
            .await
            .map_err(|e| e.to_string())?;

        app.restart();
    }

    Ok(())
}

fn setup_tray(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    let s = settings::load(&app.handle());

    let auto_start = CheckMenuItemBuilder::with_id("auto_start", "Windows起動時に自動起動")
        .checked(s.auto_start)
        .build(app)?;

    let auto_paste = CheckMenuItemBuilder::with_id("auto_paste", "自動貼り付け")
        .checked(s.auto_paste)
        .build(app)?;

    let preserve_cb =
        CheckMenuItemBuilder::with_id("preserve_clipboard", "クリップボードを保持")
            .checked(s.preserve_clipboard)
            .build(app)?;

    let separator = PredefinedMenuItem::separator(app)?;
    let quit = MenuItemBuilder::with_id("quit", "終了").build(app)?;

    let menu = MenuBuilder::new(app)
        .item(&auto_start)
        .item(&auto_paste)
        .item(&preserve_cb)
        .item(&separator)
        .item(&quit)
        .build()?;

    // Use the default window icon from the bundle configuration
    let mut tray_builder = TrayIconBuilder::new()
        .tooltip("FontConverter - Ctrl+Shift+F")
        .menu(&menu)
        .on_menu_event(move |app, event| match event.id().as_ref() {
            "auto_start" => {
                let mut s = settings::load(app);
                s.auto_start = !s.auto_start;
                settings::save(app, &s);
                sync_autostart(app, s.auto_start);
            }
            "auto_paste" => {
                let mut s = settings::load(app);
                s.auto_paste = !s.auto_paste;
                settings::save(app, &s);
            }
            "preserve_clipboard" => {
                let mut s = settings::load(app);
                s.preserve_clipboard = !s.preserve_clipboard;
                settings::save(app, &s);
            }
            "quit" => {
                app.exit(0);
            }
            _ => {}
        });

    if let Some(icon) = app.default_window_icon().cloned() {
        tray_builder = tray_builder.icon(icon);
    }

    let _tray = tray_builder.build(app)?;

    Ok(())
}

pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(|app, _shortcut, event| {
                    if event.state == ShortcutState::Pressed {
                        handle_shortcut(app);
                    }
                })
                .build(),
        )
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            None,
        ))
        .plugin(tauri_plugin_process::init())
        .setup(|app| {
            // Initialize updater plugin
            app.handle()
                .plugin(tauri_plugin_updater::Builder::new().build())?;

            // Register global shortcut from settings (default: Ctrl+Shift+F)
            let s_for_shortcut = settings::load(app.handle());
            let shortcut = parse_shortcut(&s_for_shortcut.shortcut)
                .unwrap_or_else(|| Shortcut::new(
                    Some(Modifiers::CONTROL | Modifiers::SHIFT),
                    Code::KeyF,
                ));
            app.global_shortcut().register(shortcut)?;

            // Sync autostart OS state with saved settings on launch
            let s = settings::load(app.handle());
            sync_autostart(app.handle(), s.auto_start);

            // Setup system tray
            setup_tray(app)?;

            // Check for updates in background
            check_for_updates(app.handle().clone());

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            apply_font,
            dismiss_popup,
            get_settings,
            save_settings,
            check_update,
            install_update,
            update_shortcut,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
