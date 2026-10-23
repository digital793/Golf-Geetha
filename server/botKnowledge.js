import crypto from 'node:crypto';
import { getContent } from './db.js';

// Curated Q&A data directly from Chat box draft contents v1.md
export const DRAFT_KNOWLEDGE = {
  welcome: {
    title: 'Welcome to Golf Gita',
    subtitle: 'What would you like to explore today?',
    topics: [
      { id: 'book', label: 'About the book' },
      { id: 'gita', label: 'The Bhagavad Gita and its wisdom' },
      { id: 'author', label: 'About the author' },
      { id: 'technique', label: 'Golf technique' },
      { id: 'mental', label: 'Confidence, focus and the mental game' },
    ],
  },
  categories: [
    {
      id: 'book',
      name: 'About the Book',
      shortName: 'About the Book',
      description: 'Explore the 18 holes of wisdom, themes of ego and balance, and where to buy.',
      qa: [
        {
          id: 'b1',
          q: 'What is Golf Gita?',
          summary: 'Explores golf through the Bhagavad Gita across 18 holes of ego, balance, and awareness.',
          a: 'Golf Gita: The Eternal Game of Celestial Wisdom explores golf through the wisdom of the Bhagavad Gita. Across 18 holes, it connects the challenges of the game with questions of ego, balance, awareness and purposeful action.',
          keywords: ['what is golf gita', 'about book', 'overview', 'summary', 'concept', 'meaning', 'celestial wisdom', 'about the book', 'what is the book about', 'book introduction'],
        },
        {
          id: 'b2',
          q: 'Who is the book written for?',
          summary: 'Written for golfers, coaches, newcomers, leaders, and anyone navigating everyday pressures.',
          a: 'It is written for golfers, coaches, newcomers and anyone interested in understanding themselves through the experiences of a game. Its reflections also speak to leaders and people navigating everyday pressures.',
          keywords: ['who is the book written for', 'who is the book for', 'target audience', 'readers', 'beginners', 'leaders', 'who should read', 'for whom'],
        },
        {
          id: 'b3',
          q: 'Do I need to play golf to enjoy it?',
          summary: 'No; golf provides the setting, but the experiences of doubt, ambition, and acceptance are universal.',
          a: 'No. Golf provides the setting, but the experiences are familiar to everyone: doubt, ambition, frustration, confidence and acceptance.',
          keywords: ['do i need to play golf', 'non golfer', 'dont play golf', 'enjoy without playing', 'not a golfer', 'never played golf'],
        },
        {
          id: 'b4',
          q: 'What are the 18 holes of wisdom?',
          summary: 'The book’s 18 chapters structured like a round of golf, exploring themes from ego to liberation.',
          a: 'They are the book’s 18 chapters, arranged like a round of golf. Each explores a theme such as ego, duality, time, balance, the senses or liberation, inviting readers to recognise its influence on their game and life.',
          keywords: ['18 holes of wisdom', 'eighteen holes', '18 holes', 'chapters', 'book structure', 'themes', 'round of golf', 'structure of book'],
        },
        {
          id: 'b5',
          q: 'How can I apply its lessons on and off the course?',
          summary: 'Choose one idea—like pausing before reacting or committing fully to a decision—and repeat it.',
          a: 'Choose one idea and practise it in a real situation. You might pause before reacting, commit fully to a decision, or review a mistake without judging your worth. Awareness becomes useful through repeated action.',
          keywords: ['how can i apply its lessons', 'apply lessons', 'practical application', 'off course', 'daily life', 'in real life', 'apply in life', 'real situation'],
        },
        {
          id: 'b6',
          q: 'Where can I buy the book?',
          summary: 'Available on Amazon India, Amazon US, Flipkart, Kindle, or directly through author Nazeer Tajudeen.',
          a: 'Golf Gita is available on Amazon India, Amazon US, Flipkart, and Kindle. You can also contact the author for signed copies, bulk orders, current availability, and delivery information.',
          action: 'buy_modal',
          keywords: ['where can i buy the book', 'where can i buy', 'where to buy', 'buy', 'purchase', 'order', 'amazon', 'flipkart', 'kindle', 'price', 'store', 'hardcover', 'paperback', 'get the book', 'cost'],
        },
      ],
    },
    {
      id: 'gita',
      name: 'About the Bhagavad Gita',
      shortName: 'Bhagavad Gita',
      description: 'Ancient philosophical dialogues between Krishna and Arjuna mapped to modern golf.',
      qa: [
        {
          id: 'g1',
          q: 'What is the Bhagavad Gita?',
          summary: 'A philosophical dialogue in the Mahabharata exploring action, duty, and the nature of the Self.',
          a: 'The Bhagavad Gita is a philosophical and spiritual dialogue within the Indian epic, the Mahabharata. Its 18 chapters explore action, duty, knowledge, devotion and the nature of the Self.',
          keywords: ['what is the bhagavad gita', 'ancient scripture', 'mahabharata', 'history', 'dialogue', 'sacred text', 'hindu scripture', 'origin of gita'],
        },
        {
          id: 'g2',
          q: 'Who are Krishna and Arjuna?',
          summary: 'Arjuna is the warrior overwhelmed by doubt, and Krishna is his charioteer guiding him to act with clarity.',
          a: 'Arjuna is the warrior who becomes overwhelmed by doubt before the battle of Kurukṣetra. Krishna, his charioteer and divine guide, helps him examine his confusion and understand how to act with clarity.',
          keywords: ['who are krishna and arjuna', 'krishna and arjuna', 'krishna', 'arjuna', 'charioteer', 'warrior', 'kurukshetra', 'kurukṣetra', 'divine guide'],
        },
        {
          id: 'g3',
          q: 'How does its wisdom relate to golf?',
          summary: 'Golf repeatedly tests commitment under uncertainty, mirroring the Gita’s teachings on disciplined action.',
          a: 'Golf repeatedly asks us to choose, commit and respond to uncertain outcomes. Golf Gita draws connections between these experiences and the Gita’s teachings on disciplined action, steadiness and self-awareness.',
          keywords: ['how does its wisdom relate to golf', 'how wisdom relates to golf', 'connection to golf', 'parallel', 'why golf and gita', 'relationship with golf', 'fairway meets battlefield'],
        },
        {
          id: 'g4',
          q: 'What does it teach about ego and self-doubt?',
          summary: 'A poor shot is an experience to learn from, rather than a definition of your identity or self-worth.',
          a: 'The Gita invites us to look beyond pride, fear and the need to prove ourselves. Through Golf Gita’s lens, a poor shot becomes an experience to learn from, rather than a definition of who we are.',
          keywords: ['what does it teach about ego and self doubt', 'ego and self doubt', 'ego', 'self doubt', 'self-doubt', 'pride', 'fear', 'poor shot', 'identity', 'feeling inadequate'],
        },
        {
          id: 'g5',
          q: 'What does acting without attachment to results mean?',
          summary: 'Give preparation and stroke full attention, while accepting you cannot control every outcome.',
          a: 'Give your preparation and action your full attention while accepting that you cannot control every outcome. In golf, choose your shot carefully and swing with commitment. Afterwards, learn from the result without clinging to it. You can care about your score without allowing it to govern your state of mind.',
          keywords: ['what does acting without attachment to results mean', 'acting without attachment', 'attachment to results', 'outcomes', 'nishkama karma', 'score anxiety', 'results', 'outcome expectation'],
        },
        {
          id: 'g6',
          q: 'Do I need a spiritual background to understand Golf Gita?',
          summary: 'No; approach the book with curiosity and reflect on its insights through your personal experience.',
          a: 'No. You can approach the book with curiosity and reflect on its ideas through your own experience and beliefs.',
          keywords: ['do i need a spiritual background', 'do i need spiritual background', 'religious background', 'religion', 'secular', 'beliefs', 'faith'],
        },
      ],
    },
    {
      id: 'author',
      name: 'About the Author',
      shortName: 'The Author',
      description: 'Nazeer Tajudeen — 20+ years coaching experience, Top 50 recognition, coaching philosophy.',
      qa: [
        {
          id: 'a1',
          q: 'Who is Nazeer Tajudeen?',
          summary: 'Author of Golf Gita and golf coach with over two decades of coaching experience.',
          a: 'Nazeer Tajudeen is the author of Golf Gita and a golf coach with two decades of coaching experience. His background spans visual communication, advertising, event management and teaching golfers of different ages and abilities.',
          keywords: ['who is nazeer tajudeen', 'author', 'who wrote', 'nazeer', 'tajudeen', 'bio', 'biography', 'about author', 'writer'],
        },
        {
          id: 'a2',
          q: 'What inspired him to write Golf Gita?',
          summary: 'Coaching showed how closely golf reflects the player’s inner condition, harmonized with the Gita.',
          a: 'His coaching experience revealed how closely the game reflects the person playing it. Golf Gita brings those observations into conversation with the Bhagavad Gita, exploring how our inner condition influences our choices and actions.',
          keywords: ['what inspired him to write golf gita', 'what inspired him', 'inspiration', 'why write', 'origin', 'motivation', 'spark'],
        },
        {
          id: 'a3',
          q: 'What is his background in golf coaching?',
          summary: 'Coaching since 2005, teaching golfers aged 5–85 with Top 50 recognition from WGTF and U.S. Kids Golf.',
          a: 'Nazeer discovered golf in 2000 and moved into full-time coaching in 2005. He has taught golfers aged five to 85 and has received Top 50 recognition from the World Golf Teachers Federation and U.S. Kids Golf.',
          keywords: ['what is his background in golf coaching', 'coaching background', 'wgtf', 'us kids golf', 'u.s. kids golf', 'top 50', 'experience', 'credentials'],
        },
        {
          id: 'a4',
          q: 'What is his coaching philosophy?',
          summary: 'Connecting technique with awareness, balancing mind, body, club, and energy for shot clarity.',
          a: 'His approach connects technique with awareness, confidence and enjoyment. He emphasises balance between mind, body, club and energy, helping golfers understand their game and commit to each shot with greater clarity.',
          keywords: ['what is his coaching philosophy', 'coaching philosophy', 'methodology', 'teaching style', 'mind body club', 'approach to coaching', 'philosophy of nazeer'],
        },
        {
          id: 'a5',
          q: 'How can I arrange a lesson with him?',
          summary: 'Contact the author with your location, playing experience, and main challenge to schedule a session.',
          a: 'Use the Contact the Author option and mention your location, golfing experience and what you would like help with. Ask about available lesson formats and scheduling.',
          action: 'contact_author',
          keywords: ['how can i arrange a lesson with him', 'arrange a lesson', 'golf lesson', 'coaching session', 'book coaching', 'private coaching', 'hire coach', 'take a lesson'],
        },
        {
          id: 'a6',
          q: 'Can I invite him to speak or lead a retreat?',
          summary: 'Enquire through Contact the Author with date, location, audience, and theme for retreats or keynotes.',
          a: 'You can send an enquiry through Contact the Author. Include the proposed date, location, audience and theme so he can consider the request and discuss availability.',
          action: 'contact_author',
          keywords: ['can i invite him to speak or lead a retreat', 'invite him to speak', 'lead a retreat', 'speaker', 'keynote', 'retreat', 'corporate workshop', 'seminar', 'masterclass', 'executive retreat'],
        },
      ],
    },
    {
      id: 'technique',
      name: 'Golf Swing Problems: Technical',
      shortName: 'Golf Technique',
      description: 'Physical ball striking, slice/hook, contact consistency, balance and distance.',
      qa: [
        {
          id: 't1',
          q: 'Why do I slice or hook the ball?',
          summary: 'Curve stems from the clubface angle relative to swing path direction at impact.',
          a: 'The curve usually comes from the relationship between the clubface and the direction the club is travelling at impact. For a right-handed golfer, a face open to the swing path encourages a slice; a face closed to it encourages a hook. The directions reverse for a left-handed golfer. Grip, alignment and off-centre contact can contribute, so start by describing where the ball begins and which way it curves.',
          keywords: ['why do i slice or hook the ball', 'slice', 'hook', 'why do i slice', 'why do i hook', 'curve', 'ball curves right', 'ball curves left', 'clubface', 'swing path', 'open face', 'closed face'],
        },
        {
          id: 't2',
          q: 'Why do I hit behind the ball or top it?',
          summary: 'Misses caused by swing arc low-point changes, posture, or balance—best remedied with small brushing swings.',
          a: 'These misses often involve where the club reaches the bottom of its arc and where it contacts the ball. Changes in posture, balance or arm movement can contribute. For an iron shot from the ground, practise small swings that strike the ball before brushing the turf beyond it.',
          keywords: ['why do i hit behind the ball or top it', 'hit behind the ball', 'top it', 'topping the ball', 'fat shot', 'thin shot', 'chunk', 'ground before ball', 'low point', 'contact turf'],
        },
        {
          id: 't3',
          q: 'Why is my ball striking inconsistent?',
          summary: 'Inconsistency comes from changing setup, balance, or tempo; start with repeatable half-swings.',
          a: 'Inconsistent contact can come from changing setup, balance, tempo or impact location. Begin with a repeatable setup and controlled half swings. Notice where the ball strikes the clubface before trying to add speed or make several swing changes.',
          keywords: ['why is my ball striking inconsistent', 'ball striking inconsistent', 'inconsistent contact', 'mis-hits', 'sweet spot', 'erratic strike', 'inconsistency', 'bad contact'],
        },
        {
          id: 't4',
          q: 'How can I improve my balance and swing rhythm?',
          summary: 'Swing at a tempo allowing you to hold your balanced finish comfortably for three seconds.',
          a: 'Make comfortable swings at a speed that lets you finish in balance and hold the finish for three seconds. Allow the backswing to complete before changing direction. If you repeatedly stumble or fall away, reduce your effort and check your setup.',
          keywords: ['how can i improve my balance and swing rhythm', 'balance and swing rhythm', 'balance', 'swing rhythm', 'tempo', 'rushing transition', 'falling over', 'footwork', 'swing tempo'],
        },
        {
          id: 't5',
          q: 'Why am I losing distance?',
          summary: 'Centered contact creates distance; trying to swing harder often reduces ball speed and strike quality.',
          a: 'Distance depends on centred contact, club speed, launch conditions and equipment suitability. First establish whether your contact has changed. Trying to swing harder can reduce distance if it produces poorer strikes. A coach or launch monitor assessment can help identify the main cause.',
          keywords: ['why am i losing distance', 'losing distance', 'loss of distance', 'hit shorter', 'distance drop', 'swing harder', 'lack of yards', 'clubhead speed'],
        },
        {
          id: 't6',
          q: 'How can I improve my chipping and putting?',
          summary: 'Pick a precise landing spot for chipping; separate starting direction and distance control for putting.',
          a: 'For chipping, practise landing the ball on a chosen spot and observing how far it rolls. For putting, work separately on starting direction and distance control. Use one ball occasionally and complete your normal routine to make practice more like the course.',
          keywords: ['how can i improve my chipping and putting', 'chipping and putting', 'chipping', 'putting', 'short game', 'greenside', 'landing spot', 'distance control putting', 'green reading'],
        },
      ],
    },
    {
      id: 'mental',
      name: 'Golf Swing Problems: Mental',
      shortName: 'Mental Game',
      description: 'Inner calmness, managing first-tee nerves, commitment, and bouncing back.',
      qa: [
        {
          id: 'm1',
          q: 'Why is my swing better in practice than on the course?',
          summary: 'Range practice lacks consequences, whereas course play introduces scoring pressure and changing lies.',
          a: 'Practice often offers repeated attempts with little consequence. On the course, changing lies, targets and concerns about scoring can shift your attention. Practise with one ball, change targets frequently and use the same routine you intend to follow during a round.',
          keywords: ['why is my swing better in practice than on the course', 'better in practice than on the course', 'practice vs course', 'range player', 'driving range vs course', 'scoring pressure', 'play worse on course'],
        },
        {
          id: 'm2',
          q: 'How can I stop overthinking during my swing?',
          summary: 'Prepare beforehand, step up with one simple cue like "smooth" or "target", and commit fully.',
          a: 'Give technical thinking a place during preparation, then choose one simple cue for the shot, such as “target” or “smooth.” Once you address the ball, commit to that cue. If you feel undecided, step away and restart.',
          keywords: ['how can i stop overthinking during my swing', 'stop overthinking', 'overthinking', 'too many swing thoughts', 'paralysis by analysis', 'mental clutter', 'busy mind', 'quiet mind'],
        },
        {
          id: 'm3',
          q: 'How do I recover mentally after a bad shot?',
          summary: 'Breathe, accept the result, save mechanical analysis for later, and focus on the immediate next shot.',
          a: 'Acknowledge what happened, take a comfortable breath and identify what the next shot requires. Save detailed swing analysis for later. The immediate task is to make a useful decision from your new position.',
          keywords: ['how do i recover mentally after a bad shot', 'recover mentally after a bad shot', 'bad shot', 'frustration', 'anger', 'reset mind', 'after bad shot', 'bouncing back', 'calm down after bad shot'],
        },
        {
          id: 'm4',
          q: 'How can I manage first-tee nerves?',
          summary: 'Warm up thoroughly, pick a familiar shot, settle breathing, and accept nerves while committing to the shot.',
          a: 'Arrive with enough time to warm up, choose a familiar shot and follow a routine you have practised. Let your breathing settle and aim at a clear target. You can make a committed swing while still feeling nervous.',
          keywords: ['how can i manage first-tee nerves', 'manage first-tee nerves', 'first tee nerves', 'first-tee nerves', 'anxiety on tee', 'shaking on first tee', 'nervous start', 'opening hole nerves'],
        },
        {
          id: 'm5',
          q: 'How do I commit to a shot when I feel uncertain?',
          summary: 'Pick a target and acceptable miss area; if doubt remains, choose a club and shot you trust.',
          a: 'Choose a club, target and acceptable place to miss before stepping into the shot. If doubt remains, select a more comfortable option. Commitment grows when the decision matches your ability and the situation.',
          keywords: ['how do i commit to a shot when i feel uncertain', 'commit to a shot', 'feel uncertain', 'doubt', 'hesitation', 'indecision', 'committing to shot', 'fear of trouble', 'uncertainty'],
        },
        {
          id: 'm6',
          q: 'How can I stop a bad hole from spoiling my round?',
          summary: 'Leave the mistake on the green with one lesson learned, reset on the next tee, and take each hole fresh.',
          a: 'As you leave the green, take one useful lesson from the hole and turn your attention to the next tee. Set a small goal, such as completing your routine or choosing a sensible target. The next hole deserves a fresh decision.',
          keywords: ['how can i stop a bad hole from spoiling my round', 'bad hole from spoiling my round', 'bad hole', 'blowup hole', 'ruining my round', 'snowball effect', 'triple bogey reset', 'bad score spoiling round'],
        },
      ],
    },
  ],
};

// Global in-memory knowledge cache
let cachedKnowledge = null;
let cachedETag = '';
let lastCrawledAt = null;
let crawlerInterval = null;

/**
 * Background Site Crawler & Knowledge Indexer
 * Scans SQLite database (holes, articles, faqs, platforms, content_blocks, lists)
 * and combines with curated draft knowledge into an indexed, ultra-fast search structure.
 */
export function crawlAndIndexSite() {
  const startedAt = Date.now();
  try {
    const content = getContent();

    // 1. Process 18 Holes
    const indexedHoles = (content.holes || []).map((h) => ({
      hole: h.hole,
      par: h.par,
      distance: h.distance,
      numeral: h.numeral,
      title: h.title,
      subtitle: h.subtitle,
      sanskrit: h.sanskrit,
      devanagari: h.devanagari,
      description: h.description,
      image: h.image,
      summary: `Hole ${h.hole} (${h.numeral}) - ${h.title} (${h.sanskrit} / ${h.devanagari}): Par ${h.par}, ${h.distance}. ${h.subtitle}. ${h.description}`,
    }));

    // 2. Process Articles
    const indexedArticles = (content.articles || [])
      .filter((a) => a.is_active !== 0)
      .map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        body: a.body,
        readTime: a.read_time,
        category: a.category,
        holeTag: a.hole_tag,
        image: a.image,
      }));

    // 3. Process FAQs
    const indexedFaqs = (content.faqs || []).map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
    }));

    // 4. Process Platforms (Where to buy)
    const indexedPlatforms = (content.platforms || [])
      .filter((p) => p.is_active !== 0)
      .map((p) => ({
        slug: p.slug,
        name: p.name,
        formats: p.formats,
        url: p.url,
        icon: p.icon,
      }));

    // 5. Process Speaking & Retreats & Lists
    const retreatMeta = content.lists?.retreat_meta || [];
    const speakingAudiences = content.lists?.speaking_audiences || [];
    const whoFor = content.lists?.who_for || [];
    const social = content.lists?.social || [];

    const knowledgePayload = {
      meta: {
        site_title: content.settings?.site_title || 'Golf Gita',
        site_description: content.settings?.site_description || '',
        author_name: 'Nazeer Tajudeen',
        last_crawled_at: new Date().toISOString(),
        counts: {
          holes: indexedHoles.length,
          articles: indexedArticles.length,
          faqs: indexedFaqs.length,
          platforms: indexedPlatforms.length,
          categories: DRAFT_KNOWLEDGE.categories.length,
        },
      },
      welcome: DRAFT_KNOWLEDGE.welcome,
      categories: DRAFT_KNOWLEDGE.categories,
      holes: indexedHoles,
      articles: indexedArticles,
      faqs: indexedFaqs,
      platforms: indexedPlatforms,
      lists: {
        retreatMeta,
        speakingAudiences,
        whoFor,
        social,
      },
      sections: {
        book: content.sections?.book || {},
        author: content.sections?.author || {},
        speaking: content.sections?.speaking_page || {},
        contact: content.sections?.contact || {},
        the_turn: content.sections?.the_turn || {},
      },
    };

    // Calculate ETag
    const serialized = JSON.stringify(knowledgePayload);
    const hash = crypto.createHash('md5').update(serialized).digest('hex');

    cachedKnowledge = knowledgePayload;
    cachedETag = `"${hash}"`;
    lastCrawledAt = new Date().toISOString();

    const elapsed = Date.now() - startedAt;
    console.log(
      `[Golf Gita Bot Crawler] Site crawled and indexed successfully in ${elapsed}ms. ` +
      `Index contains ${indexedHoles.length} holes, ${indexedArticles.length} articles, ` +
      `${indexedFaqs.length} FAQs, ${indexedPlatforms.length} platforms.`
    );

    return cachedKnowledge;
  } catch (err) {
    console.error('[Golf Gita Bot Crawler] Error during crawl:', err);
    return cachedKnowledge;
  }
}

/**
 * Start periodic crawler background worker.
 * Interval: default 5 minutes (300,000ms).
 */
export function startBackgroundCrawler(intervalMs = 300000) {
  // Run initial crawl immediately
  crawlAndIndexSite();

  if (crawlerInterval) clearInterval(crawlerInterval);
  crawlerInterval = setInterval(() => {
    crawlAndIndexSite();
  }, intervalMs);

  // Allow process to exit cleanly without waiting for interval
  if (crawlerInterval.unref) crawlerInterval.unref();
}

/**
 * Immediately triggers an incremental sync when Admin updates any CMS content.
 */
export function triggerBackgroundSync() {
  setImmediate(() => {
    crawlAndIndexSite();
  });
}

/**
 * Returns current knowledge bundle and ETag
 */
export function getKnowledgeBundle() {
  if (!cachedKnowledge) {
    crawlAndIndexSite();
  }
  return {
    etag: cachedETag,
    lastCrawledAt,
    data: cachedKnowledge,
  };
}

// ── DOMAIN VOCABULARY & SCOPE BOUNDARY DEFINITION ──
const GOLF_TERMS = [
  'golf', 'golfer', 'golfers', 'golfing', 'swing', 'swings', 'shot', 'shots',
  'club', 'clubs', 'ball', 'balls', 'iron', 'irons', 'driver', 'drivers', 'wedge', 'wedges',
  'putter', 'putt', 'putting', 'chip', 'chipping', 'pitch', 'pitching', 'slice', 'slicing',
  'hook', 'hooking', 'fade', 'draw', 'fairway', 'green', 'greens', 'tee', 'bunker', 'hazard',
  'rough', 'turf', 'par', 'score', 'scorecard', 'handicap', 'strike', 'contact', 'tempo',
  'rhythm', 'balance', 'distance', 'arc', 'stance', 'grip', 'alignment', 'backswing',
  'downswing', 'follow through', 'lie', 'hole', 'holes', 'round', 'course', 'range',
  'practice', 'caddie', 'pin', 'yardage', 'shank', 'top', 'topping', 'fat', 'thin',
  'chunk', 'divot', 'loft'
];

const GITA_MENTAL_TERMS = [
  'gita', 'geetha', 'bhagavad', 'krishna', 'arjuna', 'kurukshetra', 'kurukṣetra',
  'karma', 'dharma', 'yoga', 'nishkama', 'wisdom', 'celestial', 'ego', 'doubt',
  'self doubt', 'self-doubt', 'nerves', 'anxiety', 'nervous', 'overthinking',
  'think', 'mind', 'mental', 'focus', 'attachment', 'outcome', 'outcomes', 'stillness',
  'calm', 'calmness', 'breathe', 'breath', 'breathing', 'presence', 'duality',
  'liberation', 'awareness', 'spiritual', 'philosophy', 'routine', 'pressure',
  'choke', 'hesitation', 'commit', 'commitment', 'acceptance', 'frustration',
  'anger', 'peace', 'inner'
];

const SITE_AUTHOR_TERMS = [
  'book', 'author', 'nazeer', 'tajudeen', 'chapter', 'chapters',
  'kindle', 'amazon', 'flipkart', 'hardcover', 'paperback', 'lesson', 'lessons',
  'coach', 'coaching', 'retreat', 'retreats', 'speaking', 'keynote', 'workshop',
  'masterclass', 'seminar', 'site', 'website', 'contact', 'eighteen', '18 holes', 'scorecard'
];

const OFF_TOPIC_REJECT_TERMS = [
  'bitcoin', 'crypto', 'cryptocurrency', 'ethereum', 'btc', 'stock', 'stocks',
  'weather', 'forecast', 'recipe', 'pizza', 'burger', 'cooking', 'code', 'coding',
  'python', 'javascript', 'java', 'c++', 'html', 'css', 'movie', 'cinema', 'actor',
  'actress', 'song', 'celebrity', 'politics', 'election', 'president', 'war',
  'football', 'cricket', 'nba', 'fifa', 'tennis', 'hockey', 'formula 1', 'f1',
  'car', 'flight', 'airline', 'hotel', 'hospital', 'doctor', 'medicine', 'drug'
];

const SANSKRIT_HOLE_NAMES = [
  'vishada', 'sankhya', 'sankhyayoga', 'karmayoga', 'jnanayoga', 'sannyasa',
  'dhyana', 'vijnana', 'akshara', 'rajavidya', 'vibhuti', 'vishwaroopa',
  'bhakti', 'kshetra', 'gunatraya', 'purushottama', 'daivasura', 'shraddhatraya', 'moksha'
];

const GREETING_TERMS = [
  'hi', 'hello', 'hey', 'namaste', 'greetings', 'good morning', 'good afternoon',
  'good evening', 'who are you', 'what are you', 'how can you help', 'what can you do',
  'help', 'topics', 'start', 'begin', 'menu', 'options'
];

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'that', 'this', 'with', 'from', 'about', 'what', 'when',
  'where', 'which', 'who', 'why', 'how', 'can', 'could', 'would', 'should',
  'tell', 'show', 'give', 'help', 'some', 'any', 'are', 'was', 'were', 'have',
  'has', 'had', 'does', 'did', 'doing', 'make', 'into', 'out', 'need', 'play',
  'enjoy', 'look', 'want', 'please', 'know', 'just', 'more'
]);

function cleanTokens(str = '') {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function calculateJaccardSimilarity(textA = '', textB = '') {
  const setA = new Set(cleanTokens(textA));
  const setB = new Set(cleanTokens(textB));
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) intersection++;
  }
  const union = new Set([...setA, ...setB]).size;
  return union > 0 ? intersection / union : 0;
}

/**
 * Validates whether query falls within Golf Gita domain boundaries.
 */
function isDomainRelevant(query = '') {
  const lower = query.toLowerCase().trim();
  const normalized = lower.replace(/[^\w\s]/g, ' ');
  const tokenSet = new Set(normalized.split(' ').filter(Boolean));

  // 1. Immediately reject explicit off-topic subjects (crypto, weather, coding, etc.)
  for (const reject of OFF_TOPIC_REJECT_TERMS) {
    if (tokenSet.has(reject) || (reject.includes(' ') && normalized.includes(reject))) {
      return false;
    }
  }

  // 2. Check greetings / bot introduction
  for (const g of GREETING_TERMS) {
    if (lower === g || lower.startsWith(g + ' ') || lower.endsWith(' ' + g)) {
      return true;
    }
  }

  // 3. Check Holes 1 to 18
  if (/\bhole\s*([0-9]{1,2})\b/i.test(lower)) return true;

  // 4. Check Sanskrit names
  for (const s of SANSKRIT_HOLE_NAMES) {
    if (normalized.includes(s)) return true;
  }

  // 5. Check domain keywords (Golf, Gita/Mental, Site/Author)
  const allTerms = [...GOLF_TERMS, ...GITA_MENTAL_TERMS, ...SITE_AUTHOR_TERMS];
  for (const term of allTerms) {
    if (normalized.includes(term)) return true;
  }

  // 6. Check buy/order/price when paired with book/read/copy
  if (
    (normalized.includes('buy') || normalized.includes('purchase') || normalized.includes('order') || normalized.includes('price') || normalized.includes('cost')) &&
    (normalized.includes('book') || normalized.includes('golf') || normalized.includes('gita') || normalized.includes('copy') || normalized.includes('copies') || normalized.includes('read'))
  ) {
    return true;
  }

  return false;
}

/**
 * Flattens all 30 curated questions with their metadata for fast lookup and scoring.
 */
function getAllCuratedQuestions() {
  const all = [];
  for (const cat of DRAFT_KNOWLEDGE.categories) {
    for (const item of cat.qa) {
      all.push({
        ...item,
        categoryId: cat.id,
        categoryName: cat.name,
        categoryIcon: cat.icon,
      });
    }
  }
  return all;
}

/**
 * Intelligent Answer Engine for Free-Form or Guided Inquiries
 * Complies with strict domain boundaries, genuinely refuses unwanted queries without harm,
 * suggests related Topic Q&As for general keyword queries, and answers site-specific queries.
 */
export function answerBotQuery({ query = '', userContext = {}, _history = [] }) {
  if (!cachedKnowledge) crawlAndIndexSite();

  const cleanQuery = query.trim();
  const lower = cleanQuery.toLowerCase();
  const handedness = userContext.handedness || 'Right-handed';
  const userName = userContext.name || '';
  const allCurated = getAllCuratedQuestions();

  // ── STEP 1: SAFETY & DOMAIN RELEVANCE FILTER ──
  // If query is unrelated, unwanted, or out of scope, genuinely refuse without harm.
  if (!isDomainRelevant(cleanQuery)) {
    return {
      answer: `I am dedicated exclusively to **Golf Gita: The Eternal Game of Celestial Wisdom**, its 18 holes of wisdom, golf swing technique and mental game principles, and author Nazeer Tajudeen.\n\nI genuinely cannot assist with questions outside of these topics. You are warmly welcome to explore any of our 5 wisdom chapters or ask about golf challenges, the book, or the 18 holes.`,
      category: 'Golf Gita Domain Boundary',
      source: 'Scope Restriction',
      isRefusal: true,
      suggestedQuestions: [
        'What is Golf Gita?',
        'What are the 18 holes of wisdom?',
        'Why do I slice or hook the ball?',
        'How can I manage first-tee nerves?',
      ],
      showContactAuthor: false,
      showFeedback: false,
    };
  }

  // ── STEP 2: GREETINGS & PURPOSE INQUIRIES ──
  const isGreetingOnly = GREETING_TERMS.some(
    (g) => lower === g || lower === `${g}!` || lower === `${g}?` || lower === `${g}.`
  );
  if (isGreetingOnly) {
    return {
      answer: `Namaste${userName ? `, **${userName}**` : ''}. Welcome to **Golf Gita: The Eternal Game of Celestial Wisdom**.\n\nHere, the ancient dialogue of the Bhagavad Gita meets the physical and mental arena of golf across 18 holes of insight. I can guide your swing mechanics, steady your mental game, introduce the author Nazeer Tajudeen, or explore where to purchase the book.\n\nHow would you like to begin?`,
      category: 'Welcome to Golf Gita',
      source: 'Golf Gita Guide',
      suggestedQuestions: [
        'What is Golf Gita?',
        'What are the 18 holes of wisdom?',
        'Why do I slice or hook the ball?',
        'How can I stop overthinking during my swing?',
        'Where can I buy the book?',
      ],
      showContactAuthor: false,
      showFeedback: false,
    };
  }

  // ── STEP 3: EXACT OR HIGH-CONFIDENCE QUESTION MATCH ──
  // If the user is asking an exact question from the curated 30 Q&As
  let bestExactMatch = null;
  let bestExactScore = 0;

  for (const item of allCurated) {
    const qLower = item.q.toLowerCase().replace(/[^\w\s]/g, '').trim();
    const queryNorm = lower.replace(/[^\w\s]/g, '').trim();

    // 1. Direct identical match
    if (queryNorm === qLower) {
      bestExactMatch = item;
      bestExactScore = 1.0;
      break;
    }

    // 2. High Jaccard similarity (word tokens overlap > 0.65)
    const sim = calculateJaccardSimilarity(item.q, cleanQuery);
    if (sim > bestExactScore && sim >= 0.65) {
      bestExactScore = sim;
      bestExactMatch = item;
    }

    // 3. Substring containment with meaningful length
    if (queryNorm.length > 18 && (qLower.includes(queryNorm) || queryNorm.includes(qLower))) {
      if (bestExactScore < 0.9) {
        bestExactScore = 0.9;
        bestExactMatch = item;
      }
    }
  }

  if (bestExactMatch && bestExactScore >= 0.65) {
    let answerText = bestExactMatch.a;
    // Tailor slice/hook to handedness if technical
    if (bestExactMatch.id === 't1' && handedness.toLowerCase().includes('left')) {
      answerText = 'For a left-handed golfer, a face open to the swing path encourages a slice, while a face closed to it encourages a hook (mirroring right-handed physics). The curve comes from the relationship between the clubface angle and the club path direction at impact. Grip, alignment and off-centre strike contribute significantly—start by noting where your ball begins and which way it curves.';
    }

    // Sibling questions from same category
    const followUps = allCurated
      .filter((q) => q.categoryId === bestExactMatch.categoryId && q.id !== bestExactMatch.id)
      .slice(0, 4)
      .map((q) => q.q);

    return {
      answer: answerText,
      category: bestExactMatch.categoryName,
      source: 'Curated Golf Gita Wisdom',
      matchedQuestion: bestExactMatch.q,
      suggestedQuestions: followUps,
      action: bestExactMatch.action,
      showContactAuthor:
        bestExactMatch.action === 'contact_author' ||
        bestExactMatch.categoryId === 'technique' ||
        bestExactMatch.categoryId === 'mental',
      showFeedback: true,
    };
  }

  // ── STEP 4: HOLE 1 TO 18 MATCH ──
  const holeMatch = lower.match(/\bhole\s*([0-9]{1,2})\b/);
  if (holeMatch) {
    const holeNum = parseInt(holeMatch[1], 10);
    const hole = cachedKnowledge?.holes?.find((h) => h.hole === holeNum);
    if (hole) {
      const nextHole = holeNum < 18 ? holeNum + 1 : 1;
      return {
        answer: `**Hole ${hole.numeral} — ${hole.title}** (${hole.sanskrit} / ${hole.devanagari})\n\n• **Course Specs:** Par ${hole.par}, ${hole.distance}\n• **Theme:** ${hole.subtitle}\n• **Wisdom Insight:** "${hole.description}"\n\nIn the ancient map, Hole ${hole.hole} corresponds to Chapter ${hole.hole} of the Bhagavad Gita, where Krishna instructs Arjuna on mastering the inner terrain before executing the outer stroke.`,
        category: '18 Holes of Wisdom',
        source: `Scorecard Hole ${hole.hole}`,
        image: hole.image,
        suggestedQuestions: [
          `Tell me about Hole ${nextHole}`,
          'What are the 18 holes of wisdom?',
          'How does its wisdom relate to golf?',
          'Where can I buy the book?',
        ],
        showContactAuthor: false,
        showFeedback: true,
      };
    }
  }

  // Check Hole by Sanskrit or Title
  for (const hole of cachedKnowledge?.holes || []) {
    if (
      lower.includes(hole.title.toLowerCase()) ||
      lower.includes(hole.sanskrit.toLowerCase()) ||
      lower.includes(hole.subtitle.toLowerCase())
    ) {
      return {
        answer: `**Hole ${hole.numeral} — ${hole.title} (${hole.sanskrit} / ${hole.devanagari})**\n\n• **Theme:** ${hole.subtitle}\n• **Par & Distance:** Par ${hole.par}, ${hole.distance}\n• **Core Reflection:** "${hole.description}"\n\nThis chapter corresponds to Hole ${hole.hole} in the Golf Gita scorecard, bridging ancient spiritual clarity with your mindset on the tee box.`,
        category: '18 Holes of Wisdom',
        source: `Scorecard Hole ${hole.hole}`,
        image: hole.image,
        suggestedQuestions: [
          'What are the 18 holes of wisdom?',
          'How does its wisdom relate to golf?',
          'Where can I buy the book?',
        ],
        showContactAuthor: false,
        showFeedback: true,
      };
    }
  }

  // ── STEP 5: WHERE TO BUY / PURCHASE / PRICE / RETAILERS ──
  const isPurchaseInquiry =
    lower.includes('buy') ||
    lower.includes('purchase') ||
    lower.includes('amazon') ||
    lower.includes('flipkart') ||
    lower.includes('kindle') ||
    lower.includes('hardcover') ||
    lower.includes('paperback') ||
    ((lower.includes('price') || lower.includes('cost') || lower.includes('order')) &&
      (lower.includes('book') || lower.includes('copy') || lower.includes('copies') || lower.includes('golf gita') || lower.includes('how much')));

  if (isPurchaseInquiry) {
    const platforms = cachedKnowledge?.platforms || [];
    const platformList = platforms.map((p) => `• **${p.name}** (${p.formats}) — [Order on ${p.name}](${p.url})`).join('\n');
    return {
      answer: `*Golf Gita: The Eternal Game of Celestial Wisdom* is available across major platforms:\n\n${platformList}\n\nFor signed author copies, bulk orders for golf clubs, or international delivery arrangements, you can also reach out directly to author Nazeer Tajudeen.`,
      category: 'Where to Buy',
      source: 'Official Retail Partners',
      action: 'buy_modal',
      suggestedQuestions: [
        'What is Golf Gita?',
        'Who is the book written for?',
        'Who is Nazeer Tajudeen?',
      ],
      showContactAuthor: true,
      showFeedback: true,
    };
  }

  // ── STEP 6: SPEAKING / RETREATS / MASTERCLASSES ──
  if (
    lower.includes('retreat') ||
    lower.includes('speaking') ||
    lower.includes('keynote') ||
    lower.includes('workshop') ||
    lower.includes('masterclass') ||
    lower.includes('corporate')
  ) {
    return {
      answer: `Nazeer Tajudeen conducts exclusive keynotes, corporate retreats, and immersive workshops bridging mindfulness, leadership, and golf.\n\n• **Format Options:** Executive Golf Retreats, Half-Day & Full-Day Masterclasses, Keynote Addresses, and 1-on-1 Mentorship.\n• **Themes:** Performing under pressure, non-attachment to outcomes, and mastering the mental scorecard.\n\nTo check availability and arrange an event for your organization or club, send an inquiry through Contact the Author.`,
      category: 'Speaking & Retreats',
      source: 'Events & Masterclasses',
      action: 'contact_author',
      suggestedQuestions: [
        'Who is Nazeer Tajudeen?',
        'What is his coaching philosophy?',
        'How can I arrange a lesson with him?',
      ],
      showContactAuthor: true,
      showFeedback: true,
    };
  }

  // ── STEP 7: GENERAL QUESTIONS CONTAINING DOCUMENT KEYWORDS ──
  // Requirement: "if i ask any genral Quetion with any of these Docs Contain Key Word
  // the Bot Must need to Suggest the related Topic Q&A isted of giveing Genral Answers,
  // if it is Out the sites and chapters, and if incase any genral qution but related to this site can be answerable"

  // Score each curated Q&A against the query keywords
  const queryTokens = cleanTokens(cleanQuery);
  const scoredItems = allCurated.map((item) => {
    let score = 0;

    // Check keyword match
    for (const kw of item.keywords) {
      if (lower.includes(kw)) score += 12;
      for (const token of queryTokens) {
        if (kw.includes(token)) score += 4;
      }
    }

    // Check question title overlap
    for (const token of queryTokens) {
      if (item.q.toLowerCase().includes(token)) score += 5;
    }

    // Category relevance bonus
    if (lower.includes('swing') || lower.includes('slice') || lower.includes('hook') || lower.includes('contact') || lower.includes('distance')) {
      if (item.categoryId === 'technique') score += 6;
    }
    if (lower.includes('mental') || lower.includes('mind') || lower.includes('nerve') || lower.includes('overthink') || lower.includes('focus')) {
      if (item.categoryId === 'mental') score += 6;
    }
    if (lower.includes('author') || lower.includes('nazeer') || lower.includes('coach') || lower.includes('lesson')) {
      if (item.categoryId === 'author') score += 6;
    }
    if (lower.includes('gita') || lower.includes('krishna') || lower.includes('arjuna') || lower.includes('ego')) {
      if (item.categoryId === 'gita') score += 6;
    }
    if (lower.includes('book') || lower.includes('chapter') || lower.includes('read')) {
      if (item.categoryId === 'book') score += 6;
    }

    return { item, score };
  });

  // Filter items with positive relevance
  scoredItems.sort((a, b) => b.score - a.score);
  const matchedSuggestions = scoredItems.filter((s) => s.score >= 5).slice(0, 4);

  // If we found matching Q&As based on document keywords:
  if (matchedSuggestions.length > 0) {
    const primaryCat = matchedSuggestions[0].item.categoryName;
    const questionsList = matchedSuggestions.map((s) => s.item.q);

    // Build structured preview with summaries
    const bulletList = matchedSuggestions
      .map((s) => `• **${s.item.q}**\n  *${s.item.summary || s.item.q}*`)
      .join('\n\n');

    return {
      answer: `Based on **Golf Gita**, here are the related questions and chapter guidance concerning **"${cleanQuery}"**:\n\n${bulletList}\n\nSelect any question below to explore its complete guidance, or reach out to author Nazeer Tajudeen if your challenge requires personal consultation.`,
      category: primaryCat,
      source: 'Related Topic Suggestions',
      suggestedQuestions: questionsList,
      showContactAuthor: true,
      showFeedback: true,
    };
  }

  // ── STEP 8: GENERAL SITE-RELATED / PHILOSOPHY INQUIRY ──
  // If in case any general question is related to this site, provide an authentic Golf Gita overview:
  return {
    answer: `*Golf Gita: The Eternal Game of Celestial Wisdom* explores the parallel between the game of golf and the timeless dialogue of the Bhagavad Gita.\n\nAcross 18 holes arranged like a round of golf, author Nazeer Tajudeen connects the challenges of the fairways—slice, hesitation, first-tee nerves, and score attachment—with ancient wisdom on ego, balance, awareness, and selfless action (*Nishkama Karma*).\n\nHere are related topics from the chapters to explore:`,
    category: 'About Golf Gita',
    source: 'Golf Gita Overview',
    suggestedQuestions: [
      'What is Golf Gita?',
      'What are the 18 holes of wisdom?',
      'How does its wisdom relate to golf?',
      'What does acting without attachment to results mean?',
      'Where can I buy the book?',
    ],
    showContactAuthor: true,
    showFeedback: true,
  };
}
