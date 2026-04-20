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
    const fontGrid = document.getElementById('font-grid');
    const btnClose = document.getElementById('btn-close');
    const btnSettings = document.getElementById('btn-settings');
    const settingsPanel = document.getElementById('settings-panel');
    const btnCloseSettings = document.getElementById('btn-close-settings');

    // Settings checkboxes
    const settingAutoPaste = document.getElementById('setting-auto-paste');
    const settingPreserveClipboard = document.getElementById('setting-preserve-clipboard');
    const settingAutoStart = document.getElementById('setting-auto-start');

    // --- Category labels ---
    const categoryLabels = {
        math: 'Mathematical',
        script: 'Script',
        decorative: 'Decorative',
        sans: 'Sans-Serif',
        enclosed: 'Enclosed',
        special: 'Special',
        combining: 'Combining',
        decoration: 'Decoration',
        japanese: '日本語',
    };

    // --- State ---
    let currentText = '';
    let currentSettings = null;

    // --- Initialize ---
    function init() {
        setupEventListeners();
        loadSettings();
        renderGrid('Sample Text');
    }

    // --- Event Listeners ---
    function setupEventListeners() {
        // Listen for show-popup event from Rust backend
        listen('show-popup', (event) => {
            const { text } = event.payload;
            currentText = text || '';
            inputText.value = currentText;
            renderGrid(currentText || 'Sample Text');

            // Close settings panel when popup reopens
            settingsPanel.classList.add('hidden');

            inputText.focus();
            inputText.setSelectionRange(0, inputText.value.length);
        });

        // Input text change → update previews
        inputText.addEventListener('input', () => {
            currentText = inputText.value;
            renderGrid(currentText || 'Sample Text');
        });

        // Close button
        btnClose.addEventListener('click', dismissPopup);

        // Settings button
        btnSettings.addEventListener('click', () => {
            settingsPanel.classList.toggle('hidden');
        });

        // Close settings button
        btnCloseSettings.addEventListener('click', () => {
            settingsPanel.classList.add('hidden');
        });

        // Settings toggles
        settingAutoPaste.addEventListener('change', saveCurrentSettings);
        settingPreserveClipboard.addEventListener('change', saveCurrentSettings);
        settingAutoStart.addEventListener('change', saveCurrentSettings);

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                if (!settingsPanel.classList.contains('hidden')) {
                    settingsPanel.classList.add('hidden');
                } else {
                    dismissPopup();
                }
            }
        });
    }

    // --- Settings ---
    async function loadSettings() {
        try {
            currentSettings = await invoke('get_settings');
            settingAutoPaste.checked = currentSettings.auto_paste;
            settingPreserveClipboard.checked = currentSettings.preserve_clipboard;
            settingAutoStart.checked = currentSettings.auto_start;
        } catch (err) {
            console.error('Failed to load settings:', err);
        }
    }

    async function saveCurrentSettings() {
        if (!currentSettings) return;
        currentSettings.auto_paste = settingAutoPaste.checked;
        currentSettings.preserve_clipboard = settingPreserveClipboard.checked;
        currentSettings.auto_start = settingAutoStart.checked;
        try {
            await invoke('save_settings', { newSettings: currentSettings });
        } catch (err) {
            console.error('Failed to save settings:', err);
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
        card.classList.add('copied');
        setTimeout(() => card.classList.remove('copied'), 500);
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

        let lastCategory = null;

        for (const style of window.FONT_STYLES) {
            // Category separator
            if (style.category !== lastCategory) {
                lastCategory = style.category;
                const label = document.createElement('div');
                label.className = 'category-label';
                label.textContent = categoryLabels[style.category] || style.category;
                fontGrid.appendChild(label);
            }

            const converted = window.convertText(text, style);

            const card = document.createElement('div');
            card.className = 'font-card';
            card.setAttribute('data-style-id', style.id);
            card.innerHTML = `
                <div class="font-card-label">
                    ${style.name}
                    <span class="label-ja">${style.nameJa}</span>
                </div>
                <div class="font-card-preview">${escapeHtml(converted)}</div>
                <div class="font-card-status">✓</div>
            `;

            card.addEventListener('click', () => {
                const actualText = window.convertText(currentText, style);
                applyFont(actualText, card);
            });

            fontGrid.appendChild(card);
        }
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
