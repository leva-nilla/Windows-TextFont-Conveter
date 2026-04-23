// app.js
// FontConverter - Popup UI Logic
// Uses window.__TAURI__ (withGlobalTauri: true) for IPC

(function () {
    'use strict';

    // --- Tauri IPC ---
    const { invoke } = window.__TAURI__.core;
    const { listen } = window.__TAURI__.event;

    // --- DOM Elements ---
    const inputText = document.getElementById('input-text');
    const searchText = document.getElementById('search-text');
    const fontGrid = document.getElementById('font-grid');
    const btnClose = document.getElementById('btn-close');
    const btnSettings = document.getElementById('btn-settings');
    const settingsPanel = document.getElementById('settings-panel');
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const btnHistory = document.getElementById('btn-history');
    const historyPanel = document.getElementById('history-panel');
    const historyList = document.getElementById('history-list');
    const btnCloseHistory = document.getElementById('btn-close-history');
    const shortcutInput = document.getElementById('setting-shortcut');
    const shortcutLabel = document.getElementById('status-shortcut-label');

    // Settings checkboxes
    const settingAutoPaste = document.getElementById('setting-auto-paste');
    const settingPreserveClipboard = document.getElementById('setting-preserve-clipboard');
    const settingAutoStart = document.getElementById('setting-auto-start');
    const settingNotificationOnCopy = document.getElementById('setting-notification-on-copy');
    const settingCompactMode = document.getElementById('setting-compact-mode');

    // --- Category labels ---
    const categoryLabels = {
        favorites: '★ お気に入り',
        math: 'Mathematical',
        script: 'Script',
        decorative: 'Decorative',
        sans: 'Sans-Serif',
        enclosed: 'Enclosed',
        special: 'Special',
        combining: 'Combining',
        decoration: 'Decoration',
        japanese: '日本語',
        character: 'キャラ風',
    };

    // --- State ---
    let currentText = '';
    let currentSettings = null;
    let searchQuery = '';
    let favorites = [];
    let history = [];
    const MAX_HISTORY = 5;

    // --- Initialize ---
    async function init() {
        setupEventListeners();
        loadSettings();
        renderGrid('Sample Text');
        listenForUpdates();
        
        try {
            const version = await window.__TAURI__.app.getVersion();
            document.getElementById('app-version-desc').textContent = 'v' + version;
        } catch (e) {
            document.getElementById('app-version-desc').textContent = '不明';
        }
    }

    // --- Event Listeners ---
    function setupEventListeners() {
        // Listen for show-popup event from Rust backend
        listen('show-popup', (event) => {
            const { text } = event.payload;
            currentText = text || '';
            inputText.value = currentText;
            renderGrid(currentText || 'Sample Text');

            // Close panels when popup reopens
            settingsPanel.classList.add('hidden');
            historyPanel.classList.add('hidden');

            inputText.focus();
            inputText.setSelectionRange(0, inputText.value.length);
        });

        // Input text change → update previews
        inputText.addEventListener('input', () => {
            currentText = inputText.value;
            renderGrid(currentText || 'Sample Text');
        });

        // Search text change → filter grid
        searchText.addEventListener('input', () => {
            searchQuery = searchText.value.trim().toLowerCase();
            renderGrid(currentText || 'Sample Text');
        });

        // Close button
        btnClose.addEventListener('click', dismissPopup);

        // Settings button
        btnSettings.addEventListener('click', () => {
            settingsPanel.classList.toggle('hidden');
            historyPanel.classList.add('hidden');
        });

        // Close settings button
        btnCloseSettings.addEventListener('click', () => {
            settingsPanel.classList.add('hidden');
        });

        // History button
        btnHistory.addEventListener('click', () => {
            historyPanel.classList.toggle('hidden');
            settingsPanel.classList.add('hidden');
            renderHistory();
        });

        // Close history button
        btnCloseHistory.addEventListener('click', () => {
            historyPanel.classList.add('hidden');
        });

        settingAutoPaste.addEventListener('change', saveCurrentSettings);
        settingPreserveClipboard.addEventListener('change', saveCurrentSettings);
        settingAutoStart.addEventListener('change', saveCurrentSettings);
        settingNotificationOnCopy.addEventListener('change', saveCurrentSettings);
        settingCompactMode.addEventListener('change', () => {
            applyCompactMode(settingCompactMode.checked);
            saveCurrentSettings();
        });

        // Shortcut input — capture key combo
        shortcutInput.addEventListener('keydown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const parts = [];
            if (e.ctrlKey) parts.push('Ctrl');
            if (e.shiftKey) parts.push('Shift');
            if (e.altKey) parts.push('Alt');
            if (e.metaKey) parts.push('Win');

            const key = e.key;
            // Ignore modifier-only keypresses
            if (['Control', 'Shift', 'Alt', 'Meta'].includes(key)) return;

            // Normalize key name
            let keyName = key.length === 1 ? key.toUpperCase() : key;
            parts.push(keyName);

            const combo = parts.join('+');
            shortcutInput.value = combo;

            // Apply the new shortcut
            applyShortcut(combo);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                if (!settingsPanel.classList.contains('hidden')) {
                    settingsPanel.classList.add('hidden');
                } else if (!historyPanel.classList.contains('hidden')) {
                    historyPanel.classList.add('hidden');
                } else {
                    dismissPopup();
                }
            }
        });
    }

    // --- Shortcut ---
    async function applyShortcut(combo) {
        try {
            await invoke('update_shortcut', { shortcut: combo });
            shortcutLabel.textContent = combo;
        } catch (err) {
            console.error('Failed to update shortcut:', err);
            // Revert display to current setting
            if (currentSettings) {
                shortcutInput.value = currentSettings.shortcut;
            }
        }
    }

    // --- Auto Update ---
    function listenForUpdates() {
        listen('update-available', (event) => {
            const { version } = event.payload;
            showUpdateBanner(version);
        });
    }

    function showUpdateBanner(version) {
        const banner = document.getElementById('update-banner');
        const versionLabel = document.getElementById('update-version');
        if (banner && versionLabel) {
            versionLabel.textContent = `v${version}`;
            banner.classList.remove('hidden');
        }
    }

    async function triggerUpdate() {
        const banner = document.getElementById('update-banner');
        const bannerText = banner?.querySelector('.update-banner-text');
        if (bannerText) {
            bannerText.textContent = 'アップデート中...';
        }
        try {
            await invoke('install_update');
        } catch (err) {
            console.error('Update failed:', err);
            if (bannerText) {
                bannerText.textContent = 'アップデート失敗';
            }
        }
    }

    // Expose triggerUpdate for onclick
    window.triggerUpdate = triggerUpdate;

    // --- Settings ---
    async function loadSettings() {
        try {
            currentSettings = await invoke('get_settings');
            settingAutoPaste.checked = currentSettings.auto_paste;
            settingPreserveClipboard.checked = currentSettings.preserve_clipboard;
            settingAutoStart.checked = currentSettings.auto_start;
            settingNotificationOnCopy.checked = currentSettings.notification_on_copy;
            settingCompactMode.checked = currentSettings.compact_mode;
            applyCompactMode(currentSettings.compact_mode);

            // Load favorites
            favorites = currentSettings.favorites || [];

            // Load history
            history = currentSettings.history || [];

            // Load shortcut
            shortcutInput.value = currentSettings.shortcut || 'Ctrl+Shift+F';
            shortcutLabel.textContent = currentSettings.shortcut || 'Ctrl+Shift+F';
        } catch (err) {
            console.error('Failed to load settings:', err);
        }
    }

    async function saveCurrentSettings() {
        if (!currentSettings) return;
        currentSettings.auto_paste = settingAutoPaste.checked;
        currentSettings.preserve_clipboard = settingPreserveClipboard.checked;
        currentSettings.auto_start = settingAutoStart.checked;
        currentSettings.notification_on_copy = settingNotificationOnCopy.checked;
        currentSettings.compact_mode = settingCompactMode.checked;
        currentSettings.favorites = favorites;
        currentSettings.history = history;
        try {
            await invoke('save_settings', { newSettings: currentSettings });
        } catch (err) {
            console.error('Failed to save settings:', err);
        }
    }

    // --- Favorites ---
    function toggleFavorite(styleId) {
        const idx = favorites.indexOf(styleId);
        if (idx >= 0) {
            favorites.splice(idx, 1);
        } else {
            favorites.push(styleId);
        }
        saveCurrentSettings();
        renderGrid(currentText || 'Sample Text');
    }

    // --- History ---
    function addHistory(styleId, inputText, outputText) {
        const entry = {
            style_id: styleId,
            input_text: inputText,
            output_text: outputText,
            timestamp: Date.now(),
        };
        history.unshift(entry);
        if (history.length > MAX_HISTORY) history.pop();
        saveCurrentSettings();
    }

    function renderHistory() {
        historyList.innerHTML = '';
        if (history.length === 0) {
            historyList.innerHTML = '<div class="empty-state"><div>履歴はまだありません</div></div>';
            return;
        }
        for (const entry of history) {
            const style = window.FONT_STYLES.find(s => s.id === entry.style_id);
            const item = document.createElement('div');
            item.className = 'history-item';
            item.innerHTML = `
                <div class="history-item-label">${style ? style.nameJa : entry.style_id}</div>
                <div class="history-item-preview">${escapeHtml(entry.output_text)}</div>
            `;
            item.addEventListener('click', () => {
                applyFont(entry.output_text, item);
            });
            historyList.appendChild(item);
        }
    }

    // --- Dismiss Popup ---
    async function dismissPopup() {
        try {
            await invoke('dismiss_popup');
        } catch (err) {
            console.error('dismiss_popup error:', err);
        }
    }

    // --- Apply Font ---
    async function applyFont(convertedText, cardElement) {
        try {
            showCopyFeedback(cardElement);
            await invoke('apply_font', { text: convertedText });
        } catch (err) {
            console.error('apply_font error:', err);
        }
    }

    // --- Copy Feedback Animation ---
    function showCopyFeedback(card) {
        if (currentSettings && !currentSettings.notification_on_copy) return;
        card.classList.add('copied');
        setTimeout(() => card.classList.remove('copied'), 500);
    }

    // --- Compact Mode ---
    function applyCompactMode(enabled) {
        document.getElementById('font-grid').classList.toggle('compact', enabled);
    }

    // --- Render Font Grid ---
    function renderGrid(text) {
        fontGrid.innerHTML = '';

        if (!text || text.trim() === '') {
            fontGrid.innerHTML = `
                <div class="empty-state">
                    <div class="icon">⌨</div>
                    <div>テキストを入力してください</div>
                </div>
            `;
            return;
        }

        const allStyles = window.FONT_STYLES;

        // Filter by search query
        const filtered = searchQuery
            ? allStyles.filter(s =>
                s.name.toLowerCase().includes(searchQuery) ||
                s.nameJa.toLowerCase().includes(searchQuery) ||
                s.id.toLowerCase().includes(searchQuery) ||
                (categoryLabels[s.category] || s.category).toLowerCase().includes(searchQuery)
            )
            : allStyles;

        // Separate favorites from the rest
        const favStyles = filtered.filter(s => favorites.includes(s.id));
        const otherStyles = filtered;

        // Render favorites section first
        if (favStyles.length > 0) {
            const label = document.createElement('div');
            label.className = 'category-label category-label-fav';
            label.textContent = categoryLabels.favorites;
            fontGrid.appendChild(label);

            for (const style of favStyles) {
                fontGrid.appendChild(createCard(style, text, true));
            }
        }

        // Render other categories
        let lastCategory = null;
        for (const style of otherStyles) {
            if (style.category !== lastCategory) {
                lastCategory = style.category;
                const label = document.createElement('div');
                label.className = 'category-label';
                label.textContent = categoryLabels[style.category] || style.category;
                fontGrid.appendChild(label);
            }
            fontGrid.appendChild(createCard(style, text, false));
        }

        // No results message
        if (filtered.length === 0) {
            fontGrid.innerHTML = `
                <div class="empty-state">
                    <div class="icon">🔍</div>
                    <div>「${escapeHtml(searchQuery)}」に一致するスタイルが見つかりません</div>
                </div>
            `;
        }
    }

    function createCard(style, text, isFavSection) {
        const converted = window.convertText(text, style);
        const isFav = favorites.includes(style.id);

        const card = document.createElement('div');
        card.className = 'font-card' + (isFav ? ' is-favorite' : '');
        card.setAttribute('data-style-id', style.id);
        card.innerHTML = `
            <div class="font-card-label">
                <span class="fav-star" title="お気に入り">${isFav ? '★' : '☆'}</span>
                ${style.name}
                <span class="label-ja">${style.nameJa}</span>
            </div>
            <div class="font-card-preview">${escapeHtml(converted)}</div>
            <div class="font-card-status">✓</div>
        `;

        // Click card → copy
        card.addEventListener('click', (e) => {
            // Don't copy if clicking the star
            if (e.target.classList.contains('fav-star')) return;
            const actualText = window.convertText(currentText, style);
            applyFont(actualText, card);
            addHistory(style.id, currentText, actualText);
        });

        // Click star → toggle favorite
        const star = card.querySelector('.fav-star');
        star.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(style.id);
        });

        return card;
    }

    // --- Utility: Escape HTML ---
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // --- Start ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
