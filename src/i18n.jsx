import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const languages = [
  { code: 'en', label: 'English (Primary)', shortLabel: 'EN' },
  { code: 'ta', label: 'Tamil', shortLabel: 'TA' },
  { code: 'hi', label: 'Hindi', shortLabel: 'HI' },
  { code: 'de', label: 'German', shortLabel: 'DE' },
  { code: 'fr', label: 'French', shortLabel: 'FR' },
  { code: 'ko', label: 'Korean', shortLabel: 'KO' },
  { code: 'ja', label: 'Japanese', shortLabel: 'JA' },
];

const messages = {
  'The Book': {
    ta: 'புத்தகம்', hi: 'पुस्तक', de: 'Das Buch', fr: 'Le livre', ko: '책', ja: '本',
  },
  '18 Holes': {
    ta: '18 குழிகள்', hi: '18 होल', de: '18 Löcher', fr: '18 trous', ko: '18홀', ja: '18ホール',
  },
  'Discover Your Game': {
    ta: 'உங்கள் விளையாட்டைக் கண்டறியுங்கள்', hi: 'अपने खेल को खोजें', de: 'Entdecke dein Spiel', fr: 'Découvrez votre jeu', ko: '나만의 게임을 발견하세요', ja: 'ゲームを発見する',
  },
  'Events': {
    ta: 'நிகழ்வுகள்', hi: 'इवेंट्स', de: 'Veranstaltungen', fr: 'Événements', ko: '이벤트', ja: 'イベント',
  },
  'Speaking & Retreats': {
    ta: 'உரைகள் & ஓய்வுக்கால முகாம்கள்', hi: 'व्याख्यान और रिट्रीट', de: 'Vorträge & Retreats', fr: 'Conférences et retraites', ko: '강연 및 리트릿', ja: '講演・リトリート',
  },
  'Author': {
    ta: 'ஆசிரியர்', hi: 'लेखक', de: 'Autor', fr: 'Auteur', ko: '저자', ja: '著者',
  },
  'Articles': {
    ta: 'கட்டுரைகள்', hi: 'लेख', de: 'Artikel', fr: 'Articles', ko: '아티클', ja: '記事',
  },
  'Contact': {
    ta: 'தொடர்பு', hi: 'संपर्क', de: 'Kontakt', fr: 'Contact', ko: '문의', ja: 'お問い合わせ',
  },
  'BUY NOW': {
    ta: 'இப்போதே வாங்குங்கள்', hi: 'अभी खरीदें', de: 'JETZT KAUFEN', fr: 'ACHETER', ko: '지금 구매', ja: '今すぐ購入',
  },
  'Where to buy': {
    ta: 'எங்கே வாங்கலாம்', hi: 'कहाँ से खरीदें', de: 'Wo kaufen', fr: 'Où acheter', ko: '구매처', ja: '購入方法',
  },
  'Get a sample': {
    ta: 'மாதிரியைப் பெறுங்கள்', hi: 'नमूना प्राप्त करें', de: 'Leseprobe erhalten', fr: 'Recevoir un extrait', ko: '샘플 받기', ja: 'サンプルを入手',
  },
  '18 Holes of Golf': {
    ta: 'கோல்ஃபின் 18 குழிகள்', hi: 'गोल्फ के 18 होल', de: '18 Löcher Golf', fr: '18 trous de golf', ko: '골프 18홀', ja: 'ゴルフの18ホール',
  },
  'Play': { ta: 'விளையாடு', hi: 'खेलें', de: 'Spielen', fr: 'Jouer', ko: '플레이', ja: 'プレー' },
  'Reflect': { ta: 'சிந்தி', hi: 'चिंतन करें', de: 'Reflektieren', fr: 'Réfléchir', ko: '성찰', ja: '振り返る' },
  'Evolve': { ta: 'முன்னேறு', hi: 'विकसित हों', de: 'Wachsen', fr: 'Évoluer', ko: '성장', ja: '成長する' },
  'Not religious. Not instructional.': {
    ta: 'மத நூலும் அல்ல. பயிற்சி கையேடும் அல்ல.', hi: 'न धार्मिक। न निर्देशात्मक।', de: 'Nicht religiös. Keine Anleitung.', fr: 'Ni religieux. Ni didactique.', ko: '종교서도, 교습서도 아닙니다.', ja: '宗教書でも教本でもありません。',
  },
  '18 Chapters of The Gita': {
    ta: 'கீதையின் 18 அத்தியாயங்கள்', hi: 'गीता के 18 अध्याय', de: '18 Kapitel der Gita', fr: '18 chapitres de la Gita', ko: '기타의 18장', ja: 'ギーターの18章',
  },
  'A Calmer mind, A Braver game': {
    ta: 'அமைதியான மனம், துணிவான ஆட்டம்', hi: 'शांत मन, साहसी खेल', de: 'Ein ruhigerer Geist, ein mutigeres Spiel', fr: 'Un esprit plus calme, un jeu plus audacieux', ko: '차분한 마음, 대담한 경기', ja: '穏やかな心、勇敢なプレー',
  },
  "The toughest opponent isn't across from you": {
    ta: 'கடினமான எதிரி எதிரே இல்லை; உங்களுக்குள் இருக்கிறார்', hi: 'सबसे कठिन प्रतिद्वंद्वी सामने नहीं, आपके भीतर है', de: 'Der härteste Gegner steht nicht gegenüber', fr: "L'adversaire le plus redoutable n'est pas en face de vous", ko: '가장 어려운 상대는 맞은편에 있지 않습니다', ja: '最も手強い相手は向かい側にいるのではありません',
  },
  '18 Days of Kurukshetra': {
    ta: 'குருக்ஷேத்திரத்தின் 18 நாட்கள்', hi: 'कुरुक्षेत्र के 18 दिन', de: '18 Tage Kurukshetra', fr: '18 jours de Kurukshetra', ko: '쿠룩셰트라의 18일', ja: 'クルクシェートラの18日間',
  },
  'Better golf, A Calmer you': {
    ta: 'சிறந்த கோல்ஃப், அமைதியான நீங்கள்', hi: 'बेहतर गोल्फ, अधिक शांत आप', de: 'Besseres Golf, mehr Gelassenheit', fr: 'Un meilleur golf, plus de sérénité', ko: '더 나은 골프, 더 차분한 나', ja: 'より良いゴルフ、より穏やかな自分',
  },
  'The oldest game and the oldest question': {
    ta: 'பழமையான விளையாட்டும் பழமையான கேள்வியும்', hi: 'सबसे पुराना खेल और सबसे पुराना प्रश्न', de: 'Das älteste Spiel und die älteste Frage', fr: 'Le jeu le plus ancien et la question la plus ancienne', ko: '가장 오래된 경기와 가장 오래된 질문', ja: '最も古いゲームと最も古い問い',
  },
  'share the same number.': {
    ta: 'ஒரே எண்ணைப் பகிர்கின்றன.', hi: 'एक ही संख्या साझा करते हैं।', de: 'teilen dieselbe Zahl.', fr: 'partagent le même nombre.', ko: '같은 숫자를 공유합니다.', ja: '同じ数字を共有しています。',
  },
  'Golf Gita maps each hole on the course to a chapter of the Bhagavad Gita. Not a metaphor. A manual.': {
    ta: 'கோல்ஃப் கீதா, மைதானத்தின் ஒவ்வொரு குழியையும் பகவத் கீதையின் ஓர் அத்தியாயத்துடன் இணைக்கிறது. இது உருவகம் அல்ல. ஒரு வழிகாட்டி.',
    hi: 'गोल्फ गीता मैदान के हर होल को भगवद्गीता के एक अध्याय से जोड़ती है। यह रूपक नहीं, एक मार्गदर्शिका है।',
    de: 'Golf Gita verbindet jedes Loch des Platzes mit einem Kapitel der Bhagavad Gita. Keine Metapher. Ein Leitfaden.',
    fr: 'Golf Gita associe chaque trou du parcours à un chapitre de la Bhagavad-Gita. Pas une métaphore. Un guide.',
    ko: '골프 기타는 코스의 각 홀을 바가바드 기타의 한 장과 연결합니다. 비유가 아니라 안내서입니다.',
    ja: 'ゴルフ・ギーターはコースの各ホールをバガヴァッド・ギーターの章に結びつけます。比喩ではなく、実践の手引きです。',
  },
  'Golf gives you 18 holes and four hours to confront yourself. The Bhagavad Gita gives you 18 chapters and a battlefield. The problems are identical. So are the solutions.': {
    ta: 'கோல்ஃப், உங்களை எதிர்கொள்ள 18 குழிகளையும் நான்கு மணி நேரத்தையும் தருகிறது. பகவத் கீதை 18 அத்தியாயங்களையும் ஒரு போர்க்களத்தையும் தருகிறது. சிக்கல்கள் ஒன்றே; தீர்வுகளும் அப்படியே.',
    hi: 'गोल्फ आपको स्वयं का सामना करने के लिए 18 होल और चार घंटे देता है। भगवद्गीता 18 अध्याय और एक रणभूमि देती है। समस्याएँ एक जैसी हैं, समाधान भी।',
    de: 'Golf gibt Ihnen 18 Löcher und vier Stunden, um sich selbst zu begegnen. Die Bhagavad Gita gibt Ihnen 18 Kapitel und ein Schlachtfeld. Die Probleme sind dieselben. Die Lösungen auch.',
    fr: 'Le golf vous offre 18 trous et quatre heures pour vous confronter à vous-même. La Bhagavad-Gita vous offre 18 chapitres et un champ de bataille. Les problèmes sont identiques, tout comme les solutions.',
    ko: '골프는 자신과 마주할 18홀과 네 시간을 줍니다. 바가바드 기타는 18장과 전장을 줍니다. 문제도 해결책도 같습니다.',
    ja: 'ゴルフは自分自身と向き合うための18ホールと4時間を与えてくれます。バガヴァッド・ギーターは18章と戦場を与えます。課題も解決策も同じです。',
  },
  'Where the fairway meets the battlefield': {
    ta: 'ஃபேர்வேயும் போர்க்களமும் சந்திக்கும் இடம்', hi: 'जहाँ फेयरवे रणभूमि से मिलता है', de: 'Wo Fairway und Schlachtfeld aufeinandertreffen', fr: 'Là où le fairway rencontre le champ de bataille', ko: '페어웨이와 전장이 만나는 곳', ja: 'フェアウェイと戦場が交わる場所',
  },
  'Days of Kurukshetra': {
    ta: 'குருக்ஷேத்திரத்தின் நாட்கள்', hi: 'कुरुक्षेत्र के दिन', de: 'Tage von Kurukshetra', fr: 'jours de Kurukshetra', ko: '쿠룩셰트라의 날', ja: 'クルクシェートラの日々',
  },
  'Hole': { ta: 'குழி', hi: 'होल', de: 'Loch', fr: 'Trou', ko: '홀', ja: 'ホール' },
  'FRONT NINE': { ta: 'முதல் ஒன்பது', hi: 'फ्रंट नाइन', de: 'ERSTE NEUN', fr: 'PREMIER NEUF', ko: '전반 9홀', ja: 'アウトコース' },
  'BACK NINE': { ta: 'பின்புற ஒன்பது', hi: 'बैक नाइन', de: 'ZWEITE NEUN', fr: 'DERNIER NEUF', ko: '후반 9홀', ja: 'インコース' },
  'After hole 9 · Before the turn': {
    ta: '9-ஆம் குழிக்குப் பிறகு · திருப்பத்திற்கு முன்', hi: 'होल 9 के बाद · टर्न से पहले', de: 'Nach Loch 9 · Vor dem Turn', fr: 'Après le trou 9 · Avant le retour', ko: '9번 홀 이후 · 턴 전', ja: '9番ホールの後 · 折り返し前',
  },
  'The turn': { ta: 'திருப்பம்', hi: 'टर्न', de: 'Der Turn', fr: 'Le tournant', ko: '턴', ja: '折り返し' },
  'The caddie’s note': {
    ta: 'கேடியின் குறிப்பு', hi: 'कैडी का नोट', de: 'Die Notiz des Caddies', fr: 'La note du caddie', ko: '캐디의 노트', ja: 'キャディのメモ',
  },
  "The caddie's note": {
    ta: 'கேடியின் குறிப்பு', hi: 'कैडी का नोट', de: 'Die Notiz des Caddies', fr: 'La note du caddie', ko: '캐디의 노트', ja: 'キャディのメモ',
  },
  'The one shot that teaches more than a hundred good ones.': {
    ta: 'நூறு சிறந்த ஷாட்களைவிட அதிகம் கற்பிக்கும் ஒரு ஷாட்.', hi: 'वह एक शॉट जो सौ अच्छे शॉट्स से अधिक सिखाता है।', de: 'Der eine Schlag, der mehr lehrt als hundert gute.', fr: 'Le coup qui enseigne plus que cent bons coups.', ko: '좋은 샷 백 번보다 더 많은 것을 가르치는 한 번의 샷.', ja: '百回のナイスショットより多くを教えてくれる一打。',
  },
  'Subscribe': { ta: 'பதிவு செய்க', hi: 'सदस्यता लें', de: 'Abonnieren', fr: "S'abonner", ko: '구독', ja: '登録' },
  'Subscribed!': { ta: 'பதிவு செய்யப்பட்டது!', hi: 'सदस्यता हो गई!', de: 'Abonniert!', fr: 'Abonné !', ko: '구독 완료!', ja: '登録しました！' },
  'No spam. Unsubscribe anytime.': {
    ta: 'தேவையற்ற மின்னஞ்சல்கள் இல்லை. எப்போது வேண்டுமானாலும் விலகலாம்.', hi: 'कोई स्पैम नहीं। कभी भी सदस्यता छोड़ें।', de: 'Kein Spam. Jederzeit abbestellbar.', fr: 'Pas de spam. Désabonnement à tout moment.', ko: '스팸 없이, 언제든 구독 취소 가능.', ja: '迷惑メールなし。いつでも配信停止できます。',
  },
  'Recent articles': { ta: 'சமீபத்திய கட்டுரைகள்', hi: 'हाल के लेख', de: 'Aktuelle Artikel', fr: 'Articles récents', ko: '최근 아티클', ja: '最近の記事' },
  'View all →': { ta: 'அனைத்தையும் காண்க →', hi: 'सभी देखें →', de: 'Alle ansehen →', fr: 'Tout voir →', ko: '모두 보기 →', ja: 'すべて見る →' },
  'Speaking': { ta: 'உரை', hi: 'व्याख्यान', de: 'Vorträge', fr: 'Conférences', ko: '강연', ja: '講演' },
  'Bring the Gita to your club, course, or leadership retreat.': {
    ta: 'உங்கள் கிளப், மைதானம் அல்லது தலைமைத்துவ முகாமுக்கு கீதையைக் கொண்டு வாருங்கள்.',
    hi: 'गीता को अपने क्लब, कोर्स या नेतृत्व रिट्रीट तक लाएँ।',
    de: 'Bringen Sie die Gita in Ihren Club, auf Ihren Platz oder in Ihr Führungskräfte-Retreat.',
    fr: 'Faites découvrir la Gita à votre club, parcours ou retraite de leadership.',
    ko: '기타의 지혜를 클럽, 코스 또는 리더십 리트릿으로 가져오세요.',
    ja: 'ギーターの教えをクラブ、コース、リーダーシップ・リトリートへ。',
  },
  'Half-day and full-day sessions for golf clubs, corporate offsites, and wellness retreats.': {
    ta: 'கோல்ஃப் கிளப்புகள், நிறுவனக் கூட்டங்கள் மற்றும் நலவாழ்வு முகாம்களுக்கான அரைநாள் மற்றும் முழுநாள் அமர்வுகள்.',
    hi: 'गोल्फ क्लबों, कॉर्पोरेट ऑफसाइट और वेलनेस रिट्रीट के लिए आधे और पूरे दिन के सत्र।',
    de: 'Halb- und ganztägige Veranstaltungen für Golfclubs, Firmen-Offsites und Wellness-Retreats.',
    fr: 'Sessions d’une demi-journée ou d’une journée pour clubs de golf, séminaires d’entreprise et retraites bien-être.',
    ko: '골프 클럽, 기업 오프사이트 및 웰니스 리트릿을 위한 반나절·종일 세션.',
    ja: 'ゴルフクラブ、企業研修、ウェルネス・リトリート向けの半日・終日セッション。',
  },
  'Enquire about a session': {
    ta: 'அமர்வு குறித்து விசாரிக்கவும்', hi: 'सत्र के बारे में पूछें', de: 'Anfrage zu einer Veranstaltung', fr: 'Demander une session', ko: '세션 문의하기', ja: 'セッションについて問い合わせる',
  },
  'Available on': { ta: 'கிடைக்கும் தளங்கள்', hi: 'यहाँ उपलब्ध', de: 'Erhältlich bei', fr: 'Disponible sur', ko: '이용 가능', ja: '取扱先' },
  'English (Primary)': { ta: 'ஆங்கிலம் (முதன்மை)', hi: 'अंग्रेज़ी (प्राथमिक)', de: 'Englisch (Primär)', fr: 'Anglais (principal)', ko: '영어 (기본)', ja: '英語（メイン）' },
  'Tamil': { ta: 'தமிழ்', hi: 'तमिल', de: 'Tamilisch', fr: 'Tamoul', ko: '타밀어', ja: 'タミル語' },
  'Hindi': { ta: 'இந்தி', hi: 'हिन्दी', de: 'Hindi', fr: 'Hindi', ko: '힌디어', ja: 'ヒンディー語' },
  'German': { ta: 'ஜெர்மன்', hi: 'जर्मन', de: 'Deutsch', fr: 'Allemand', ko: '독일어', ja: 'ドイツ語' },
  'French': { ta: 'பிரெஞ்சு', hi: 'फ़्रेंच', de: 'Französisch', fr: 'Français', ko: '프랑스어', ja: 'フランス語' },
  'Korean': { ta: 'கொரியன்', hi: 'कोरियाई', de: 'Koreanisch', fr: 'Coréen', ko: '한국어', ja: '韓国語' },
  'Japanese': { ta: 'ஜப்பானியம்', hi: 'जापानी', de: 'Japanisch', fr: 'Japonais', ko: '일본어', ja: '日本語' },
};

const additionalMessageRows = {
  'Get Free Sample Chapters': ['இலவச மாதிரி அத்தியாயங்களைப் பெறுங்கள்', 'मुफ़्त नमूना अध्याय प्राप्त करें', 'Kostenlose Leseproben erhalten', 'Recevoir des chapitres gratuits', '무료 샘플 챕터 받기', '無料サンプル章を入手'],
  'Enter your email to receive Hole 1:': ['ஹோல் 1-ஐப் பெற உங்கள் மின்னஞ்சலை உள்ளிடவும்:', 'होल 1 पाने के लिए अपना ईमेल दर्ज करें:', 'Geben Sie Ihre E-Mail ein, um Loch 1 zu erhalten:', 'Saisissez votre e-mail pour recevoir le trou 1 :', '1번 홀을 받으려면 이메일을 입력하세요:', '第1ホールを受け取るメールアドレスを入力してください：'],
  'and Hole 2:': ['மற்றும் ஹோல் 2:', 'और होल 2:', 'und Loch 2:', 'et le trou 2 :', '그리고 2번 홀:', '第2ホール：'],
  'directly to your inbox.': ['நேரடியாக உங்கள் மின்னஞ்சலுக்கு.', 'सीधे आपके इनबॉक्स में।', 'direkt in Ihr Postfach.', 'directement dans votre boîte mail.', '받은 편지함으로 바로 보내드립니다.', 'メールに直接お届けします。'],
  'Send Sample PDF': ['மாதிரி PDF-ஐ அனுப்பவும்', 'नमूना PDF भेजें', 'Leseprobe als PDF senden', 'Envoyer le PDF extrait', '샘플 PDF 보내기', 'サンプルPDFを送信'],
  'Speaking & Retreat Enquiry': ['உரை மற்றும் முகாம் விசாரணை', 'व्याख्यान और रिट्रीट पूछताछ', 'Anfrage zu Vortrag & Retreat', 'Demande de conférence et retraite', '강연 및 리트릿 문의', '講演・リトリートのお問い合わせ'],
  'Bring the transformative philosophy of Golf Gita to your club, corporate leadership retreat, or golf clinic.': ['கோல்ஃப் கீதையின் மாற்றத்தை ஏற்படுத்தும் தத்துவத்தை உங்கள் கிளப், நிறுவனத் தலைமை முகாம் அல்லது கோல்ஃப் பயிற்சி முகாமுக்குக் கொண்டு வாருங்கள்.', 'गोल्फ गीता के परिवर्तनकारी दर्शन को अपने क्लब, कॉर्पोरेट नेतृत्व रिट्रीट या गोल्फ क्लिनिक तक लाएँ।', 'Bringen Sie die transformative Philosophie der Golf Gita in Ihren Club, Ihr Führungskräfte-Retreat oder Ihre Golfklinik.', 'Apportez la philosophie transformatrice de Golf Gita à votre club, retraite de direction ou clinique de golf.', '골프 기타의 변화를 이끄는 철학을 클럽, 기업 리더십 리트릿 또는 골프 클리닉에 전해보세요.', 'ゴルフ・ギーターの変革をもたらす哲学を、クラブ、企業リーダーシップ・リトリート、ゴルフクリニックへ。'],
  'Your Name / Organization': ['உங்கள் பெயர் / நிறுவனம்', 'आपका नाम / संगठन', 'Ihr Name / Ihre Organisation', 'Votre nom / organisation', '이름 / 단체명', 'お名前 / 団体名'],
  'Email address': ['மின்னஞ்சல் முகவரி', 'ईमेल पता', 'E-Mail-Adresse', 'Adresse e-mail', '이메일 주소', 'メールアドレス'],
  'Submit Enquiry': ['விசாரணையைச் சமர்ப்பிக்கவும்', 'पूछताछ भेजें', 'Anfrage senden', 'Envoyer la demande', '문의 보내기', '問い合わせを送信'],
  'Who is this for?': ['யாருக்கானது?', 'यह किसके लिए है?', 'Für wen ist das?', 'À qui s’adresse ce livre ?', '누구를 위한 책인가요?', 'どんな人に向けた本ですか？'],
  'Books written': ['எழுதிய புத்தகங்கள்', 'लिखी गई पुस्तकें', 'Veröffentlichte Bücher', 'Livres écrits', '집필 도서', '著書'],
  'Years playing golf': ['கோல்ஃப் விளையாடிய ஆண்டுகள்', 'गोल्फ़ खेलने के वर्ष', 'Jahre Golferfahrung', 'Années de golf', '골프 경력', 'ゴルフ歴'],
  'Countries spoken in': ['உரையாற்றிய நாடுகள்', 'जिन देशों में वक्तव्य दिए', 'Länder mit Vorträgen', 'Pays où il a pris la parole', '강연 국가', '講演した国'],
  'Handicap': ['ஹேண்டிகேப்', 'हैंडिकैप', 'Handicap', 'Handicap', '핸디캡', 'ハンディキャップ'],
  'GET IN TOUCH.': ['தொடர்பு கொள்ளுங்கள்.', 'संपर्क करें।', 'KONTAKT.', 'CONTACT.', '문의하기.', 'お問い合わせ'],
  'Also here': ['இங்கேயும்', 'यहाँ भी', 'Auch hier', 'Également ici', '여기에서도', 'こちらも'],
  'Message Sent': ['செய்தி அனுப்பப்பட்டது', 'संदेश भेजा गया', 'Nachricht gesendet', 'Message envoyé', '메시지를 보냈습니다', 'メッセージを送信しました'],
  'Thank you for reaching out. We will get back to you shortly.': ['தொடர்பு கொண்டதற்கு நன்றி. விரைவில் உங்களைத் தொடர்புகொள்கிறோம்.', 'संपर्क करने के लिए धन्यवाद। हम जल्द ही आपसे संपर्क करेंगे।', 'Vielen Dank für Ihre Nachricht. Wir melden uns in Kürze.', 'Merci de nous avoir contactés. Nous vous répondrons bientôt.', '문의해 주셔서 감사합니다. 곧 연락드리겠습니다.', 'お問い合わせありがとうございます。近日中にご連絡します。'],
  'Send another message': ['மற்றொரு செய்தியை அனுப்பவும்', 'एक और संदेश भेजें', 'Weitere Nachricht senden', 'Envoyer un autre message', '메시지 더 보내기', '別のメッセージを送信'],
  'Name': ['பெயர்', 'नाम', 'Name', 'Nom', '이름', 'お名前'],
  'Email': ['மின்னஞ்சல்', 'ईमेल', 'E-Mail', 'E-mail', '이메일', 'メール'],
  'Subject': ['பொருள்', 'विषय', 'Betreff', 'Objet', '제목', '件名'],
  'Message': ['செய்தி', 'संदेश', 'Nachricht', 'Message', '메시지', 'メッセージ'],
  'Send Enquiry': ['விசாரணையை அனுப்பவும்', 'पूछताछ भेजें', 'Anfrage senden', 'Envoyer la demande', '문의 보내기', '問い合わせを送信'],
  "Before the first swing, the inner trembling begins. The first tee jitters are nothing less than Arjuna's hesitation on Kurukshetra - confronting expectation, self-doubt, and the fear of failure.": ['முதல் ஸ்விங்கிற்கு முன்பே உள்ளத்தில் நடுக்கம் தொடங்குகிறது. முதல் டீயின் பதற்றம், எதிர்பார்ப்பு, தன்னம்பிக்கையின்மை, தோல்வி பயம் ஆகியவற்றை எதிர்கொள்ளும் குருக்ஷேத்திரத்தில் அர்ஜுனனின் தயக்கமே.', 'पहले स्विंग से पहले ही भीतर की कंपकंपी शुरू होती है। पहले टी का तनाव कुरुक्षेत्र में अर्जुन की हिचकिचाहट जैसा है-अपेक्षाओं, आत्म-संदेह और असफलता के डर का सामना।', 'Noch vor dem ersten Schwung beginnt das innere Zittern. Die Nervosität am ersten Abschlag gleicht Arjunas Zögern auf Kurukshetra: Erwartungen, Selbstzweifel und Versagensangst zu begegnen.', 'Avant le premier swing, le tremblement intérieur commence. Le trac du premier départ rappelle l’hésitation d’Arjuna à Kurukshetra : affronter les attentes, le doute de soi et la peur de l’échec.', '첫 스윙 전부터 마음속 떨림이 시작됩니다. 첫 티의 긴장은 기대, 자기 의심, 실패에 대한 두려움과 마주한 쿠룩셰트라의 아르주나의 망설임과 다르지 않습니다.', '最初のスイングの前に、心の震えが始まります。最初のティーでの緊張は、期待、自信の揺らぎ、失敗への恐れに向き合うクルクシェートラでのアルジュナのためらいにほかなりません。'],
  'A round of golf seems linear, but the lessons loop. Every ending becomes another beginning - a circle of return, rhythm, and flow.': ['கோல்ஃப் சுற்று நேர்கோட்டைப் போலத் தோன்றினாலும், பாடங்கள் மீண்டும் வருகின்றன. ஒவ்வொரு முடிவும் புதிய தொடக்கமாகிறது - திரும்புதல், தாளம், ஓட்டம் ஆகியவற்றின் வட்டம்.', 'गोल्फ़ का राउंड सीधा लगता है, पर सीखें चक्र में लौटती हैं। हर अंत एक नई शुरुआत बनता है-वापसी, लय और प्रवाह का एक चक्र।', 'Eine Golfrunde wirkt linear, doch die Lehren kehren wieder. Jedes Ende wird zum neuen Anfang - ein Kreislauf aus Wiederkehr, Rhythmus und Fluss.', 'Une partie de golf semble linéaire, mais les leçons reviennent. Chaque fin devient un nouveau départ, dans un cycle de retour, de rythme et de fluidité.', '골프 라운드는 직선처럼 보이지만 배움은 순환합니다. 모든 끝은 돌아옴과 리듬, 흐름의 고리 속에서 새로운 시작이 됩니다.', 'ゴルフのラウンドは直線的に見えても、教えは巡ります。すべての終わりは、回帰、リズム、流れの輪の中で新たな始まりになります。'],
  'Swing with complete commitment, but relinquish possession of where the ball lands. The stroke belongs to your intent; the landing belongs to physics and grace.': ['முழு ஈடுபாட்டுடன் ஸ்விங் செய்யுங்கள்; ஆனால் பந்து எங்கு விழுகிறது என்பதில் உரிமை கோராதீர்கள். அடி உங்கள் நோக்கத்திற்குரியது; அதன் விழுகை இயற்பியலுக்கும் அருளுக்கும் உரியது.', 'पूरी प्रतिबद्धता से स्विंग करें, लेकिन गेंद कहाँ गिरेगी इस पर अधिकार छोड़ दें। शॉट आपका संकल्प है; उसका उतरना भौतिकी और कृपा पर निर्भर है।', 'Schwingen Sie mit voller Hingabe, lassen Sie aber los, wo der Ball landet. Der Schlag gehört Ihrer Absicht, der Landepunkt der Physik und der Gnade.', 'Frappez avec un engagement total, mais renoncez à contrôler l’endroit où la balle atterrit. Le coup relève de votre intention ; sa trajectoire, de la physique et de la grâce.', '온전히 몰입해 스윙하되 공이 어디에 떨어질지는 내려놓으세요. 샷은 의지의 몫이고, 낙하지점은 물리와 은총의 몫입니다.', '全身全霊でスイングしながら、ボールの着地点への執着は手放しましょう。ショットは意図のもの、着地は物理と恩寵のものです。'],
  'True knowledge on the fairway is not intellectual theory; it is intuitive silence. The clubhead moves effortlessly when the calculating ego steps aside.': ['ஃபேர்வேயில் உண்மையான அறிவு என்பது அறிவுசார் கோட்பாடு அல்ல; அது உள்ளுணர்வின் அமைதி. கணக்கிடும் அகந்தை ஒதுங்கும்போது கிளப் தலை இயல்பாக நகரும்.', 'फेयरवे पर सच्चा ज्ञान बौद्धिक सिद्धांत नहीं, सहज मौन है। गणना करता अहंकार हट जाए तो क्लबहेड सहजता से चलता है।', 'Wahres Wissen auf dem Fairway ist keine Theorie, sondern intuitive Stille. Wenn das berechnende Ego zurücktritt, bewegt sich der Schlägerkopf mühelos.', 'Sur le fairway, la vraie connaissance n’est pas une théorie intellectuelle, mais un silence intuitif. Quand l’ego calculateur s’efface, la tête du club se déplace sans effort.', '페어웨이의 참된 지혜는 지적 이론이 아니라 직관의 고요함입니다. 계산하는 자아가 물러나면 클럽 헤드는 힘들이지 않고 움직입니다.', 'フェアウェイでの真の知恵は知的な理論ではなく、直感の静けさです。計算する自我が退けば、クラブヘッドは自然に動きます。'],
  'Leave double bogeys and triumphs on the previous green. The fifth hole demands a pure mind unburdened by memories of good or bad shots.': ['இரட்டை போகிகளையும் வெற்றிகளையும் முந்தைய கிரீனிலேயே விட்டுவிடுங்கள். நல்ல அல்லது கெட்ட ஷாட்களின் நினைவுச் சுமையற்ற தூய மனதை ஐந்தாவது குழி கேட்கிறது.', 'डबल बोगी और जीत को पिछले ग्रीन पर ही छोड़ दें। पाँचवाँ होल अच्छे-बुरे शॉट्स की यादों से मुक्त मन चाहता है।', 'Lassen Sie Doppelbogeys und Triumphe auf dem vorherigen Grün zurück. Das fünfte Loch verlangt einen Geist, der nicht von guten oder schlechten Schlägen belastet ist.', 'Laissez les doubles bogeys et les triomphes sur le green précédent. Le cinquième trou exige un esprit libre du souvenir des bons comme des mauvais coups.', '더블 보기와 승리는 지난 그린에 두고 오세요. 다섯 번째 홀은 좋은 샷과 나쁜 샷의 기억에 짓눌리지 않는 맑은 마음을 요구합니다.', 'ダブルボギーも勝利も前のグリーンに置いていきましょう。5番ホールが求めるのは、良いショットも悪いショットも記憶に縛られない澄んだ心です。'],
  'A quiet breath in the address posture is a temple. One who has conquered their breath and thoughts can navigate hazards with the calm of a sage.': ['அட்ரஸ் நிலையில் எடுக்கும் அமைதியான மூச்சே ஒரு கோயில். மூச்சையும் எண்ணங்களையும் ஆள்பவர் ஞானியைப் போலத் தடைகளை அமைதியாகக் கடப்பார்.', 'एड्रेस की मुद्रा में शांत साँस लेना एक मंदिर जैसा है। जिसने श्वास और विचारों को साध लिया, वह ऋषि की शांति से बाधाओं को पार कर सकता है।', 'Ein ruhiger Atemzug in der Ansprechposition ist ein Tempel. Wer Atem und Gedanken gemeistert hat, navigiert Hindernisse mit der Ruhe eines Weisen.', 'Un souffle paisible à l’adresse est un temple. Celui qui maîtrise son souffle et ses pensées franchit les obstacles avec le calme d’un sage.', '어드레스 자세에서의 고요한 호흡은 하나의 사원입니다. 호흡과 생각을 다스린 이는 현자의 평온함으로 장애물을 헤쳐 나갑니다.', 'アドレスでの静かなひと呼吸は寺院です。呼吸と思考を制した人は、賢者の落ち着きでハザードを越えていきます。'],
  'The ball, the pin, the green, and the player are manifestations of one continuum. Look past the hazards to perceive the pure line of flight.': ['பந்து, பின், கிரீன், வீரர் - அனைத்தும் ஒரே தொடரின் வெளிப்பாடுகள். தடைகளைத் தாண்டிப் பார்த்து, பறப்பின் தூய பாதையை உணருங்கள்.', 'गेंद, पिन, ग्रीन और खिलाड़ी-एक ही निरंतरता के रूप हैं। बाधाओं से आगे देखकर उड़ान की शुद्ध रेखा पहचानें।', 'Ball, Fahne, Grün und Spieler sind Ausdruck eines Ganzen. Blicken Sie über die Hindernisse hinaus und erkennen Sie die klare Fluglinie.', 'La balle, le drapeau, le green et le joueur sont les manifestations d’un même continuum. Regardez au-delà des obstacles pour percevoir la trajectoire pure.', '공, 핀, 그린, 선수는 하나의 연속체가 드러난 모습입니다. 장애물 너머를 바라보고 순수한 비행선을 알아보세요.', 'ボール、ピン、グリーン、プレーヤーは一つの連続体の現れです。障害の先を見つめ、澄んだ弾道を捉えましょう。'],
  'A bad bounce does not alter who you are. The true golfer abides in equanimity regardless of tournament rankings or handicap numbers.': ['மோசமான பவுன்ஸ் உங்கள் இயல்பை மாற்றாது. போட்டி தரவரிசையோ ஹேண்டிகேப் எண்ணோ எதுவாக இருந்தாலும் உண்மையான கோல்ஃப் வீரர் சமநிலையுடன் இருப்பார்.', 'खराब उछाल आपके वास्तविक स्वरूप को नहीं बदलता। टूर्नामेंट रैंकिंग या हैंडिकैप कुछ भी हो, सच्चा गोल्फ़र समभाव में रहता है।', 'Ein schlechter Aufsprung verändert nicht, wer Sie sind. Ein wahrer Golfer bleibt unabhängig von Rangliste oder Handicap gelassen.', 'Un mauvais rebond ne change pas qui vous êtes. Le vrai golfeur garde son équanimité, quels que soient le classement ou le handicap.', '나쁜 바운스가 당신의 본질을 바꾸지는 않습니다. 진정한 골퍼는 대회 순위나 핸디캡에 상관없이 평정심을 지킵니다.', '悪いバウンドであなた自身が変わるわけではありません。真のゴルファーは順位やハンディキャップにかかわらず平静を保ちます。'],
  'The royal secret: total faith replaces nervous tension. Complete the front nine with gratitude for the fairway and the lessons it bestowed.': ['அரச ரகசியம் இதுதான்: முழு நம்பிக்கை பதற்றத்தை மாற்றுகிறது. ஃபேர்வேக்கும் அது தந்த பாடங்களுக்கும் நன்றியுடன் முன் ஒன்பதை முடிக்கவும்.', 'राज रहस्य यह है: पूर्ण विश्वास घबराहट की जगह लेता है। फेयरवे और उससे मिली सीख के प्रति कृतज्ञता के साथ फ्रंट नाइन पूरा करें।', 'Das königliche Geheimnis: Voller Glaube ersetzt nervöse Anspannung. Beenden Sie die ersten neun mit Dankbarkeit für das Fairway und seine Lehren.', 'Le secret royal : la foi totale remplace la tension nerveuse. Terminez l’aller avec gratitude pour le fairway et les leçons qu’il vous a offertes.', '왕의 비밀은 완전한 믿음이 긴장을 대신한다는 것입니다. 페어웨이와 그곳에서 얻은 배움에 감사하며 전반 9홀을 마무리하세요.', '王の秘訣は、揺るぎない信頼が緊張に取って代わること。フェアウェイとそこで得た教えに感謝しながら前半9ホールを終えましょう。'],
  'Fresh energy welcomes you on the turn. In every whispering pine, gentle fairway slope, and ray of morning sun, recognize the celestial architecture.': ['திருப்பத்தில் புதிய ஆற்றல் உங்களை வரவேற்கிறது. காற்றில் அசையும் பைன் மரம், மென்மையான ஃபேர்வே சாய்வு, காலைக் கதிர் அனைத்திலும் விண்ணுலகக் கட்டமைப்பைக் காணுங்கள்.', 'टर्न पर नई ऊर्जा आपका स्वागत करती है। सरसराते चीड़, फेयरवे की हल्की ढलान और सुबह की किरण-हर जगह दिव्य संरचना को पहचानें।', 'Am Turn empfängt Sie neue Energie. Erkennen Sie in jeder rauschenden Kiefer, sanften Fairway-Neigung und jedem Morgenstrahl die himmlische Architektur.', 'Au tournant, une énergie nouvelle vous accueille. Dans chaque pin qui murmure, chaque pente douce du fairway et chaque rayon du matin, reconnaissez l’architecture céleste.', '턴에서 새로운 에너지가 당신을 맞이합니다. 속삭이는 소나무, 완만한 페어웨이 경사, 아침 햇살 속에서 천상의 질서를 알아보세요.', '折り返しでは新たな力が迎えてくれます。ささやく松、なだらかなフェアウェイ、朝日の一筋に、天上の構造を見出しましょう。'],
  'Play out of genuine reverence for the craft rather than hunger for vanity. Devotion softens the hands, creating a release that tension could never produce.': ['புகழாசைக்காக அல்ல, கலையின் மீதான உண்மையான மதிப்பால் விளையாடுங்கள். அர்ப்பணிப்பு கைகளை மென்மையாக்கி, பதற்றத்தால் ஒருபோதும் தர முடியாத விடுவிப்பை உருவாக்குகிறது.', 'दिखावे की लालसा नहीं, खेल के प्रति सच्चे सम्मान से खेलें। समर्पण हाथों को कोमल बनाता है और ऐसा सहज छोड़ना देता है जो तनाव से संभव नहीं।', 'Spielen Sie aus echter Ehrfurcht vor dem Können, nicht aus Eitelkeit. Hingabe macht die Hände weich und schafft eine Lockerheit, die Anspannung nie hervorbringen kann.', 'Jouez par respect sincère pour le geste, plutôt que par vanité. La dévotion assouplit les mains et crée un relâchement que la tension ne saurait produire.', '허영이 아니라 기술에 대한 진정한 경외심으로 플레이하세요. 헌신은 손을 부드럽게 하여 긴장으로는 만들 수 없는 릴리스를 이끌어냅니다.', '見栄ではなく技への真の敬意からプレーしましょう。献身は手を柔らかくし、緊張では決して生み出せない解放をもたらします。'],
  'The golf course is the external field; the consciousness swinging the club is the eternal observer. Know the distinction and remain unperturbed.': ['கோல்ஃப் மைதானம் வெளிப்புறக் களம்; கிளப்பை ஆட்டும் விழிப்புணர்வே நித்திய சாட்சி. இந்த வேறுபாட்டை அறிந்து கலங்காமல் இருங்கள்.', 'गोल्फ़ का मैदान बाहरी क्षेत्र है; क्लब घुमाने वाली चेतना शाश्वत साक्षी है। यह भेद जानें और अप्रभावित रहें।', 'Der Golfplatz ist das äußere Feld; das Bewusstsein, das den Schläger führt, ist der ewige Beobachter. Erkennen Sie den Unterschied und bleiben Sie unberührt.', 'Le parcours est le champ extérieur ; la conscience qui manie le club est l’observateur éternel. Comprenez la distinction et restez imperturbable.', '골프 코스는 바깥의 장이고, 클럽을 휘두르는 의식은 영원한 관찰자입니다. 그 차이를 알고 흔들리지 마세요.', 'ゴルフコースは外なる場、クラブを振る意識は永遠の観察者です。その違いを知り、心を乱されずにいましょう。'],
  'Patience (Sattva), frustration (Rajas), and inertia (Tamas). Understand which energy is in your hands before you pull the trigger on a delicate wedge.': ['பொறுமை (சத்துவம்), விரக்தி (ரஜஸ்), மந்தநிலை (தமஸ்). நுணுக்கமான வெட்ஜ் அடிக்கும் முன் உங்கள் கைகளில் எந்த ஆற்றல் உள்ளது என்பதை அறியுங்கள்.', 'धैर्य (सत्त्व), हताशा (रजस) और जड़ता (तमस)। नाज़ुक वेज शॉट से पहले समझें कि आपके हाथों में कौन-सी ऊर्जा है।', 'Geduld (Sattva), Frustration (Rajas) und Trägheit (Tamas). Erkennen Sie vor dem heiklen Wedge, welche Energie Ihre Hände leitet.', 'Patience (sattva), frustration (rajas) et inertie (tamas). Identifiez l’énergie qui vous anime avant de jouer un wedge délicat.', '인내(사트바), 좌절(라자스), 관성(타마스). 섬세한 웨지 샷을 하기 전에 어떤 에너지가 손에 있는지 살펴보세요.', '忍耐（サットヴァ）、苛立ち（ラジャス）、惰性（タマス）。繊細なウェッジを打つ前に、自分の手にどの力が宿っているかを見極めましょう。'],
  'Beyond the player who made the birdie and the one who made the triple lies the true self, pristine and untainted by the scorecard.': ['பேர்டி அடித்தவரையும் டிரிபிள் அடித்தவரையும் கடந்தே, ஸ்கோர்கார்டால் களங்கப்படாத தூய்மையான உண்மையான ஆன்மா இருக்கிறது.', 'बर्डी बनाने वाले और ट्रिपल बोगी करने वाले खिलाड़ी से परे वास्तविक आत्मा है-निर्मल और स्कोरकार्ड से अछूती।', 'Jenseits des Spielers mit Birdie und des Spielers mit Triple liegt das wahre Selbst - rein und unberührt von der Scorekarte.', 'Au-delà du joueur qui a fait un birdie et de celui qui a fait un triple se trouve le vrai soi, pur et intact malgré la carte de score.', '버디를 한 선수와 트리플 보기를 한 선수를 넘어, 스코어카드에 물들지 않은 순수한 참자아가 있습니다.', 'バーディーを取ったプレーヤーもトリプルを打ったプレーヤーも超えたところに、スコアカードに染まらない純粋な真の自己があります。'],
  'Humility accepts a lip-out with poise; pride blames the greenskeeper. Your response to bad fortune reveals your spiritual caliber.': ['தன்னடக்கம் லிப்-அவுட்டை அமைதியாக ஏற்கும்; அகந்தை கிரீன்ஸ்கீப்பரைக் குறை கூறும். துரதிர்ஷ்டத்திற்கான உங்கள் பதில் ஆன்மீகப் பண்பை வெளிப்படுத்துகிறது.', 'विनम्रता लिप-आउट को सहजता से स्वीकारती है; अभिमान ग्रीनकीपर को दोष देता है। दुर्भाग्य पर आपकी प्रतिक्रिया आपका आध्यात्मिक स्तर दिखाती है।', 'Demut nimmt einen Lip-out gelassen hin; Stolz gibt dem Greenkeeper die Schuld. Ihre Reaktion auf Pech zeigt Ihre innere Reife.', 'L’humilité accepte une balle qui lèche le bord avec calme ; l’orgueil accuse le greenkeeper. Votre réaction à l’adversité révèle votre maturité spirituelle.', '겸손은 홀 가장자리를 돌아 나온 공을 평정하게 받아들이지만, 자만은 코스 관리자를 탓합니다. 불운에 대한 반응이 내면의 깊이를 보여줍니다.', '謙虚さはカップに蹴られた一打を平静に受け止め、傲慢さはグリーンキーパーのせいにします。不運への反応が心の成熟度を映します。'],
  'Carry unshakable faith over the treacherous water carry. The ball reflects the exact purity and focus with which it was struck.': ['ஆபத்தான நீர்த் தடையைத் தாண்டும்போது அசைக்க முடியாத நம்பிக்கையை எடுத்துச் செல்லுங்கள். அடித்த தருணத்தின் தூய்மையையும் ஒருமுகத்தையும் பந்து பிரதிபலிக்கிறது.', 'खतरनाक जल-बाधा के पार अटूट विश्वास लेकर जाएँ। गेंद उसी शुद्धता और एकाग्रता को दर्शाती है जिससे उसे मारा गया।', 'Tragen Sie unerschütterlichen Glauben über das tückische Wasserhindernis. Der Ball spiegelt die Reinheit und Konzentration des Schlags wider.', 'Franchissez l’obstacle d’eau avec une foi inébranlable. La balle reflète exactement la pureté et la concentration du coup.', '위험한 워터 해저드를 넘을 때 흔들리지 않는 믿음을 지니세요. 공은 타격 순간의 순수함과 집중을 그대로 비춥니다.', '危険な池越えには揺るがぬ信頼を携えて。ボールは打った瞬間の純粋さと集中をそのまま映します。'],
  'The 18th hole brings total surrender. You lay down the clubs with profound tranquility. The tournament ends, but the awakeness lasts forever.': ['18-ஆம் குழி முழுமையான சரணாகதியைக் கொண்டுவருகிறது. ஆழ்ந்த அமைதியுடன் கிளப்புகளை வைக்கிறீர்கள். போட்டி முடிகிறது; விழிப்புணர்வு என்றென்றும் நீடிக்கிறது.', '18वाँ होल पूर्ण समर्पण लाता है। आप गहरी शांति से क्लब रख देते हैं। टूर्नामेंट समाप्त होता है, पर जागरूकता सदा बनी रहती है।', 'Das 18. Loch führt zur völligen Hingabe. In tiefer Ruhe legen Sie die Schläger nieder. Das Turnier endet, doch das Erwachen bleibt.', 'Le 18e trou mène à l’abandon total. Vous déposez les clubs dans une profonde sérénité. Le tournoi s’achève, mais l’éveil demeure.', '18번 홀은 완전한 내려놓음으로 이끕니다. 깊은 평온 속에서 클럽을 내려놓습니다. 경기는 끝나도 깨어 있음은 영원히 이어집니다.', '18番ホールは完全な委ねへと導きます。深い静けさの中でクラブを置く。大会は終わっても、目覚めは永遠に続きます。'],
  'Speaking page': ['உரைப் பக்கம்', 'व्याख्यान पृष्ठ', 'Vortragsseite', 'Page des conférences', '강연 페이지', '講演ページ'],
  'For speaking and retreat enquiries, the form on the': ['உரை மற்றும் முகாம் தொடர்பான விசாரணைகளுக்கு,', 'व्याख्यान और रिट्रीट से जुड़ी पूछताछ के लिए,', 'Für Anfragen zu Vorträgen und Retreats ist das Formular auf der', 'Pour les demandes de conférences et retraites, le formulaire de la', '강연 및 리트릿 문의는', '講演やリトリートのお問い合わせは'],
  'will get to the right person faster. This form is for everything else.': ['சரியான நபரை விரைவாகச் சென்றடையும். மற்ற அனைத்திற்கும் இந்தப் படிவத்தைப் பயன்படுத்துங்கள்.', 'से सही व्यक्ति तक जल्दी पहुँचेगी। अन्य सभी विषयों के लिए यह फ़ॉर्म है।', 'erreichen Sie schneller die richtige Ansprechperson. Dieses Formular ist für alles andere.', 'vous mettra plus rapidement en contact avec la bonne personne. Ce formulaire concerne tout le reste.', '해당 페이지의 양식을 이용하면 더 빠르게 담당자에게 전달됩니다. 그 외 문의는 이 양식을 이용하세요.', 'のフォームからお問い合わせください。その他のご連絡にはこちらのフォームをご利用ください。'],
  'Close modal': ['மூடு', 'बंद करें', 'Dialog schließen', 'Fermer la fenêtre', '창 닫기', '閉じる'],
  'WHERE TO BUY': ['எங்கே வாங்கலாம்', 'कहाँ से खरीदें', 'WO KAUFEN', 'OÙ ACHETER', '구매처', '購入方法'],
  'Buy now': ['இப்போதே வாங்குங்கள்', 'अभी खरीदें', 'Jetzt kaufen', 'Acheter', '지금 구매', '今すぐ購入'],
  'Previous hole': ['முந்தைய குழி', 'पिछला होल', 'Vorheriges Loch', 'Trou précédent', '이전 홀', '前のホール'],
  'Next hole': ['அடுத்த குழி', 'अगला होल', 'Nächstes Loch', 'Trou suivant', '다음 홀', '次のホール'],
  'Previous chapter': ['முந்தைய அத்தியாயம்', 'पिछला अध्याय', 'Vorheriges Kapitel', 'Chapitre précédent', '이전 챕터', '前の章'],
  'Next chapter': ['அடுத்த அத்தியாயம்', 'अगला अध्याय', 'Nächstes Kapitel', 'Chapitre suivant', '다음 챕터', '次の章'],
  'Issue No. 1': ['இதழ் எண் 1', 'अंक संख्या 1', 'Ausgabe Nr. 1', 'Numéro 1', '1호', '第1号'],
  'Email Address': ['மின்னஞ்சல் முகவரி', 'ईमेल पता', 'E-Mail-Adresse', 'Adresse e-mail', '이메일 주소', 'メールアドレス'],
  'MIRROR': ['கண்ணாடி', 'दर्पण', 'SPIEGEL', 'MIROIR', '거울', '鏡'],
  'Golf is a': ['கோல்ஃப் என்பது ஒரு', 'गोल्फ एक', 'Golf ist ein', 'Le golf est un', '골프는', 'ゴルフは'],
  '- patience, ego, the restless mind, reflected back.': ['- பொறுமை, அகந்தை, அமைதியற்ற மனம் ஆகியவற்றை நமக்குப் பிரதிபலிக்கிறது.', '- धैर्य, अहंकार और चंचल मन को वापस प्रतिबिंबित करता है।', '- es spiegelt Geduld, Ego und einen unruhigen Geist wider.', '- patience, ego et agitation intérieure s’y reflètent.', '- 인내심, 자아, 흔들리는 마음을 되비춥니다.', '-忍耐、自我、落ち着かない心を映し返します。'],
  'Golf Gita maps it exactly -': ['கோல்ஃப் கீதா இதனைத் துல்லியமாக இணைக்கிறது -', 'गोल्फ गीता इसे सटीक रूप से जोड़ती है -', 'Golf Gita ordnet es genau zu -', 'Golf Gita établit précisément le lien -', '골프 기타는 이를 정확히 연결합니다 -', 'ゴルフ・ギーターはこれを正確に対応させます -'],
  'holes to': ['குழிகளை', 'होल को', 'Löcher zu', 'trous à', '홀과', 'ホールを'],
  'chapters,': ['அத்தியாயங்கள்,', 'अध्यायों,', 'Kapiteln,', 'chapitres,', '장,', '章、'],
  'forces that shape how we play.': ['நாம் விளையாடும் விதத்தை வடிவமைக்கும் சக்திகள்.', 'हमारे खेलने के तरीके को आकार देने वाली शक्तियाँ।', 'Kräfte, die unser Spiel prägen.', 'forces qui façonnent notre jeu.', '우리의 플레이 방식을 만드는 힘.', 'プレーのあり方を形づくる力。'],
  'Nine forces met you already. What you carry into the back nine is your choice.': ['ஒன்பது சக்திகளை ஏற்கெனவே சந்தித்துவிட்டீர்கள். பின்புற ஒன்பதுக்குள் எதை எடுத்துச் செல்கிறீர்கள் என்பது உங்கள் தேர்வு.', 'आप नौ शक्तियों से मिल चुके हैं। बैक नाइन में क्या लेकर जाते हैं, यह आपकी पसंद है।', 'Neun Kräfte sind Ihnen bereits begegnet. Was Sie auf die zweiten neun mitnehmen, entscheiden Sie.', 'Vous avez déjà rencontré neuf forces. Ce que vous emportez sur le retour est votre choix.', '아홉 가지 힘을 이미 만났습니다. 후반 9홀에 무엇을 가져갈지는 당신의 선택입니다.', 'すでに九つの力に出会いました。後半9ホールに何を持ち込むかはあなた次第です。'],
  'Get the book': ['புத்தகத்தைப் பெறுங்கள்', 'पुस्तक प्राप्त करें', 'Buch erhalten', 'Obtenir le livre', '책 받기', '本を手に入れる'],
  '18 HOLES': ['18 குழிகள்', '18 होल', '18 LÖCHER', '18 TROUS', '18홀', '18ホール'],
  'Each hole corresponds to a chapter of the Bhagavad Gita. Each chapter arrives exactly when the game needs it.': ['ஒவ்வொரு குழியும் பகவத் கீதையின் ஓர் அத்தியாயத்துடன் தொடர்புடையது. ஆட்டத்திற்குத் தேவைப்படும் நேரத்தில் அந்த அத்தியாயம் வருகிறது.', 'हर होल भगवद्गीता के एक अध्याय से जुड़ा है। हर अध्याय ठीक उसी समय आता है जब खेल को उसकी ज़रूरत होती है।', 'Jedes Loch entspricht einem Kapitel der Bhagavad Gita. Jedes Kapitel kommt genau dann, wenn das Spiel es braucht.', 'Chaque trou correspond à un chapitre de la Bhagavad-Gita. Chaque chapitre arrive au moment où le jeu en a besoin.', '각 홀은 바가바드 기타의 한 장에 해당합니다. 각 장은 경기가 필요로 하는 순간에 찾아옵니다.', '各ホールはバガヴァッド・ギーターの一章に対応します。ゲームが必要とする時に、その教えが訪れます。'],
  'DESCRIPTION': ['விளக்கம்', 'विवरण', 'BESCHREIBUNG', 'DESCRIPTION', '설명', '概要'],
  '18 HOLES. 18 CHAPTERS. ONE ANCIENT MAP.': ['18 குழிகள். 18 அத்தியாயங்கள். ஒரு பழமையான வழிகாட்டி.', '18 होल। 18 अध्याय। एक प्राचीन मार्गदर्शिका।', '18 Löcher. 18 Kapitel. Eine alte Landkarte.', '18 trous. 18 chapitres. Une carte ancienne.', '18홀. 18장. 하나의 오래된 지도.', '18ホール。18章。一つの古代の地図。'],
  'CHAPTERS OVERVIEW': ['அத்தியாயங்கள் கண்ணோட்டம்', 'अध्यायों का अवलोकन', 'KAPITELÜBERSICHT', 'APERÇU DES CHAPITRES', '챕터 개요', '章の概要'],
  'Chapter / Hole': ['அத்தியாயம் / குழி', 'अध्याय / होल', 'Kapitel / Loch', 'Chapitre / Trou', '챕터 / 홀', '章 / ホール'],
  '18 Chapters, 18 Experiences, 18 Lessons': ['18 அத்தியாயங்கள், 18 அனுபவங்கள், 18 பாடங்கள்', '18 अध्याय, 18 अनुभव, 18 सीख', '18 Kapitel, 18 Erlebnisse, 18 Lektionen', '18 chapitres, 18 expériences, 18 leçons', '18개 챕터, 18가지 경험, 18가지 교훈', '18章、18の体験、18の教訓'],
  'FAQS': ['அடிக்கடி கேட்கப்படும் கேள்விகள்', 'अक्सर पूछे जाने वाले प्रश्न', 'HÄUFIGE FRAGEN', 'FAQ', '자주 묻는 질문', 'よくある質問'],
  'The book took three years to write. The first draft mapped the holes in order and found, without planning to, that each chapter arrived at exactly the right moment. That coincidence became the argument.': ['இந்தப் புத்தகத்தை எழுத மூன்று ஆண்டுகள் ஆனது. முதல் வரைவில் குழிகளை வரிசைப்படுத்தியபோது, திட்டமிடாமலேயே ஒவ்வொரு அத்தியாயமும் சரியான தருணத்தில் வந்தது. அந்த ஒற்றுமையே இதன் வாதமாகியது.', 'पुस्तक लिखने में तीन साल लगे। पहले मसौदे में होल को क्रम से रखा और अनायास ही हर अध्याय ठीक सही समय पर आया। यही संयोग पुस्तक का तर्क बन गया।', 'Das Buch brauchte drei Jahre. Der erste Entwurf ordnete die Löcher und stellte ungeplant fest, dass jedes Kapitel genau im richtigen Moment kam. Dieser Zufall wurde zur These.', 'Le livre a demandé trois ans d’écriture. Le premier brouillon associait les trous dans l’ordre et a révélé, sans l’avoir prévu, que chaque chapitre arrivait au bon moment. Cette coïncidence est devenue l’argument.', '책을 쓰는 데 3년이 걸렸습니다. 첫 초안에서 홀을 순서대로 연결하다 보니, 의도하지 않았는데도 각 장이 정확한 순간에 찾아왔습니다. 그 우연이 책의 논지가 되었습니다.', '執筆には3年かかりました。ホールを順に並べた初稿で、意図せず各章がちょうどよい瞬間に現れることに気づきました。その符合が本書の論点になりました。'],
  'Nazeer Tajudeen has been playing golf since 2004 and has spent over fifteen years studying the Bhagavad Gita. Golf Gita emerged from a question asked on a course in Scotland: why does this game feel like a philosophical practice, and why does no one say so out loud?': ['நசீர் தாஜுதீன் 2004 முதல் கோல்ஃப் விளையாடி வருகிறார்; பகவத் கீதையைப் பதினைந்து ஆண்டுகளுக்கும் மேலாகப் படித்து வருகிறார். ஸ்காட்லாந்து மைதானத்தில் எழுந்த ஒரு கேள்வியிலிருந்து கோல்ஃப் கீதா உருவானது: இந்த விளையாட்டு ஏன் தத்துவப் பயிற்சிபோல் உணரப்படுகிறது, இதை ஏன் யாரும் வெளிப்படையாகச் சொல்லவில்லை?', 'नज़ीर ताजुद्दीन 2004 से गोल्फ़ खेल रहे हैं और पंद्रह वर्षों से अधिक समय से भगवद्गीता का अध्ययन कर रहे हैं। स्कॉटलैंड के एक कोर्स पर उठे सवाल से गोल्फ़ गीता का जन्म हुआ: यह खेल दार्शनिक अभ्यास जैसा क्यों लगता है, और कोई इसे खुलकर क्यों नहीं कहता?', 'Nazeer Tajudeen spielt seit 2004 Golf und beschäftigt sich seit über fünfzehn Jahren mit der Bhagavad Gita. Golf Gita entstand aus einer Frage auf einem Platz in Schottland: Warum fühlt sich dieses Spiel wie eine philosophische Praxis an, und warum sagt das niemand laut?', 'Nazeer Tajudeen joue au golf depuis 2004 et étudie la Bhagavad-Gita depuis plus de quinze ans. Golf Gita est née d’une question posée sur un parcours en Écosse : pourquoi ce jeu ressemble-t-il à une pratique philosophique, et pourquoi personne ne le dit-il tout haut ?', '나지르 타주딘은 2004년부터 골프를 해왔으며 15년 넘게 바가바드 기타를 공부했습니다. 골프 기타는 스코틀랜드의 한 코스에서 나온 질문에서 시작되었습니다. 왜 이 경기는 철학적 수행처럼 느껴지며, 왜 아무도 이를 소리 내어 말하지 않을까요?', 'ナジール・タジュディーンは2004年からゴルフを続け、15年以上にわたりバガヴァッド・ギーターを研究してきました。ゴルフ・ギーターはスコットランドのコースで生まれた問いから始まりました。なぜこのゲームは哲学の実践のように感じられるのか、そしてなぜ誰もそれを口にしないのか。'],
  'Nazeer speaks at golf clubs, leadership programmes, and wellness retreats across India, the UK, and Southeast Asia. He lives in Bangalore.': ['நசீர் இந்தியா, இங்கிலாந்து மற்றும் தென்கிழக்கு ஆசியா முழுவதும் உள்ள கோல்ஃப் கிளப்புகள், தலைமைத்துவத் திட்டங்கள் மற்றும் நலவாழ்வு முகாம்களில் உரையாற்றுகிறார். அவர் பெங்களூரில் வசிக்கிறார்.', 'नज़ीर भारत, ब्रिटेन और दक्षिण-पूर्व एशिया के गोल्फ़ क्लबों, नेतृत्व कार्यक्रमों और वेलनेस रिट्रीट में बोलते हैं। वे बेंगलुरु में रहते हैं।', 'Nazeer spricht in Golfclubs, Führungskräfteprogrammen und Wellness-Retreats in Indien, Großbritannien und Südostasien. Er lebt in Bangalore.', 'Nazeer intervient dans des clubs de golf, des programmes de leadership et des retraites bien-être en Inde, au Royaume-Uni et en Asie du Sud-Est. Il vit à Bangalore.', '나지르는 인도, 영국, 동남아시아의 골프 클럽, 리더십 프로그램, 웰니스 리트릿에서 강연합니다. 벵갈루루에 살고 있습니다.', 'ナジールはインド、英国、東南アジア各地のゴルフクラブ、リーダーシップ・プログラム、ウェルネス・リトリートで講演しています。バンガロール在住です。'],
  'Enquire about speaking': ['உரை நிகழ்ச்சி குறித்து விசாரிக்கவும்', 'व्याख्यान के लिए पूछताछ करें', 'Vortragsanfrage stellen', 'Demander une conférence', '강연 문의하기', '講演について問い合わせる'],
  'THE INNER GAME,': ['உள் ஆட்டம்,', 'भीतरी खेल,', 'DAS INNERE SPIEL,', 'LE JEU INTÉRIEUR,', '내면의 경기,', '内なるゲームを、'],
  'BROUGHT TO YOUR COURSE.': ['உங்கள் மைதானத்திற்கு.', 'आपके कोर्स तक।', 'AUF IHREN PLATZ GEBRACHT.', 'SUR VOTRE PARCOURS.', '당신의 코스로 가져옵니다.', 'あなたのコースへ。'],
  "Keynotes, workshops, and immersive retreats built on the Golf Gita's 18-chapter framework. For golf clubs, corporate teams, and anyone who uses the game as a place to think.": ['கோல்ஃப் கீதையின் 18 அத்தியாயக் கட்டமைப்பை அடிப்படையாகக் கொண்ட முக்கிய உரைகள், பயிலரங்குகள் மற்றும் ஆழ்ந்த முகாம்கள். கோல்ஃப் கிளப்புகள், நிறுவனக் குழுக்கள் மற்றும் சிந்தனைக்கான இடமாக விளையாட்டைப் பயன்படுத்துவோருக்காக.', 'गोल्फ़ गीता के 18-अध्याय ढाँचे पर आधारित मुख्य भाषण, कार्यशालाएँ और गहन रिट्रीट। गोल्फ़ क्लबों, कॉर्पोरेट टीमों और खेल को चिंतन का माध्यम मानने वाले सभी लोगों के लिए।', 'Keynotes, Workshops und immersive Retreats auf Grundlage des 18-Kapitel-Modells der Golf Gita. Für Golfclubs, Unternehmensteams und alle, die das Spiel zum Nachdenken nutzen.', 'Conférences, ateliers et retraites immersives fondés sur les 18 chapitres de Golf Gita. Pour les clubs de golf, les équipes d’entreprise et tous ceux qui font du jeu un espace de réflexion.', '골프 기타의 18장 체계를 바탕으로 한 기조연설, 워크숍, 몰입형 리트릿입니다. 골프 클럽, 기업 팀, 경기를 사유의 장으로 삼는 모든 분을 위한 프로그램입니다.', 'ゴルフ・ギーターの18章の枠組みに基づく基調講演、ワークショップ、没入型リトリート。ゴルフクラブ、企業チーム、ゲームを思索の場とするすべての方へ。'],
  'Explore the retreat': ['முகாமைப் பற்றி அறியுங்கள்', 'रिट्रीट के बारे में जानें', 'Retreat entdecken', 'Découvrir la retraite', '리트릿 알아보기', 'リトリートを見る'],
  'THE GAME WITHIN THE GAME, FOR EVERY AUDIENCE.': ['ஒவ்வொருவருக்குமான ஆட்டத்திற்குள் ஓர் ஆட்டம்.', 'हर दर्शक के लिए, खेल के भीतर का खेल।', 'DAS SPIEL IM SPIEL - FÜR JEDES PUBLIKUM.', 'LE JEU DANS LE JEU, POUR TOUS LES PUBLICS.', '모든 청중을 위한 경기 속의 경기.', 'あらゆる人に届ける、ゲームの中のゲーム。'],
  'Keynotes · Talks · Workshops': ['முக்கிய உரைகள் · பேச்சுகள் · பயிலரங்குகள்', 'मुख्य भाषण · वार्ताएँ · कार्यशालाएँ', 'Keynotes · Vorträge · Workshops', 'Conférences · Interventions · Ateliers', '기조연설 · 강연 · 워크숍', '基調講演 · トーク · ワークショップ'],
  'GOLF CLUBS & ASSOCIATIONS': ['கோல்ஃப் கிளப்புகள் & சங்கங்கள்', 'गोल्फ़ क्लब और संघ', 'GOLFCLUBS & VERBÄNDE', 'CLUBS ET ASSOCIATIONS DE GOLF', '골프 클럽 및 협회', 'ゴルフクラブ・協会'],
  'A session that changes how members think about the game they already love.': ['உறுப்பினர்கள் ஏற்கெனவே விரும்பும் விளையாட்டைப் பற்றி சிந்திக்கும் விதத்தை மாற்றும் அமர்வு.', 'एक ऐसा सत्र जो सदस्यों के प्रिय खेल के बारे में सोचने का तरीका बदल देता है।', 'Eine Veranstaltung, die verändert, wie Mitglieder über ihr geliebtes Spiel denken.', 'Une session qui change le regard des membres sur le jeu qu’ils aiment déjà.', '회원들이 이미 사랑하는 경기를 바라보는 방식을 바꾸는 세션입니다.', 'メンバーがすでに愛するゲームへの見方を変えるセッション。'],
  'FOR: CLUB MEMBERS, CAPTAINS, COMMITTEES': ['யாருக்கு: கிளப் உறுப்பினர்கள், கேப்டன்கள், குழுக்கள்', 'किसके लिए: क्लब सदस्य, कप्तान, समितियाँ', 'FÜR: CLUBMITGLIEDER, CAPTAINS, AUSSCHÜSSE', 'POUR : MEMBRES, CAPITAINES, COMITÉS', '대상: 클럽 회원, 캡틴, 위원회', '対象：クラブ会員、キャプテン、委員会'],
  'CORPORATE LEADERSHIP': ['நிறுவனத் தலைமைத்துவம்', 'कॉर्पोरेट नेतृत्व', 'UNTERNEHMENSFÜHRUNG', 'LEADERSHIP EN ENTREPRISE', '기업 리더십', '企業リーダーシップ'],
  'Performance under pressure, decision-making, and the inner game of business.': ['அழுத்தத்தின் கீழ் செயல்திறன், முடிவெடுத்தல் மற்றும் வணிகத்தின் உள் ஆட்டம்.', 'दबाव में प्रदर्शन, निर्णय लेना और व्यवसाय का भीतरी खेल।', 'Leistung unter Druck, Entscheidungsfindung und das innere Spiel des Geschäftslebens.', 'La performance sous pression, la prise de décision et le jeu intérieur de l’entreprise.', '압박 속 수행, 의사결정, 비즈니스의 내면 경기.', 'プレッシャー下のパフォーマンス、意思決定、ビジネスの内なるゲーム。'],
  'FOR: LEADERSHIP TEAMS, OFFSITES, BOARD RETREATS': ['யாருக்கு: தலைமைத்துவக் குழுக்கள், வெளியிடக் கூட்டங்கள், நிர்வாக முகாம்கள்', 'किसके लिए: नेतृत्व टीमें, ऑफसाइट, बोर्ड रिट्रीट', 'FÜR: FÜHRUNGSTEAMS, OFFSITES, BOARD-RETREATS', 'POUR : ÉQUIPES DE DIRECTION, SÉMINAIRES, RETRAITES DE CONSEIL', '대상: 리더십 팀, 오프사이트, 이사회 리트릿', '対象：リーダーシップチーム、オフサイト、役員リトリート'],
  'PHILOSOPHY & WELLNESS': ['தத்துவம் & நலவாழ்வு', 'दर्शन और वेलनेस', 'PHILOSOPHIE & WELLNESS', 'PHILOSOPHIE ET BIEN-ÊTRE', '철학 및 웰니스', '哲学・ウェルネス'],
  'The Gita as a living text, explored through the lens of sport and practice.': ['விளையாட்டு மற்றும் பயிற்சியின் பார்வையில் உயிரோட்டமுள்ள நூலாக கீதை ஆராயப்படுகிறது.', 'खेल और अभ्यास के नज़रिए से गीता को एक जीवंत ग्रंथ के रूप में समझना।', 'Die Gita als lebendiger Text, betrachtet durch die Linse von Sport und Praxis.', 'La Gita comme texte vivant, explorée à travers le sport et la pratique.', '스포츠와 수행의 관점에서 살아 있는 텍스트로 탐구하는 기타.', 'スポーツと実践の視点から、生きた書物としてギーターを探究します。'],
  'FOR: YOGA STUDIOS, WELLNESS RETREATS, LEARNING CENTRES': ['யாருக்கு: யோகா மையங்கள், நலவாழ்வு முகாம்கள், கற்றல் மையங்கள்', 'किसके लिए: योग स्टूडियो, वेलनेस रिट्रीट, शिक्षण केंद्र', 'FÜR: YOGASTUDIOS, WELLNESS-RETREATS, BILDUNGSZENTREN', 'POUR : STUDIOS DE YOGA, RETRAITES BIEN-ÊTRE, CENTRES DE FORMATION', '대상: 요가 스튜디오, 웰니스 리트릿, 교육 센터', '対象：ヨガスタジオ、ウェルネス・リトリート、学習センター'],
  'SCHOOLS & UNIVERSITIES': ['பள்ளிகள் & பல்கலைக்கழகங்கள்', 'स्कूल और विश्वविद्यालय', 'SCHULEN & UNIVERSITÄTEN', 'ÉCOLES ET UNIVERSITÉS', '학교 및 대학교', '学校・大学'],
  'Ancient wisdom framed for a generation navigating performance and identity.': ['செயல்திறன் மற்றும் அடையாளத்தை எதிர்கொள்ளும் தலைமுறைக்காக வடிவமைக்கப்பட்ட பழமையான ஞானம்.', 'प्रदर्शन और पहचान के बीच रास्ता खोज रही पीढ़ी के लिए प्राचीन ज्ञान।', 'Alte Weisheit für eine Generation, die Leistung und Identität navigiert.', 'Une sagesse ancienne pensée pour une génération en quête de performance et d’identité.', '수행과 정체성을 고민하는 세대를 위한 고대의 지혜.', 'パフォーマンスとアイデンティティに向き合う世代へ贈る古代の知恵。'],
  'FOR: STUDENTS, FACULTY, SPORTS ACADEMIES': ['யாருக்கு: மாணவர்கள், ஆசிரியர்கள், விளையாட்டு அகாடமிகள்', 'किसके लिए: विद्यार्थी, शिक्षक, खेल अकादमियाँ', 'FÜR: STUDIERENDE, LEHRKRÄFTE, SPORTAKADEMIEN', 'POUR : ÉTUDIANTS, ENSEIGNANTS, ACADÉMIES SPORTIVES', '대상: 학생, 교수진, 스포츠 아카데미', '対象：学生、教職員、スポーツアカデミー'],
  'The Golf Gita Retreat': ['கோல்ஃப் கீதா முகாம்', 'गोल्फ़ गीता रिट्रीट', 'Das Golf-Gita-Retreat', 'La retraite Golf Gita', '골프 기타 리트릿', 'ゴルフ・ギーター・リトリート'],
  'A ROUND UNLIKE ANY YOU HAVE PLAYED BEFORE.': ['நீங்கள் இதுவரை விளையாடாத ஒரு சுற்று.', 'एक ऐसा राउंड जैसा आपने पहले कभी नहीं खेला।', 'EINE RUNDE, WIE SIE SIE NOCH NIE GESPIELT HABEN.', 'UN PARCOURS COMME VOUS N’EN AVEZ JAMAIS JOUÉ.', '지금까지 경험하지 못한 라운드.', 'これまでにないラウンド。'],
  'THE CLASSROOM': ['வகுப்பறை', 'कक्षा', 'DER UNTERRICHTSRAUM', 'LA SALLE DE COURS', '교실', '教室'],
  'THE COURSE': ['மைதானம்', 'कोर्स', 'DER GOLFPLATZ', 'LE PARCOURS', '코스', 'コース'],
  'THE INTEGRATION': ['ஒருங்கிணைப்பு', 'समेकन', 'DIE INTEGRATION', 'L’INTÉGRATION', '통합', '統合'],
  'DURATION:': ['கால அளவு:', 'अवधि:', 'DAUER:', 'DURÉE :', '기간:', '期間：'],
  'Tailored to client': ['வாடிக்கையாளருக்கேற்ப', 'ग्राहक के अनुसार', 'Individuell abgestimmt', 'Adaptée au client', '고객 맞춤', 'ご要望に合わせて'],
  'LOCATION:': ['இடம்:', 'स्थान:', 'ORT:', 'LIEU :', '장소:', '場所：'],
  'Worldwide': ['உலகம் முழுவதும்', 'दुनिया भर में', 'Weltweit', 'Dans le monde entier', '전 세계', '世界各地'],
  'GROUP SIZE:': ['குழு அளவு:', 'समूह का आकार:', 'GRUPPENGRÖSSE:', 'TAILLE DU GROUPE :', '그룹 규모:', 'グループ人数：'],
  'Intimate': ['நெருக்கமான', 'छोटा समूह', 'Im kleinen Kreis', 'En petit comité', '소규모', '少人数'],
  'TELL US ABOUT YOUR EVENT.': ['உங்கள் நிகழ்வைப் பற்றி கூறுங்கள்.', 'अपने कार्यक्रम के बारे में बताएँ।', 'ERZÄHLEN SIE UNS VON IHRER VERANSTALTUNG.', 'PARLEZ-NOUS DE VOTRE ÉVÉNEMENT.', '행사에 대해 알려주세요.', 'イベントについてお聞かせください。'],
  'We respond within two working days. No obligation, no pitch deck.': ['இரண்டு வேலை நாட்களுக்குள் பதிலளிப்போம். எந்தக் கட்டுப்பாடும் இல்லை; விற்பனை விளக்கமும் இல்லை.', 'हम दो कार्यदिवसों में जवाब देते हैं। कोई बाध्यता नहीं, कोई बिक्री प्रस्तुति नहीं।', 'Wir antworten innerhalb von zwei Werktagen. Unverbindlich und ohne Verkaufspitch.', 'Nous répondons sous deux jours ouvrés. Sans engagement ni présentation commerciale.', '영업일 기준 이틀 내에 답변드립니다. 부담이나 홍보 자료는 없습니다.', '2営業日以内にご返信します。義務も売り込み資料もありません。'],
  'Thank you for reaching out!': ['தொடர்பு கொண்டதற்கு நன்றி!', 'संपर्क करने के लिए धन्यवाद!', 'Vielen Dank für Ihre Nachricht!', 'Merci de nous avoir contactés !', '문의해 주셔서 감사합니다!', 'お問い合わせありがとうございます！'],
  'We have received your enquiry and will be in touch within two working days.': ['உங்கள் விசாரணையைப் பெற்றோம். இரண்டு வேலை நாட்களுக்குள் தொடர்புகொள்கிறோம்.', 'हमें आपकी पूछताछ मिल गई है। हम दो कार्यदिवसों में संपर्क करेंगे।', 'Wir haben Ihre Anfrage erhalten und melden uns innerhalb von zwei Werktagen.', 'Nous avons reçu votre demande et vous répondrons sous deux jours ouvrés.', '문의가 접수되었습니다. 영업일 기준 이틀 내에 연락드리겠습니다.', 'お問い合わせを受け付けました。2営業日以内にご連絡します。'],
  'Organization': ['நிறுவனம்', 'संगठन', 'Organisation', 'Organisation', '단체명', '組織名'],
  'Phone': ['தொலைபேசி', 'फ़ोन', 'Telefon', 'Téléphone', '전화번호', '電話番号'],
  'Type of enquiry': ['விசாரணை வகை', 'पूछताछ का प्रकार', 'Art der Anfrage', 'Type de demande', '문의 유형', 'お問い合わせの種類'],
  'Select type of enquiry': ['விசாரணை வகையைத் தேர்ந்தெடுக்கவும்', 'पूछताछ का प्रकार चुनें', 'Anfragetyp auswählen', 'Choisir le type de demande', '문의 유형 선택', 'お問い合わせの種類を選択'],
  'Golf Club / Member Keynote': ['கோல்ஃப் கிளப் / உறுப்பினர் முக்கிய உரை', 'गोल्फ़ क्लब / सदस्य मुख्य भाषण', 'Keynote für Golfclub / Mitglieder', 'Conférence pour club / membres', '골프 클럽 / 회원 기조연설', 'ゴルフクラブ・会員向け基調講演'],
  'Corporate Leadership Retreat': ['நிறுவனத் தலைமைத்துவ முகாம்', 'कॉर्पोरेट नेतृत्व रिट्रीट', 'Führungskräfte-Retreat', 'Retraite de leadership en entreprise', '기업 리더십 리트릿', '企業リーダーシップ・リトリート'],
  'Philosophy & Wellness Clinic': ['தத்துவம் & நலவாழ்வு பயிற்சி முகாம்', 'दर्शन और वेलनेस क्लिनिक', 'Philosophie- und Wellness-Workshop', 'Atelier philosophie et bien-être', '철학 및 웰니스 클리닉', '哲学・ウェルネス・クリニック'],
  'School / University Talk': ['பள்ளி / பல்கலைக்கழக உரை', 'स्कूल / विश्वविद्यालय वार्ता', 'Vortrag an Schule / Universität', 'Intervention école / université', '학교 / 대학 강연', '学校・大学での講演'],
  'Private Group Masterclass': ['தனியார் குழு மாஸ்டர் வகுப்பு', 'निजी समूह मास्टरक्लास', 'Masterclass für private Gruppen', 'Masterclass en groupe privé', '비공개 그룹 마스터클래스', 'プライベートグループ・マスタークラス'],
  'City': ['நகரம்', 'शहर', 'Stadt', 'Ville', '도시', '都市'],
  'Main Navigation': ['முதன்மை வழிசெலுத்தல்', 'मुख्य नेविगेशन', 'Hauptnavigation', 'Navigation principale', '기본 내비게이션', 'メインナビゲーション'],
  'Toggle navigation': ['வழிசெலுத்தலை மாற்று', 'नेविगेशन टॉगल करें', 'Navigation umschalten', 'Afficher/masquer la navigation', '내비게이션 전환', 'ナビゲーションを切り替え'],
  'Golf Gita Home': ['கோல்ஃப் கீதா முகப்பு', 'गोल्फ़ गीता होम', 'Golf-Gita-Startseite', 'Accueil Golf Gita', '골프 기타 홈', 'ゴルフ・ギーター ホーム'],
  'Golf Gita Emblem': ['கோல்ஃப் கீதா சின்னம்', 'गोल्फ़ गीता प्रतीक', 'Golf-Gita-Emblem', 'Emblème Golf Gita', '골프 기타 엠블럼', 'ゴルフ・ギーターの紋章'],
  'Golf Gita Celestial Sun Emblem': ['கோல்ஃப் கீதா விண்ணுலக சூரியச் சின்னம்', 'गोल्फ़ गीता दिव्य सूर्य प्रतीक', 'Himmlisches Sonnensymbol von Golf Gita', 'Emblème solaire céleste de Golf Gita', '골프 기타 천상의 태양 엠블럼', 'ゴルフ・ギーターの天空の太陽紋章'],
  'Book summary marquee': ['புத்தகச் சுருக்கம்', 'पुस्तक सारांश', 'Buchzusammenfassung', 'Résumé du livre', '도서 요약', '本の概要'],
  'Golf Gita: The Eternal Game of Celestial Wisdom by Nazeer Tajudeen': ['நசீர் தாஜுதீனின் கோல்ஃப் கீதா: விண்ணுலக ஞானத்தின் நித்திய விளையாட்டு', 'नज़ीर ताजुद्दीन की गोल्फ़ गीता: दिव्य ज्ञान का शाश्वत खेल', 'Golf Gita: Das ewige Spiel himmlischer Weisheit von Nazeer Tajudeen', 'Golf Gita : le jeu éternel de la sagesse céleste, par Nazeer Tajudeen', '나지르 타주딘의 골프 기타: 천상의 지혜가 깃든 영원한 경기', 'ナジール・タジュディーン著『ゴルフ・ギーター：天上の智慧の永遠のゲーム』'],
  'Golf Gita Book Cover': ['கோல்ஃப் கீதா புத்தக அட்டை', 'गोल्फ़ गीता पुस्तक आवरण', 'Golf-Gita-Buchcover', 'Couverture du livre Golf Gita', '골프 기타 책 표지', 'ゴルフ・ギーターの書影'],
  'Golf Gita CTA Emblem': ['கோல்ஃப் கீதா அழைப்பு சின்னம்', 'गोल्फ़ गीता CTA प्रतीक', 'Golf-Gita-CTA-Emblem', 'Emblème CTA de Golf Gita', '골프 기타 CTA 엠블럼', 'ゴルフ・ギーターCTA紋章'],
  'Golf retreat and leadership speaking session': ['கோல்ஃப் முகாம் மற்றும் தலைமைத்துவ உரை அமர்வு', 'गोल्फ़ रिट्रीट और नेतृत्व व्याख्यान सत्र', 'Golf-Retreat und Führungsvortrag', 'Retraite de golf et conférence sur le leadership', '골프 리트릿 및 리더십 강연 세션', 'ゴルフ・リトリートとリーダーシップ講演'],
  'Golf course at the turn': ['திருப்பப் பகுதியில் உள்ள கோல்ஃப் மைதானம்', 'टर्न पर गोल्फ़ कोर्स', 'Golfplatz am Turn', 'Parcours de golf au tournant', '턴 지점의 골프 코스', '折り返し地点のゴルフコース'],
  'Golf Gita - The Eternal Game of Celestial Wisdom | By Nazeer Tajudeen': ['கோல்ஃப் கீதா - விண்ணுலக ஞானத்தின் நித்திய விளையாட்டு | நசீர் தாஜுதீன்', 'गोल्फ़ गीता - दिव्य ज्ञान का शाश्वत खेल | नज़ीर ताजुद्दीन द्वारा', 'Golf Gita - Das ewige Spiel himmlischer Weisheit | Von Nazeer Tajudeen', 'Golf Gita - Le jeu éternel de la sagesse céleste | Par Nazeer Tajudeen', '골프 기타 - 천상의 지혜가 깃든 영원한 경기 | 나지르 타주딘', 'ゴルフ・ギーター - 天上の智慧の永遠のゲーム | ナジール・タジュディーン'],
  'Golf Gita maps each hole on the course to a chapter of the Bhagavad Gita. Where the fairway meets the battlefield.': ['கோல்ஃப் கீதா, மைதானத்தின் ஒவ்வொரு குழியையும் பகவத் கீதையின் ஓர் அத்தியாயத்துடன் இணைக்கிறது. ஃபேர்வேயும் போர்க்களமும் சந்திக்கும் இடம்.', 'गोल्फ़ गीता मैदान के हर होल को भगवद्गीता के एक अध्याय से जोड़ती है। जहाँ फेयरवे रणभूमि से मिलता है।', 'Golf Gita verbindet jedes Loch des Platzes mit einem Kapitel der Bhagavad Gita. Wo Fairway und Schlachtfeld aufeinandertreffen.', 'Golf Gita associe chaque trou du parcours à un chapitre de la Bhagavad-Gita. Là où le fairway rencontre le champ de bataille.', '골프 기타는 코스의 각 홀을 바가바드 기타의 한 장과 연결합니다. 페어웨이와 전장이 만나는 곳.', 'ゴルフ・ギーターは各ホールをバガヴァッド・ギーターの章に結びつけます。フェアウェイと戦場が交わる場所。'],
  'Nazeer Tajudeen - Author of Golf Gita': ['நசீர் தாஜுதீன் - கோல்ஃப் கீதா நூலாசிரியர்', 'नज़ीर ताजुद्दीन - गोल्फ़ गीता के लेखक', 'Nazeer Tajudeen - Autor von Golf Gita', 'Nazeer Tajudeen - auteur de Golf Gita', '나지르 타주딘 - 골프 기타 저자', 'ナジール・タジュディーン - ゴルフ・ギーター著者'],
  'In the ancient wisdom tradition, every physical action carries an internal counterpart. When standing on the tee box, the stillness of mind reflects Krishna’s counsel to Arjuna: release the attachment to victory or defeat, and focus purely on the devotion of the present stroke.': ['பழமையான ஞான மரபில், ஒவ்வொரு உடல் செயலுக்கும் ஓர் உள் இணை உண்டு. டீயில் நிற்கும் அமைதியான மனம், வெற்றி தோல்விப் பற்றை விடுத்து இப்போதைய அடியில் முழுமையாக ஈடுபட வேண்டும் என்ற கிருஷ்ணரின் அறிவுரையை அர்ஜுனனுக்கு நினைவூட்டுகிறது.', 'प्राचीन ज्ञान परंपरा में हर शारीरिक क्रिया का एक आंतरिक समकक्ष होता है। टी पर मन की स्थिरता अर्जुन को कृष्ण की सीख याद दिलाती है: जीत या हार से आसक्ति छोड़कर वर्तमान शॉट में पूरी निष्ठा रखें।', 'In der alten Weisheitstradition hat jede körperliche Handlung ein inneres Gegenstück. Die Stille am Abschlag spiegelt Krishnas Rat an Arjuna: Lassen Sie die Bindung an Sieg oder Niederlage los und widmen Sie sich ganz dem gegenwärtigen Schlag.', 'Dans l’ancienne tradition de sagesse, chaque geste physique a son pendant intérieur. Au départ, le calme de l’esprit rappelle le conseil de Krishna à Arjuna : se détacher de la victoire comme de la défaite et se consacrer pleinement au coup présent.', '고대 지혜의 전통에서 모든 신체적 행위에는 내면의 대응물이 있습니다. 티잉 구역에서의 고요함은 승패에 대한 집착을 놓고 지금의 샷에 온전히 집중하라는 크리슈나의 조언을 아르주나에게 일깨웁니다.', '古代の智慧の伝統では、あらゆる身体的な行為に内なる対応物があります。ティーイングエリアでの心の静けさは、勝敗への執着を手放し、今の一打に専心せよというクリシュナのアルジュナへの教えを映しています。'],
  "The Bhagavad Gita's 18 chapters mapped to the structure of a round. Each teaching placed where it arrives on the course.": ['பகவத் கீதையின் 18 அத்தியாயங்கள் ஒரு சுற்றின் அமைப்புடன் இணைக்கப்பட்டுள்ளன. ஒவ்வொரு போதனையும் மைதானத்தில் அது தேவைப்படும் இடத்தில் வைக்கப்பட்டுள்ளது.', 'भगवद्गीता के 18 अध्याय एक राउंड की संरचना से जुड़े हैं। हर शिक्षा को कोर्स पर उसके सही पड़ाव पर रखा गया है।', 'Die 18 Kapitel der Bhagavad Gita sind dem Ablauf einer Runde zugeordnet. Jede Lehre steht dort, wo sie auf dem Platz gebraucht wird.', 'Les 18 chapitres de la Bhagavad-Gita suivent la structure d’une partie. Chaque enseignement apparaît à l’endroit où il prend tout son sens sur le parcours.', '바가바드 기타의 18장을 라운드의 구성에 맞췄습니다. 각 가르침은 코스에서 필요한 순간에 놓여 있습니다.', 'バガヴァッド・ギーターの18章をラウンドの構成に対応させました。それぞれの教えをコースで必要となる場所に置いています。'],
  'Walk the holes. Apply what was heard. The game becomes the practice, not an illustration of it.': ['ஒவ்வொரு குழியிலும் நடந்து, கேட்டதைச் செயல்படுத்துங்கள். விளையாட்டு ஓர் எடுத்துக்காட்டு அல்ல; பயிற்சியாகிறது.', 'होल पर चलें। सुनी हुई बातों को अपनाएँ। खेल उसका उदाहरण नहीं, अभ्यास बन जाता है।', 'Gehen Sie die Löcher ab und wenden Sie das Gehörte an. Das Spiel wird zur Praxis, nicht zu ihrer Illustration.', 'Parcourez les trous. Mettez en pratique ce que vous avez entendu. Le jeu devient la pratique elle-même, et non son illustration.', '홀을 걸으며 들은 가르침을 적용하세요. 경기는 설명의 예시가 아니라 수행 그 자체가 됩니다.', 'ホールを歩き、聞いた教えを実践しましょう。ゲームは教えの例ではなく、実践そのものになります。'],
  'Reflection, group conversation, and a personal framework to carry back into the next round - and beyond it.': ['சிந்தனை, குழு உரையாடல் மற்றும் அடுத்த சுற்றுக்கும் அதற்கு அப்பாலும் எடுத்துச் செல்லும் தனிப்பட்ட வழிமுறை.', 'चिंतन, समूह संवाद और अगले राउंड-और उससे आगे-के लिए एक व्यक्तिगत रूपरेखा।', 'Reflexion, Gruppengespräch und ein persönlicher Leitfaden für die nächste Runde - und darüber hinaus.', 'Réflexion, échange collectif et cadre personnel à emporter pour la prochaine partie, et au-delà.', '성찰, 그룹 대화, 다음 라운드와 그 이후에도 가져갈 개인적인 틀을 제공합니다.', '振り返り、グループでの対話、次のラウンド、そしてその先へ持ち帰る個人の指針。'],
  'THE PRE-SHOT ROUTINE AS MEDITATION': ['முன்-ஷாட் வழக்கம் ஒரு தியானமாக', 'प्री-शॉट रूटीन एक ध्यान के रूप में', 'Die Pre-Shot-Routine als Meditation', 'La routine pré-shot comme méditation', '프리샷 루틴을 명상으로', 'プレショット・ルーティンを瞑想として'],
  'Why the 30 seconds before you swing is the most important practice in golf.': ['நீங்கள் அடிப்பதற்கு முந்தைய 30 வினாடிகள் ஏன் கோல்ஃபின் மிக முக்கியமான பயிற்சி.', 'स्विंग से पहले के 30 सेकंड गोल्फ़ का सबसे महत्वपूर्ण अभ्यास क्यों हैं।', 'Warum die 30 Sekunden vor dem Schlag die wichtigste Übung im Golf sind.', 'Pourquoi les 30 secondes avant votre swing sont la pratique la plus importante au golf.', '스윙 전 30초가 골프에서 가장 중요한 연습인 이유.', 'スイング前の30秒がゴルフで最も大切な練習である理由。'],
  'KARMA AND THE SCORECARD': ['கர்மாவும் ஸ்கோர்கார்டும்', 'कर्म और स्कोरकार्ड', 'Karma und Scorekarte', 'Le karma et la carte de score', '카르마와 스코어카드', 'カルマとスコアカード'],
  'What the Gita actually means by action without attachment to results.': ['முடிவுகளின் மீது பற்றில்லாமல் செயல்படுவது என்பதற்கு கீதை உண்மையில் கூறும் பொருள்.', 'परिणामों से आसक्ति के बिना कर्म करने का गीता में वास्तविक अर्थ।', 'Was die Gita mit Handeln ohne Anhaftung an Ergebnisse wirklich meint.', 'Ce que la Gita entend réellement par agir sans s’attacher aux résultats.', '결과에 집착하지 않는 행동이 기타에서 실제로 뜻하는 것.', '結果に執着せず行為することの、ギーターにおける本当の意味。'],
  'THE YIPS: A SPIRITUAL DIAGNOSIS': ['யிப்ஸ்: ஓர் ஆன்மீகக் கண்டறிதல்', 'यिप्स: एक आध्यात्मिक निदान', 'Das Yips-Phänomen: eine spirituelle Diagnose', 'Les yips : un diagnostic spirituel', '입스: 영적 진단', 'イップス：精神性からの診断'],
  'Ancient psychology has a precise name for what happens on the first tee.': ['முதல் டீயில் நிகழ்வதற்கு பழங்கால உளவியலில் துல்லியமான பெயர் உள்ளது.', 'पहली टी पर जो होता है, उसके लिए प्राचीन मनोविज्ञान में सटीक नाम है।', 'Die alte Psychologie kennt einen präzisen Namen für das, was am ersten Abschlag geschieht.', 'La psychologie ancienne a un nom précis pour ce qui se passe au premier départ.', '첫 번째 티에서 일어나는 현상에는 고대 심리학의 정확한 이름이 있습니다.', '最初のティーで起こることには、古代心理学に正確な名前があります。'],
  "Tell us about the event, your audience, and what you're hoping for.": ['நிகழ்வு, பார்வையாளர்கள் மற்றும் உங்கள் எதிர்பார்ப்புகளைப் பற்றி கூறுங்கள்.', 'कार्यक्रम, दर्शकों और अपनी अपेक्षाओं के बारे में बताएँ।', 'Erzählen Sie uns von der Veranstaltung, Ihrem Publikum und Ihren Erwartungen.', 'Parlez-nous de l’événement, de votre public et de vos attentes.', '행사, 청중 및 기대하시는 점을 알려주세요.', 'イベント、参加者、ご希望についてお聞かせください。'],
  'Do I need to know the Bhagavad Gita to read this?': ['இதைப் படிக்க பகவத் கீதையை அறிந்திருக்க வேண்டுமா?', 'क्या इसे पढ़ने के लिए भगवद्गीता जानना ज़रूरी है?', 'Muss ich die Bhagavad Gita kennen, um dieses Buch zu lesen?', 'Faut-il connaître la Bhagavad-Gita pour lire ce livre ?', '이 책을 읽으려면 바가바드 기타를 알아야 하나요?', '読む前にバガヴァッド・ギーターを知っている必要がありますか？'],
  'Not at all. The book introduces each Gita concept freshly through the lens of golf. No prior knowledge of Sanskrit, philosophy, or Hinduism is required.': ['தேவையில்லை. கோல்ஃப் பார்வையில் ஒவ்வொரு கீதை கருத்தையும் இந்தப் புத்தகம் புதிதாக அறிமுகப்படுத்துகிறது. சமஸ்கிருதம், தத்துவம் அல்லது இந்து மதம் பற்றிய முன் அறிவு தேவையில்லை.', 'बिल्कुल नहीं। पुस्तक गोल्फ़ के नज़रिए से गीता की हर अवधारणा को नए ढंग से समझाती है। संस्कृत, दर्शन या हिंदू धर्म का पूर्वज्ञान आवश्यक नहीं है।', 'Überhaupt nicht. Das Buch führt jedes Gita-Konzept aus der Perspektive des Golfs neu ein. Vorkenntnisse in Sanskrit, Philosophie oder Hinduismus sind nicht nötig.', 'Pas du tout. Le livre présente chaque concept de la Gita à travers le prisme du golf. Aucune connaissance préalable du sanskrit, de la philosophie ou de l’hindouisme n’est requise.', '전혀 필요 없습니다. 이 책은 골프의 관점에서 기타의 개념을 새롭게 소개합니다. 산스크리트어, 철학, 힌두교에 대한 사전 지식은 필요하지 않습니다.', 'まったく必要ありません。ゴルフの視点からギーターの概念を一つずつ紹介します。サンスクリット語、哲学、ヒンドゥー教の予備知識は不要です。'],
  'Is this a religious book?': ['இது ஒரு மத நூலா?', 'क्या यह धार्मिक पुस्तक है?', 'Ist dies ein religiöses Buch?', 'Est-ce un livre religieux ?', '종교 서적인가요?', '宗教書ですか？'],
  'No. Golf Gita draws on the Bhagavad Gita as a universal performance philosophy - the same way a sports psychologist might reference Stoicism. Accessible to readers of any background.': ['இல்லை. கோல்ஃப் கீதா பகவத் கீதையைப் பொதுவான செயல்திறன் தத்துவமாகப் பயன்படுத்துகிறது. எந்தப் பின்னணியிலிருந்தும் வாசிக்கலாம்.', 'नहीं। गोल्फ़ गीता भगवद्गीता को सार्वभौमिक प्रदर्शन-दर्शन के रूप में प्रस्तुत करती है। यह हर पृष्ठभूमि के पाठकों के लिए है।', 'Nein. Golf Gita versteht die Bhagavad Gita als universelle Leistungsphilosophie. Für Leser aller Hintergründe geeignet.', 'Non. Golf Gita s’inspire de la Bhagavad-Gita comme d’une philosophie universelle de la performance. Accessible à tous.', '아닙니다. 골프 기타는 바가바드 기타를 보편적인 수행 철학으로 다룹니다. 어떤 배경의 독자도 읽을 수 있습니다.', 'いいえ。ゴルフ・ギーターはバガヴァッド・ギーターを普遍的なパフォーマンス哲学として扱います。背景を問わず読めます。'],
  'Is it available as an ebook?': ['மின்னூலாகக் கிடைக்குமா?', 'क्या यह ई-बुक के रूप में उपलब्ध है?', 'Ist es als E-Book erhältlich?', 'Est-il disponible en livre numérique ?', '전자책으로도 볼 수 있나요?', '電子書籍版はありますか？'],
  'Yes. The Kindle edition and ePub are available through Amazon and major digital retailers. Links are on the Where to Buy page.': ['ஆம். Kindle பதிப்பும் ePub-மும் Amazon மற்றும் முக்கிய மின்னூல் விற்பனையாளர்களிடம் கிடைக்கின்றன. இணைப்புகள் வாங்கும் பக்கத்தில் உள்ளன.', 'हाँ। Kindle संस्करण और ePub Amazon तथा प्रमुख डिजिटल दुकानों पर उपलब्ध हैं। लिंक खरीदें पृष्ठ पर हैं।', 'Ja. Die Kindle-Ausgabe und das ePub sind bei Amazon und großen digitalen Händlern erhältlich. Links finden Sie auf der Seite „Wo kaufen“.', 'Oui. L’édition Kindle et l’ePub sont disponibles sur Amazon et chez les principaux revendeurs numériques. Les liens figurent sur la page Où acheter.', '네. Kindle판과 ePub은 Amazon 및 주요 디지털 서점에서 구매할 수 있습니다. 링크는 구매처 페이지에 있습니다.', 'はい。Kindle版とePub版はAmazonなど主要な電子書店で購入できます。リンクは購入方法ページにあります。'],
  'Can I bulk-order for a club or corporate event?': ['கிளப் அல்லது நிறுவன நிகழ்வுக்கு மொத்தமாக ஆர்டர் செய்யலாமா?', 'क्या क्लब या कॉर्पोरेट कार्यक्रम के लिए थोक ऑर्डर कर सकते हैं?', 'Kann ich für einen Club oder eine Firmenveranstaltung größere Mengen bestellen?', 'Puis-je commander en quantité pour un club ou un événement d’entreprise ?', '클럽이나 기업 행사용으로 대량 주문할 수 있나요?', 'クラブや企業イベント向けにまとめて注文できますか？'],
  'Yes. Contact us directly for bulk pricing on 10+ copies. We also offer signed collector editions for corporate gift packages.': ['ஆம். 10 பிரதிகளுக்கு மேல் மொத்த விலைக்காக எங்களைத் தொடர்புகொள்ளுங்கள். நிறுவனப் பரிசுகளுக்காக கையொப்பமிட்ட பதிப்புகளும் உள்ளன.', 'हाँ। 10 से अधिक प्रतियों के थोक मूल्य के लिए संपर्क करें। कॉर्पोरेट उपहार के लिए हस्ताक्षरित विशेष संस्करण भी उपलब्ध हैं।', 'Ja. Für Mengen ab 10 Exemplaren kontaktieren Sie uns wegen Sonderpreisen. Für Firmengeschenke gibt es signierte Sammlerausgaben.', 'Oui. Contactez-nous pour un tarif de groupe à partir de 10 exemplaires. Des éditions collector signées sont aussi proposées.', '네. 10권 이상 단체 구매 가격은 문의해 주세요. 기업 선물용 사인본도 있습니다.', 'はい。10冊以上の一括購入価格はお問い合わせください。企業ギフト向けサイン入り版もあります。'],
  'THE CRISIS AT THE TEE': ['டீயில் எழும் நெருக்கடி', 'टी पर संकट', 'DIE KRISE AM ABSCHLAG', 'LA CRISE AU DÉPART', '티잉 구역의 위기', 'ティーでの葛藤'],
  'INFINITY': ['எல்லையின்மை', 'अनंतता', 'UNENDLICHKEIT', 'INFINI', '무한', '無限'],
  'ACTION WITHOUT ATTACHMENT': ['பற்றில்லாச் செயல்', 'अनासक्त कर्म', 'HANDELN OHNE ANHAFTUNG', 'AGIR SANS ATTACHEMENT', '집착 없는 행동', '執着なき行為'],
  'WISDOM IN ACTION': ['செயலில் ஞானம்', 'कर्म में ज्ञान', 'WEISHEIT IM HANDELN', 'LA SAGESSE EN ACTION', '행동 속 지혜', '行為の中の智慧'],
  'RENUNCIATION OF THE PAST': ['கடந்ததைத் துறத்தல்', 'अतीत का त्याग', 'DIE VERGANGENHEIT LOSLASSEN', 'RENoncer AU PASSÉ', '과거를 내려놓기', '過去を手放す'],
  'THE DISCIPLINED MIND': ['ஒழுக்கமான மனம்', 'अनुशासित मन', 'DER DISZIPLINIERTE GEIST', 'L’ESPRIT DISCIPLINÉ', '절제된 마음', '鍛えられた心'],
  'PERCEPTION & ESSENCE': ['பார்வையும் சாரமும்', 'दृष्टि और सार', 'WAHRNEHMUNG & WESEN', 'PERCEPTION ET ESSENCE', '인식과 본질', '認識と本質'],
  'THE IMPERISHABLE PATH': ['அழிவற்ற பாதை', 'अविनाशी मार्ग', 'DER UNVERGÄNGLICHE PFAD', 'LA VOIE IMPÉRISSABLE', '불멸의 길', '不滅の道'],
  'THE SOVEREIGN MYSTERY': ['அரச மறைபொருள்', 'परम रहस्य', 'DAS KÖNIGLICHE GEHEIMNIS', 'LE MYSTÈRE SUPRÊME', '왕의 비밀', '至高の秘義'],
  'DIVINE OPULENCE': ['தெய்வீகச் செழுமை', 'दैवी वैभव', 'GÖTTLICHE FÜLLE', 'SPLENDEUR DIVINE', '신성한 풍요', '神聖なる豊かさ'],
  'THE COSMIC PERSPECTIVE': ['பிரபஞ்சப் பார்வை', 'ब्रह्मांडीय दृष्टि', 'DIE KOSMISCHE PERSPEKTIVE', 'LA PERSPECTIVE COSMIQUE', '우주적 관점', '宇宙的視点'],
  'DEVOTION TO THE PROCESS': ['செயல்முறைக்கான அர்ப்பணிப்பு', 'प्रक्रिया के प्रति समर्पण', 'HINGABE AN DEN PROZESS', 'SE CONSACRER AU PROCESSUS', '과정에 대한 헌신', 'プロセスへの献身'],
  'THE COURSE AND THE KNOWER': ['களமும் அதை அறிபவரும்', 'क्षेत्र और क्षेत्रज्ञ', 'DAS FELD UND DER KENNER', 'LE CHAMP ET CELUI QUI LE CONNAÎT', '장과 그것을 아는 자', '場とそれを知る者'],
  'THE THREE INNER FORCES': ['மூன்று அகச் சக்திகள்', 'तीन आंतरिक शक्तियाँ', 'DIE DREI INNEREN KRÄFTE', 'LES TROIS FORCES INTÉRIEURES', '내면의 세 가지 힘', '内なる三つの力'],
  'THE SUPREME SELF': ['உயர்ந்த ஆன்மா', 'परम आत्मा', 'DAS HÖCHSTE SELBST', 'LE SOI SUPRÊME', '지고의 자아', '至高の自己'],
  'THE TWO DISPOSITIONS': ['இரு மனப்பாங்குகள்', 'दो प्रवृत्तियाँ', 'DIE ZWEI HALTUNGEN', 'LES DEUX DISPOSITIONS', '두 가지 성향', '二つの気質'],
  'THREEFOLD FAITH': ['மூவகை நம்பிக்கை', 'त्रिविध श्रद्धा', 'DREIFACHER GLAUBE', 'LA FOI TRIPLE', '세 가지 신념', '三つの信仰'],
  'SURRENDER & FREEDOM': ['சரணடைதலும் விடுதலையும்', 'समर्पण और मुक्ति', 'HINGABE & FREIHEIT', 'ABANDON ET LIBERTÉ', '내려놓음과 자유', '委ねることと自由'],
  "Arjuna's Crisis": ['அர்ஜுனனின் நெருக்கடி', 'अर्जुन का संकट', 'Arjunas Krise', 'La crise d’Arjuna', '아르주나의 위기', 'アルジュナの葛藤'],
  'The Eternal Self': ['நித்திய ஆன்மா', 'शाश्वत आत्मा', 'Das ewige Selbst', 'Le soi éternel', '영원한 자아', '永遠の自己'],
  'The Pure Stroke': ['தூய ஆட்டம்', 'शुद्ध प्रहार', 'Der reine Schlag', 'Le coup pur', '순수한 스트로크', '純粋な一打'],
  'Silence of the Ego': ['அகந்தையின் மௌனம்', 'अहंकार का मौन', 'Das Schweigen des Egos', 'Le silence de l’ego', '자아의 침묵', '自我の静寂'],
  'Baggage on the Green': ['கிரீனில் சுமை', 'ग्रीन पर बोझ', 'Altlasten auf dem Grün', 'Le poids sur le green', '그린 위의 짐', 'グリーンに残る荷物'],
  'Conquest of Breath': ['மூச்சைக் கட்டுப்படுத்துதல்', 'श्वास पर विजय', 'Meisterschaft über den Atem', 'Maîtrise du souffle', '호흡 다스리기', '呼吸を制する'],
  'The Pure Flight': ['தூய பறப்பு', 'शुद्ध उड़ान', 'Der reine Flug', 'Le vol pur', '순수한 비행', '純粋な飛翔'],
  'Beyond the Handicap': ['ஹேண்டிகேப்பைக் கடந்து', 'हैंडिकैप से परे', 'Jenseits des Handicaps', 'Au-delà du handicap', '핸디캡 너머', 'ハンディキャップを超えて'],
  'The Royal Secret': ['அரச ரகசியம்', 'राजयोग का रहस्य', 'Das königliche Geheimnis', 'Le secret royal', '왕의 비밀', '王の秘密'],
  'Celestial Architecture': ['விண்ணுலகக் கட்டமைப்பு', 'दैवी संरचना', 'Himmlische Architektur', 'Architecture céleste', '천상의 설계', '天上の構造'],
  'The Horizon Expands': ['அடிவானம் விரிகிறது', 'क्षितिज विस्तृत होता है', 'Der Horizont weitet sich', 'L’horizon s’élargit', '지평선이 넓어지다', '地平線が広がる'],
  'Soft Hands & Surrender': ['மென்மையான கரங்களும் சரணாகதியும்', 'कोमल हाथ और समर्पण', 'Sanfte Hände & Hingabe', 'Mains souples et abandon', '부드러운 손과 맡김', '柔らかな手と委ねる心'],
  'The Inner Observer': ['உள் நோக்குநர்', 'भीतरी साक्षी', 'Der innere Beobachter', 'L’observateur intérieur', '내면의 관찰자', '内なる観察者'],
  'Gunas in the Hands': ['கரங்களில் குணங்கள்', 'हाथों में गुण', 'Die Gunas in den Händen', 'Les gunas dans les mains', '손에 깃든 구나', '手に宿るグナ'],
  'Untouched by the Score': ['மதிப்பெண்ணால் பாதிக்கப்படாதது', 'स्कोर से अछूता', 'Vom Ergebnis unberührt', 'Détaché du score', '점수에 흔들리지 않는', 'スコアに左右されない'],
  'Poise vs Pride': ['அமைதியும் அகந்தையும்', 'संयम बनाम अभिमान', 'Gelassenheit statt Stolz', 'Sang-froid ou orgueil', '평정과 자만', '平静と誇り'],
  'The Water Carry': ['நீரைக் கடத்தல்', 'पानी के पार', 'Der Schlag über das Wasser', 'Le franchissement de l’eau', '물을 넘기는 샷', '池越えのショット'],
  'Lay Down the Clubs': ['கோல்ஃப் குச்சிகளை வையுங்கள்', 'क्लब रख दें', 'Die Schläger niederlegen', 'Déposer les clubs', '클럽을 내려놓다', 'クラブを置く'],
  'Select language': ['மொழியைத் தேர்ந்தெடுக்கவும்', 'भाषा चुनें', 'Sprache auswählen', 'Choisir la langue', '언어 선택', '言語を選択'],
  'The oldest game and the oldest question': ['பழமையான விளையாட்டும் பழமையான கேள்வியும்', 'सबसे पुराना खेल और सबसे पुराना प्रश्न', 'Das älteste Spiel und die älteste Frage', 'Le jeu le plus ancien et la question la plus ancienne', '가장 오래된 경기와 가장 오래된 질문', '最も古いゲームと最も古い問い'],
  'share the same number.': ['ஒரே எண்ணைப் பகிர்கின்றன.', 'एक ही संख्या साझा करते हैं।', 'teilen dieselbe Zahl.', 'partagent le même nombre.', '같은 숫자를 공유합니다.', '同じ数字を共有しています。'],
  'Golf Gita maps each hole on the course to a chapter of the Bhagavad Gita. Not a metaphor. A manual.': ['கோல்ஃப் கீதா, மைதானத்தின் ஒவ்வொரு குழியையும் பகவத் கீதையின் ஓர் அத்தியாயத்துடன் இணைக்கிறது. இது உருவகம் அல்ல. ஒரு வழிகாட்டி.', 'गोल्फ़ गीता मैदान के हर होल को भगवद्गीता के एक अध्याय से जोड़ती है। यह रूपक नहीं, एक मार्गदर्शिका है।', 'Golf Gita verbindet jedes Loch des Platzes mit einem Kapitel der Bhagavad Gita. Keine Metapher. Ein Leitfaden.', 'Golf Gita associe chaque trou du parcours à un chapitre de la Bhagavad-Gita. Pas une métaphore. Un guide.', '골프 기타는 코스의 각 홀을 바가바드 기타의 한 장과 연결합니다. 비유가 아니라 안내서입니다.', 'ゴルフ・ギーターはコースの各ホールをバガヴァッド・ギーターの章に結びつけます。比喩ではなく実践の手引きです。'],
  'Available on': ['கிடைக்கும் தளங்கள்', 'यहाँ उपलब्ध', 'Erhältlich bei', 'Disponible sur', '이용 가능', '取扱先'],
  'Golf gives you 18 holes and four hours to confront yourself. The Bhagavad Gita gives you 18 chapters and a battlefield. The problems are identical. So are the solutions.': ['கோல்ஃப் உங்களை எதிர்கொள்ள 18 குழிகளையும் நான்கு மணி நேரத்தையும் தருகிறது. பகவத் கீதை 18 அத்தியாயங்களையும் ஒரு போர்க்களத்தையும் தருகிறது. சிக்கல்களும் தீர்வுகளும் ஒன்றே.', 'गोल्फ़ स्वयं का सामना करने के लिए 18 होल और चार घंटे देता है। भगवद्गीता 18 अध्याय और एक रणभूमि देती है। समस्याएँ और समाधान एक जैसे हैं।', 'Golf gibt Ihnen 18 Löcher und vier Stunden, um sich selbst zu begegnen. Die Bhagavad Gita gibt Ihnen 18 Kapitel und ein Schlachtfeld. Probleme und Lösungen sind dieselben.', 'Le golf vous offre 18 trous et quatre heures pour vous confronter à vous-même. La Bhagavad-Gita vous offre 18 chapitres et un champ de bataille. Les problèmes et les solutions sont identiques.', '골프는 자신과 마주할 18홀과 네 시간을 줍니다. 바가바드 기타는 18장과 전장을 줍니다. 문제와 해결책은 같습니다.', 'ゴルフは自分自身と向き合う18ホールと4時間を与えます。バガヴァッド・ギーターは18章と戦場を与えます。課題も解決策も同じです。'],
  'This book does not argue the coincidence. It works through it, hole by hole. Each chapter opens with the teaching most needed at that point in a round, then shows where the Gita said the same thing, two thousand years earlier.': ['இந்த ஒற்றுமையை இந்தப் புத்தகம் வாதிடுவதில்லை. ஒவ்வொரு குழியாக அதை ஆராய்கிறது. ஒவ்வொரு அத்தியாயமும் அந்தச் சுற்றில் தேவையான போதனையுடன் தொடங்கி, அதையே கீதை இரண்டாயிரம் ஆண்டுகளுக்கு முன் எங்கு கூறியது என்பதைக் காட்டுகிறது.', 'यह पुस्तक इस संयोग पर बहस नहीं करती। यह हर होल के साथ इसकी पड़ताल करती है। हर अध्याय उस समय की ज़रूरी सीख से शुरू होता है और दिखाता है कि गीता ने वही बात दो हज़ार साल पहले कहाँ कही थी।', 'Dieses Buch diskutiert den Zufall nicht. Es geht ihm Loch für Loch nach. Jedes Kapitel beginnt mit der an diesem Punkt der Runde wichtigsten Lehre und zeigt, wo die Gita dasselbe bereits vor zweitausend Jahren sagte.', 'Ce livre ne cherche pas à démontrer cette coïncidence. Il l’explore, trou après trou. Chaque chapitre commence par l’enseignement le plus utile à ce moment du parcours et montre où la Gita disait déjà la même chose, deux mille ans plus tôt.', '이 책은 그 우연을 논쟁하지 않습니다. 홀마다 그 의미를 따라갑니다. 각 장은 라운드의 그 시점에 가장 필요한 가르침으로 시작해, 기타가 2천 년 전에 같은 말을 어디서 했는지 보여줍니다.', 'この本はその符合を論じるのではなく、ホールごとに読み解きます。各章はその時点で必要な教えから始まり、ギーターが二千年前に同じことを説いた箇所を示します。'],
  'Golfers who feel there is something more to the game': ['இந்த விளையாட்டில் இன்னும் ஏதோ ஒன்று உள்ளது என்று உணரும் கோல்ஃப் வீரர்கள்', 'वे गोल्फ़ खिलाड़ी जिन्हें लगता है कि इस खेल में कुछ और भी है', 'Golfer, die spüren, dass mehr in diesem Spiel steckt', 'Les golfeurs qui sentent que ce jeu cache autre chose', '골프에 더 깊은 의미가 있다고 느끼는 골퍼', 'このゲームにはもっと深い何かがあると感じるゴルファー'],
  'Readers of the Gita looking for a living application': ['கீதையின் போதனைகளை வாழ்வில் பயன்படுத்த விரும்பும் வாசகர்கள்', 'गीता को जीवन में लागू करने का तरीका खोजने वाले पाठक', 'Gita-Leser auf der Suche nach einer praktischen Anwendung', 'Les lecteurs de la Gita en quête d’une application concrète', '기타의 가르침을 삶에 적용하고 싶은 독자', 'ギーターの教えを実生活に活かしたい読者'],
  'Anyone who uses sport as a place to think': ['சிந்திக்கும் இடமாக விளையாட்டைப் பயன்படுத்தும் அனைவரும்', 'वे सभी जो खेल को सोचने की जगह मानते हैं', 'Alle, die Sport als Raum zum Nachdenken nutzen', 'Toute personne qui fait du sport un espace de réflexion', '스포츠를 사유의 공간으로 삼는 사람', 'スポーツを考える場として捉える人'],
  'Coaches and teachers who work with performance and mind': ['செயல்திறன் மற்றும் மனநிலையுடன் பணிபுரியும் பயிற்சியாளர்கள் மற்றும் ஆசிரியர்கள்', 'प्रदर्शन और मन पर काम करने वाले कोच और शिक्षक', 'Trainer und Lehrkräfte, die mit Leistung und Geist arbeiten', 'Les entraîneurs et enseignants qui travaillent sur la performance et le mental', '수행 능력과 마음을 함께 다루는 코치와 교사', 'パフォーマンスと心に向き合うコーチや教育者'],
  'Hardcover': ['கடின அட்டை', 'हार्डकवर', 'Gebundene Ausgabe', 'Relié', '양장본', 'ハードカバー'],
  'Paperback': ['மென் அட்டை', 'पेपरबैक', 'Taschenbuch', 'Broché', '페이퍼백', 'ペーパーバック'],
  'Kindle': ['கிண்டில்', 'किंडल', 'Kindle', 'Kindle', '킨들', 'Kindle'],
  'ePub': ['ePub', 'ePub', 'ePub', 'ePub', 'ePub', 'ePub'],
  'Sample chapters have been sent to your email!': ['மாதிரி அத்தியாயங்கள் உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்டன!', 'नमूना अध्याय आपके ईमेल पर भेज दिए गए हैं!', 'Die Leseproben wurden an Ihre E-Mail-Adresse gesendet!', 'Les chapitres d’extrait ont été envoyés par e-mail !', '샘플 챕터를 이메일로 보냈습니다!', 'サンプル章をメールに送信しました！'],
  'Thank you for reaching out! We will contact you within 24 hours.': ['தொடர்பு கொண்டதற்கு நன்றி! 24 மணி நேரத்திற்குள் உங்களைத் தொடர்புகொள்கிறோம்.', 'संपर्क करने के लिए धन्यवाद! हम 24 घंटे में आपसे संपर्क करेंगे।', 'Vielen Dank für Ihre Nachricht! Wir melden uns innerhalb von 24 Stunden.', 'Merci de nous avoir contactés ! Nous vous répondrons sous 24 heures.', '문의해 주셔서 감사합니다! 24시간 이내에 연락드리겠습니다.', 'お問い合わせありがとうございます。24時間以内にご連絡します！'],
  'Your email address': ['உங்கள் மின்னஞ்சல் முகவரி', 'आपका ईमेल पता', 'Ihre E-Mail-Adresse', 'Votre adresse e-mail', '이메일 주소', 'メールアドレス'],
  'Tell us about your event, location, and preferred dates': ['உங்கள் நிகழ்வு, இடம் மற்றும் விரும்பும் தேதிகளைப் பற்றி கூறுங்கள்', 'अपने कार्यक्रम, स्थान और पसंदीदा तारीखों के बारे में बताएँ', 'Erzählen Sie uns von Ihrer Veranstaltung, dem Ort und Ihren Wunschterminen', 'Parlez-nous de votre événement, du lieu et des dates souhaitées', '행사, 장소 및 희망 날짜를 알려주세요', 'イベント、場所、ご希望の日程をお知らせください'],
  'I DID NOT SET OUT TO WRITE A SPIRITUAL BOOK ABOUT GOLF. I SET OUT TO UNDERSTAND WHY GOLF FELT LIKE A SPIRITUAL PRACTICE, AND FOUND THAT SOMEONE HAD ALREADY WRITTEN THE MAP.': ['கோல்ஃப் பற்றி ஆன்மீகப் புத்தகம் எழுத நான் தொடங்கவில்லை. கோல்ஃப் ஏன் ஆன்மீகப் பயிற்சிபோல் உணரப்படுகிறது என்பதைப் புரிந்துகொள்ளத் தொடங்கினேன்; அந்த வழிகாட்டியை ஏற்கெனவே ஒருவர் எழுதியிருப்பதைக் கண்டேன்.', 'मैंने गोल्फ़ पर आध्यात्मिक पुस्तक लिखने का लक्ष्य नहीं रखा था। मैं यह समझना चाहता था कि गोल्फ़ आध्यात्मिक अभ्यास जैसा क्यों लगता है-और पाया कि उसका मार्ग किसी ने पहले ही लिख दिया था।', 'Ich wollte kein spirituelles Buch über Golf schreiben. Ich wollte verstehen, warum sich Golf wie eine spirituelle Praxis anfühlt - und fand heraus, dass jemand den Weg bereits beschrieben hatte.', 'Je ne voulais pas écrire un livre spirituel sur le golf. Je voulais comprendre pourquoi le golf ressemble à une pratique spirituelle et j’ai découvert que quelqu’un en avait déjà tracé la voie.', '골프에 관한 영적인 책을 쓰려던 것이 아닙니다. 골프가 왜 영적 수행처럼 느껴지는지 이해하려 했고, 누군가 이미 그 길을 기록해 두었다는 것을 발견했습니다.', 'ゴルフについてのスピリチュアルな本を書くつもりはありませんでした。ゴルフがなぜ精神的な実践のように感じられるのかを理解しようとし、その道筋がすでに書かれていたことに気づいたのです。'],
  'Tell us about the event, your audience, and what you’re hoping for.': ['நிகழ்வு, பார்வையாளர்கள் மற்றும் உங்கள் எதிர்பார்ப்புகளைப் பற்றி கூறுங்கள்.', 'कार्यक्रम, दर्शकों और अपनी अपेक्षाओं के बारे में बताएँ।', 'Erzählen Sie uns von der Veranstaltung, Ihrem Publikum und Ihren Erwartungen.', 'Parlez-nous de l’événement, de votre public et de vos attentes.', '행사, 청중 및 기대하시는 점을 알려주세요.', 'イベント、参加者、ご希望についてお聞かせください。'],
  'DESPAIR': ['விரக்தி', 'निराशा', 'VERZWEIFLUNG', 'DÉSESPOIR', '절망', '絶望'],
  'KNOWLEDGE': ['அறிவு', 'ज्ञान', 'WISSEN', 'CONNAISSANCE', '지식', '知識'],
  'ACTION': ['செயல்', 'कर्म', 'HANDLUNG', 'ACTION', '행동', '行為'],
  'RENUNCIATION': ['துறவு', 'संन्यास', 'ENTSAGUNG', 'RENONCEMENT', '포기', '放棄'],
  'RESTRAINT': ['கட்டுப்பாடு', 'संयम', 'BEHERRSCHUNG', 'MAÎTRISE', '절제', '自制'],
  'MEDITATION': ['தியானம்', 'ध्यान', 'MEDITATION', 'MÉDITATION', '명상', '瞑想'],
  'WISDOM': ['ஞானம்', 'प्रज्ञा', 'WEISHEIT', 'SAGESSE', '지혜', '智慧'],
  'THE ETERNAL': ['நித்தியம்', 'शाश्वत', 'DAS EWIGE', 'L’ÉTERNEL', '영원', '永遠'],
  'SOVEREIGNTY': ['ஆட்சி அறிவு', 'राज विद्या', 'HOHEIT', 'SOUVERAINETÉ', '주권', '主権'],
  'MANIFESTATION': ['வெளிப்பாடு', 'विभूति', 'OFFENBARUNG DER FÜLLE', 'MANIFESTATION', '현현', '顕現'],
  'REVELATION': ['திருவுருவம்', 'विश्वरूप', 'OFFENBARUNG', 'RÉVÉLATION', '계시', '啓示'],
  'DEVOTION': ['பக்தி', 'भक्ति', 'HINGABE', 'DÉVOTION', '헌신', '帰依'],
  'DISCERNMENT': ['பாகுபாடு', 'विवेक', 'UNTERSCHEIDUNG', 'DISCERNEMENT', '분별', '識別'],
  'TRANSCENDENCE': ['கடத்தல்', 'अतिक्रमण', 'TRANSZENDENZ', 'TRANSCENDANCE', '초월', '超越'],
  'THE WHOLE': ['முழுமை', 'पूर्ण', 'DAS GANZE', 'LE TOUT', '전체', '全体'],
  'INTEGRITY': ['நேர்மை', 'सत्यनिष्ठा', 'INTEGRITÄT', 'INTÉGRITÉ', '정직', '誠実'],
  'CONVICTION': ['நம்பிக்கை', 'श्रद्धा', 'ÜBERZEUGUNG', 'CONVICTION', '신념', '信念'],
  'LIBERATION': ['விடுதலை', 'मोक्ष', 'BEFREIUNG', 'LIBÉRATION', '해방', '解脱'],
  'Eternal Self': ['நித்திய ஆன்மா', 'शाश्वत आत्मा', 'Das ewige Selbst', 'Le soi éternel', '영원한 자아', '永遠の自己'],
  'Selfless Work': ['சுயநலமற்ற செயல்', 'निष्काम कर्म', 'Selbstlose Arbeit', 'Le travail désintéressé', '이타적 행위', '無私の行為'],
  'Path of Wisdom': ['ஞானப் பாதை', 'ज्ञान का मार्ग', 'Pfad der Weisheit', 'Voie de la sagesse', '지혜의 길', '智慧の道'],
  'Karma-Sannyas': ['கர்ம-சந்நியாசம்', 'कर्म-संन्यास', 'Karma-Sannyasa', 'Karma-sannyasa', '카르마-산냐사', 'カルマ・サンニャーサ'],
  'Self-Mastery': ['தன்வசப்படுத்துதல்', 'आत्म-निपुणता', 'Selbstbeherrschung', 'Maîtrise de soi', '자기 수련', '自己修練'],
  'Knowledge Realized': ['உணரப்பட்ட அறிவு', 'अनुभूत ज्ञान', 'Erkanntes Wissen', 'Savoir réalisé', '체득된 지식', '体得された知'],
  'Imperishable Brahman': ['அழிவற்ற பிரம்மம்', 'अविनाशी ब्रह्म', 'Das unvergängliche Brahman', 'Le Brahman impérissable', '불멸의 브라흐만', '不滅のブラフマン'],
  'Royal Knowledge': ['அரச அறிவு', 'राज विद्या', 'Königliches Wissen', 'Savoir royal', '왕의 지식', '王の知識'],
  'Divine Glories': ['தெய்வீகச் சிறப்புகள்', 'दिव्य विभूतियाँ', 'Göttliche Herrlichkeiten', 'Gloires divines', '신성한 영광', '神聖な栄光'],
  'Cosmic Form': ['பிரபஞ்ச உருவம்', 'विश्वरूप', 'Kosmische Gestalt', 'Forme cosmique', '우주적 형상', '宇宙の姿'],
  'Path of Love': ['அன்புப் பாதை', 'प्रेम का मार्ग', 'Pfad der Liebe', 'Voie de l’amour', '사랑의 길', '愛の道'],
  'Field of Action': ['செயல் களம்', 'कर्म क्षेत्र', 'Feld des Handelns', 'Champ d’action', '행위의 장', '行為の場'],
  'The Three Qualities': ['மூன்று குணங்கள்', 'तीन गुण', 'Die drei Eigenschaften', 'Les trois qualités', '세 가지 성질', '三つの性質'],
  'Supreme Self': ['உயர்ந்த ஆன்மா', 'परम आत्मा', 'Das höchste Selbst', 'Le soi suprême', '지고의 자아', '至高の自己'],
  'Divine Qualities': ['தெய்வீகக் குணங்கள்', 'दैवी गुण', 'Göttliche Qualitäten', 'Qualités divines', '신성한 성품', '神聖な性質'],
  'Threefold Faith': ['மூவகை நம்பிக்கை', 'त्रिविध श्रद्धा', 'Dreifacher Glaube', 'Foi triple', '세 가지 믿음', '三つの信仰'],
  'Freedom': ['விடுதலை', 'मुक्ति', 'Freiheit', 'Liberté', '자유', '自由'],
  'Every round begins at the edge of self-doubt.': ['ஒவ்வொரு சுற்றும் தன்னம்பிக்கை இல்லாத விளிம்பிலேயே தொடங்குகிறது.', 'हर राउंड आत्म-संदेह के किनारे से शुरू होता है।', 'Jede Runde beginnt am Rand des Selbstzweifels.', 'Chaque partie commence au bord du doute de soi.', '모든 라운드는 자기 의심의 가장자리에서 시작됩니다.', 'どのラウンドも自己不信の縁から始まります。'],
  'What falls is never what swings the club.': ['விழுவது ஒருபோதும் குச்சியை அசைப்பது அல்ல.', 'गिरता वही नहीं जो क्लब घुमाता है।', 'Was fällt, ist nie das, was den Schläger schwingt.', 'Ce qui tombe n’est jamais ce qui balance le club.', '쓰러지는 것은 클럽을 휘두르는 것이 아닙니다.', '倒れるものは、クラブを振るものではありません。'],
  'Strike. Do not negotiate with the outcome.': ['அடியுங்கள். முடிவுடன் பேரம் பேசாதீர்கள்.', 'मारो। परिणाम से सौदा मत करो।', 'Schlagen Sie. Verhandeln Sie nicht mit dem Ergebnis.', 'Frappez. Ne négociez pas avec le résultat.', '치십시오. 결과와 흥정하지 마십시오.', '打て。結果と交渉するな。'],
  'Release the last shot before you take the next.': ['அடுத்த அடிக்கு முன் கடைசி அடியை விடுங்கள்.', 'अगला शॉट लेने से पहले पिछला छोड़ दें।', 'Lassen Sie den letzten Schlag los, bevor Sie den nächsten spielen.', 'Lâchez le dernier coup avant de jouer le suivant.', '다음 샷 전에 마지막 샷을 놓으십시오.', '次のショットの前に、今の一打を手放せ。'],
  'The quiet swing holds more power than the forced one.': ['அமைதியான சுவிங், வலிந்து செய்யும் சுவிங்கைவிட அதிக சக்தி கொண்டது.', 'शांत स्विंग मजबूर स्विंग से अधिक शक्ति रखता है।', 'Der ruhige Schwung hat mehr Kraft als der erzwungene.', 'Le swing calme a plus de puissance que le swing forcé.', '고요한 스윙이 억지 스윙보다 더 큰 힘을 가집니다.', '静かなスイングは、無理なスイングより力を持つ。'],
  'Stillness before the backswing. Stillness after.': ['பேக்ஸ்விங்கிற்கு முன் அமைதி. பின்னும் அமைதி.', 'बैकस्विंग से पहले शांति। बाद में भी शांति।', 'Stille vor dem Rückschwung. Stille danach.', 'Le calme avant le backswing. Le calme après.', '백스윙 전의 고요. 그 후의 고요.', 'バックスイングの前の静けさ。その後の静けさ。'],
  'Understanding the course is not the same as knowing it.': ['மைதானத்தைப் புரிந்துகொள்வது, அதை அறிந்திருப்பதற்குச் சமமல்ல.', 'कोर्स को समझना उसे जानने के बराबर नहीं है।', 'Den Platz zu verstehen ist nicht dasselbe, wie ihn zu kennen.', 'Comprendre le parcours n’est pas le connaître.', '코스를 이해하는 것과 아는 것은 다릅니다.', 'コースを理解することと、それを知ることは同じではない。'],
  'You are playing a game older than your name for it.': ['நீங்கள் இதற்கு வைத்த பெயரைவிடப் பழமையான விளையாட்டை விளையாடுகிறீர்கள்.', 'आप उस खेल को खेल रहे हैं जो आपके दिए नाम से भी पुराना है।', 'Sie spielen ein Spiel, das älter ist als Ihr Name dafür.', 'Vous jouez un jeu plus ancien que le nom que vous lui donnez.', '당신이 붙인 이름보다 오래된 경기를 하고 있습니다.', 'あなたが付けた名前より古いゲームをプレーしている。'],
  'Mastery is hidden in plain sight.': ['தேர்ச்சி வெளிப்படையாகவே மறைந்துள்ளது.', 'निपुणता साफ दिखते हुए भी छिपी है।', 'Meisterschaft ist offen sichtbar verborgen.', 'La maîtrise est cachée à la vue de tous.', '숙련은 눈에 보이는 곳에 숨겨져 있습니다.', '熟達は、目の前に隠されている。'],
  'Every hole is an expression of something vaster.': ['ஒவ்வொரு குழியும் இன்னும் பெரிய ஒன்றின் வெளிப்பாடு.', 'हर होल किसी और विशाल चीज़ की अभिव्यक्ति है।', 'Jedes Loch ist Ausdruck von etwas Größerem.', 'Chaque trou exprime quelque chose de plus vaste.', '모든 홀은 더 큰 무언가의 표현입니다.', 'すべてのホールは、より大きなものの現れである。'],
  'At some point the game becomes the teacher.': ['ஒரு கட்டத்தில் விளையாட்டே ஆசிரியராகிறது.', 'किसी बिंदु पर खेल स्वयं शिक्षक बन जाता है।', 'Irgendwann wird das Spiel zum Lehrer.', 'À un moment, le jeu devient le maître.', '어느 순간 경기가 스승이 됩니다.', 'やがてゲームそのものが師になる。'],
  'Play for the love of the game, not its verdict.': ['விளையாட்டின் தீர்ப்பிற்காக அல்ல, அன்பிற்காக விளையாடுங்கள்.', 'फैसले के लिए नहीं, खेल के प्रेम के लिए खेलें।', 'Spielen Sie aus Liebe zum Spiel, nicht wegen seines Urteils.', 'Jouez par amour du jeu, non pour son verdict.', '판정이 아니라 경기에 대한 사랑으로 치십시오.', '判定のためではなく、ゲームへの愛でプレーせよ。'],
  'Know the course. Know the one who walks it.': ['மைதானத்தை அறியுங்கள். அதில் நடப்பவரை அறியுங்கள்.', 'कोर्स को जानो। उस पर चलने वाले को जानो।', 'Kennen Sie den Platz. Kennen Sie den, der ihn geht.', 'Connaissez le parcours. Connaissez celui qui le marche.', '코스를 알십시오. 그 위를 걷는 이를 알십시오.', 'コースを知れ。それを歩く者を知れ。'],
  'Dullness, restlessness, clarity: you cycle through all three.': ['மந்தம், அமைதியின்மை, தெளிவு: மூன்றிலும் சுழல்கிறீர்கள்.', 'जड़ता, चंचलता, स्पष्टता: आप तीनों से गुजरते हैं।', 'Trägheit, Unruhe, Klarheit: Sie durchlaufen alle drei.', 'Lenteur, agitation, clarté : vous traversez les trois.', '둔함, 안절부절, 명료함: 세 가지를 모두 순환합니다.', '惰性、落ち着きのなさ、明澄。あなたはその三つを巡る。'],
  'The best hole you ever played dissolves into the round.': ['நீங்கள் விளையாடிய சிறந்த குழி, சுற்றில் கரைந்துவிடுகிறது.', 'आपका सबसे अच्छा होल पूरे राउंड में घुल जाता है।', 'Ihr bestes Loch löst sich in der Runde auf.', 'Votre meilleur trou se fond dans la partie.', '당신이 친 최고의 홀은 라운드 속으로 녹아듭니다.', '最高のホールはラウンドの中に溶けていく。'],
  'The card you sign at the end is the player you are.': ['இறுதியில் நீங்கள் கையொப்பமிடும் அட்டை, நீங்கள் யார் என்பதைக் காட்டுகிறது.', 'अंत में जिस कार्ड पर आप हस्ताक्षर करते हैं, वही आपका खिलाड़ी है।', 'Die Karte, die Sie am Ende unterschreiben, ist der Spieler, der Sie sind.', 'La carte que vous signez à la fin est le joueur que vous êtes.', '마지막에 서명하는 카드가 바로 당신이라는 선수입니다.', '最後にサインするカードが、あなたという選手である。'],
  'Doubt in the downswing loses the hole before it is played.': ['டவுன்ஸ்விங்கில் எழும் சந்தேகம், விளையாடுவதற்கு முன்பே குழியை இழக்கிறது.', 'डाउनस्विंग में संदेह होल को खेलने से पहले ही हरा देता है।', 'Zweifel im Abschwung verlieren das Loch, bevor es gespielt ist.', 'Le doute dans le downswing perd le trou avant qu’il soit joué.', '다운스윙의 의심은 치기도 전에 홀을 잃게 합니다.', 'ダウンスイングの疑いは、打つ前にホールを失わせる。'],
  'The final hole is where you put down everything you carried.': ['கடைசிக் குழியில் நீங்கள் சுமந்த அனைத்தையும் இறக்கி வைக்கிறீர்கள்.', 'आखिरी होल वह जगह है जहाँ आप जो कुछ ढो रहे थे उसे उतार देते हैं।', 'Am letzten Loch legen Sie alles ab, was Sie getragen haben.', 'Le dernier trou est l’endroit où vous déposez tout ce que vous portiez.', '마지막 홀은 당신이 짊어진 모든 것을 내려놓는 곳입니다.', '最後のホールは、背負ってきたすべてを置く場所である。'],
  'The course': ['மைதானம்', 'कोर्स', 'Der Platz', 'Le parcours', '코스', 'コース'],
  'Read the book →': ['புத்தகத்தைப் படியுங்கள் →', 'पुस्तक पढ़ें →', 'Buch lesen →', 'Lire le livre →', '책 읽기 →', '本を読む →'],
  'Front Nine': ['முதல் ஒன்பது', 'फ्रंट नाइन', 'Vordere Neun', 'Premier neuf', '전반 9홀', 'フロントナイン'],
  'The front nine': ['முதல் ஒன்பது', 'फ्रंट नाइन', 'Die vordere Neun', 'Le premier neuf', '전반 9홀', 'フロントナイン'],
  'The Back Nine': ['பின்புற ஒன்பது', 'बैक नाइन', 'Die hintere Neun', 'Le dernier neuf', '후반 9홀', 'バックナイン'],
  'Back nine 10–18': ['பின்புற ஒன்பது 10–18', 'बैक नाइन 10–18', 'Hintere Neun 10–18', 'Retour 10–18', '후반 9홀 10–18', 'バックナイン 10–18'],
  'Halfway House': ['ஹாஃப்வே ஹவுஸ்', 'हाफवे हाउस', 'Halfway House', 'Halfway House', '하프웨이 하우스', 'ハーフウェイハウス'],
  'The Halfway House': ['ஹாஃப்வே ஹவுஸ்', 'हाफवे हाउस', 'Das Halfway House', 'The Halfway House', '하프웨이 하우스', 'ハーフウェイハウス'],
  'After nine days of battle, the Pandavas gather with Krishna to reassess their strategy and prepare for the nine days ahead - The Bhagavad Gita': ['ஒன்பது நாள் போருக்குப் பிறகு, பாண்டவர்கள் கிருஷ்ணருடன் கூடி முன்வரும் ஒன்பது நாட்களுக்கான வழியை மீண்டும் ஆயத்தமாக்குகிறார்கள் - பகவத் கீதை', 'नौ दिनों के युद्ध के बाद पांडव कृष्ण के साथ बैठकर आगे के नौ दिनों की रणनीति तय करते हैं - भगवद्गीता', 'Nach neun Kampftagen versammeln sich die Pandavas mit Krishna, um die nächsten neun Tage vorzubereiten – Die Bhagavad Gita', 'Après neuf jours de bataille, les Pandavas se réunissent avec Krishna pour préparer les neuf jours à venir – La Bhagavad-Gita', '아홉 날의 전투 후, 판다바들은 크리슈나와 함께 앞으로의 아홉 날을 준비합니다 - 바가바드 기타', '九日の戦いの後、パーンダヴァはクリシュナとともに残る九日の備えを整える — バガヴァッド・ギーター'],
  'The Eternal Game of Celestial Wisdom.': ['விண்ணுலக ஞானத்தின் நித்திய விளையாட்டு.', 'दिव्य ज्ञान का शाश्वत खेल।', 'Das ewige Spiel himmlischer Weisheit.', 'Le jeu éternel de la sagesse céleste.', '천상의 지혜가 깃든 영원한 경기.', '天上の智慧の永遠のゲーム。'],
  'Golf Gita blends the art of golf with the wisdom of the Bhagavad Gita, guiding readers through ego, duality and balance towards inner clarity, purposeful action and freedom beyond the scorecard.': ['கோல்ஃப் கீதா கோல்ஃப் கலையையும் பகவத் கீதை ஞானத்தையும் இணைத்து, அகந்தை, இருமை, சமநிலை வழியாக உள் தெளிவு, நோக்கமுள்ள செயல் மற்றும் ஸ்கோர்கார்ட்டுக்கு அப்பாற்பட்ட விடுதலைக்கு வாசகரை அழைத்துச் செல்கிறது.', 'गोल्फ़ गीता गोल्फ़ की कला को भगवद्गीता के ज्ञान से जोड़ती है और अहंकार, द्वैत और संतुलन के मार्ग से पाठक को आंतरिक स्पष्टता, सार्थक कर्म और स्कोरकार्ड से परे स्वतंत्रता तक ले जाती है।', 'Golf Gita verbindet die Kunst des Golfs mit der Weisheit der Bhagavad Gita und führt Leser durch Ego, Dualität und Balance zu innerer Klarheit, bewusstem Handeln und Freiheit jenseits der Scorekarte.', 'Golf Gita unit l’art du golf à la sagesse de la Bhagavad-Gita et guide le lecteur, à travers l’ego, la dualité et l’équilibre, vers la clarté intérieure, l’action juste et une liberté au-delà de la carte de score.', '골프 기타는 골프의 예술과 바가바드 기타의 지혜를 잇고, 자아·이원성·균형을 지나 내면의 명료함, 뜻 있는 행위, 스코어카드 너머의 자유로 이끕니다.', 'ゴルフ・ギーターはゴルフの技とバガヴァッド・ギーターの智慧を結び、自我・二元・均衡を通して内なる明澄、意図ある行為、スコアカードを超えた自由へと導きます。'],
  'Golf Gita is a personal journal and guided exploration of golf’s inner game through the wisdom of the Bhagavad Gita. It is neither a technical golf manual nor a final authority on the Gita. Its 18 holes offer mirrors for ego, fear, desire, balance and awareness, not a fixed sequence of lessons. Read in order or turn to what speaks to you today. The course has numbers. The mind does not.': ['கோல்ஃப் கீதா, பகவத் கீதை ஞானம் வழியாக கோல்ஃபின் உள் ஆட்டத்தை ஆராயும் தனிப்பட்ட பயணம். இது தொழில்நுட்ப கையேடும் அல்ல; கீதையின் இறுதி அதிகாரமும் அல்ல. 18 குழிகள் அகந்தை, பயம், ஆசை, சமநிலை, விழிப்புணர்வுக்கான கண்ணாடிகள். வரிசையில் படியுங்கள் அல்லது இன்று உங்களைத் தொடுவதைத் தேர்ந்தெடுங்கள். மைதானத்திற்கு எண்கள் உண்டு. மனத்திற்கு இல்லை.', 'गोल्फ़ गीता भगवद्गीता के ज्ञान से गोल्फ़ के भीतरी खेल की व्यक्तिगत यात्रा है। यह तकनीकी मैनुअल नहीं, गीता का अंतिम प्रमाण भी नहीं। 18 होल अहंकार, भय, इच्छा, संतुलन और जागरूकता के दर्पण हैं। क्रम से पढ़ें या जो आज पुकारे उसे खोलें। कोर्स की संख्याएँ हैं। मन की नहीं।', 'Golf Gita ist eine persönliche Erkundung des inneren Spiels durch die Weisheit der Bhagavad Gita. Weder technisches Handbuch noch letzte Autorität zur Gita. Die 18 Löcher sind Spiegel für Ego, Angst, Verlangen, Balance und Achtsamkeit. Lesen Sie der Reihe nach oder öffnen Sie, was Sie heute anspricht. Der Platz hat Zahlen. Der Geist nicht.', 'Golf Gita est une exploration personnelle du jeu intérieur à travers la sagesse de la Bhagavad-Gita. Ni manuel technique ni autorité finale. Ses 18 trous sont des miroirs pour l’ego, la peur, le désir, l’équilibre et la présence. Lisez dans l’ordre, ou ouvrez ce qui vous parle aujourd’hui. Le parcours a des numéros. L’esprit n’en a pas.', '골프 기타는 바가바드 기타의 지혜로 골프의 내면 경기를 탐구하는 개인 여정입니다. 기술 교본도, 기타의 최종 권위도 아닙니다. 18홀은 자아, 두려움, 욕망, 균형, 알아차림의 거울입니다. 순서대로 읽거나 오늘 마음에 닿는 장을 여십시오. 코스에는 번호가 있습니다. 마음에는 없습니다.', 'ゴルフ・ギーターは、バガヴァッド・ギーターの智慧を通してゴルフの内なるゲームを探る個人の旅です。技術書でもギーターの最終権威でもありません。18ホールは自我・恐れ・欲望・均衡・気づきの鏡です。順に読むもよし、今日心に響く章を開くもよし。コースには番号がある。心にはない。'],
  'Who is this for?': ['யாருக்கு?', 'यह किसके लिए है?', 'Für wen ist das?', 'Pour qui ?', '누구를 위한 책인가요?', '誰のための本？'],
  'Ask the Caddie': ['கேடியிடம் கேளுங்கள்', 'कैडी से पूछें', 'Den Caddie fragen', 'Demandez au caddie', '캐디에게 묻기', 'キャディに聞く'],
  'Read the preface free': ['முன்னுரையை இலவசமாகப் படியுங்கள்', 'प्रस्तावना निःशुल्क पढ़ें', 'Vorwort kostenlos lesen', 'Lire la préface gratuitement', '서문을 무료로 읽기', '序文を無料で読む'],
  'Experienced Golfers seeking wisdom beyond the scorecard': ['ஸ்கோர்கார்ட்டுக்கு அப்பாற்பட்ட ஞானத்தைத் தேடும் அனுபவமிக்க கோல்ஃப் வீரர்கள்', 'स्कोरकार्ड से परे ज्ञान चाहने वाले अनुभवी गोल्फ़र', 'Erfahrene Golfer, die Weisheit jenseits der Scorekarte suchen', 'Golfeurs expérimentés en quête d’une sagesse au-delà de la carte', '스코어카드 너머의 지혜를 찾는 경험 많은 골퍼', 'スコアカードを超えた智慧を求める経験豊富なゴルファー'],
  'Golf Coaches guiding both the swing and the mind': ['சுவிங்கையும் மனதையும் வழிநடத்தும் கோல்ஃப் பயிற்சியாளர்கள்', 'स्विंग और मन दोनों को मार्ग दिखाने वाले गोल्फ़ कोच', 'Golftrainer, die Schwung und Geist führen', 'Entraîneurs qui guident le swing et l’esprit', '스윙과 마음을 함께 이끄는 골프 코치', 'スイングと心の両方を導くコーチ'],
  'Those new to golf discovering the game and themselves': ['விளையாட்டையும் தங்களையும் கண்டறியும் புதிய வீரர்கள்', 'गोल्फ़ में नए लोग जो खेल और स्वयं को खोज रहे हैं', 'Einsteiger, die Spiel und Selbst entdecken', 'Les débutants qui découvrent le jeu et eux-mêmes', '경기와 자신을 발견하는 골프 입문자', 'ゲームと自分自身を発見する初心者'],
  'Leaders exploring balance, awareness and purposeful action': ['சமநிலை, விழிப்புணர்வு, நோக்கமுள்ள செயலை ஆராயும் தலைவர்கள்', 'संतुलन, जागरूकता और सार्थक कर्म खोजने वाले नेता', 'Führungskräfte, die Balance, Achtsamkeit und sinnvolles Handeln suchen', 'Dirigeants en quête d’équilibre, de présence et d’action juste', '균형, 알아차림, 뜻 있는 행위를 탐구하는 리더', '均衡・気づき・意図ある行為を探るリーダー'],
  'Nazeer Tajudeen discovered golf in 2000 and left corporate life in 2005 to coach full-time. His journey from artist to executive to teacher brings creativity and insight to his work. Raised along the Thailand–Laos border and later in southern India, he grew up among diverse faiths and cultures that quietly shaped his outlook on life.': ['நசீர் தாஜுதீன் 2000-ல் கோல்ஃப்பைக் கண்டறிந்து, 2005-ல் நிறுவன வாழ்க்கையை விட்டு முழுநேரப் பயிற்சியாளரானார். கலைஞரிலிருந்து நிர்வாகி, ஆசிரியர் வரையிலான பயணம் அவரது பணிக்குப் படைப்பாற்றலையும் நுண்ணறிவையும் தருகிறது. தாய்லாந்து–லாவோஸ் எல்லையிலும் பின்னர் தென்னிந்தியாவிலும் வளர்ந்த அவர், பல நம்பிக்கைகளுக்கும் பண்பாடுகளுக்கும் இடையே வாழ்ந்தார்.', 'नज़ीर ताजुद्दीन ने 2000 में गोल्फ़ जाना और 2005 में कॉर्पोरेट जीवन छोड़कर पूर्णकालिक कोच बने। कलाकार से कार्यकारी और शिक्षक तक की यात्रा उनके काम में रचनात्मकता लाती है। थाईलैंड–लाओस सीमा और बाद में दक्षिण भारत में पले-बढ़े, विविध आस्थाओं ने उनके दृष्टिकोण को आकार दिया।', 'Nazeer Tajudeen entdeckte Golf 2000 und verließ 2005 das Unternehmensleben, um Vollzeit zu coachen. Der Weg vom Künstler über die Führungskraft zum Lehrer prägt seine Arbeit. Aufgewachsen an der Grenze Thailand–Laos und später in Südindien, formten vielfältige Kulturen seinen Blick aufs Leben.', 'Nazeer Tajudeen a découvert le golf en 2000 et quitté le monde de l’entreprise en 2005 pour enseigner à plein temps. Son parcours d’artiste à dirigeant puis enseignant nourrit son travail. Élevé à la frontière Thaïlande–Laos puis en Inde du Sud, il a grandi parmi des foi et cultures diverses.', '나지르 타주딘은 2000년 골프를 만났고 2005년 회사를 떠나 전업 코치가 되었습니다. 예술가에서 임원, 교사로 이어진 여정이 그의 작업에 창의와 통찰을 줍니다. 태국–라오스 국경과 남인도에서 자라며 여러 신앙과 문화 속에서 세계관을 키웠습니다.', 'ナジー�・タジュディーンは2000年にゴルフと出会い、2005年に会社を辞めて専任コーチになりました。芸術家から経営者、教師へという歩みが仕事に創造と洞察をもたらします。タイ・ラオス国境、のち南インドで育ち、多様な信仰と文化が人生観を静かに形づくりました。'],
  'Golf Gita grew from two decades of coaching and his own struggles with the game. Through public mishits, persistence and reflection, he explored how ego, fear, expectations and awareness shape both performance and personal growth.': ['இருபதாண்டுப் பயிற்சியும் விளையாட்டில் அவரது போராட்டங்களுமே கோல்ஃப் கீதாவை வளர்த்தன. பகிரங்கத் தவறுகள், விடாமுயற்சி, சிந்தனை வழியாக அகந்தை, பயம், எதிர்பார்ப்பு, விழிப்புணர்வு ஆகியவை செயல்திறனையும் வளர்ச்சியையும் எப்படி வடிவமைக்கின்றன என்பதை அவர் ஆராய்ந்தார்.', 'दो दशकों की कोचिंग और खेल के साथ उनके संघर्ष से गोल्फ़ गीता का जन्म हुआ। सार्वजनिक गलतियों, दृढ़ता और चिंतन से उन्होंने देखा कि अहंकार, भय, अपेक्षाएँ और जागरूकता प्रदर्शन और विकास को कैसे गढ़ते हैं।', 'Golf Gita wuchs aus zwei Jahrzehnten Coaching und seinem eigenen Ringen mit dem Spiel. Über Fehlschläge, Ausdauer und Reflexion erforschte er, wie Ego, Angst, Erwartungen und Achtsamkeit Leistung und Wachstum formen.', 'Golf Gita est née de vingt ans d’enseignement et de ses propres luttes avec le jeu. À travers les erreurs publiques, la persévérance et la réflexion, il a exploré comment l’ego, la peur, les attentes et la présence façonnent la performance et la croissance.', '골프 기타는 20년의 코칭과 그 자신의 경기 고민에서 자랐습니다. 공개된 실수, 끈기, 성찰을 통해 자아, 두려움, 기대, 알아차림이 수행과 성장을 어떻게 만드는지 탐구했습니다.', 'ゴルフ・ギーターは二十年のコーチングと、ゲームとの自身の葛藤から育ちました。公開のミス、粘り、内省を通して、自我・恐れ・期待・気づきが成果と成長をどう形づくるかを探りました。'],
  'Recognized globally as a Top 50 coach by WGTF and U.S. Kids Golf in 2024, Nazeer teaches golfers aged 5 to 85. He welcomes beginners and helps struggling players regain confidence and joy.': ['2024-ல் WGTF மற்றும் U.S. Kids Golf ஆல் உலக அளவில் Top 50 பயிற்சியாளராக அங்கீகரிக்கப்பட்ட நசீர், 5 முதல் 85 வயது வரை கற்பிக்கிறார். புதியவர்களை வரவேற்று, சிரமப்படும் வீரர்களுக்கு நம்பிக்கையையும் மகிழ்ச்சியையும் மீட்டுத் தருகிறார்.', '2024 में WGTF और U.S. Kids Golf द्वारा विश्व स्तर पर टॉप 50 कोच माने गए नज़ीर 5 से 85 वर्ष तक के खिलाड़ियों को पढ़ाते हैं। वे शुरुआती लोगों का स्वागत करते हैं और संघर्षरत खिलाड़ियों का विश्वास लौटाते हैं।', '2024 von WGTF und U.S. Kids Golf als Top-50-Trainer ausgezeichnet, unterrichtet Nazeer Golfer von 5 bis 85. Er begrüßt Anfänger und hilft Spielern, Freude und Vertrauen zurückzugewinnen.', 'Reconnu en 2024 parmi les 50 meilleurs coachs par la WGTF et U.S. Kids Golf, Nazeer enseigne aux golfeurs de 5 à 85 ans. Il accueille les débutants et aide les joueurs en difficulté à retrouver confiance et joie.', '2024년 WGTF와 U.S. Kids Golf가 세계 Top 50 코치로 인정한 나지르는 5세부터 85세까지 가르칩니다. 초보를 환영하고, 힘든 선수들이 자신감과 기쁨을 되찾도록 돕습니다.', '2024年にWGTFとU.S. Kids Golfから世界トップ50コーチに認められたナジー�は、5歳から85歳まで教えます。初心者を迎え、苦しむ選手が自信と喜びを取り戻すのを助けます。'],
  'Golf Gita grew from my own struggles with the game, and the discovery that understanding ourselves matters as much as understanding the swing': ['கோல்ஃப் கீதா என் போராட்டங்களிலிருந்தும், சுவிங்கைப் புரிந்துகொள்வதுபோல நம்மைப் புரிந்துகொள்வதும் முக்கியம் என்ற கண்டுபிடிப்பிலிருந்தும் வளர்ந்தது', 'गोल्फ़ गीता मेरे अपने संघर्षों से जन्मी, और इस खोज से कि स्विंग को समझना जितना ज़रूरी है, खुद को समझना उतना ही ज़रूरी है', 'Golf Gita wuchs aus meinem eigenen Ringen und der Einsicht, dass uns zu verstehen ebenso wichtig ist wie den Schwung zu verstehen', 'Golf Gita est née de mes propres luttes, et de la découverte que se comprendre compte autant que comprendre le swing', '골프 기타는 나 자신의 고민과, 스윙을 아는 만큼 우리 자신을 아는 일도 중요하다는 발견에서 자랐습니다', 'ゴルフ・ギーターは私自身の葛藤と、スイングを知ることと同じく自分を知ることが大切だという発見から育ちました'],
  'Speaking · Retreats': ['உரைகள் · முகாம்கள்', 'व्याख्यान · रिट्रीट', 'Vorträge · Retreats', 'Conférences · Retraites', '강연 · 리트릿', '講演 · リトリート'],
  'A golf retreat for the mind, body and swing': ['மனம், உடல், சுவிங்கிற்கான கோல்ஃப் முகாம்', 'मन, शरीर और स्विंग के लिए गोल्फ़ रिट्रीट', 'Ein Golf-Retreat für Geist, Körper und Schwung', 'Une retraite de golf pour l’esprit, le corps et le swing', '마음, 몸, 스윙을 위한 골프 리트릿', '心・身体・スイングのためのゴルフ・リトリート'],
  'Send enquiry': ['விசாரணையை அனுப்பு', 'पूछताछ भेजें', 'Anfrage senden', 'Envoyer la demande', '문의 보내기', '問い合わせを送る'],
  'Select one': ['ஒன்றைத் தேர்ந்தெடுக்கவும்', 'एक चुनें', 'Bitte wählen', 'Choisir', '하나 선택', '選択してください'],
  'Organisation': ['நிறுவனம்', 'संगठन', 'Organisation', 'Organisation', '단체', '組織'],
  'Golf club or association': ['கோல்ஃப் கிளப் அல்லது சங்கம்', 'गोल्फ़ क्लब या संघ', 'Golfclub oder Verband', 'Club ou association de golf', '골프 클럽 또는 협회', 'ゴルフクラブまたは協会'],
  'Corporate leadership': ['நிறுவனத் தலைமைத்துவம்', 'कॉर्पोरेट नेतृत्व', 'Unternehmensführung', 'Leadership en entreprise', '기업 리더십', '企業リーダーシップ'],
  'Philosophy or wellness': ['தத்துவம் அல்லது நலவாழ்வு', 'दर्शन या वेलनेस', 'Philosophie oder Wellness', 'Philosophie ou bien-être', '철학 또는 웰니스', '哲学またはウェルネス'],
  'School or university': ['பள்ளி அல்லது பல்கலைக்கழகம்', 'स्कूल या विश्वविद्यालय', 'Schule oder Universität', 'École ou université', '학교 또는 대학', '学校または大学'],
  'Retreat': ['முகாம்', 'रिट्रीट', 'Retreat', 'Retraite', '리트릿', 'リトリート'],
  'Other': ['பிற', 'अन्य', 'Sonstiges', 'Autre', '기타', 'その他'],
  'Thank you. We will respond within two working days.': ['நன்றி. இரண்டு வேலை நாட்களுக்குள் பதிலளிப்போம்.', 'धन्यवाद। हम दो कार्यदिवसों में जवाब देंगे।', 'Danke. Wir antworten innerhalb von zwei Werktagen.', 'Merci. Nous répondrons sous deux jours ouvrés.', '감사합니다. 영업일 기준 이틀 내에 답변드립니다.', 'ありがとうございます。2営業日以内にご返信します。'],
  'Where the fairway meets the Inner Battlefield': ['ஃபேர்வேயும் உள் போர்க்களமும் சந்திக்கும் இடம்', 'जहाँ फेयरवे भीतरी रणभूमि से मिलता है', 'Wo Fairway und inneres Schlachtfeld sich treffen', 'Là où le fairway rencontre le champ de bataille intérieur', '페어웨이와 내면의 전장이 만나는 곳', 'フェアウェイと内なる戦場が交わる場所'],
  'Chapters of Bhagavad Gita': ['பகவத் கீதையின் அத்தியாயங்கள்', 'भगवद्गीता के अध्याय', 'Kapitel der Bhagavad Gita', 'Chapitres de la Bhagavad-Gita', '바가바드 기타의 장', 'バガヴァッド・ギーターの章'],
  'From the course notes': ['மைதானக் குறிப்புகளிலிருந்து', 'कोर्स नोट्स से', 'Aus den Platznotizen', 'Notes de parcours', '코스 노트에서', 'コースノートより'],
  'All articles →': ['அனைத்துக் கட்டுரைகளும் →', 'सभी लेख →', 'Alle Artikel →', 'Tous les articles →', '모든 아티클 →', 'すべての記事 →'],
  'Why the 90 seconds before you swing is the most important practice in golf.': ['நீங்கள் அடிப்பதற்கு முந்தைய 90 வினாடிகள் ஏன் கோல்ஃபின் மிக முக்கியமான பயிற்சி.', 'स्विंग से पहले के 90 सेकंड गोल्फ़ का सबसे महत्वपूर्ण अभ्यास क्यों हैं।', 'Warum die 90 Sekunden vor dem Schlag die wichtigste Übung im Golf sind.', 'Pourquoi les 90 secondes avant le swing sont la pratique la plus importante au golf.', '스윙 전 90초가 골프에서 가장 중요한 연습인 이유.', 'スイング前の90秒がゴルフで最も大切な練習である理由。'],
  'Get in touch.': ['தொடர்பு கொள்ளுங்கள்.', 'संपर्क करें।', 'Nehmen Sie Kontakt auf.', 'Contactez-nous.', '문의하세요.', 'ご連絡ください。'],
  'Send message': ['செய்தியை அனுப்பு', 'संदेश भेजें', 'Nachricht senden', 'Envoyer le message', '메시지 보내기', 'メッセージを送る'],
  '18 CHAPTERS': ['18 அத்தியாயங்கள்', '18 अध्याय', '18 KAPITEL', '18 CHAPITRES', '18장', '18章'],
  'No. Each chapter introduces the teaching in plain language before showing how it plays out on the course.': ['இல்லை. ஒவ்வொரு அத்தியாயமும் போதனையை எளிய மொழியில் அறிமுகப்படுத்தி, அது மைதானத்தில் எப்படி விளையாடுகிறது என்பதைக் காட்டுகிறது.', 'नहीं। हर अध्याय सीख को सरल भाषा में समझाता है, फिर दिखाता है कि वह कोर्स पर कैसे चलती है।', 'Nein. Jedes Kapitel stellt die Lehre schlicht vor und zeigt dann, wie sie auf dem Platz wirkt.', 'Non. Chaque chapitre présente l’enseignement simplement, puis montre comment il se joue sur le parcours.', '아닙니다. 각 장은 가르침을 쉬운 말로 소개한 뒤, 코스에서 어떻게 나타나는지 보여줍니다.', 'いいえ。各章は教えを平易に紹介し、それがコースでどう働くかを示します。'],
  'No. The Gita is treated here as a text about the mind, action, and attention. Readers of any belief, or none, will find it useful.': ['இல்லை. இங்கு கீதை மனம், செயல், கவனம் பற்றிய நூலாக அணுகப்படுகிறது. எந்த நம்பிக்கையினரும் பயன்பெறலாம்.', 'नहीं। यहाँ गीता मन, कर्म और ध्यान का ग्रंथ है। किसी भी विश्वास के पाठक इसे उपयोगी पाएँगे।', 'Nein. Die Gita wird hier als Text über Geist, Handeln und Aufmerksamkeit gelesen. Für Leser jeden Glaubens.', 'Non. La Gita est ici un texte sur l’esprit, l’action et l’attention. Utile quel que soit le croyance.', '아닙니다. 여기서 기타는 마음, 행위, 주의에 관한 텍스트입니다. 어떤 믿음의 독자에게도 도움이 됩니다.', 'いいえ。ここではギーターを心・行為・注意についての書として扱います。信条を問わず役立ちます。'],
  "Yes. Golf Gita is available on Kindle and as an ePub. See the 'Where to buy' links for options.": ['ஆம். கோல்ஃப் கீதா Kindle மற்றும் ePub-ல் கிடைக்கிறது. வாங்கும் இணைப்புகளைப் பாருங்கள்.', 'हाँ। गोल्फ़ गीता Kindle और ePub पर उपलब्ध है। खरीद लिंक देखें।', 'Ja. Golf Gita gibt es als Kindle und ePub. Siehe die Kauf-Links.', 'Oui. Golf Gita est disponible en Kindle et ePub. Voir les liens d’achat.', '네. 골프 기타는 Kindle과 ePub으로 구매할 수 있습니다.', 'はい。ゴルフ・ギーターはKindleとePubで入手できます。'],
  'Yes. Please get in touch through the Contact page and we will help with bulk and corporate orders.': ['ஆம். தொடர்புப் பக்கம் வழியாக எழுதுங்கள்; மொத்த மற்றும் நிறுவன ஆர்டர்களுக்கு உதவுவோம்.', 'हाँ। संपर्क पृष्ठ से लिखें; हम थोक और कॉर्पोरेट ऑर्डर में मदद करेंगे।', 'Ja. Schreiben Sie uns über die Kontaktseite; wir helfen bei Sammel- und Firmenbestellungen.', 'Oui. Contactez-nous via la page Contact pour les commandes groupées et d’entreprise.', '네. 문의 페이지로 연락 주시면 대량·기업 주문을 도와드립니다.', 'はい。お問い合わせページからご連絡ください。まとめ買い・法人注文を支援します。'],
};

for (const [source, translations] of Object.entries(additionalMessageRows)) {
  messages[source] = Object.fromEntries(
    ['ta', 'hi', 'de', 'fr', 'ko', 'ja'].map((language, index) => [language, translations[index]])
  );
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = window.localStorage.getItem('golf-gita-language');
    return languages.some(({ code }) => code === savedLanguage) ? savedLanguage : 'en';
  });

  useEffect(() => {
    window.localStorage.setItem('golf-gita-language', language);
    document.documentElement.lang = language;
    document.title = messages['Golf Gita - The Eternal Game of Celestial Wisdom | By Nazeer Tajudeen']?.[language]
      ?? 'Golf Gita - The Eternal Game of Celestial Wisdom | By Nazeer Tajudeen';
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute(
        'content',
        messages['Golf Gita maps each hole on the course to a chapter of the Bhagavad Gita. Where the fairway meets the battlefield.']?.[language]
          ?? 'Golf Gita maps each hole on the course to a chapter of the Bhagavad Gita. Where the fairway meets the battlefield.'
      );
    }
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (source) => messages[source]?.[language] ?? source,
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}

export function LanguageSelector({ light = false, compact = false }) {
  const { language, setLanguage, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);
  const selectedIndex = languages.findIndex(({ code }) => code === language);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!selectorRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    optionRefs.current[selectedIndex]?.focus();
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, selectedIndex]);

  const focusOption = (index) => {
    optionRefs.current[index]?.focus();
  };

  const handleMenuKeyDown = (event) => {
    const focusedIndex = optionRefs.current.findIndex((option) => option === document.activeElement);
    const currentIndex = focusedIndex >= 0 ? focusedIndex : selectedIndex;
    let nextIndex = currentIndex;
    if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % languages.length;
    else if (event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + languages.length) % languages.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = languages.length - 1;
    else return;

    event.preventDefault();
    focusOption(nextIndex);
  };

  return (
    <div
      ref={selectorRef}
      className={`language-selector ${light ? 'language-selector-light' : ''} ${compact ? 'language-selector-compact' : ''} ${isOpen ? 'language-selector-open' : ''}`}
    >
      <span className="visually-hidden">{t('Select language')}</span>
      <button
        ref={triggerRef}
        type="button"
        className="language-select"
        aria-label={t('Select language')}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        {compact ? (
          <>
            <span className="language-label-full">{languages[selectedIndex]?.label}</span>
            <span className="language-label-short">{languages[selectedIndex]?.shortLabel}</span>
          </>
        ) : languages[selectedIndex]?.label}
        <ChevronDown size={compact ? 12 : 14} aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="language-menu" role="menu" onKeyDown={handleMenuKeyDown}>
          {languages.map(({ code, label, shortLabel }, index) => (
            <button
              key={code}
              ref={(element) => { optionRefs.current[index] = element; }}
              type="button"
              className="language-option"
              role="menuitemradio"
              aria-checked={language === code}
              onClick={() => {
                setLanguage(code);
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
            >
              {compact ? (
                <>
                  <span className="language-label-full">{label}</span>
                  <span className="language-label-short">{shortLabel}</span>
                </>
              ) : label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
