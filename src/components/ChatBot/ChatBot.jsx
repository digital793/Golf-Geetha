import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Send,
  RefreshCw,
  Check,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Mail,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { useCms } from '../../cms/CmsContext';
import { submitForm, trackEvent } from '../../cms/tracking';
import './ChatBot.css';

// ── Stable browser-local ID ── persists across tabs & sessions via localStorage
const LOCAL_PROFILE_KEY = 'gg_bot_local_id';
function getLocalId() {
  let id = window.localStorage.getItem(LOCAL_PROFILE_KEY);
  if (!id) {
    id = `bot-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(LOCAL_PROFILE_KEY, id);
  }
  return id;
}
function clearLocalId() {
  window.localStorage.removeItem(LOCAL_PROFILE_KEY);
}

const DEFAULT_PROFILE = {
  name: '', age: '', gender: '', genderCustom: '',
  city: '', country: '',
  handedness: 'Right-handed', experience: 'Regular golfer',
  yearsPlayed: '', handicap: '', mainChallenge: '',
  occurrence: 'On the course', clubShotDifficulty: '',
  ballFlight: '', physicalLimitations: '', mentalTroubles: '', mentalTriggers: '',
};

export function ChatBot({ onNavigate, onBuyClick }) {
  const { settings } = useCms();
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnreadGreeting, setHasUnreadGreeting] = useState(true);

  // Background knowledge crawler state (quiet, zero UI clutter)
  const [knowledge, setKnowledge] = useState(null);
  const [knowledgeEtag, setKnowledgeEtag] = useState('');

  // Wizard flow state: 1: Topics → 2: About you → 3: Golf → 4: Chat
  const [step, setStep] = useState(1);
  const [selectedTopics, setSelectedTopics] = useState([]);

  // User profile — merged with saved DB record on open
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // Profile persistence state
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Chat conversation state
  const [activeCategory, setActiveCategory] = useState('book');
  const [isTopicDrawerOpen, setIsTopicDrawerOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [contactAuthorModal, setContactAuthorModal] = useState({
    isOpen: false,
    subject: '',
    customNote: '',
    isSent: false,
  });

  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && step === 4) {
      scrollToBottom();
    }
  }, [messages, isAiTyping, isOpen, step]);

  // Background Crawler Engine: quietly syncs knowledge in background with 304 ETag caching
  const syncKnowledge = useCallback(async () => {
    try {
      const headers = {};
      if (knowledgeEtag) {
        headers['If-None-Match'] = knowledgeEtag;
      }
      const res = await fetch('/api/bot/knowledge', { headers });
      if (res.status === 304) return;
      if (res.ok) {
        const bundle = await res.json();
        setKnowledge(bundle.data);
        setKnowledgeEtag(bundle.etag || '');
      }
    } catch {
      // Quiet fallback
    }
  }, [knowledgeEtag]);

  useEffect(() => {
    syncKnowledge();
    const interval = setInterval(syncKnowledge, 180000);
    return () => clearInterval(interval);
  }, [syncKnowledge]);

  // ── Load saved profile from DB on first open ──
  const loadSavedProfile = useCallback(async () => {
    if (profileLoaded) return;
    setIsLoadingProfile(true);
    try {
      const localId = getLocalId();
      const res = await fetch(`/api/bot/profile/${localId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.found && data.privacyAccepted) {
          setProfile((prev) => ({ ...prev, ...data.profile }));
          setSelectedTopics(data.topics || []);
          setPrivacyAccepted(true);
          setStep(4);
          const savedName = data.profile?.name?.trim() || 'Seeker';
          setMessages([
            {
              id: 'returning-greeting',
              sender: 'bot',
              text: `Welcome back, **${savedName}**.\n\nYour conversation picks up where you left off. Ask any question, or explore the five chapters of Golf Gita wisdom below.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              category: 'Golf Gita Wisdom',
              showTopicSelector: true,
            },
          ]);
          const tops = data.topics || [];
          if (tops.includes('technique')) setActiveCategory('technique');
          else if (tops.includes('mental')) setActiveCategory('mental');
          else if (tops.includes('book')) setActiveCategory('book');
          else if (tops.includes('gita')) setActiveCategory('gita');
          else if (tops.includes('author')) setActiveCategory('author');
        }
      }
    } catch { /* Offline — continue with wizard */ }
    setProfileLoaded(true);
    setIsLoadingProfile(false);
  }, [profileLoaded]);

  // ── Save profile to DB ──
  const saveProfileToDb = useCallback(async (prof, topics) => {
    try {
      await fetch('/api/bot/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ localId: getLocalId(), profile: prof, topics, privacyAccepted: true }),
      });
    } catch { /* Quiet */ }
  }, []);

  const handleOpenChat = () => {
    setIsOpen(true);
    setHasUnreadGreeting(false);
    if (!profileLoaded) loadSavedProfile();
    trackEvent('bot_opened', { step });
  };

  const handleTopicToggle = (topicId) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  const hasGolfTopics = selectedTopics.includes('technique') || selectedTopics.includes('mental');

  // Step 1 -> Step 2
  const handleContinueFromWelcome = () => {
    if (selectedTopics.length === 0) return;
    setStep(2);
  };

  // Step 2 -> Step 3 or 4
  const handleContinueFromAboutYou = () => {
    if (!privacyAccepted) return;
    if (hasGolfTopics) {
      setStep(3);
    } else {
      startConversation(profile, selectedTopics);
    }
  };

  // Step 3 -> Step 4
  const handleContinueFromGolf = () => {
    startConversation(profile, selectedTopics);
  };

  // Initialize Step 4: Active Chat Room
  const startConversation = (prof, topics) => {
    const p = prof || profile;
    const t = topics || selectedTopics;
    const localHasGolf = t.includes('technique') || t.includes('mental');
    setStep(4);
    saveProfileToDb(p, t);
    const firstName = p.name.trim() || 'Seeker';
    let welcomeGreeting = `Namaste, **${firstName}**. Welcome to Golf Gita.\n\n`;
    if (localHasGolf && p.mainChallenge) {
      welcomeGreeting +=
        `I note that you play ${p.handedness.toLowerCase()} and are currently reflecting on: *" ${p.mainChallenge} "*.\n\n` +
        `In Golf Gita, every curve of the ball and each moment of hesitation mirrors the inner dialogue of Arjuna on Kurukṣetra. Below you can explore all 5 chapters of wisdom, or simply ask any question.`;
    } else {
      welcomeGreeting +=
        `Across the 18 holes of wisdom, we examine the connection between inner stillness, selfless action, and the modern round.\n\n` +
        `You may explore any of the five topics below, or ask any question at any time.`;
    }
    setMessages([
      {
        id: 'initial-greeting',
        sender: 'bot',
        text: welcomeGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: 'Golf Gita Wisdom',
        showTopicSelector: true,
      },
    ]);
    if (t.includes('technique')) setActiveCategory('technique');
    else if (t.includes('mental')) setActiveCategory('mental');
    else if (t.includes('book')) setActiveCategory('book');
    else if (t.includes('gita')) setActiveCategory('gita');
    else if (t.includes('author')) setActiveCategory('author');
    else setActiveCategory('book');
    trackEvent('bot_flow_started', { topics: t, handedness: p.handedness });
  };

  const handleRestart = () => {
    setStep(1);
    setMessages([]);
    setSelectedTopics([]);
    setIsTopicDrawerOpen(false);
  };

  // ── End Session: clear DB + localStorage + reset for a different user ──
  const handleEndSession = async () => {
    try { await fetch(`/api/bot/profile/${getLocalId()}`, { method: 'DELETE' }); } catch { /* quiet */ }
    clearLocalId();
    setProfile(DEFAULT_PROFILE);
    setSelectedTopics([]);
    setPrivacyAccepted(false);
    setMessages([]);
    setStep(1);
    setIsTopicDrawerOpen(false);
    setProfileLoaded(false);
    trackEvent('bot_session_ended', {});
  };

  // Available categories with full questions directly from markdown
  const categories = knowledge?.categories || [
    {
      id: 'book',
      name: '1. About the Book',
      shortName: 'The Book',
      icon: '📖',
      qa: [
        { id: 'b1', q: 'What is Golf Gita?', a: 'Golf Gita: The Eternal Game of Celestial Wisdom explores golf through the wisdom of the Bhagavad Gita. Across 18 holes, it connects the challenges of the game with questions of ego, balance, awareness and purposeful action.' },
        { id: 'b2', q: 'Who is the book written for?', a: 'It is written for golfers, coaches, newcomers and anyone interested in understanding themselves through the experiences of a game. Its reflections also speak to leaders and people navigating everyday pressures.' },
        { id: 'b3', q: 'Do I need to play golf to enjoy it?', a: 'No. Golf provides the setting, but the experiences are familiar to everyone: doubt, ambition, frustration, confidence and acceptance.' },
        { id: 'b4', q: 'What are the 18 holes of wisdom?', a: 'They are the book’s 18 chapters, arranged like a round of golf. Each explores a theme such as ego, duality, time, balance, the senses or liberation, inviting readers to recognise its influence on their game and life.' },
        { id: 'b5', q: 'How can I apply its lessons on and off the course?', a: 'Choose one idea and practise it in a real situation. You might pause before reacting, commit fully to a decision, or review a mistake without judging your worth. Awareness becomes useful through repeated action.' },
        { id: 'b6', q: 'Where can I buy the book?', a: 'Please contact the author for current availability, ordering options and delivery information. It is also available on Amazon India, Amazon US, Flipkart, and Kindle.', action: 'buy_modal' },
      ],
    },
    {
      id: 'gita',
      name: '2. About the Bhagavad Gita',
      shortName: 'The Bhagavad Gita',
      icon: '🕉️',
      qa: [
        { id: 'g1', q: 'What is the Bhagavad Gita?', a: 'The Bhagavad Gita is a philosophical and spiritual dialogue within the Indian epic, the Mahabharata. Its 18 chapters explore action, duty, knowledge, devotion and the nature of the Self.' },
        { id: 'g2', q: 'Who are Krishna and Arjuna?', a: 'Arjuna is the warrior who becomes overwhelmed by doubt before the battle of Kurukṣetra. Krishna, his charioteer and divine guide, helps him examine his confusion and understand how to act with clarity.' },
        { id: 'g3', q: 'How does its wisdom relate to golf?', a: 'Golf repeatedly asks us to choose, commit and respond to uncertain outcomes. Golf Gita draws connections between these experiences and the Gita’s teachings on disciplined action, steadiness and self-awareness.' },
        { id: 'g4', q: 'What does it teach about ego and self-doubt?', a: 'The Gita invites us to look beyond pride, fear and the need to prove ourselves. Through Golf Gita’s lens, a poor shot becomes an experience to learn from, rather than a definition of who we are.' },
        { id: 'g5', q: 'What does acting without attachment to results mean?', a: 'Give your preparation and action your full attention while accepting that you cannot control every outcome. In golf, choose your shot carefully and swing with commitment. Afterwards, learn from the result without clinging to it. You can care about your score without allowing it to govern your state of mind.' },
        { id: 'g6', q: 'Do I need a spiritual background to understand Golf Gita?', a: 'No. You can approach the book with curiosity and reflect on its ideas through your own experience and beliefs.' },
      ],
    },
    {
      id: 'author',
      name: '3. About the Author',
      shortName: 'The Author',
      icon: '🏌️',
      qa: [
        { id: 'a1', q: 'Who is Nazeer Tajudeen?', a: 'Nazeer Tajudeen is the author of Golf Gita and a golf coach with two decades of coaching experience. His background spans visual communication, advertising, event management and teaching golfers of different ages and abilities.' },
        { id: 'a2', q: 'What inspired him to write Golf Gita?', a: 'His coaching experience revealed how closely the game reflects the person playing it. Golf Gita brings those observations into conversation with the Bhagavad Gita, exploring how our inner condition influences our choices and actions.' },
        { id: 'a3', q: 'What is his background in golf coaching?', a: 'Nazeer discovered golf in 2000 and moved into full-time coaching in 2005. He has taught golfers aged five to 85 and has received Top 50 recognition from the World Golf Teachers Federation and U.S. Kids Golf.' },
        { id: 'a4', q: 'What is his coaching philosophy?', a: 'His approach connects technique with awareness, confidence and enjoyment. He emphasises balance between mind, body, club and energy, helping golfers understand their game and commit to each shot with greater clarity.' },
        { id: 'a5', q: 'How can I arrange a lesson with him?', a: 'Use the Contact the Author option and mention your location, golfing experience and what you would like help with. Ask about available lesson formats and scheduling.', action: 'contact_author' },
        { id: 'a6', q: 'Can I invite him to speak or lead a retreat?', a: 'You can send an enquiry through Contact the Author. Include the proposed date, location, audience and theme so he can consider the request and discuss availability.', action: 'contact_author' },
      ],
    },
    {
      id: 'technique',
      name: '4. Golf Swing Problems: Technical',
      shortName: 'Technical Swing',
      icon: '⛳',
      qa: [
        { id: 't1', q: 'Why do I slice or hook the ball?', a: 'The curve usually comes from the relationship between the clubface and the direction the club is travelling at impact. For a right-handed golfer, a face open to the swing path encourages a slice; a face closed to it encourages a hook. The directions reverse for a left-handed golfer. Grip, alignment and off-centre contact can contribute, so start by describing where the ball begins and which way it curves.' },
        { id: 't2', q: 'Why do I hit behind the ball or top it?', a: 'These misses often involve where the club reaches the bottom of its arc and where it contacts the ball. Changes in posture, balance or arm movement can contribute. For an iron shot from the ground, practise small swings that strike the ball before brushing the turf beyond it.' },
        { id: 't3', q: 'Why is my ball striking inconsistent?', a: 'Inconsistent contact can come from changing setup, balance, tempo or impact location. Begin with a repeatable setup and controlled half swings. Notice where the ball strikes the clubface before trying to add speed or make several swing changes.' },
        { id: 't4', q: 'How can I improve my balance and swing rhythm?', a: 'Make comfortable swings at a speed that lets you finish in balance and hold the finish for three seconds. Allow the backswing to complete before changing direction. If you repeatedly stumble or fall away, reduce your effort and check your setup.' },
        { id: 't5', q: 'Why am I losing distance?', a: 'Distance depends on centred contact, club speed, launch conditions and equipment suitability. First establish whether your contact has changed. Trying to swing harder can reduce distance if it produces poorer strikes. A coach or launch monitor assessment can help identify the main cause.' },
        { id: 't6', q: 'How can I improve my chipping and putting?', a: 'For chipping, practise landing the ball on a chosen spot and observing how far it rolls. For putting, work separately on starting direction and distance control. Use one ball occasionally and complete your normal routine to make practice more like the course.' },
      ],
    },
    {
      id: 'mental',
      name: '5. Golf Swing Problems: Mental',
      shortName: 'Mental Game',
      icon: '🧠',
      qa: [
        { id: 'm1', q: 'Why is my swing better in practice than on the course?', a: 'Practice often offers repeated attempts with little consequence. On the course, changing lies, targets and concerns about scoring can shift your attention. Practise with one ball, change targets frequently and use the same routine you intend to follow during a round.' },
        { id: 'm2', q: 'How can I stop overthinking during my swing?', a: 'Give technical thinking a place during preparation, then choose one simple cue for the shot, such as “target” or “smooth.” Once you address the ball, commit to that cue. If you feel undecided, step away and restart.' },
        { id: 'm3', q: 'How do I recover mentally after a bad shot?', a: 'Acknowledge what happened, take a comfortable breath and identify what the next shot requires. Save detailed swing analysis for later. The immediate task is to make a useful decision from your new position.' },
        { id: 'm4', q: 'How can I manage first-tee nerves?', a: 'Arrive with enough time to warm up, choose a familiar shot and follow a routine you have practised. Let your breathing settle and aim at a clear target. You can make a committed swing while still feeling nervous.' },
        { id: 'm5', q: 'How do I commit to a shot when I feel uncertain?', a: 'Choose a club, target and acceptable place to miss before stepping into the shot. If doubt remains, select a more comfortable option. Commitment grows when the decision matches your ability and the situation.' },
        { id: 'm6', q: 'How can I stop a bad hole from spoiling my round?', a: 'As you leave the green, take one useful lesson from the hole and turn your attention to the next tee. Set a small goal, such as completing your routine or choosing a sensible target. The next hole deserves a fresh decision.' },
      ],
    },
  ];

  const currentCategoryObj = categories.find((c) => c.id === activeCategory) || categories[0];

  // User clicks a curated or suggested question
  const handleAskCuratedQuestion = async (qObj) => {
    setIsTopicDrawerOpen(false);

    // Look up full Q&A object from categories if only q string/object was passed
    let fullQObj = qObj;
    const qText = typeof qObj === 'string' ? qObj : qObj.q;
    for (const cat of categories) {
      const found = cat.qa.find((item) => item.q.toLowerCase() === qText.toLowerCase());
      if (found) {
        fullQObj = found;
        setActiveCategory(cat.id);
        break;
      }
    }

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: qText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsAiTyping(true);

    try {
      const res = await fetch('/api/bot/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: qText,
          userContext: profile,
          history: messages.slice(-4),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTimeout(() => {
          setIsAiTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: 'bot',
              text: data.answer || fullQObj.a,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              category: data.category || currentCategoryObj.name,
              action: fullQObj.action || data.action,
              showFeedback: !data.isRefusal,
              qPrompt: qText,
              suggestedQuestions: data.suggestedQuestions,
              isRefusal: data.isRefusal,
            },
          ]);
        }, 300);
        return;
      }
    } catch {
      // Offline fallback
    }

    setTimeout(() => {
      setIsAiTyping(false);
      let answerText = fullQObj.a || `In Golf Gita, each shot on the fairway is an invitation to observe your state of mind.`;
      if (fullQObj.id === 't1' && profile.handedness.toLowerCase().includes('left')) {
        answerText = 'For a left-handed golfer, a face open to the swing path encourages a slice, while a face closed to it encourages a hook (mirroring right-handed physics). The curve comes from the relationship between the clubface angle and the club path direction at impact. Grip, alignment and off-centre contact contribute, so start by describing where your ball begins and which way it curves.';
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: answerText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category: currentCategoryObj.name,
          action: fullQObj.action,
          showFeedback: true,
          qPrompt: qText,
        },
      ]);
    }, 300);
  };

  // User submits a free-text question
  const handleSendFreeText = async (e) => {
    if (e) e.preventDefault();
    const query = inputValue.trim();
    if (!query || isAiTyping) return;

    setInputValue('');
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsAiTyping(true);

    try {
      const res = await fetch('/api/bot/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          userContext: profile,
          history: messages.slice(-4),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTimeout(() => {
          setIsAiTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: 'bot',
              text: data.answer,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              category: data.category || 'Wisdom Insight',
              action: data.action,
              showFeedback: !data.isRefusal,
              qPrompt: query,
              suggestedQuestions: data.suggestedQuestions,
              isRefusal: data.isRefusal,
            },
          ]);
        }, 350);
        return;
      }
    } catch {
      // Offline fallback
    }

    setTimeout(() => {
      setIsAiTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `In Golf Gita, every moment on the fairway or practice range is an invitation to observe your state of mind. You can explore the 18 holes, review specific swing challenges, or connect directly with author Nazeer Tajudeen.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category: 'Reflection',
          showFeedback: true,
          qPrompt: query,
          suggestedQuestions: [
            'What is Golf Gita?',
            'What are the 18 holes of wisdom?',
            'Why do I slice or hook the ball?',
            'How can I manage first-tee nerves?',
          ],
        },
      ]);
    }, 350);
  };

  // Feedback action handlers matching exact markdown draft
  const handleFeedback = (type, qPrompt) => {
    if (type === 'yes') {
      setMessages((prev) => [
        ...prev,
        {
          id: `feedback-${Date.now()}`,
          sender: 'bot',
          text: `May this insight bring steadiness to your game. What would you like to explore next?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category: 'Reflection',
          showTopicSelector: true,
        },
      ]);
    } else if (type === 'another') {
      setIsTopicDrawerOpen(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `feedback-${Date.now()}`,
          sender: 'bot',
          text: `Select any of the five topics below to view its questions, or type your enquiry in the field:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category: 'Explore',
          showTopicSelector: true,
        },
      ]);
    } else if (type === 'contact') {
      // Show exact guidance from draft lines 210-214
      setMessages((prev) => [
        ...prev,
        {
          id: `contact-guidance-${Date.now()}`,
          sender: 'bot',
          text: `If the answer does not address your concern, you are welcome to contact Nazeer Tajudeen. Share your question and a little relevant background so he can better understand what you need.\n\nFor a golf concern, mention whether you play right-handed or left-handed, the shot involved, what the ball does and when the problem occurs.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category: 'Contact Author',
          showDirectContactButton: true,
          qPrompt,
        },
      ]);
    }
  };

  // Contact Nazeer Tajudeen Modal
  const openContactAuthorModal = (relatedQuestion = '') => {
    setContactAuthorModal({
      isOpen: true,
      subject: relatedQuestion ? `Inquiry regarding: ${relatedQuestion}` : 'Golf Gita Consultation Inquiry',
      customNote: '',
      isSent: false,
    });
  };

  const handleSendAuthorInquiry = (e) => {
    e.preventDefault();
    const payload = {
      name: profile.name || 'Golf Gita Inquirer',
      city: profile.city || '',
      country: profile.country || '',
      handedness: profile.handedness,
      experience: profile.experience,
      handicap: profile.handicap,
      mainChallenge: profile.mainChallenge,
      subject: contactAuthorModal.subject,
      message: contactAuthorModal.customNote || `User requested consultation on: ${contactAuthorModal.subject}`,
      source: 'Golf Gita Chatbot',
    };

    submitForm('contact', payload);
    setContactAuthorModal((prev) => ({ ...prev, isSent: true }));

    setMessages((prev) => [
      ...prev,
      {
        id: `contact-sent-${Date.now()}`,
        sender: 'bot',
        text: `Your message has been sent directly to **Nazeer Tajudeen**.\n\nHe will review your background and get back to you with guidance.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: 'Author Contact',
      },
    ]);
  };

  return (
    <>
      {/* ── FLOATING CELESTIAL LAUNCHER ── */}
      <div className="celestial-launcher-container" aria-label="Golf Gita Wisdom Assistant">
        {!isOpen && hasUnreadGreeting && (
          <div className="celestial-greeting-bubble" onClick={handleOpenChat}>
            <div className="greeting-bubble-content">
              <span>Seek clarity on the course & within yourself.</span>
            </div>
            <button
              className="greeting-bubble-close"
              onClick={(e) => {
                e.stopPropagation();
                setHasUnreadGreeting(false);
              }}
              aria-label="Dismiss greeting"
            >
              <X size={13} />
            </button>
          </div>
        )}

        <button
          className={`celestial-launcher-btn ${isOpen ? 'is-active' : ''}`}
          onClick={() => (isOpen ? setIsOpen(false) : handleOpenChat())}
          aria-label={isOpen ? 'Close Golf Gita Guide' : 'Open Golf Gita Celestial Guide'}
          title="Golf Gita Guide • Tap to explore"
        >
          <span className="orbital-ring" aria-hidden="true" />
          <span className="orbital-glow" aria-hidden="true" />

          <div className="launcher-emblem-wrapper">
            <img
              src="/favicon.svg"
              alt="Golf Gita Sun Emblem"
              className="launcher-sun-icon"
              onError={(e) => {
                if (settings?.emblem_light) e.currentTarget.src = settings.emblem_light;
              }}
            />
          </div>
        </button>
      </div>

      {/* ── LUXURY BESPOKE CHAT WINDOW ── */}
      {isOpen && (
        <div
          className="celestial-chatbot-window"
          role="dialog"
          aria-modal="true"
          aria-label="Golf Gita Celestial Chatbot"
        >
          {/* Calm, Elegant Editorial Header */}
          <div className="chatbot-header">
            <div className="header-brand">
              <div className="header-emblem-ring">
                <img src="/favicon.svg" alt="Golf Gita Emblem" className="header-sun-emblem" />
              </div>
              <div className="header-titles">
                <div className="header-main-title">GOLF GITA</div>
                <div className="header-sub-status">Celestial Wisdom for the Course & the Mind</div>
              </div>
            </div>

            <div className="header-controls">
              {step === 4 && (
                <button
                  type="button"
                  className="header-ctrl-btn"
                  onClick={handleRestart}
                  title="Restart conversation"
                  aria-label="Restart conversation"
                >
                  <RefreshCw size={15} />
                </button>
              )}
              {step === 4 && (
                <button
                  type="button"
                  className="header-ctrl-btn end-session-btn"
                  onClick={handleEndSession}
                  title="End session & switch user"
                  aria-label="End session"
                >
                  <LogOut size={15} />
                  <span className="end-session-label">End Session</span>
                </button>
              )}

              <button
                type="button"
                className="header-ctrl-btn close-btn"
                onClick={() => setIsOpen(false)}
                title="Close"
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Profile loading state */}
          {isLoadingProfile && (
            <div className="profile-loading-state">
              <div className="profile-loading-dots">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
              <p>Recalling your conversation…</p>
            </div>
          )}

          {!isLoadingProfile && step === 1 && (
            <div className="chatbot-step-container step-welcome">
              <div className="step-badge">Welcome</div>
              <h2 className="step-heading">Welcome to Golf Gita</h2>
              <p className="step-prompt">What would you like to explore today?</p>

              <div className="topic-selection-list">
                {[
                  { id: 'book', label: 'About the Book' },
                  { id: 'gita', label: 'The Bhagavad Gita & Its Wisdom' },
                  { id: 'author', label: 'About the Author' },
                  { id: 'technique', label: 'Golf Technique' },
                  { id: 'mental', label: 'Confidence, Focus & the Mental Game' },
                ].map((item) => {
                  const isChecked = selectedTopics.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`topic-card-btn ${isChecked ? 'is-selected' : ''}`}
                      onClick={() => handleTopicToggle(item.id)}
                    >
                      <span className="topic-label">{item.label}</span>
                      <span className="topic-checkbox">{isChecked && <Check size={14} />}</span>
                    </button>
                  );
                })}
              </div>

              <div className="step-actions">
                <button
                  type="button"
                  className="step-primary-btn"
                  disabled={selectedTopics.length === 0}
                  onClick={handleContinueFromWelcome}
                >
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: A LITTLE ABOUT YOU ── */}
          {!isLoadingProfile && step === 2 && (
            <div className="chatbot-step-container step-about-you">
              <div className="step-badge-row">
                <button
                  type="button"
                  className="step-back-btn"
                  onClick={() => setStep(1)}
                  aria-label="Back"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <span className="step-badge">A little about you</span>
              </div>

              <h2 className="step-heading">A little about you</h2>
              <p className="step-prompt">This helps personalise your conversation. All fields are optional.</p>

              <div className="step-form-grid">
                <div className="form-field">
                  <label htmlFor="user-name">First name or nickname</label>
                  <input
                    id="user-name"
                    type="text"
                    placeholder="Your name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>

                <div className="form-row-duo">
                  <div className="form-field">
                    <label htmlFor="user-age">Age</label>
                    <input
                      id="user-age"
                      type="number"
                      placeholder="Age"
                      value={profile.age}
                      onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="user-gender">Gender</label>
                    <select
                      id="user-gender"
                      value={profile.gender}
                      onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Self-describe">Self-describe</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-duo">
                  <div className="form-field">
                    <label htmlFor="user-city">City</label>
                    <input
                      id="user-city"
                      type="text"
                      placeholder="City"
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="user-country">Country</label>
                    <input
                      id="user-country"
                      type="text"
                      placeholder="Country"
                      value={profile.country}
                      onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Policy Checkbox */}
              <div className="privacy-consent-block">
                <label className="privacy-checkbox-label" htmlFor="privacy-consent">
                  <input
                    id="privacy-consent"
                    type="checkbox"
                    className="privacy-checkbox-input"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  />
                  <span className="privacy-checkbox-box">
                    {privacyAccepted && <Check size={11} />}
                  </span>
                  <span className="privacy-checkbox-text">
                    I have read and accept the{' '}
                    <button
                      type="button"
                      className="inline-privacy-link"
                      onClick={() => {
                        if (onNavigate) onNavigate('privacy');
                        setIsOpen(false);
                      }}
                    >
                      Privacy Policy
                    </button>
                    , and I consent to my details being stored to personalise this conversation.
                  </span>
                </label>
              </div>

              <div className="step-actions">
                <button
                  type="button"
                  className="step-primary-btn"
                  disabled={!privacyAccepted}
                  onClick={handleContinueFromAboutYou}
                >
                  <span>{hasGolfTopics ? 'Continue to Golf Details' : 'Start My Conversation'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: TELL US ABOUT YOUR GOLF ── */}
          {!isLoadingProfile && step === 3 && (
            <div className="chatbot-step-container step-golf-profile">
              <div className="step-badge-row">
                <button
                  type="button"
                  className="step-back-btn"
                  onClick={() => setStep(2)}
                  aria-label="Back"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <span className="step-badge">Your Golf</span>
              </div>

              <h2 className="step-heading">Tell us about your golf</h2>
              <p className="step-prompt">Additional questions for technique or the mental game.</p>

              <div className="step-form-grid">
                <div className="form-field">
                  <label>Which way do you play golf?</label>
                  <div className="pill-choice-group">
                    {['Right-handed', 'Left-handed', 'Not sure'].map((hand) => (
                      <button
                        key={hand}
                        type="button"
                        className={`choice-pill ${profile.handedness === hand ? 'selected' : ''}`}
                        onClick={() => setProfile({ ...profile, handedness: hand })}
                      >
                        {hand}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-field">
                  <label>Your experience:</label>
                  <div className="pill-choice-group wrap">
                    {['New to golf', 'Beginner', 'Regular golfer', 'Experienced golfer', 'Golf coach'].map(
                      (exp) => (
                        <button
                          key={exp}
                          type="button"
                          className={`choice-pill ${profile.experience === exp ? 'selected' : ''}`}
                          onClick={() => setProfile({ ...profile, experience: exp })}
                        >
                          {exp}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="form-row-duo">
                  <div className="form-field">
                    <label htmlFor="years-played">How long have you played?</label>
                    <input
                      id="years-played"
                      type="text"
                      placeholder="E.g. 5 years"
                      value={profile.yearsPlayed}
                      onChange={(e) => setProfile({ ...profile, yearsPlayed: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="handicap">Handicap or usual score</label>
                    <input
                      id="handicap"
                      type="text"
                      placeholder="E.g. 15 / 88"
                      value={profile.handicap}
                      onChange={(e) => setProfile({ ...profile, handicap: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="main-challenge">Describe your main challenge:</label>
                  <input
                    id="main-challenge"
                    type="text"
                    placeholder="E.g. Inconsistent strike, mental fatigue on back nine"
                    value={profile.mainChallenge}
                    onChange={(e) => setProfile({ ...profile, mainChallenge: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>When does it happen most?</label>
                  <div className="pill-choice-group wrap">
                    {['During practice', 'On the course', 'In competitions', 'Throughout my game'].map(
                      (occ) => (
                        <button
                          key={occ}
                          type="button"
                          className={`choice-pill ${profile.occurrence === occ ? 'selected' : ''}`}
                          onClick={() => setProfile({ ...profile, occurrence: occ })}
                        >
                          {occ}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {selectedTopics.includes('technique') && (
                  <div className="conditional-group">
                    <div className="group-title">For Technical Questions:</div>
                    <div className="form-field">
                      <label htmlFor="club-difficulty">Which club or shot gives you difficulty?</label>
                      <input
                        id="club-difficulty"
                        type="text"
                        placeholder="E.g. Long irons, Driver"
                        value={profile.clubShotDifficulty}
                        onChange={(e) =>
                          setProfile({ ...profile, clubShotDifficulty: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="ball-flight">What does the ball usually do?</label>
                      <input
                        id="ball-flight"
                        type="text"
                        placeholder="E.g. Slices right, low push"
                        value={profile.ballFlight}
                        onChange={(e) => setProfile({ ...profile, ballFlight: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {selectedTopics.includes('mental') && (
                  <div className="conditional-group">
                    <div className="group-title">For Mental Game Questions:</div>
                    <div className="form-field">
                      <label htmlFor="mental-troubles">What thoughts or feelings trouble you most?</label>
                      <input
                        id="mental-troubles"
                        type="text"
                        placeholder="E.g. Fear of bad holes, overthinking swing mechanics"
                        value={profile.mentalTroubles}
                        onChange={(e) => setProfile({ ...profile, mentalTroubles: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="step-actions">
                <button type="button" className="step-primary-btn" onClick={handleContinueFromGolf}>
                  <span>Start My Conversation</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: ACTIVE CHAT ROOM ── */}
          {!isLoadingProfile && step === 4 && (
            <div className="chatbot-room-container">
              {/* Clean Topic Navigation Bar (All 5 Categories 100% Accessible) */}
              <div className="topic-nav-strip">
                <button
                  type="button"
                  className="topic-dropdown-trigger"
                  onClick={() => setIsTopicDrawerOpen(!isTopicDrawerOpen)}
                  aria-expanded={isTopicDrawerOpen}
                >
                  <div className="trigger-current">
                    <span className="trigger-name">{currentCategoryObj.name}</span>
                  </div>
                  <div className="trigger-action">
                    <span>{isTopicDrawerOpen ? 'Close Menu' : 'Browse All 5 Topics'}</span>
                    {isTopicDrawerOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </button>
              </div>

              {/* Expandable Menu Showing All 5 Topics & Their Curated Questions */}
              {isTopicDrawerOpen && (
                <div className="topics-overlay-panel">
                  <div className="topics-panel-header">
                    <div className="panel-heading">The 5 Chapters of Wisdom</div>
                    <button
                      type="button"
                      className="panel-close-btn"
                      onClick={() => setIsTopicDrawerOpen(false)}
                    >
                      <X size={15} />
                    </button>
                  </div>

                  <div className="topics-pill-tabs">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        className={`topic-tab-pill ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat.id)}
                      >
                        {cat.shortName}
                      </button>
                    ))}
                  </div>

                  <div className="topic-questions-list">
                    <div className="questions-section-title">{currentCategoryObj.name}</div>
                    {currentCategoryObj.qa.map((qObj) => (
                      <button
                        key={qObj.id}
                        type="button"
                        className="topic-question-row-btn"
                        onClick={() => handleAskCuratedQuestion(qObj)}
                      >
                        <span className="question-text">{qObj.q}</span>
                        <ArrowRight size={13} className="question-arrow" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Single Unified Chat Messages Stream (Zero Nested Scrollboxes!) */}
              <div className="chatbot-messages-body">
                {messages.map((msg) => (
                  <div key={msg.id} className={`chat-message-row ${msg.sender}`}>
                    {msg.sender === 'bot' && (
                      <div className="message-avatar">
                        <img src="/favicon.svg" alt="Golf Gita" />
                      </div>
                    )}

                    <div className="message-bubble-wrapper">
                      <div className="message-bubble">
                        {msg.category && <div className="message-category-tag">{msg.category}</div>}

                        <div className="message-text">
                          {msg.text.split('\n\n').map((para, i) => (
                            <p key={i}>{para}</p>
                          ))}
                        </div>

                        {/* If initial greeting or user asked for another topic: show clean 5 topic cards */}
                        {msg.showTopicSelector && (
                          <div className="chat-inline-topics-grid">
                            <div className="inline-grid-label">Choose a topic to explore:</div>
                            {categories.map((cat) => (
                              <button
                                key={cat.id}
                                type="button"
                                className="inline-topic-card"
                                onClick={() => {
                                  setActiveCategory(cat.id);
                                  setIsTopicDrawerOpen(true);
                                }}
                              >
                                <div className="inline-card-content">
                                  <div className="inline-card-title">{cat.name}</div>
                                  <div className="inline-card-count">6 Curated Questions</div>
                                </div>
                                <ArrowRight size={13} className="inline-card-arrow" />
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Optional Buy Link */}
                        {msg.action === 'buy_modal' && (
                          <div className="message-action-card">
                            <span className="action-card-text">Explore signed hardcover, paperback & Kindle editions:</span>
                            <button
                              type="button"
                              className="action-card-btn"
                              onClick={() => {
                                if (onBuyClick) onBuyClick();
                                setIsOpen(false);
                              }}
                            >
                              <span>Where to Buy</span>
                              <ExternalLink size={13} />
                            </button>
                          </div>
                        )}

                        {/* Interactive Suggested Topic Questions / Q&A Guidance */}
                        {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                          <div className="chat-suggested-questions-list">
                            <div className="suggested-list-label">
                              {msg.isRefusal
                                ? 'Explore Golf Gita Topics Instead:'
                                : 'Suggested Questions & Chapter Guidance:'}
                            </div>
                            <div className="suggested-buttons-wrapper">
                              {msg.suggestedQuestions.map((qItem, idx) => {
                                const qText = typeof qItem === 'string' ? qItem : qItem.q;
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    className="suggested-q-btn"
                                    onClick={() => handleAskCuratedQuestion(qText)}
                                  >
                                    <span className="suggested-q-text">{qText}</span>
                                    <ArrowRight size={13} className="suggested-q-arrow" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Feedback Section (Lines 206-208 of Draft) */}
                        {msg.showFeedback && (
                          <div className="message-feedback-section">
                            <div className="feedback-prompt">Did this answer your question?</div>
                            <div className="feedback-buttons-row">
                              <button
                                type="button"
                                className="feedback-btn feedback-yes"
                                onClick={() => handleFeedback('yes', msg.qPrompt)}
                              >
                                <Check size={12} /> Yes, thank you
                              </button>
                              <button
                                type="button"
                                className="feedback-btn feedback-another"
                                onClick={() => handleFeedback('another', msg.qPrompt)}
                              >
                                Ask another question
                              </button>
                              <button
                                type="button"
                                className="feedback-btn feedback-contact"
                                onClick={() => handleFeedback('contact', msg.qPrompt)}
                              >
                                Contact the Author
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Direct Contact Button (Lines 210-214 of Draft) */}
                        {msg.showDirectContactButton && (
                          <div className="direct-contact-action-box">
                            <button
                              type="button"
                              className="direct-contact-nazeer-btn"
                              onClick={() => openContactAuthorModal(msg.qPrompt)}
                            >
                              <Mail size={14} />
                              <span>Contact Nazeer</span>
                            </button>
                          </div>
                        )}

                        <span className="message-timestamp">{msg.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* AI Typing Indicator */}
                {isAiTyping && (
                  <div className="chat-message-row bot">
                    <div className="message-avatar">
                      <img src="/favicon.svg" alt="Golf Gita" />
                    </div>
                    <div className="message-bubble typing-bubble">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Bottom Input Area */}
              <form className="chatbot-input-bar" onSubmit={handleSendFreeText}>
                <input
                  type="text"
                  placeholder="Ask any question about the book, holes, or your swing..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isAiTyping}
                />
                <button
                  type="submit"
                  className="input-send-btn"
                  disabled={!inputValue.trim() || isAiTyping}
                  aria-label="Send"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          )}

          {/* ── CONSULT WITH NAZEER TAJUDEEN MODAL ── */}
          {contactAuthorModal.isOpen && (
            <div className="author-inquiry-modal-overlay">
              <div className="author-inquiry-modal">
                <div className="inquiry-modal-header">
                  <div className="modal-title-row">
                    <Mail size={16} className="gold-icon" />
                    <h3>Contact Nazeer Tajudeen</h3>
                  </div>
                  <button
                    type="button"
                    className="modal-close-btn"
                    onClick={() => setContactAuthorModal({ ...contactAuthorModal, isOpen: false })}
                  >
                    <X size={15} />
                  </button>
                </div>

                {!contactAuthorModal.isSent ? (
                  <form className="inquiry-modal-form" onSubmit={handleSendAuthorInquiry}>
                    <p className="inquiry-modal-intro">
                      Share your question and relevant background so Nazeer can better understand what you need.
                    </p>

                    <div className="inquiry-summary-tags">
                      <span className="summary-tag">👤 {profile.name || 'Seeker'}</span>
                      <span className="summary-tag">🏌️ {profile.handedness}</span>
                      <span className="summary-tag">⭐ {profile.experience}</span>
                      {profile.handicap && <span className="summary-tag">⛳ Hcp {profile.handicap}</span>}
                    </div>

                    <div className="form-field">
                      <label htmlFor="inquiry-subject">Subject</label>
                      <input
                        id="inquiry-subject"
                        type="text"
                        value={contactAuthorModal.subject}
                        onChange={(e) =>
                          setContactAuthorModal({ ...contactAuthorModal, subject: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="inquiry-message">Your specific question or concern:</label>
                      <textarea
                        id="inquiry-message"
                        rows={3}
                        placeholder="Mention the shot involved, what the ball does, and when the problem occurs..."
                        value={contactAuthorModal.customNote}
                        onChange={(e) =>
                          setContactAuthorModal({ ...contactAuthorModal, customNote: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="modal-actions">
                      <button
                        type="button"
                        className="modal-cancel-btn"
                        onClick={() => setContactAuthorModal({ ...contactAuthorModal, isOpen: false })}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="modal-submit-btn">
                        <span>Send to Nazeer</span>
                        <Send size={13} />
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="inquiry-success-view">
                    <div className="success-badge">✓</div>
                    <h4>Enquiry Received</h4>
                    <p>
                      Thank you, {profile.name || 'Friend'}. Nazeer Tajudeen will review your background and respond promptly.
                    </p>
                    <button
                      type="button"
                      className="modal-close-action-btn"
                      onClick={() => setContactAuthorModal({ ...contactAuthorModal, isOpen: false })}
                    >
                      Return to Conversation
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
export default ChatBot;
