// unicode-maps.js
// Unicode Font Style mappings for text conversion
// 29 styles: Mathematical Alphanumeric + special Unicode ranges

/**
 * Creates a character map from sequential Unicode code points.
 */
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

/**
 * Creates a map from explicit character arrays.
 */
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

// --- Bubble (White / Circled) ---
const bubbleWhiteMap = {};
for (let i = 0; i < 26; i++) {
    bubbleWhiteMap[String.fromCharCode(65 + i)] = String.fromCodePoint(0x24B6 + i);
    bubbleWhiteMap[String.fromCharCode(97 + i)] = String.fromCodePoint(0x24D0 + i);
}
bubbleWhiteMap['0'] = '\u24EA';
for (let i = 1; i <= 9; i++) {
    bubbleWhiteMap[String(i)] = String.fromCodePoint(0x2460 + i - 1);
}

// --- Bubble (Black / Negative Circled) ---
const bubbleBlackMap = {};
for (let i = 0; i < 26; i++) {
    bubbleBlackMap[String.fromCharCode(65 + i)] = String.fromCodePoint(0x1F150 + i);
    bubbleBlackMap[String.fromCharCode(97 + i)] = String.fromCodePoint(0x1F150 + i);
}
bubbleBlackMap['0'] = '\u24FF';
for (let i = 1; i <= 9; i++) {
    bubbleBlackMap[String(i)] = String.fromCodePoint(0x2776 + i - 1);
}

// --- Square (White) ---
const squareWhiteMap = {};
for (let i = 0; i < 26; i++) {
    squareWhiteMap[String.fromCharCode(65 + i)] = String.fromCodePoint(0x1F130 + i);
    squareWhiteMap[String.fromCharCode(97 + i)] = String.fromCodePoint(0x1F130 + i);
}

// --- Square (Black / Negative Squared) ---
const squareBlackMap = {};
for (let i = 0; i < 26; i++) {
    squareBlackMap[String.fromCharCode(65 + i)] = String.fromCodePoint(0x1F170 + i);
    squareBlackMap[String.fromCharCode(97 + i)] = String.fromCodePoint(0x1F170 + i);
}

// --- Parenthesized ---
const parenthesizedMap = {};
for (let i = 0; i < 26; i++) {
    parenthesizedMap[String.fromCharCode(65 + i)] = String.fromCodePoint(0x249C + i);
    parenthesizedMap[String.fromCharCode(97 + i)] = String.fromCodePoint(0x249C + i);
}
for (let i = 1; i <= 9; i++) {
    parenthesizedMap[String(i)] = String.fromCodePoint(0x2474 + i - 1);
}
parenthesizedMap['0'] = '0';

// --- Small Caps (lowercase only) ---
const smallCapsLower = 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ';
const smallCapsMap = {};
const scChars = [...smallCapsLower];
for (let i = 0; i < 26; i++) {
    smallCapsMap[String.fromCharCode(65 + i)] = String.fromCharCode(65 + i);
    smallCapsMap[String.fromCharCode(97 + i)] = scChars[i];
}
for (let i = 0; i < 10; i++) {
    smallCapsMap[String.fromCharCode(48 + i)] = String.fromCharCode(48 + i);
}

// --- Superscript ---
const superscriptMap = createExplicitMap(
    'ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻ',
    'ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻ',
    '⁰¹²³⁴⁵⁶⁷⁸⁹'
);

// --- Upside Down ---
const upsideDownMap = createExplicitMap(
    '∀ꓭƆᗡƎℲ⅁HIſꓘ˥WNOԀꝹꓤS⊥∩ΛMX⅄Z',
    'ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz',
    '0ƖᄅƐㄣϛ9ㄥ86'
);

// --- Fullwidth ---
const fullwidthMap = {};
for (let i = 0; i < 26; i++) {
    fullwidthMap[String.fromCharCode(65 + i)] = String.fromCodePoint(0xFF21 + i);
    fullwidthMap[String.fromCharCode(97 + i)] = String.fromCodePoint(0xFF41 + i);
}
for (let i = 0; i < 10; i++) {
    fullwidthMap[String.fromCharCode(48 + i)] = String.fromCodePoint(0xFF10 + i);
}
fullwidthMap[' '] = '\u3000';

// ======================================
// Export all font styles (29 styles)
// ======================================
const FONT_STYLES = [
    // === Mathematical styles ===
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
    // === Script ===
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
    // === Decorative ===
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
    // === Sans-serif ===
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
    // === Enclosed ===
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
    // === Special ===
    {
        id: 'smallCaps', name: 'Small Caps', nameJa: 'スモールキャップス', category: 'special',
        map: smallCapsMap,
    },
    {
        id: 'superscript', name: 'Superscript', nameJa: '上付き文字', category: 'special',
        map: superscriptMap,
    },
    {
        id: 'fullwidth', name: 'Fullwidth', nameJa: '全角', category: 'special',
        map: fullwidthMap,
    },
    {
        id: 'upsideDown', name: 'Upside Down', nameJa: '逆さ文字', category: 'special',
        map: upsideDownMap,
        reverse: true,
    },
    {
        id: 'spaced', name: 'S p a c e d', nameJa: 'スペース', category: 'special',
        transform: 'spaced',
    },
    // === Combining character styles ===
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
    {
        id: 'dotsAbove', name: 'Dots Above', nameJa: '点付き', category: 'combining',
        combiningChar: '\u0307',
    },
    {
        id: 'wavyBelow', name: 'Wavy Below', nameJa: '波線', category: 'combining',
        combiningChar: '\u0330',
    },
];

/**
 * Convert input text using a specific font style.
 */
function convertText(text, style) {
    // Combining character style
    if (style.combiningChar) {
        return [...text].map(ch => ch + style.combiningChar).join('');
    }

    // Special transforms
    if (style.transform === 'spaced') {
        return [...text].join(' ');
    }

    // Character map based conversion
    const map = style.map;
    let result = [...text].map(ch => map[ch] || ch).join('');

    if (style.reverse) {
        result = [...result].reverse().join('');
    }

    return result;
}

// Make available globally (no bundler)
window.FONT_STYLES = FONT_STYLES;
window.convertText = convertText;
