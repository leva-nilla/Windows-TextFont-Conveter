// test_500.js — 500サンプル網羅テスト
global.window = {};
require('./src/unicode-maps.js');
const { FONT_STYLES, convertText } = window;

const charIds = [
    'hisokaClassic', 'hisokaSexy', 'mesugakiHeart', 'mesugakiTaunt',
    'jojoMenacing', 'tsundere', 'yandere', 'gyaru', 'chuuni',
];

// --- 500サンプル生成 ---
const samples = [];

// 敬語パターン (50)
const keigoVerbs = ['行きます', '食べます', '見ます', '聞きます', '読みます', '書きます', '走ります', '泳ぎます', '飛びます', '歩きます'];
const keigoEndings = ['です', 'ます', 'ました', 'ません', 'ですか', 'ますか', 'でした', 'ましょう'];
const keigoSubjects = ['今日は', '明日は', '彼は', '私は', '先生は', '友達は', '猫は', '犬は', '空は', '海は'];
const keigoPredicates = ['きれいです', '楽しいです', '美味しいです', '嬉しいです', '悲しいです', '面白いです', '難しいです', '簡単です', '大きいです', '小さいです'];

for (let i = 0; i < 50; i++) {
    if (i < 10) {
        samples.push({ label: `敬語-形容詞${i+1}`, text: `${keigoSubjects[i]}${keigoPredicates[i]}。` });
    } else if (i < 20) {
        samples.push({ label: `敬語-動詞${i-9}`, text: `${keigoSubjects[i%10]}${keigoVerbs[i-10]}。` });
    } else if (i < 30) {
        samples.push({ label: `敬語-複合${i-19}`, text: `${keigoSubjects[i%10]}${keigoPredicates[i%10]}。${keigoSubjects[(i+1)%10]}${keigoVerbs[i%10]}。` });
    } else if (i < 40) {
        samples.push({ label: `敬語-疑問${i-29}`, text: `${keigoSubjects[i%10]}${keigoPredicates[i%10].replace(/です$/, 'ですか')}。` });
    } else {
        samples.push({ label: `敬語-否定${i-39}`, text: `${keigoSubjects[i%10]}${keigoVerbs[i%10].replace(/ます$/, 'ません')}。` });
    }
}

// タメ口パターン (50)
const tameEndings = ['だ', 'だよ', 'だね', 'よ', 'ね', 'さ', 'かな', 'じゃん', 'だろ', 'かも'];
const tamePredicates = ['きれいだ', '楽しい', '美味しい', '嬉しい', '悲しい', '面白い', '難しい', '簡単だ', '大きい', '小さい'];
const tameVerbs = ['行く', '食べる', '見る', '聞く', '読む', '書く', '走る', '泳ぐ', '飛ぶ', '歩く'];

for (let i = 0; i < 50; i++) {
    if (i < 10) {
        samples.push({ label: `タメ口-基本${i+1}`, text: `${keigoSubjects[i]}${tamePredicates[i]}。` });
    } else if (i < 20) {
        samples.push({ label: `タメ口-語尾${i-9}`, text: `${keigoSubjects[i%10]}${tamePredicates[i%10].replace(/だ$|い$/,'')}${tameEndings[i-10]}。` });
    } else if (i < 30) {
        samples.push({ label: `タメ口-動詞${i-19}`, text: `${keigoSubjects[i%10]}${tameVerbs[i%10]}よ。` });
    } else if (i < 40) {
        samples.push({ label: `タメ口-複合${i-29}`, text: `${tamePredicates[i%10].replace(/だ$/,'')}よ。また${tameVerbs[i%10]}ね。` });
    } else {
        samples.push({ label: `タメ口-否定${i-39}`, text: `${keigoSubjects[i%10]}${tameVerbs[i%10]}ない。` });
    }
}

// 関西弁パターン (50)
const kansaiEndings = ['やん', 'やで', 'やんか', 'やろ', 'やねん', 'わ', 'んや', 'へん', 'ねん', 'やんけ'];
const kansaiAdj = ['おもろい', 'えらい', 'あかん', 'しょうもない', 'ちゃう', 'すごい', 'やばい', 'うまい', 'こわい', 'さむい'];

for (let i = 0; i < 50; i++) {
    if (i < 10) {
        samples.push({ label: `関西弁-基本${i+1}`, text: `めっちゃ${kansaiAdj[i]}${kansaiEndings[i]}。` });
    } else if (i < 20) {
        samples.push({ label: `関西弁-複合${i-9}`, text: `${kansaiAdj[i%10]}${kansaiEndings[i%10]}。ほんまに${kansaiAdj[(i+1)%10]}わ。` });
    } else if (i < 30) {
        samples.push({ label: `関西弁-会話${i-19}`, text: `なんでそうなる${kansaiEndings[i%10]}。` });
    } else if (i < 40) {
        samples.push({ label: `関西弁-感嘆${i-29}`, text: `うわっ、${kansaiAdj[i%10]}${kansaiEndings[i%10]}！` });
    } else {
        samples.push({ label: `関西弁-否定${i-39}`, text: `そんなん${kansaiAdj[i%10]}${kansaiEndings[i%10]}。せやけど仕方ないわ。` });
    }
}

// 句読点なしパターン (30)
const noPunctTexts = [
    'こんにちは元気ですか', 'ありがとうございます', 'すみません', 'おはようございます',
    'お疲れ様です', 'よろしくお願いします', 'さようなら', 'いただきます',
    'ごちそうさまでした', 'おやすみなさい', 'なるほど', 'わかりました',
    'そうですね', 'いいですね', 'すごいですね', '大丈夫です',
    'ちょっと待って', 'もう一回', 'どういたしまして', 'お先に失礼します',
    '頑張って', '気をつけて', '楽しみだ', '嬉しい', 'やった',
    'まじか', 'うそでしょ', 'すげえ', 'やばい', 'かわいい',
];

noPunctTexts.forEach((t, i) => samples.push({ label: `句読点なし${i+1}`, text: t }));

// 長文パターン (30)
const longTexts = [
    '今日はとてもいい天気です。公園に散歩に行きました。桜がきれいでした。',
    '昨日の試合は本当に面白かったです。最後まで手に汗握る展開でした。感動しました。',
    '新しいレストランに行きました。料理がとても美味しかったです。また行きたいです。',
    '明日のプレゼンが不安です。でも、準備はしっかりしました。頑張ります。',
    '週末は映画を見ました。ストーリーが素晴らしかったです。おすすめです。',
    'この本はとても面白いです。主人公が魅力的です。ぜひ読んでみてください。',
    '今日の授業は難しかったです。先生の説明がわかりにくかったです。復習します。',
    '夏休みに海に行きます。友達と一緒に泳ぎます。楽しみです。',
    '猫がかわいいです。毎日癒されます。家族みたいな存在です。',
    '仕事が忙しいです。でも、やりがいがあります。もう少し頑張ります。',
    '雨が降っています。傘を忘れました。コンビニで買います。',
    '彼女は歌が上手です。コンサートに行きました。感動しました。',
    '日本語を勉強しています。難しいですが楽しいです。もっと上達したいです。',
    '朝ごはんを食べました。卵焼きが美味しかったです。お母さんに感謝です。',
    '新しいゲームを買いました。グラフィックがすごいです。時間を忘れます。',
    'めっちゃ疲れたわ。今日はもう寝るわ。おやすみ。',
    'あのさ、聞いてよ。すごいことがあったんだ。びっくりするよ。',
    'まじでやばいよ。テスト全然勉強してない。どうしよう。',
    'ほんまにすごいやん。こんなの初めて見たわ。感動したわ。',
    'なんでやねん。そんなわけないやろ。ちゃんと確認してや。',
    '今日はめっちゃ暑い。アイス食べたい。コンビニ行こう。',
    'この曲いいね。歌詞がすごくいい。何度も聞いちゃう。',
    'お腹すいたよ。ラーメン食べたい。一緒に行かない？',
    '明日は休みだ。ゆっくり寝るぞ。最高だ。',
    'あの映画見た？めっちゃ面白かったよ。泣いちゃった。',
    '宿題終わらない。量が多すぎる。助けて。',
    'このケーキ美味しい。幸せだ。もう一個食べたい。',
    '走るの好きだよ。毎朝走ってる。気持ちいいよ。',
    '冬は寒いね。でも雪が好きだ。きれいだよね。',
    'プログラミングは楽しいです。毎日コードを書いています。将来はエンジニアになりたいです。',
];

longTexts.forEach((t, i) => samples.push({ label: `長文${i+1}`, text: t }));

// 特殊パターン (40)
const specialTexts = [
    '？', '！', '。', 'あ', 'うん',
    'えっ、まじで？', 'はい、そうです。', 'いいえ、違います。',
    'そうだよね、わかる。', 'でも、やっぱり無理だ。',
    'すごい！本当に！信じられない！', 'なんで？どうして？教えて。',
    '行きましょう。', '食べましょう。', '帰りましょう。',
    '行ってきます。', '行ってらっしゃい。', 'ただいま。', 'おかえりなさい。',
    '好きです。', '嫌いだ。', '愛してる。',
    '負けない。', '絶対に勝つ。', '諦めない。',
    '怒ってる？', '泣いてるの？', '笑ってよ。',
    '静かにして。', 'うるさいよ。', '黙れ。',
    '助けて！', '危ない！', '逃げろ！',
    '信じてる。', '待ってるよ。', '忘れないで。',
    'おめでとう！', 'ごめんなさい。', 'さすがだね。', 'やるじゃん。',
];

specialTexts.forEach((t, i) => samples.push({ label: `特殊${i+1}`, text: t }));

// 混合敬語タメ口 (30)
const mixedTexts = [
    'すみません、これはいくらですか。', 'あのう、道を教えてください。',
    'お忙しいところ恐れ入ります。', '失礼しますが、お名前は何ですか。',
    'ちょっといいですか。話があります。', 'すごいですよね。感動しました。',
    '残念です。仕方がないですね。', '素晴らしいです。さすがです。',
    '心配しないでください。大丈夫です。', 'お疲れ様でした。ありがとうございました。',
    'やっぱりね。そうだと思った。', 'まさか。信じられない。',
    'ほら見ろ。俺の言った通りだ。', 'だから言っただろ。',
    'どうしたの？大丈夫？', 'ねぇ、聞いてる？',
    'そんなことない。気にしないで。', 'いいよ、別に。',
    'うん、わかった。任せて。', 'ごめん、遅れる。待ってて。',
    'なんやそれ。意味わからんわ。', 'せやな。その通りやわ。',
    'ほんまにありがとうな。助かったわ。', 'あかんわ。もう限界やわ。',
    'ええやん。めっちゃいいやん。', 'しゃーないな。手伝ったるわ。',
    'まじかよ。やばすぎだろ。', 'うわ、すげぇ。かっこいい。',
    'ちょ、待って。それ本当？', 'はぁ？何言ってんの？',
];

mixedTexts.forEach((t, i) => samples.push({ label: `混合${i+1}`, text: t }));

// 感情表現 (30)
const emotionTexts = [
    '嬉しい！やった！最高だ！', '悲しい。泣きたい。',
    '怒った。許さない。', '怖い。助けて。',
    '寂しいよ。会いたい。', '恥ずかしい。穴があったら入りたい。',
    '楽しい！もっと遊びたい！', '退屈だ。何かしたい。',
    '驚いた！まさか！', '感動した。涙が出た。',
    '困った。どうしよう。', '安心した。よかった。',
    'イライラする。もう嫌だ。', 'ワクワクする。楽しみだ。',
    'ドキドキする。緊張する。', 'ホッとした。間に合った。',
    'ガッカリだ。期待はずれだ。', 'スッキリした。気分がいい。',
    'モヤモヤする。何かが引っかかる。', 'ウキウキする。明日が待ち遠しい。',
    'ゾッとした。怖すぎる。', 'キュンとした。かわいすぎる。',
    'ムカつく。許せない。', 'ニヤニヤする。面白すぎる。',
    'ため息が出る。疲れた。', 'テンション上がる。最高だ。',
    '胸が熱くなる。感動だ。', '鳥肌が立った。すごすぎる。',
    '涙が止まらない。嬉しすぎる。', '心が折れそうだ。もう無理だ。',
];

emotionTexts.forEach((t, i) => samples.push({ label: `感情${i+1}`, text: t }));

// ネットスラング (30)
const netTexts = [
    '草', 'ワロタ', 'それな', 'わかりみ', 'つらみ',
    'おけまる', 'りょ', 'あざます', 'おつ', 'ぴえん',
    'しか勝たん', '推せる', '尊い', 'エモい', 'チルい',
    '知らんけど', 'まあええやろ', 'ほんそれ', 'それはそう', 'マ？',
    'ガチでやばい', 'まじ卍', 'ぐう有能', '神すぎる', 'は？',
    '詰んだ', 'ワンチャンある', '無理ゲー', 'オワコン', '控えめに言って最高',
];

netTexts.forEach((t, i) => samples.push({ label: `ネット${i+1}`, text: t }));

// セリフ風 (40)
const dialogTexts = [
    'お前はもう死んでいる。', '私の戦闘力は53万です。',
    'だが断る。', 'やれやれだぜ。',
    '逃げちゃダメだ。逃げちゃダメだ。', 'あきらめたらそこで試合終了ですよ。',
    '海賊王に、俺はなる！', 'お前の罪を数えろ。',
    '正義とは、勝つことだ。', '仲間がいるよ。',
    '真実はいつもひとつ。', 'この世界は残酷だ。',
    '人は、変われるんだ。', '夢を諦めるな。',
    '俺が守る。', 'みんなの力を貸してくれ。',
    '約束だよ。必ず戻ってくる。', 'さよならは言わない。',
    '強くなりたい。もっと強く。', 'この先に未来がある。',
    'そんなの関係ない。', 'どうでもいい。',
    'ふざけるな。', 'もう二度とごめんだ。',
    '覚悟を決めた。', '最後の戦いだ。',
    '奇跡は起きる。信じろ。', '限界なんてない。',
    'ここが正念場だ。', 'やるしかない。',
    'バカヤロウ。', 'この野郎。',
    '行くぞ。', '来い。', '立て。', '走れ。',
    'ありえない。', '信じられない。', 'まさかな。', 'なんてこった。',
];

dialogTexts.forEach((t, i) => samples.push({ label: `セリフ${i+1}`, text: t }));

// 日常会話 (50)
const dailyTexts = [
    '今日の晩ごはん何？', 'カレーがいいな。', 'コンビニ行ってくるよ。',
    'お風呂入ってきます。', 'もう寝るね。おやすみ。', 'テレビ見てる。',
    '宿題やった？', 'まだやってない。', 'あとでやるよ。',
    '電話していい？', 'ラインしてよ。', '写真撮って。',
    '何時に待ち合わせ？', '駅前で集合ね。', '遅刻しそう。',
    '天気予報見た？', '傘持っていった方がいいよ。', '今日は暑いね。',
    '髪切った？', '似合うね。', 'ありがとう、嬉しい。',
    'この服どう？', 'いいと思う。', 'ちょっと派手じゃない？',
    '充電切れそう。', 'WiFi繋がらない。', 'アプリ落ちた。',
    '明日テストだ。', '全然勉強してない。', 'ノート見せて。',
    'お小遣いちょうだい。', '来月まで待って。', 'ケチだなぁ。',
    'この歌知ってる？', '聞いたことある。', 'いい曲だよね。',
    'お腹痛い。', '薬飲んだ？', '大丈夫、少し休めば治る。',
    '眠い。', 'コーヒー飲む？', 'お願い。',
    '暇だね。', 'ゲームしない？', 'いいね、やろう。',
    '荷物多いね。', '手伝おうか？', '大丈夫、一人で持てる。',
    '靴紐ほどけてるよ。', 'あ、ほんとだ。',
];

dailyTexts.forEach((t, i) => samples.push({ label: `日常${i+1}`, text: t }));

// 英語 (40)
const enTexts = [
    'Hello, how are you?', 'I am fine, thank you.', 'Good morning.',
    'Nice to meet you.', 'See you later.', 'Have a nice day.',
    'I love you.', 'I hate this.', 'Please help me.',
    'What is your name?', 'Where are you from?', 'How old are you?',
    'I am so happy!', 'This is amazing.', 'I can not believe it.',
    'Let us go.', 'Wait for me.', 'Do not worry.',
    'It is raining.', 'The sun is shining.', 'It is cold today.',
    'I want to eat pizza.', 'Coffee, please.', 'Thank you so much.',
    'Sorry, my bad.', 'Excuse me.', 'No problem.',
    'That is cool.', 'Awesome!', 'Incredible.',
    'I am tired.', 'Good night.', 'Sweet dreams.',
    'You are the best.', 'Never give up.', 'Believe in yourself.',
    'Time flies.', 'Life is good.', 'Just do it.', 'Game over.',
];

enTexts.forEach((t, i) => samples.push({ label: `英語${i+1}`, text: t }));

// === 実行 & 分析 ===
console.log(`Total samples: ${samples.length}`);
console.log('');

// 不自然パターン検出
const issues = [];

for (const { label, text } of samples) {
    for (const id of charIds) {
        const style = FONT_STYLES.find(s => s.id === id);
        if (!style) continue;
        let result;
        try {
            result = convertText(text, style);
        } catch (e) {
            issues.push({ label, style: style.nameJa, text, error: e.message });
            continue;
        }

        // 不自然パターン検出
        // 1. 二重記号
        if (/♡♡|💢💢|✨✨|！！！|。。|、、/.test(result))
            issues.push({ label, style: style.nameJa, text, issue: '二重記号', result });
        // 2. 残留する句読点（変換されてないはず）
        if (id !== 'hisokaClassic' && id !== 'hisokaSexy' && id !== 'hisokaFace' && /。/.test(result))
            issues.push({ label, style: style.nameJa, text, issue: '残留句読点。', result });
        // 3. 文中に変な接続（ますぅ→）
        if (/しる|しだ|しじゃん|しっしょ|しなの/.test(result))
            issues.push({ label, style: style.nameJa, text, issue: '不自然な「し+語尾」', result });
        // 4. 空の結果
        if (result.trim() === '')
            issues.push({ label, style: style.nameJa, text, issue: '空の結果', result });
        // 5. 元テキストと同じ（変換されていない）— characterスタイルのみ
        if (result === text && id !== 'hisokaFace')
            issues.push({ label, style: style.nameJa, text, issue: '未変換', result });
        // 6. "だか" (ですか→だか問題)
        if (/だか[^ら]/.test(result) && !/だから/.test(result))
            issues.push({ label, style: style.nameJa, text, issue: 'だか問題', result });
    }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`検出された問題: ${issues.length}件`);
console.log(`${'='.repeat(60)}`);

if (issues.length > 0) {
    // グループ化
    const byIssue = {};
    for (const i of issues) {
        const key = i.error ? `ERROR: ${i.error}` : i.issue;
        if (!byIssue[key]) byIssue[key] = [];
        byIssue[key].push(i);
    }

    for (const [issue, items] of Object.entries(byIssue)) {
        console.log(`\n--- ${issue} (${items.length}件) ---`);
        // 最大5件表示
        for (const item of items.slice(0, 5)) {
            console.log(`  [${item.label}] ${item.style}`);
            console.log(`    入力: ${item.text}`);
            console.log(`    結果: ${item.result || item.error}`);
        }
        if (items.length > 5) console.log(`  ... 他 ${items.length - 5}件`);
    }
} else {
    console.log('問題は検出されませんでした！');
}

// サンプル出力（各スタイル3件ずつ）
console.log(`\n\n${'='.repeat(60)}`);
console.log('サンプル出力（各スタイル代表5件）');
console.log(`${'='.repeat(60)}`);

const sampleIndices = [0, 20, 50, 100, 150, 200, 250, 300, 350, 400, 420, 450, 460];
for (const id of charIds) {
    const style = FONT_STYLES.find(s => s.id === id);
    console.log(`\n--- ${style.nameJa} (${style.name}) ---`);
    for (const idx of sampleIndices) {
        if (idx >= samples.length) break;
        const { label, text } = samples[idx];
        const result = convertText(text, style);
        console.log(`  [${label}] ${text}`);
        console.log(`    → ${result}`);
    }
}
