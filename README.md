# Windows TextFont Converter

Unicode装飾フォントへのリアルタイム変換＆自動貼り付け機能を備えた、超軽量Windowsデスクトップアプリ。

![Shortcut](https://img.shields.io/badge/Shortcut-Ctrl%2BShift%2BF-blue)
![Memory](https://img.shields.io/badge/Memory-~30MB-green)
![Size](https://img.shields.io/badge/EXE-4.4MB-orange)

## 特徴

- **Win+V風ポップアップ** — ショートカットキーでカーソル付近にフローティングUIを表示
- **29種のフォントスタイル** — Bold, Italic, Script, Fraktur, Bubble, Square 等
- **自動コピー＆貼り付け** — 選択テキストを自動取得し、変換後に自動ペースト
- **クリップボード保持モード** — 変換操作後にクリップボードを元の状態に復元
- **超軽量** — Tauri v2 + Rust製で常駐メモリ約30MB（Electron比1/5以下）
- **システムトレイ常駐** — 右クリックで設定・終了
- **Windows起動時自動起動** — 設定で有効化可能

## 使い方

1. アプリを起動するとシステムトレイに常駐
2. テキストを選択し `Ctrl+Shift+F` を押す
3. フォントスタイル一覧からクリックで選択
4. 変換されたテキストが自動的に貼り付けられる

## 対応フォントスタイル（29種）

| カテゴリ | スタイル |
|---------|---------|
| Mathematical | Bold, Italic, Bold Italic |
| Script | Script, Bold Script |
| Decorative | Fraktur, Bold Fraktur, Double-Struck, Monospace |
| Sans-Serif | Sans, Sans Bold, Sans Italic, Sans Bold Italic |
| Enclosed | Bubble (白/黒), Square (白/黒), Parenthesized |
| Special | Small Caps, Superscript, Fullwidth, Upside Down, Spaced |
| Combining | Strikethrough, Underline, Double Underline, Slash Through, Dots Above, Wavy |

## インストール

### インストーラー（推奨）
[Releases](https://github.com/leva-nilla/Windows-TextFont-Conveter/releases) から `FontConverter_x.x.x_x64-setup.exe` をダウンロードして実行。

### ポータブル版
`font-converter.exe` を任意の場所に配置して実行。

## ビルド

### 前提条件
- [Rust](https://rustup.rs/) (1.75+)
- [Node.js](https://nodejs.org/) (18+)

### ビルド手順
```bash
npm install
npx tauri build
```

## 技術スタック

- **Backend**: Rust + Tauri v2
- **Frontend**: Vanilla HTML/CSS/JS (WebView2)
- **Keyboard Simulation**: Windows SendInput API
- **Clipboard**: arboard crate

## ライセンス

MIT
