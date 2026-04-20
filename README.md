# Windows TextFont Converter

Unicode装飾フォントへのリアルタイム変換＆自動貼り付け機能を備えた、超軽量Windowsデスクトップアプリ。

![Shortcut](https://img.shields.io/badge/Shortcut-Ctrl%2BShift%2BF-blue)
![Memory](https://img.shields.io/badge/Memory-~30MB-green)
![Size](https://img.shields.io/badge/EXE-4.4MB-orange)
![Styles](https://img.shields.io/badge/Styles-50種-purple)

## 特徴

- **Win+V風ポップアップ** — ショートカットキーでカーソル付近にフローティングUIを表示
- **50種のフォントスタイル** — Bold, Italic, Script, Fraktur, Bubble, Square, 装飾文字 等
- **日本語対応** — ひらがな⇔カタカナ変換、半角カタカナ、濁点付き、結合文字スタイル
- **自動コピー＆貼り付け** — 選択テキストを自動取得し、変換後に自動ペースト
- **クリップボード保持モード** — 変換操作後にクリップボードを元の状態に復元
- **超軽量** — Tauri v2 + Rust製で常駐メモリ約30MB（Electron比1/5以下）
- **マルチモニター対応** — ポップアップが画面外に出ないよう自動調整
- **システムトレイ常駐** — 右クリックで設定・終了
- **Windows起動時自動起動** — 設定で有効化可能

## 使い方

1. アプリを起動するとシステムトレイに常駐
2. テキストを選択して `Ctrl+Shift+F` を押す
3. フォントスタイル一覧からクリックで選択
4. 変換されたテキストが自動的に貼り付けられる

## 設定

ポップアップUI内の ⚙ ボタン、またはシステムトレイの右クリックメニューから設定可能：

| 設定項目 | 説明 |
|---------|------|
| 自動貼り付け | 変換後に自動で Ctrl+V を実行 |
| クリップボードを保持 | 変換前のクリップボード内容を復元 |
| Windows起動時に自動起動 | 最小化状態でバックグラウンド起動 |

## 対応フォントスタイル（50種）

| カテゴリ | スタイル |
|---------|---------|
| Mathematical | Bold, Italic, Bold Italic |
| Script | Script, Bold Script |
| Decorative | Fraktur, Bold Fraktur, Double-Struck, Monospace |
| Sans-Serif | Sans, Sans Bold, Sans Italic, Sans Bold Italic |
| Enclosed | Bubble (白/黒), Square (白/黒), Parenthesized |
| Special | Small Caps, Superscript, Subscript, Fullwidth, Upside Down, Spaced, Aesthetic |
| Combining | Strikethrough, Underline, Double Underline, Slash Through, Dots Above, Wavy Below, Tilde, Diaeresis, Dot Below, Ring Above, Acute Accent, Caron, Enclosing Circle, Enclosing Square |
| Decoration | ✦ Sparkles ✦, ♥ Hearts ♥, ★ Stars ★, [Brackets], D・o・t・s |
| 日本語 | カタカナ変換, ひらがな変換, 半角カタカナ, 濁点付き |

> **Note:** 結合文字スタイル（取り消し線、下線、点付き等）は日本語テキストにもそのまま適用できます。

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

> **Tip:** Windows Defenderのリアルタイムスキャンがビルドを妨げる場合は、`src-tauri/target` ディレクトリを除外に追加するか、`CARGO_BUILD_JOBS=2` で並列数を制限してください。

## 技術スタック

- **Backend**: Rust + Tauri v2
- **Frontend**: Vanilla HTML/CSS/JS (WebView2)
- **Keyboard Simulation**: Windows SendInput API
- **Clipboard**: arboard crate
- **Monitor Detection**: MonitorFromPoint / GetMonitorInfoW API

## ライセンス

MIT
