use serde::{Deserialize, Serialize};
use std::fs;
use tauri::{AppHandle, Manager};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HistoryEntry {
    pub style_id: String,
    pub input_text: String,
    pub output_text: String,
    pub timestamp: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Settings {
    pub auto_start: bool,
    pub auto_paste: bool,
    pub preserve_clipboard: bool,
    pub popup_at_cursor: bool,
    pub shortcut: String,
    #[serde(default = "default_true")]
    pub notification_on_copy: bool,
    #[serde(default)]
    pub compact_mode: bool,
    #[serde(default)]
    pub favorites: Vec<String>,
    #[serde(default)]
    pub history: Vec<HistoryEntry>,
}

fn default_true() -> bool {
    true
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            auto_start: false,
            auto_paste: true,
            preserve_clipboard: false,
            popup_at_cursor: true,
            shortcut: "Ctrl+Shift+F".to_string(),
            notification_on_copy: true,
            compact_mode: false,
            favorites: Vec::new(),
            history: Vec::new(),
        }
    }
}

/// Load settings from the app config directory.
pub fn load(app: &AppHandle) -> Settings {
    if let Ok(dir) = app.path().app_config_dir() {
        let path = dir.join("settings.json");
        if path.exists() {
            return fs::read_to_string(&path)
                .ok()
                .and_then(|s| serde_json::from_str(&s).ok())
                .unwrap_or_default();
        }
    }
    Settings::default()
}

/// Save settings to the app config directory.
pub fn save(app: &AppHandle, settings: &Settings) {
    if let Ok(dir) = app.path().app_config_dir() {
        let _ = fs::create_dir_all(&dir);
        let path = dir.join("settings.json");
        if let Ok(json) = serde_json::to_string_pretty(settings) {
            let _ = fs::write(path, json);
        }
    }
}
