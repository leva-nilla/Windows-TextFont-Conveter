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
    {
        id: 'jojoMenacing', name: 'ゴゴゴ JoJo ゴゴゴ', nameJa: 'ジョジョ風', category: 'character',
        transform: 'jojoMenacing',
    },
    {
        id: 'tsundere', name: '💢ツンデレ💢', nameJa: 'ツンデレ風', category: 'character',
        transform: 'tsundere',
    },
    {
        id: 'yandere', name: '🔪ヤンデレ♡', nameJa: 'ヤンデレ風', category: 'character',
        transform: 'yandere',
    },
    {
        id: 'gyaru', name: '✨ギャル🤙', nameJa: 'ギャル風', category: 'character',
        transform: 'gyaru',
    },
    {
        id: 'chuuni', name: '⚔厄二病⚔', nameJa: '厄二病風', category: 'character',
        transform: 'chuuni',
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
                let t2 = text.replace(/僕/g, 'ボク');
                let result;
                if (isJa) {
                    result = t2
                        .replace(/。/g, () => next())
                        .replace(/、/g, () => next())
                        .replace(/！/g, () => '！' + next())
                        .replace(/？/g, () => '？' + next());
                } else {
                    result = t2
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
                let t2 = text.replace(/僕/g, 'ボク');
                let result;
                if (isJa) {
                    result = t2
                        .replace(/。/g, () => next())
                        .replace(/、/g, () => next())
                        .replace(/！/g, () => '！' + next())
                        .replace(/？/g, () => '？' + next());
                } else {
                    result = t2
                        .replace(/\./g, () => '.' + next())
                        .replace(/,/g, () => ',' + next())
                        .replace(/!/g, () => '!' + next())
                        .replace(/\?/g, () => '?' + next());
                }
                if (si === 0) result += next();
                const pre = ['フフ…', 'ねぇ…', ''][text.length % 3];
                return pre + result;
            }
            case 'hisokaFace':
                return '⭐' + text.replace(/僕/g, 'ボク') + '💧';
            case 'mesugakiHeart': {
                // メスガキ♡: 文ごとに小悪魔口調に変換
                const isJa = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(text);
                if (!isJa) {
                    let r = text.replace(/\.+/g, '♡').replace(/,+/g, '♡');
                    if (!r.endsWith('♡')) r += '♡';
                    const s = [' zako♡', ' so weak♡', '♡'][text.length % 3];
                    return r + s;
                }
                const sentences = text.split(/(?<=。)/);
                const out = sentences.map(s => {
                    let r = s.replace(/。$/, '');
                    if (!r) return '';
                    let matched = false;
                    r = r
                        .replace(/ですか$/, () => { matched = true; return 'ですかぁ～？♡'; })
                        .replace(/ません$/, () => { matched = true; return 'ませんけどぉ～♡'; })
                        .replace(/ました$/, () => { matched = true; return 'ましたぁ～♡'; })
                        .replace(/です$/, () => { matched = true; return 'ですぅ～♡'; })
                        .replace(/します$/, () => { matched = true; return 'しますぅ～♡'; })
                        .replace(/ます$/, () => { matched = true; return 'ますぅ～♡'; })
                        .replace(/だよ$/, () => { matched = true; return 'だもんね～♡'; })
                        .replace(/だ$/, () => { matched = true; return 'だもん♡'; })
                        .replace(/よ$/, () => { matched = true; return 'よぉ～♡'; })
                        .replace(/ね$/, () => { matched = true; return 'ね～♡'; })
                        .replace(/わ$/, () => { matched = true; return 'わぁ～♡'; })
                        .replace(/やん$/, () => { matched = true; return 'やんね～♡'; });
                    r = r.replace(/、/g, '～♡');
                    if (!matched) r += '♡';
                    return r;
                }).filter(Boolean);
                const pre = ['', 'えへへ♡ ', 'ふふっ♡ ', 'ねぇ♡ ', 'あのね♡ '][text.length % 5];
                const suf = [' ざぁこ♡', ' よわよわ～♡', ' かわいそ～♡', ' ちょろ～い♡', '♡'][text.length % 5];
                return pre + out.join(' ') + suf;
            }
            case 'mesugakiTaunt': {
                // メスガキ全力煽り: 文ごとに煽り変換
                const isJa = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(text);
                if (!isJa) {
                    let r = text.replace(/\.+/g, '♡💢').replace(/,+/g, '♡');
                    if (!r.endsWith('♡') && !r.endsWith('💢')) r += '♡💢';
                    const p = ['hey♡ ', 'haha♡ ', 'aww♡ '][text.length % 3];
                    const s = [' zako zako♡', ' pathetic♡💢', ' so lame♡'][text.length % 3];
                    return p + r + s;
                }
                const mesuEnd = ['ですけどぉ～？♡', 'なんですけどぉ～♡💢', 'ですけど？♡💢'];
                let mi = 0;
                const sentences = text.split(/(?<=。)/);
                const out = sentences.map(s => {
                    let r = s.replace(/。$/, '');
                    if (!r) return '';
                    let matched = false;
                    r = r
                        .replace(/ですか$/, () => { matched = true; return 'ですかぁ～？♡💢'; })
                        .replace(/ません$/, () => { matched = true; return 'ませんけどぉ～？♡'; })
                        .replace(/ました$/, () => { matched = true; return 'ましたけどぉ～？♡💢'; })
                        .replace(/です$/, () => { matched = true; return mesuEnd[mi++ % 3]; })
                        .replace(/します$/, () => { matched = true; return 'しますけどぉ～？♡'; })
                        .replace(/ます$/, () => { matched = true; return 'ますけどぉ～？♡'; })
                        .replace(/ない$/, () => { matched = true; return 'ないんですけどぉ～♡💢'; })
                        .replace(/だよ$/, () => { matched = true; return 'だけどぉ～？♡💢'; })
                        .replace(/だ$/, () => { matched = true; return 'だけどぉ～？♡💢'; })
                        .replace(/よ$/, () => { matched = true; return 'よぉ～？♡💢'; })
                        .replace(/ね$/, () => { matched = true; return 'ねぇ～？♡💢'; })
                        .replace(/わ$/, () => { matched = true; return 'わぁ～？♡💢'; })
                        .replace(/やん$/, () => { matched = true; return 'やんねぇ～？♡💢'; });
                    r = r.replace(/、/g, '～♡');
                    if (!matched) r += '♡💢';
                    return r;
                }).filter(Boolean);
                const pre = ['ねぇねぇ♡ ', 'おじさ～ん♡ ', 'ほらほら♡ ', 'え～？♡ ', 'あのさぁ♡ '][text.length % 5];
                const suf = [' ざぁこざぁこ♡', ' よわよわ～♡💢', ' だっさ～♡💢', ' なさけな～い♡💢', ' かわいそ～♡'][text.length % 5];
                return pre + out.join(' ') + suf;
            }
            case 'jojoMenacing': {
                // ジョジョ風: 文ごとに力強く変換、丁寧語→常体
                const isJa = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(text);
                if (!isJa) {
                    let r = text.replace(/\./g, '!!').replace(/,/g, '...');
                    if (!r.endsWith('!')) r += '!!';
                    return r + ' *menacing*';
                }
                const sentences = text.split(/(?<=。)/);
                const out = sentences.map(s => {
                    let r = s.replace(/。$/, '');
                    if (!r) return '';
                    // 長いパターンから先に置換
                    r = r
                        .replace(/いですか$/, 'いだと？')
                        .replace(/ですか$/, 'かだと？')
                        .replace(/ますか$/, 'のか？')
                        .replace(/ません$/, 'ねぇッ')
                        .replace(/いました$/, 'いたッ')
                        .replace(/しました$/, 'したッ')
                        .replace(/りました$/, 'ったッ')
                        .replace(/きました$/, 'いたッ')
                        .replace(/ぎました$/, 'いだッ')
                        .replace(/びました$/, 'んだッ')
                        .replace(/みました$/, 'んだッ')
                        .replace(/にました$/, 'んだッ')
                        .replace(/ちました$/, 'ったッ')
                        .replace(/べました$/, 'べたッ')
                        .replace(/ました$/, 'たッ')
                        .replace(/いです$/, 'いッ')
                        .replace(/です$/, 'だッ')
                        .replace(/します$/, 'するッ')
                        .replace(/きます$/, 'くッ')
                        .replace(/ぎます$/, 'ぐッ')
                        .replace(/びます$/, 'ぶッ')
                        .replace(/みます$/, 'むッ')
                        .replace(/ちます$/, 'つッ')
                        .replace(/にます$/, 'ぬッ')
                        .replace(/ります$/, 'るッ')
                        .replace(/います$/, 'うッ')
                        .replace(/べます$/, 'べるッ')
                        .replace(/えます$/, 'えるッ')
                        .replace(/ます$/, 'るッ');
                    r = r.replace(/、/g, '…') + '！';
                    return r;
                }).filter(Boolean);
                const sfx = ['ゴゴゴゴゴ', 'ドドドドド', 'ゴゴゴゴゴ'][text.length % 3];
                return '「' + out.join(' ') + '」 ' + sfx;
            }
            case 'tsundere': {
                // ツンデレ風: 文ごとに照れ隠し変換
                const isJa = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(text);
                if (!isJa) {
                    let r = text.replace(/\./g, '!').replace(/,/g, '...');
                    return "I-It's not like " + r + ' ...or anything!';
                }
                const tsunEndings = ['…なんだからね！', '…じゃないんだから！', '…なんだからっ！', '…とか思ってないし！'];
                let ti = 0;
                const sentences = text.split(/(?<=。)/);
                const out = sentences.map(s => {
                    let r = s.replace(/。$/, '');
                    if (!r) return '';
                    let matched = false;
                    r = r
                        .replace(/ですか$/, () => { matched = true; return '…かなんて聞かないでよ！'; })
                        .replace(/ません$/, () => { matched = true; return 'ないんだからね！'; })
                        .replace(/しました$/, () => { matched = true; return 'しただけだし！'; })
                        .replace(/ました$/, () => { matched = true; return 'ましたけど…別に！'; })
                        .replace(/です$/, () => { matched = true; return tsunEndings[ti++ % 3]; })
                        .replace(/します$/, () => { matched = true; return 'するだけだし！'; })
                        .replace(/ます$/, () => { matched = true; return 'ますけど…別に！'; })
                        .replace(/だよ$/, () => { matched = true; return '…なんだからね！///'; })
                        .replace(/だ$/, () => { matched = true; return '…なんかじゃないし！'; })
                        .replace(/よ$/, () => { matched = true; return '…んだからね！///'; })
                        .replace(/ね$/, () => { matched = true; return '…なんだからっ！'; })
                        .replace(/わ$/, () => { matched = true; return '…だし！'; })
                        .replace(/やん$/, () => { matched = true; return '…なんかじゃないし！'; });
                    r = r.replace(/、/g, '…');
                    if (!matched) r += tsunEndings[ti++ % 3];
                    return r;
                }).filter(Boolean);
                const tp = ['べっ、別に…', 'か、勘違いしないでよね！ ', 'バカ！ '][text.length % 3];
                return tp + out.join(' ');
            }
            case 'yandere': {
                // ヤンデレ風: 文ごとに甘く病的に変換
                const isJa = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(text);
                if (!isJa) {
                    let r = text.replace(/\./g, '...♡').replace(/,/g, '...');
                    if (!r.endsWith('♡')) r += '...♡';
                    return r;
                }
                const yanEndings = ['…だよ♡', '…なの♡', '…ね♡', '…よね？♡'];
                let yi = 0;
                const sentences = text.split(/(?<=。)/);
                const out = sentences.map(s => {
                    let r = s.replace(/。$/, '');
                    if (!r) return '';
                    let matched = false;
                    r = r
                        .replace(/ですか$/, () => { matched = true; return '…かなぁ♡'; })
                        .replace(/ません$/, () => { matched = true; return 'ないよ♡'; })
                        .replace(/しました$/, () => { matched = true; return 'しちゃった♡'; })
                        .replace(/ました$/, () => { matched = true; return 'ましたの♡'; })
                        .replace(/です$/, () => { matched = true; return yanEndings[yi++ % 3]; })
                        .replace(/します$/, () => { matched = true; return 'しちゃうの♡'; })
                        .replace(/ます$/, () => { matched = true; return 'ますよ♡'; })
                        .replace(/だよ$/, () => { matched = true; return '…だよぉ♡'; })
                        .replace(/だ$/, () => { matched = true; return '…なの♡'; })
                        .replace(/よ$/, () => { matched = true; return '…よぉ♡'; })
                        .replace(/ね$/, () => { matched = true; return '…ねぇ♡'; })
                        .replace(/わ$/, () => { matched = true; return '…わぁ♡'; })
                        .replace(/やん$/, () => { matched = true; return '…やん♡'; });
                    r = r.replace(/、/g, '…');
                    if (!matched) r += yanEndings[yi++ % 3];
                    return r;
                }).filter(Boolean);
                const yp = ['', 'ねぇ…', ''][text.length % 3];
                const ys = [' ずっと一緒だよ…♡', '', ' 離さないから♡', ' 私だけのものだよ…♡'][text.length % 4];
                return yp + out.join(' ') + ys;
            }
            case 'gyaru': {
                // ギャル風: 文ごとにテンション高く変換
                const isJa = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(text);
                if (!isJa) {
                    let r = text.replace(/\./g, '~✨').replace(/,/g, '~ ');
                    if (!r.endsWith('✨')) r += '~✨';
                    return r + ' 🤙';
                }
                const gyaruEnd = ['じゃん✨', 'ってかんじ～💅', 'まじで～✨', 'やばくない？🤙', 'ガチだわ✨'];
                let gi = 0;
                const sentences = text.split(/(?<=。)/);
                const out = sentences.map(s => {
                    let r = s.replace(/。$/, '');
                    if (!r) return '';
                    let matched = false;
                    r = r
                        .replace(/ですか$/, () => { matched = true; return 'なの～？✨'; })
                        .replace(/ません$/, () => { matched = true; return 'なくない？🤔'; })
                        .replace(/しました$/, () => { matched = true; return 'したんだけど～✨'; })
                        .replace(/ました$/, () => { matched = true; return 'ましたってかんじ～💅'; })
                        .replace(/です$/, () => { matched = true; return gyaruEnd[gi++ % 4]; })
                        .replace(/します$/, () => { matched = true; return 'するっしょ✨'; })
                        .replace(/ます$/, () => { matched = true; return 'ますってかんじ✨'; })
                        .replace(/ない$/, () => { matched = true; return 'なくない？🤔'; })
                        .replace(/だよ$/, () => { matched = true; return 'っしょ！💅'; })
                        .replace(/だ$/, () => { matched = true; return 'っしょ💅'; })
                        .replace(/よ$/, () => { matched = true; return 'よ～✨'; })
                        .replace(/ね$/, () => { matched = true; return 'ね～✨'; })
                        .replace(/わ$/, () => { matched = true; return 'わ～✨'; })
                        .replace(/やん$/, () => { matched = true; return 'やん～🤙'; });
                    r = r.replace(/、/g, '～');
                    if (!matched) r += '～' + gyaruEnd[gi++ % 4];
                    return r;
                }).filter(Boolean);
                const gp = ['', 'てか～ ', 'マジ卍 '][text.length % 3];
                return gp + out.join(' ') + ' 🤙✨';
            }
            case 'chuuni': {
                // 厨二病風: 文ごとに大仰に変換
                const isJa = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(text);
                if (!isJa) {
                    let r = text.replace(/\./g, '--').replace(/,/g, '...');
                    return 'Tch... ' + r + '...!';
                }
                const chuuniEnd = ['──', '…ッ', '…！', '…フッ'];
                let ci = 0;
                const sentences = text.split(/(?<=。)/);
                const out = sentences.map(s => {
                    let r = s.replace(/。$/, '');
                    if (!r) return '';
                    let matched = false;
                    r = r
                        .replace(/ですか$/, () => { matched = true; return '…だと？ フッ…'; })
                        .replace(/ません$/, () => { matched = true; return '…ぬッ'; })
                        .replace(/しました$/, () => { matched = true; return '…した…それが運命だった'; })
                        .replace(/ました$/, () => { matched = true; return 'ました…それが運命だった'; })
                        .replace(/です$/, () => { matched = true; return '…それが定めだ'; })
                        .replace(/します$/, () => { matched = true; return 'する…それが世界の理'; })
                        .replace(/ます$/, () => { matched = true; return 'ます…それが世界の理'; })
                        .replace(/だ$/, () => { matched = true; return '…ッ'; })
                        .replace(/よ$/, () => { matched = true; return '…！'; })
                        .replace(/ね$/, () => { matched = true; return '…ッ'; })
                        .replace(/わ$/, () => { matched = true; return '…ッ'; })
                        .replace(/やん$/, () => { matched = true; return '…だとッ！？'; });
                    r = r.replace(/、/g, '…');
                    if (!matched) r += chuuniEnd[ci++ % 3];
                    return r;
                }).filter(Boolean);
                const cp = ['くっ…', 'フッ…笑止…', '我が封印されし力が…'][text.length % 3];
                return cp + out.join('──') + '…！';
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
