// unicode-maps.js
// 50 Unicode Font Styles with Japanese support

function createMathMap(upperStart, lowerStart, digitStart, exceptions = {}) {
    const map = {};
    if (upperStart !== null) {
        for (let i = 0; i < 26; i++) {
            const ch = String.fromCharCode(65 + i);
            map[ch] = exceptions[ch] || String.fromCodePoint(upperStart + i);
        }
    }
    if (lowerStart !== null) {
        for (let i = 0; i < 26; i++) {
            const ch = String.fromCharCode(97 + i);
            map[ch] = exceptions[ch] || String.fromCodePoint(lowerStart + i);
        }
    }
    if (digitStart !== null) {
        for (let i = 0; i < 10; i++) {
            map[String.fromCharCode(48 + i)] = String.fromCodePoint(digitStart + i);
        }
    }
    return map;
}

function createExplicitMap(upperChars, lowerChars, digitChars) {
    const map = {};
    if (upperChars) {
        const chars = [...upperChars];
        for (let i = 0; i < 26 && i < chars.length; i++) {
            map[String.fromCharCode(65 + i)] = chars[i];
        }
    }
    if (lowerChars) {
        const chars = [...lowerChars];
        for (let i = 0; i < 26 && i < chars.length; i++) {
            map[String.fromCharCode(97 + i)] = chars[i];
        }
    }
    if (digitChars) {
        const chars = [...digitChars];
        for (let i = 0; i < 10 && i < chars.length; i++) {
            map[String.fromCharCode(48 + i)] = chars[i];
        }
    }
    return map;
}

// ==========================================
// Enclosed character maps
// ==========================================

// Bubble (White / Circled)
const bubbleWhiteMap = {};
for (let i = 0; i < 26; i++) {
    bubbleWhiteMap[String.fromCharCode(65 + i)] = String.fromCodePoint(0x24B6 + i);
    bubbleWhiteMap[String.fromCharCode(97 + i)] = String.fromCodePoint(0x24D0 + i);
}
bubbleWhiteMap['0'] = '\u24EA';
for (let i = 1; i <= 9; i++) {
    bubbleWhiteMap[String(i)] = String.fromCodePoint(0x2460 + i - 1);
}

// Bubble (Black / Negative Circled)
const bubbleBlackMap = {};
for (let i = 0; i < 26; i++) {
    bubbleBlackMap[String.fromCharCode(65 + i)] = String.fromCodePoint(0x1F150 + i);
    bubbleBlackMap[String.fromCharCode(97 + i)] = String.fromCodePoint(0x1F150 + i);
}
bubbleBlackMap['0'] = '\u24FF';
for (let i = 1; i <= 9; i++) {
    bubbleBlackMap[String(i)] = String.fromCodePoint(0x2776 + i - 1);
}

// Square (White)
const squareWhiteMap = {};
for (let i = 0; i < 26; i++) {
    squareWhiteMap[String.fromCharCode(65 + i)] = String.fromCodePoint(0x1F130 + i);
    squareWhiteMap[String.fromCharCode(97 + i)] = String.fromCodePoint(0x1F130 + i);
}

// Square (Black)
const squareBlackMap = {};
for (let i = 0; i < 26; i++) {
    squareBlackMap[String.fromCharCode(65 + i)] = String.fromCodePoint(0x1F170 + i);
    squareBlackMap[String.fromCharCode(97 + i)] = String.fromCodePoint(0x1F170 + i);
}

// Parenthesized
const parenthesizedMap = {};
for (let i = 0; i < 26; i++) {
    parenthesizedMap[String.fromCharCode(65 + i)] = String.fromCodePoint(0x249C + i);
    parenthesizedMap[String.fromCharCode(97 + i)] = String.fromCodePoint(0x249C + i);
}
for (let i = 1; i <= 9; i++) {
    parenthesizedMap[String(i)] = String.fromCodePoint(0x2474 + i - 1);
}
parenthesizedMap['0'] = '0';

// ==========================================
// Special character maps
// ==========================================

// Small Caps
const smallCapsMap = {};
const scChars = [...'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ'];
for (let i = 0; i < 26; i++) {
    smallCapsMap[String.fromCharCode(65 + i)] = String.fromCharCode(65 + i);
    smallCapsMap[String.fromCharCode(97 + i)] = scChars[i];
}
for (let i = 0; i < 10; i++) smallCapsMap[String.fromCharCode(48 + i)] = String.fromCharCode(48 + i);

// Superscript
const superscriptMap = createExplicitMap(
    'ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻ',
    'ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻ',
    '⁰¹²³⁴⁵⁶⁷⁸⁹'
);

// Subscript (limited character set)
const subscriptMap = {};
const subDigits = [...'₀₁₂₃₄₅₆₇₈₉'];
for (let i = 0; i < 10; i++) subscriptMap[String.fromCharCode(48 + i)] = subDigits[i];
const subLetters = {a:'ₐ',e:'ₑ',h:'ₕ',i:'ᵢ',j:'ⱼ',k:'ₖ',l:'ₗ',m:'ₘ',n:'ₙ',o:'ₒ',p:'ₚ',r:'ᵣ',s:'ₛ',t:'ₜ',u:'ᵤ',v:'ᵥ',x:'ₓ'};
Object.assign(subscriptMap, subLetters);

// Upside Down
const upsideDownMap = createExplicitMap(
    '∀ꓭƆᗡƎℲ⅁HIſꓘ˥WNOԀꝹꓤS⊥∩ΛMX⅄Z',
    'ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz',
    '0ƖᄅƐㄣϛ9ㄥ86'
);

// Fullwidth
const fullwidthMap = {};
for (let i = 0; i < 26; i++) {
    fullwidthMap[String.fromCharCode(65 + i)] = String.fromCodePoint(0xFF21 + i);
    fullwidthMap[String.fromCharCode(97 + i)] = String.fromCodePoint(0xFF41 + i);
}
for (let i = 0; i < 10; i++) {
    fullwidthMap[String.fromCharCode(48 + i)] = String.fromCodePoint(0xFF10 + i);
}
fullwidthMap[' '] = '\u3000';

// ==========================================
// Japanese maps
// ==========================================

// Hiragana → Katakana (U+3041-U+3096 → U+30A1-U+30F6)
const hiraganaToKatakanaMap = {};
for (let code = 0x3041; code <= 0x3096; code++) {
    hiraganaToKatakanaMap[String.fromCodePoint(code)] = String.fromCodePoint(code + 0x60);
}
// Also map prolonged sound mark
hiraganaToKatakanaMap['\u3099'] = '\u3099'; // combining dakuten pass-through
hiraganaToKatakanaMap['\u309A'] = '\u309A'; // combining handakuten pass-through

// Katakana → Hiragana (U+30A1-U+30F6 → U+3041-U+3096)
const katakanaToHiraganaMap = {};
for (let code = 0x30A1; code <= 0x30F6; code++) {
    katakanaToHiraganaMap[String.fromCodePoint(code)] = String.fromCodePoint(code - 0x60);
}
katakanaToHiraganaMap['\u30FC'] = '\u30FC'; // prolonged sound mark (no hiragana equivalent, keep as-is)

// Halfwidth Katakana
const katakanaHalfwidthMap = {};
const hwFullKana = 'ヲァィゥェォャュョッーアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン';
const hwFullChars = [...hwFullKana];
for (let i = 0; i < hwFullChars.length; i++) {
    katakanaHalfwidthMap[hwFullChars[i]] = String.fromCodePoint(0xFF66 + i);
}
// Hiragana → halfwidth: convert via katakana offset
for (let code = 0x3041; code <= 0x3096; code++) {
    const kata = String.fromCodePoint(code + 0x60);
    if (katakanaHalfwidthMap[kata]) {
        katakanaHalfwidthMap[String.fromCodePoint(code)] = katakanaHalfwidthMap[kata];
    }
}
// Dakuten katakana → halfwidth base + ﾞ
const dkPairs = [...'ガギグゲゴザジズゼゾダヂヅデドバビブベボヴ'];
const dkBases = [...'カキクケコサシスセソタチツテトハヒフヘホウ'];
for (let i = 0; i < dkPairs.length; i++) {
    if (katakanaHalfwidthMap[dkBases[i]]) {
        katakanaHalfwidthMap[dkPairs[i]] = katakanaHalfwidthMap[dkBases[i]] + '\uFF9E';
    }
}
// Dakuten hiragana
const dkHiraPairs = [...'がぎぐげござじずぜぞだぢづでどばびぶべぼ'];
const dkHiraBases = [...'かきくけこさしすせそたちつてとはひふへほ'];
for (let i = 0; i < dkHiraPairs.length; i++) {
    const kata = String.fromCodePoint(dkHiraBases[i].codePointAt(0) + 0x60);
    if (katakanaHalfwidthMap[kata]) {
        katakanaHalfwidthMap[dkHiraPairs[i]] = katakanaHalfwidthMap[kata] + '\uFF9E';
    }
}
// Handakuten katakana → halfwidth base + ﾟ
const hkPairs = [...'パピプペポ'];
const hkBases = [...'ハヒフヘホ'];
for (let i = 0; i < hkPairs.length; i++) {
    if (katakanaHalfwidthMap[hkBases[i]]) {
        katakanaHalfwidthMap[hkPairs[i]] = katakanaHalfwidthMap[hkBases[i]] + '\uFF9F';
    }
}
// Handakuten hiragana
const hkHiraPairs = [...'ぱぴぷぺぽ'];
const hkHiraBases = [...'はひふへほ'];
for (let i = 0; i < hkHiraPairs.length; i++) {
    const kata = String.fromCodePoint(hkHiraBases[i].codePointAt(0) + 0x60);
    if (katakanaHalfwidthMap[kata]) {
        katakanaHalfwidthMap[hkHiraPairs[i]] = katakanaHalfwidthMap[kata] + '\uFF9F';
    }
}

// ==========================================
// All 50 font styles
// ==========================================
const FONT_STYLES = [
    // ===== Mathematical (13) =====
    {
        id: 'bold', name: 'Bold', nameJa: '太字', category: 'math',
        map: createMathMap(0x1D400, 0x1D41A, 0x1D7CE),
    },
    {
        id: 'italic', name: 'Italic', nameJa: 'イタリック', category: 'math',
        map: createMathMap(0x1D434, 0x1D44E, null, { 'h': '\u210E' }),
    },
    {
        id: 'boldItalic', name: 'Bold Italic', nameJa: '太字イタリック', category: 'math',
        map: createMathMap(0x1D468, 0x1D482, null),
    },
    // ===== Script (2) =====
    {
        id: 'script', name: 'Script', nameJa: '筆記体', category: 'script',
        map: createMathMap(0x1D49C, 0x1D4B6, null, {
            'B': '\u212C', 'E': '\u2130', 'F': '\u2131', 'H': '\u210B',
            'I': '\u2110', 'L': '\u2112', 'M': '\u2133', 'R': '\u211B',
            'e': '\u212F', 'g': '\u210A', 'o': '\u2134',
        }),
    },
    {
        id: 'boldScript', name: 'Bold Script', nameJa: '太字筆記体', category: 'script',
        map: createMathMap(0x1D4D0, 0x1D4EA, null),
    },
    // ===== Decorative (4) =====
    {
        id: 'fraktur', name: 'Fraktur', nameJa: 'フラクトゥール', category: 'decorative',
        map: createMathMap(0x1D504, 0x1D51E, null, {
            'C': '\u212D', 'H': '\u210C', 'I': '\u2111', 'R': '\u211C', 'Z': '\u2128',
        }),
    },
    {
        id: 'boldFraktur', name: 'Bold Fraktur', nameJa: '太字フラクトゥール', category: 'decorative',
        map: createMathMap(0x1D56C, 0x1D586, null),
    },
    {
        id: 'doubleStruck', name: 'Double-Struck', nameJa: '白抜き', category: 'decorative',
        map: createMathMap(0x1D538, 0x1D552, 0x1D7D8, {
            'C': '\u2102', 'H': '\u210D', 'N': '\u2115', 'P': '\u2119',
            'Q': '\u211A', 'R': '\u211D', 'Z': '\u2124',
        }),
    },
    {
        id: 'monospace', name: 'Monospace', nameJa: '等幅', category: 'decorative',
        map: createMathMap(0x1D670, 0x1D68A, 0x1D7F6),
    },
    // ===== Sans-Serif (4) =====
    {
        id: 'sansSerif', name: 'Sans-Serif', nameJa: 'サンセリフ', category: 'sans',
        map: createMathMap(0x1D5A0, 0x1D5BA, 0x1D7E2),
    },
    {
        id: 'sansBold', name: 'Sans Bold', nameJa: 'サンセリフ太字', category: 'sans',
        map: createMathMap(0x1D5D4, 0x1D5EE, 0x1D7EC),
    },
    {
        id: 'sansItalic', name: 'Sans Italic', nameJa: 'サンセリフ斜体', category: 'sans',
        map: createMathMap(0x1D608, 0x1D622, null),
    },
    {
        id: 'sansBoldItalic', name: 'Sans Bold Italic', nameJa: 'サンセリフ太字斜体', category: 'sans',
        map: createMathMap(0x1D63C, 0x1D656, null),
    },
    // ===== Enclosed (5) =====
    {
        id: 'bubbleWhite', name: 'Bubble', nameJa: 'バブル（白）', category: 'enclosed',
        map: bubbleWhiteMap,
    },
    {
        id: 'bubbleBlack', name: 'Bubble (Black)', nameJa: 'バブル（黒）', category: 'enclosed',
        map: bubbleBlackMap,
    },
    {
        id: 'squareWhite', name: 'Square', nameJa: 'スクエア（白）', category: 'enclosed',
        map: squareWhiteMap,
    },
    {
        id: 'squareBlack', name: 'Square (Black)', nameJa: 'スクエア（黒）', category: 'enclosed',
        map: squareBlackMap,
    },
    {
        id: 'parenthesized', name: 'Parenthesized', nameJa: '括弧付き', category: 'enclosed',
        map: parenthesizedMap,
    },
    // ===== Special (7) =====
    {
        id: 'smallCaps', name: 'Small Caps', nameJa: 'スモールキャップス', category: 'special',
        map: smallCapsMap,
    },
    {
        id: 'superscript', name: 'Superscript', nameJa: '上付き文字', category: 'special',
        map: superscriptMap,
    },
    {
        id: 'subscript', name: 'Subscript', nameJa: '下付き文字', category: 'special',
        map: subscriptMap,
    },
    {
        id: 'fullwidth', name: 'Fullwidth', nameJa: '全角', category: 'special',
        map: fullwidthMap,
    },
    {
        id: 'upsideDown', name: 'Upside Down', nameJa: '逆さ文字', category: 'special',
        map: upsideDownMap, reverse: true,
    },
    {
        id: 'spaced', name: 'S p a c e d', nameJa: 'スペース', category: 'special',
        transform: 'spaced',
    },
    {
        id: 'aesthetic', name: 'Ａｅｓｔｈｅｔｉｃ', nameJa: 'エステティック', category: 'special',
        transform: 'aesthetic',
    },
    // ===== Combining - Lines (4) =====
    {
        id: 'strikethrough', name: 'Strikethrough', nameJa: '取り消し線', category: 'combining',
        combiningChar: '\u0336',
    },
    {
        id: 'underline', name: 'Underline', nameJa: '下線', category: 'combining',
        combiningChar: '\u0332',
    },
    {
        id: 'doubleUnderline', name: 'Double Underline', nameJa: '二重下線', category: 'combining',
        combiningChar: '\u0333',
    },
    {
        id: 'slashThrough', name: 'Slash Through', nameJa: '斜線', category: 'combining',
        combiningChar: '\u0338',
    },
    // ===== Combining - Marks (8) =====
    {
        id: 'dotsAbove', name: 'Dots Above', nameJa: '点付き', category: 'combining',
        combiningChar: '\u0307',
    },
    {
        id: 'wavyBelow', name: 'Wavy Below', nameJa: '波線', category: 'combining',
        combiningChar: '\u0330',
    },
    {
        id: 'tildeAbove', name: 'Tilde Above', nameJa: 'チルダ', category: 'combining',
        combiningChar: '\u0303',
    },
    {
        id: 'diaeresis', name: 'Diaeresis', nameJa: 'ダイエレシス', category: 'combining',
        combiningChar: '\u0308',
    },
    {
        id: 'dotBelow', name: 'Dot Below', nameJa: 'ドット下', category: 'combining',
        combiningChar: '\u0323',
    },
    {
        id: 'ringAbove', name: 'Ring Above', nameJa: 'リング', category: 'combining',
        combiningChar: '\u030A',
    },
    {
        id: 'acuteAccent', name: 'Acute Accent', nameJa: 'アキュート', category: 'combining',
        combiningChar: '\u0301',
    },
    {
        id: 'caronAbove', name: 'Caron', nameJa: 'キャロン', category: 'combining',
        combiningChar: '\u030C',
    },
    // ===== Enclosing (2) =====
    {
        id: 'enclosingCircle', name: 'Enclosing Circle', nameJa: '丸囲み', category: 'combining',
        combiningChar: '\u20DD',
    },
    {
        id: 'enclosingSquare', name: 'Enclosing Square', nameJa: '四角囲み', category: 'combining',
        combiningChar: '\u20DE',
    },
    // ===== Decoration (5) =====
    {
        id: 'sparkles', name: '✦ Sparkles ✦', nameJa: 'キラキラ', category: 'decoration',
        transform: 'sparkles',
    },
    {
        id: 'hearts', name: '♥ Hearts ♥', nameJa: 'ハート', category: 'decoration',
        transform: 'hearts',
    },
    {
        id: 'stars', name: '★ Stars ★', nameJa: 'スター', category: 'decoration',
        transform: 'stars',
    },
    {
        id: 'brackets', name: '[B][r][a][c][k][e][t]', nameJa: 'ブラケット', category: 'decoration',
        transform: 'brackets',
    },
    {
        id: 'dotsBetween', name: 'D・o・t・s', nameJa: 'ドット区切り', category: 'decoration',
        transform: 'dotsBetween',
    },
    // ===== Japanese (4) =====
    {
        id: 'katakana', name: 'Katakana', nameJa: 'カタカナ変換', category: 'japanese',
        map: hiraganaToKatakanaMap,
    },
    {
        id: 'hiragana', name: 'Hiragana', nameJa: 'ひらがな変換', category: 'japanese',
        map: katakanaToHiraganaMap,
    },
    {
        id: 'halfwidthKatakana', name: 'ﾊﾝｶｸ ｶﾀｶﾅ', nameJa: '半角カタカナ', category: 'japanese',
        map: katakanaHalfwidthMap,
    },
    {
        id: 'dakuten', name: 'Dakuten', nameJa: '濁点付き', category: 'japanese',
        combiningChar: '\u3099',
    },
    // ===== Character Styles (5) =====
    {
        id: 'hisokaClassic', name: '♠ Hisoka ♥', nameJa: 'ヒソカ風', category: 'character',
        transform: 'hisokaClassic',
    },
    {
        id: 'hisokaSexy', name: '♦ Hisoka～♥', nameJa: 'ヒソカ(妖艶)', category: 'character',
        transform: 'hisokaSexy',
    },
    {
        id: 'hisokaFace', name: '⭐ Hisoka ⭐', nameJa: 'ヒソカの顔', category: 'character',
        transform: 'hisokaFace',
    },
    {
        id: 'mesugakiHeart', name: '♡ざぁこ♡', nameJa: 'メスガキ♡', category: 'character',
        transform: 'mesugakiHeart',
    },
    {
        id: 'mesugakiTaunt', name: '💢ﾒｽｶﾞｷ💢', nameJa: 'メスガキ煽り', category: 'character',
        transform: 'mesugakiTaunt',
    },
];

/**
 * Convert input text using a specific font style.
 */
function convertText(text, style) {
    // Combining character style (works on any script including Japanese)
    if (style.combiningChar) {
        return [...text].map(ch => ch === ' ' ? ch : ch + style.combiningChar).join('');
    }

    // Special transforms
    if (style.transform) {
        switch (style.transform) {
            case 'spaced':
                return [...text].join(' ');
            case 'aesthetic':
                return [...text].map(ch => fullwidthMap[ch] || ch).join(' ');
            case 'sparkles':
                return '✦ ' + [...text].join(' ✦ ') + ' ✦';
            case 'hearts':
                return '♥ ' + [...text].join(' ♥ ') + ' ♥';
            case 'stars':
                return '★ ' + [...text].join(' ★ ') + ' ★';
            case 'brackets':
                return [...text].map(ch => ch === ' ' ? ' ' : `[${ch}]`).join('');
            case 'dotsBetween':
                return [...text].join('・');
            // --- Character styles (Hisoka / Mesugaki) ---
            // テキストの言語・構造を自動認識してキャラらしく変換
            case 'hisokaClassic': {
                // 原作再現: 句読点をトランプマークに置換（漫画の吹き出しと同じ演出）
                const suits = ['♠', '♥', '♦', '♣'];
                let si = 0;
                const next = () => suits[si++ % 4];
                const isJa = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(text);
                let result;
                if (isJa) {
                    result = text
                        .replace(/。/g, () => next())
                        .replace(/、/g, () => next())
                        .replace(/！/g, () => '！' + next())
                        .replace(/？/g, () => '？' + next());
                } else {
                    result = text
                        .replace(/\./g, () => '.' + next())
                        .replace(/,/g, () => ',' + next())
                        .replace(/!/g, () => '!' + next())
                        .replace(/\?/g, () => '?' + next());
                }
                if (si === 0) result += next();
                return result;
            }
            case 'hisokaSexy': {
                // 妖艶ヒソカ: ～で色っぽく伸ばしてからスート
                const suits = ['♥', '♦', '♠', '♣'];
                let si = 0;
                const next = () => '～' + suits[si++ % 4];
                const isJa = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(text);
                let result;
                if (isJa) {
                    result = text
                        .replace(/。/g, () => next())
                        .replace(/、/g, () => next())
                        .replace(/！/g, () => '！' + next())
                        .replace(/？/g, () => '？' + next());
                } else {
                    result = text
                        .replace(/\./g, () => '.' + next())
                        .replace(/,/g, () => ',' + next())
                        .replace(/!/g, () => '!' + next())
                        .replace(/\?/g, () => '?' + next());
                }
                if (si === 0) result += next();
                return result;
            }
            case 'hisokaFace':
                return '⭐' + text + '💧';
            case 'mesugakiHeart': {
                // メスガキ♡: 語尾を自動検出→小悪魔口調に変換、句読点→♡
                const isJa = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(text);
                let result;
                if (isJa) {
                    result = text
                        .replace(/です。/g, 'ですぅ♡')
                        .replace(/です$/g, 'ですぅ♡')
                        .replace(/ます。/g, 'ますぅ♡')
                        .replace(/ます$/g, 'ますぅ♡')
                        .replace(/ました。/g, 'ましたぁ♡')
                        .replace(/ました$/g, 'ましたぁ♡')
                        .replace(/ません。/g, 'ませんけどぉ♡')
                        .replace(/ません$/g, 'ませんけどぉ♡')
                        .replace(/だ。/g, 'だもん♡')
                        .replace(/だ$/g, 'だもん♡')
                        .replace(/よ。/g, 'よぉ♡')
                        .replace(/よ$/g, 'よぉ♡')
                        .replace(/ね。/g, 'ね♡')
                        .replace(/。/g, '♡')
                        .replace(/、/g, '♡');
                    if (!result.endsWith('♡')) result += '♡';
                    result += ' ざぁこ♡';
                } else {
                    result = text.replace(/\./g, '♡').replace(/,/g, '♡');
                    if (!result.endsWith('♡')) result += '♡';
                    result += ' zako♡';
                }
                return result;
            }
            case 'mesugakiTaunt': {
                // メスガキ全力煽り: ねぇ♡で始まり、語尾を徹底的に煽り変換
                const isJa = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(text);
                let result;
                if (isJa) {
                    result = text
                        .replace(/です。/g, 'ですけどぉ？♡')
                        .replace(/です$/g, 'ですけどぉ？♡')
                        .replace(/ます。/g, 'ますけどぉ？♡')
                        .replace(/ます$/g, 'ますけどぉ？♡')
                        .replace(/ました。/g, 'ましたけどぉ？♡')
                        .replace(/ました$/g, 'ましたけどぉ？♡')
                        .replace(/だ。/g, 'だけどぉ？♡💢')
                        .replace(/だ$/g, 'だけどぉ？♡💢')
                        .replace(/ない。/g, 'ないんですけどぉ♡')
                        .replace(/ない$/g, 'ないんですけどぉ♡')
                        .replace(/。/g, '♡💢')
                        .replace(/、/g, '♡');
                    result = 'ねぇねぇ♡ ' + result;
                    if (!result.endsWith('♡') && !result.endsWith('💢')) result += '♡💢';
                    result += ' ざぁこざぁこ♡';
                } else {
                    result = text.replace(/\./g, '♡💢').replace(/,/g, '♡');
                    result = 'hey♡ ' + result;
                    if (!result.endsWith('♡') && !result.endsWith('💢')) result += '♡💢';
                    result += ' zako zako♡';
                }
                return result;
            }
            default:
                return text;
        }
    }

    // Character map based conversion
    const map = style.map;
    let result = [...text].map(ch => map[ch] || ch).join('');

    if (style.reverse) {
        result = [...result].reverse().join('');
    }

    return result;
}

// Make available globally
window.FONT_STYLES = FONT_STYLES;
window.convertText = convertText;
