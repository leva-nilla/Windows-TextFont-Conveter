// test_1000.js — 1000サンプル網羅テスト
global.window = {};
require('./src/unicode-maps.js');
const { FONT_STYLES, convertText } = window;

const charIds = [
    'jojoMenacing', 'tsundere', 'yandere', 'gyaru', 'chuuni',
    'mesugakiHeart', 'mesugakiTaunt', 'hisokaClassic', 'hisokaSexy'
];

const samples = [];

// --- パターン自動生成 (計 1000件以上) ---

// 1. 動詞・形容詞の組み合わせ (400件)
const subjects = ['私は', '彼は', '先生は', '友達が', '猫が'];
const verbs = ['行きます', '食べます', '走りました', '泳ぎません', '見ましたか', '行く', '食べる', '走った', '泳がない', '見るか'];
const adjectives = ['きれいです', '楽しいです', '悲しかったです', '大きいです', '小さくありません', 'きれいだ', '楽しい', '悲しかった', '大きい', '小さくない'];
const particles = ['。', 'よ。', 'ね。', 'よね。'];

for (const s of subjects) {
    for (const v of verbs) {
        for (const p of particles) {
            samples.push({ label: '動詞組合せ', text: s + v.replace(/。$/, '') + p });
        }
    }
    for (const a of adjectives) {
        for (const p of particles) {
            samples.push({ label: '形容詞組合せ', text: s + a.replace(/。$/, '') + p });
        }
    }
}

// 2. 関西弁の組み合わせ (200件)
const kansaiSubj = ['うち', '自分', 'お前', 'あの人'];
const kansaiPred = ['おもろい', 'あかん', 'ちゃう', 'すごい', 'やばい'];
const kansaiEnd = ['やん。', 'やで。', 'わ。', 'ねん。', 'やろ。', 'んや。', 'やんか。', 'へん。', 'で。', 'な。'];

for (const s of kansaiSubj) {
    for (const p of kansaiPred) {
        for (const e of kansaiEnd) {
            samples.push({ label: '関西弁', text: s + 'めっちゃ' + p + e });
        }
    }
}

// 3. 日常会話・セリフ (200件)
const dailyPrefix = ['ねえ、', 'あのさ、', 'ちょっと、', 'おい、', 'すみません、'];
const dailyBody = ['何してるの？', '手伝って。', 'ありがとう！', 'ごめんなさい。', '大丈夫だよ。', '本当ですか？', '信じられない！', 'お腹すいた。'];
const dailySuffix = ['早くしてよ。', '気にしないで。', 'また明日ね。', 'よろしく。', 'どういたしまして。'];

for (const p of dailyPrefix) {
    for (const b of dailyBody) {
        for (const s of dailySuffix) {
            samples.push({ label: '日常会話', text: p + b + s });
        }
    }
}

// 4. 英語・記号のみ・短文 (200件)
const words = ['Hello', 'Thanks', 'Yes', 'No', 'Wait'];
const marks = ['?', '!', '...', '!!', '!?'];
const mixins = ['how are you', 'see you', 'goodbye', 'i love you', 'oh my god', 'what', 'why', 'who'];

for (const w of words) {
    for (const m of marks) {
        for (const x of mixins) {
            samples.push({ label: '英語・記号', text: w + m + ' ' + x + m });
        }
    }
}

// 足りない分は固定の特殊テキストで水増し
const extra = [
    'おはよう。', 'こんにちは。', 'こんばんは。', 'おやすみ。', 'さようなら。',
    'いただきます。', 'ごちそうさま。', 'ただいま。', 'おかえり。', 'いってきます。'
];
for (let i = 0; samples.length < 1000; i++) {
    samples.push({ label: '特殊', text: extra[i % extra.length] });
}

console.log(`生成されたテストパターン数: ${samples.length} 件`);

// --- テスト実行 & 問題検出 ---
const issues = [];
let totalCount = 0;

for (const { label, text } of samples) {
    for (const id of charIds) {
        const style = FONT_STYLES.find(s => s.id === id);
        if (!style) continue;
        
        let result;
        try {
            result = convertText(text, style);
            totalCount++;
        } catch (e) {
            issues.push({ label, style: style.nameJa, text, error: e.message });
            continue;
        }

        // --- 検出ルール ---
        // 1. 二重記号や不自然な繰り返し
        if (/♡♡|💢💢|✨✨|！！！|。。|、、/.test(result)) {
            // メスガキはテキスト長依存で末尾♡が被るケースを許容するため、連続♡は緩和
            if (id.includes('mesugaki') && result.endsWith('♡♡')) {
                // 許容
            } else {
                issues.push({ label, style: style.nameJa, text, issue: '二重記号', result });
            }
        }
        // 2. 意図せず残った句読点 (ヒソカ以外)
        if (!id.includes('hisoka') && /。/.test(result)) {
            issues.push({ label, style: style.nameJa, text, issue: '残留句読点。', result });
        }
        // 3. 不自然な活用接続
        if (/しる|しだ|しじゃん|しっしょ|しなの|しるッ|きるッ|だか[^ら]|ますんだ|ますんじゃ|ますって|ますの/.test(result)) {
            // "ますってかんじ" "ますの♡" は仕様としたため除外
            if (!/ますってかんじ|ますの♡/.test(result)) {
                issues.push({ label, style: style.nameJa, text, issue: '不自然な接続', result });
            }
        }
        // 4. 空文字
        if (result.trim() === '') {
            issues.push({ label, style: style.nameJa, text, issue: '空の結果', result });
        }
    }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`テスト実行総数: ${totalCount} パターン ( ${samples.length} × 9キャラ )`);
console.log(`検出された問題: ${issues.length}件`);
console.log(`${'='.repeat(60)}`);

if (issues.length > 0) {
    const byIssue = {};
    for (const i of issues) {
        const key = i.error ? `ERROR: ${i.error}` : i.issue;
        if (!byIssue[key]) byIssue[key] = [];
        byIssue[key].push(i);
    }

    for (const [issue, items] of Object.entries(byIssue)) {
        console.log(`\n--- ${issue} (${items.length}件) ---`);
        for (const item of items.slice(0, 5)) {
            console.log(`  [${item.style}] 入力: ${item.text}  →  結果: ${item.result || item.error}`);
        }
        if (items.length > 5) console.log(`  ... 他 ${items.length - 5}件`);
    }
} else {
    console.log('✅ すべてのパターンで問題は検出されませんでした！完璧です！');
}
