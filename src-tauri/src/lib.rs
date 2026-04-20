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
    settings::save(&app, &new_settings);
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
        .setup(|app| {
            // Register global shortcut: Ctrl+Shift+F
            let shortcut = Shortcut::new(
                Some(Modifiers::CONTROL | Modifiers::SHIFT),
                Code::KeyF,
            );
            app.global_shortcut().register(shortcut)?;

            // Setup system tray
            setup_tray(app)?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            apply_font,
            dismiss_popup,
            get_settings,
            save_settings,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
