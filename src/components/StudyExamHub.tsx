import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  BookOpen, 
  Award, 
  TrendingUp, 
  HelpCircle, 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Plus, 
  BarChart2, 
  Zap, 
  BrainCircuit, 
  AlertTriangle,
  RotateCcw,
  MessageSquareText,
  Play,
  Square,
  Bot,
  User,
  GraduationCap,
  UserCheck,
  Copy,
  Check,
  RefreshCw,
  Download
} from 'lucide-react';
import { ScoreRecord, PracticeQuestionItem, ExamTipsResult, ChatMessage, UserPreferences, ChatCharacterChoice } from '../types';

interface StudyExamHubProps {
  onEarnXp?: (xp: number) => void;
  prefs?: UserPreferences;
  onOpenDesigner?: () => void;
  onOpenLanding?: () => void;
}

const characterDetails: Record<ChatCharacterChoice, { name: string; avatar: string; title: string; desc: string; badgeClass: string; bgGradient: string }> = {
  rainbow: {
    name: 'Rainbow AI Tutor',
    avatar: '🌈',
    title: 'Encouraging & Step-by-Step',
    desc: 'Warm analogies & clear structured study guidance',
    badgeClass: 'bg-indigo-950 text-amber-300 border-indigo-800/80',
    bgGradient: 'from-cyan-400 via-indigo-600 to-purple-600',
  },
  socrates: {
    name: 'Socrates Professor',
    avatar: '🏛️',
    title: 'Socratic Method & Guided Inquiry',
    desc: 'Asks targeted questions so you deduce solutions logically',
    badgeClass: 'bg-amber-950 text-amber-300 border-amber-800/80',
    bgGradient: 'from-amber-500 via-purple-600 to-indigo-700',
  },
  buddy: {
    name: 'Friendly Study Buddy',
    avatar: '⚡',
    title: 'Upbeat & Bite-Sized',
    desc: 'Energetic peer explanation with quick study shortcuts',
    badgeClass: 'bg-emerald-950 text-emerald-300 border-emerald-800/80',
    bgGradient: 'from-emerald-400 via-teal-600 to-indigo-600',
  },
  coach: {
    name: 'Strict Exam Coach',
    avatar: '🎯',
    title: 'High-Yield Mark Schemes',
    desc: 'Direct exam board rules, traps & time management',
    badgeClass: 'bg-rose-950 text-rose-300 border-rose-800/80',
    bgGradient: 'from-rose-500 via-red-600 to-indigo-700',
  },
  einstein: {
    name: 'Einstein Science Guru',
    avatar: '🧠',
    title: 'Deep Conceptual Models',
    desc: 'Formulas, physical laws & mental model breakdowns',
    badgeClass: 'bg-cyan-950 text-cyan-300 border-cyan-800/80',
    bgGradient: 'from-cyan-400 via-blue-600 to-indigo-700',
  },
  storyteller: {
    name: 'Memory Storyteller',
    avatar: '🎨',
    title: 'Visual Metaphors & Stories',
    desc: 'Unforgettable memory palaces & narrative mnemonics',
    badgeClass: 'bg-purple-950 text-purple-300 border-purple-800/80',
    bgGradient: 'from-purple-500 via-fuchsia-600 to-indigo-700',
  },
  questmaster: {
    name: 'RPG Quest Master',
    avatar: '🎮',
    title: 'Boss Battles & Level-Up',
    desc: 'Gamer energy, XP leveling & boss battle mindsets',
    badgeClass: 'bg-amber-950 text-amber-400 border-amber-800/80',
    bgGradient: 'from-amber-400 via-orange-600 to-purple-600',
  },
  calming: {
    name: 'Mindful Calming Mentor',
    avatar: '🧘',
    title: 'Anti-Anxiety & Calm Pace',
    desc: 'Stress-free, soothing guidance to build confidence',
    badgeClass: 'bg-teal-950 text-teal-300 border-teal-800/80',
    bgGradient: 'from-teal-400 via-emerald-600 to-indigo-600',
  },
  detective: {
    name: 'Logic Detective',
    avatar: '🕵️',
    title: 'Forensic Evidence & Clues',
    desc: 'Analytical deduction, evidence gathering & case solving',
    badgeClass: 'bg-slate-900 text-slate-200 border-slate-700',
    bgGradient: 'from-slate-500 via-gray-700 to-indigo-900',
  },
  timetraveler: {
    name: 'Historical Time Traveler',
    avatar: '📜',
    title: 'Eyewitness Epoch Accounts',
    desc: 'Firsthand eyewitness storytelling for history & science',
    badgeClass: 'bg-yellow-950 text-yellow-300 border-yellow-800/80',
    bgGradient: 'from-amber-400 via-yellow-600 to-indigo-700',
  },
  cybercoder: {
    name: 'Tech Cyber-Coder',
    avatar: '🤖',
    title: 'Algorithmic Logic & Debugs',
    desc: 'Crisp syntax rules, pseudocode & debug traps',
    badgeClass: 'bg-cyan-950 text-cyan-300 border-cyan-800/80',
    bgGradient: 'from-cyan-500 via-teal-600 to-indigo-700',
  },
  wiseowl: {
    name: 'Wise Owl Academy Dean',
    avatar: '🦉',
    title: 'Scholarly Depth & Essays',
    desc: 'Rigorous essay outlines, citations & academic depth',
    badgeClass: 'bg-indigo-950 text-indigo-200 border-indigo-800/80',
    bgGradient: 'from-indigo-400 via-purple-600 to-blue-800',
  },
};

const quickSubjects = [
  { name: 'Mathematics', topic: 'Calculus & Integration', icon: '📐' },
  { name: 'Physics', topic: 'Quantum Physics & Forces', icon: '⚛️' },
  { name: 'Chemistry', topic: 'Organic Chemistry & Bonding', icon: '🧪' },
  { name: 'Biology', topic: 'Cell Genetics & Enzymes', icon: '🧬' },
  { name: 'Computer Science', topic: 'Data Structures & Algorithms', icon: '💻' },
  { name: 'Literature', topic: 'Shakespearean Drama & Analysis', icon: '📚' },
  { name: 'History', topic: '20th Century World Conflicts', icon: '📜' },
  { name: 'Economics', topic: 'Macroeconomics & Inflation', icon: '📈' },
];

export const StudyExamHub: React.FC<StudyExamHubProps> = ({ onEarnXp, prefs, onOpenDesigner, onOpenLanding }) => {
  // Font Family Class
  const fontClass = prefs?.fontFamily === 'serif' 
    ? 'font-serif' 
    : prefs?.fontFamily === 'mono' 
    ? 'font-mono' 
    : prefs?.fontFamily === 'dyslexic' 
    ? 'font-sans tracking-wide leading-relaxed font-semibold' 
    : prefs?.fontFamily === 'display'
    ? 'font-sans tracking-tight font-extrabold'
    : prefs?.fontFamily === 'rounded'
    ? 'font-sans font-medium'
    : prefs?.fontFamily === 'handwriting'
    ? 'font-serif italic'
    : prefs?.fontFamily === 'modern'
    ? 'font-sans uppercase tracking-wider font-semibold'
    : 'font-sans';

  const userName = prefs?.userName || 'Learner';
  const isTeacher = prefs?.userRole === 'teacher';
  const activeCharKey: ChatCharacterChoice = prefs?.chatCharacter || 'rainbow';
  const activeChar = characterDetails[activeCharKey] || characterDetails.rainbow;
  // 1. Input Form States
  const [subject, setSubject] = useState<string>('Mathematics');
  const [topic, setTopic] = useState<string>('Calculus & Derivatives');
  const [testScore, setTestScore] = useState<string>('85');
  const [examScore, setExamScore] = useState<string>('92');
  const [maxScore, setMaxScore] = useState<string>('100');
  const [scoreNotes, setScoreNotes] = useState<string>('');

  // 2. Saved Score History
  const [scoreHistory, setScoreHistory] = useState<ScoreRecord[]>(() => {
    try {
      const saved = localStorage.getItem('edupath_score_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading score history:', e);
    }
    return [];
  });

  // Sync Score History
  useEffect(() => {
    localStorage.setItem('edupath_score_history', JSON.stringify(scoreHistory));
  }, [scoreHistory]);

  // 3. Practice Questions State
  const [practiceQuestions, setPracticeQuestions] = useState<PracticeQuestionItem[]>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [practiceError, setPracticeError] = useState<string>('');

  // 4. Exam Tips State
  const [examTips, setExamTips] = useState<ExamTipsResult | null>(null);
  const [isGeneratingTips, setIsGeneratingTips] = useState(false);
  const [tipsError, setTipsError] = useState<string>('');

  // 5. Chat & Speech State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'm1',
      role: 'assistant',
      text: `Hello ${userName}! ${activeChar.avatar} I'm your ${activeChar.name}. Ask me any question about your subjects, topics, or exam preparation! You can type or use the speech mic button to speak into audio.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [currentlyPlayingMsgId, setCurrentlyPlayingMsgId] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [clearModalType, setClearModalType] = useState<'score' | 'all' | 'chat' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const handleCopyMessage = (text: string, msgId: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedMsgId(msgId);
      setTimeout(() => setCopiedMsgId(null), 2000);
    } catch (e) {
      console.error('Failed to copy text:', e);
    }
  };

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isSendingMessage]);

  // Handle Log Score Record
  const handleSaveScoreRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim()) return;

    const newRecord: ScoreRecord = {
      id: `score-${Date.now()}`,
      subject: subject.trim(),
      topic: topic.trim(),
      testScore: Number(testScore) || 0,
      examScore: Number(examScore) || 0,
      maxScore: Number(maxScore) || 100,
      notes: scoreNotes.trim(),
      date: new Date().toISOString().split('T')[0],
    };

    setScoreHistory((prev) => [newRecord, ...prev]);
    setScoreNotes('');
    if (onEarnXp) onEarnXp(20);
  };

  const handleDeleteScoreRecord = (id: string) => {
    setScoreHistory((prev) => prev.filter((s) => s.id !== id));
  };

  const handleClearScoreHistory = () => {
    setClearModalType('score');
  };

  const handleClearChatHistory = () => {
    setClearModalType('chat');
  };

  const handleWipeAllHubHistory = () => {
    setClearModalType('all');
  };

  const executeClearAction = () => {
    if (clearModalType === 'score') {
      setScoreHistory([]);
      try {
        localStorage.removeItem('edupath_score_history');
        localStorage.setItem('edupath_score_history', JSON.stringify([]));
      } catch (e) {
        console.error(e);
      }
      setToastMessage('Score history log has been cleared successfully.');
    } else if (clearModalType === 'all') {
      setScoreHistory([]);
      try {
        localStorage.removeItem('edupath_score_history');
        localStorage.setItem('edupath_score_history', JSON.stringify([]));
      } catch (e) {
        console.error(e);
      }
      setPracticeQuestions([]);
      setUserAnswers({});
      setExamTips(null);
      setChatMessages([
        {
          id: `m-${Date.now()}`,
          role: 'assistant',
          text: `All history logs, score records, and practice data have been wiped out, ${userName}! 🌈 Ready for a fresh start.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setToastMessage('All history records and study logs wiped out.');
    } else if (clearModalType === 'chat') {
      setChatMessages([
        {
          id: `m-${Date.now()}`,
          role: 'assistant',
          text: `Chat history cleared. ${activeChar.avatar} ${activeChar.name} is ready to assist you!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setToastMessage('Chat conversation history cleared.');
    }

    setClearModalType(null);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Calculate Average Performance
  const calculateStats = () => {
    if (scoreHistory.length === 0) return { avgPercentage: 0, gradeTier: 'N/A', totalTests: 0 };
    let sumPct = 0;
    scoreHistory.forEach((s) => {
      const combined = ((s.testScore + s.examScore) / 2) / (s.maxScore || 100);
      sumPct += combined * 100;
    });
    const avg = Math.round(sumPct / scoreHistory.length);
    let grade = 'A+ (Distinction)';
    if (avg < 60) grade = 'C (Needs Revision)';
    else if (avg < 75) grade = 'B (Good Standard)';
    else if (avg < 88) grade = 'A (Merit)';

    return { avgPercentage: avg, gradeTier: grade, totalTests: scoreHistory.length };
  };

  const stats = calculateStats();

  // Export Score Report to Clipboard & Summary
  const handleExportScoreReport = () => {
    if (scoreHistory.length === 0) {
      setToastMessage('No score records available to export.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const lines = [
      `========================================`,
      `🎓 RAINBOW STUDY AI - PERFORMANCE REPORT`,
      `User: ${userName} (${isTeacher ? 'Teacher / Educator' : 'Student'})`,
      `Date: ${new Date().toLocaleDateString()}`,
      `Overall Average: ${stats.avgPercentage}% (${stats.gradeTier})`,
      `Total Logged Tests: ${stats.totalTests}`,
      `========================================\n`,
      `SCORE HISTORY BREAKDOWN:`,
    ];

    scoreHistory.forEach((rec, idx) => {
      const combined = Math.round((((rec.testScore + rec.examScore) / 2) / (rec.maxScore || 100)) * 100);
      lines.push(`${idx + 1}. [${rec.date}] ${rec.subject} - ${rec.topic}`);
      lines.push(`   Test: ${rec.testScore} | Exam: ${rec.examScore} / Max: ${rec.maxScore} (${combined}%)`);
      lines.push(`   Target Exam Date: ${rec.examDate}`);
      if (rec.notes) lines.push(`   Notes: "${rec.notes}"`);
      lines.push('');
    });

    const reportText = lines.join('\n');
    navigator.clipboard.writeText(reportText);
    setToastMessage('📋 Performance Report copied to clipboard!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Generate Practice Questions
  const handleGenerateQuestions = async () => {
    if (!subject.trim() || !topic.trim()) return;
    setIsGeneratingQuestions(true);
    setPracticeError('');
    setUserAnswers({});

    try {
      const res = await fetch('/api/exam/practice-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, topic, difficulty: 'medium', count: 4 }),
      });
      const data = await res.json();
      if (data.success && data.data?.questions) {
        setPracticeQuestions(data.data.questions);
        if (onEarnXp) onEarnXp(15);
      } else {
        setPracticeError(data.error || 'Failed to generate practice questions');
      }
    } catch (err: any) {
      console.error(err);
      setPracticeError('Network error generating practice questions.');
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Select option in practice quiz
  const handleSelectOption = (questionId: string, optionId: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  // Generate Exam Tips
  const handleGenerateExamTips = async () => {
    if (!subject.trim() || !topic.trim()) return;
    setIsGeneratingTips(true);
    setTipsError('');

    try {
      const res = await fetch('/api/exam/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, topic, testScore, examScore }),
      });
      const data = await res.json();
      if (data.success && data.tips) {
        setExamTips(data.tips);
        if (onEarnXp) onEarnXp(15);
      } else {
        setTipsError(data.error || 'Failed to generate exam tips');
      }
    } catch (err: any) {
      console.error(err);
      setTipsError('Network error fetching exam strategy.');
    } finally {
      setIsGeneratingTips(false);
    }
  };

  // Chat Submission
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isSendingMessage) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsSendingMessage(true);

    try {
      const res = await fetch('/api/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          subject,
          topic,
          chatCharacter: activeCharKey,
          conversationHistory: chatMessages.slice(-6),
        }),
      });
      const data = await res.json();
      const replyText = data.reply || "I'm having trouble retrieving an answer right now. Please try asking again!";

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, assistantMsg]);

      // Auto-speak response audio message
      speakTextResponse(replyText, assistantMsg.id);

    } catch (err: any) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: 'Sorry, I ran into a connection error while thinking of an answer.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Speech Recognition (Speech to Text)
  const toggleListening = () => {
    setSpeechError('');
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Speech recognition is not supported in this browser. You can type your message!');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputMessage(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setSpeechError(`Speech recognition error: ${event.error}`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      console.error(e);
      setIsListening(false);
      setSpeechError('Could not start speech microphone.');
    }
  };

  // Audio Playback / Text to Speech (Speech Audio Message)
  const speakTextResponse = async (text: string, msgId: string) => {
    // If currently playing this message, stop
    if (currentlyPlayingMsgId === msgId) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setCurrentlyPlayingMsgId(null);
      return;
    }

    setCurrentlyPlayingMsgId(msgId);

    // Try Gemini Server TTS API first
    try {
      const res = await fetch('/api/chat/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'Kore' }),
      });
      const data = await res.json();

      if (data.success && data.audioBase64) {
        // Convert PCM or base64 audio to play in browser
        const audioSrc = `data:${data.mimeType || 'audio/pcm;rate=24000'};base64,${data.audioBase64}`;
        const audio = new Audio(audioSrc);
        audio.onended = () => setCurrentlyPlayingMsgId(null);
        audio.onerror = () => fallbackWebSpeech(text, msgId);
        audio.play().catch(() => fallbackWebSpeech(text, msgId));
        return;
      }
    } catch (e) {
      console.log('Gemini TTS fallback to Web Speech Synthesis:', e);
    }

    // Fallback to Web Speech Synthesis
    fallbackWebSpeech(text, msgId);
  };

  const fallbackWebSpeech = (text: string, msgId: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*#_~`]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setCurrentlyPlayingMsgId(null);
      utterance.onerror = () => setCurrentlyPlayingMsgId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setCurrentlyPlayingMsgId(null);
    }
  };

  return (
    <div className={`space-y-8 pb-16 ${fontClass}`}>
      
      {/* Rainbow Top Decorative Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900/85 border border-indigo-900/50 shadow-xl backdrop-blur-md">
        <div className="h-2.5 w-full bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-cyan-400 via-indigo-500 to-purple-500 animate-pulse" />
        
        <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-indigo-950/60 via-slate-900/90 to-purple-950/40">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-red-500 via-emerald-500 to-indigo-600 text-white shadow-sm">
                🌈 Rainbow Academic Suite
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-950/80 text-indigo-200 border border-indigo-800/80">
                {isTeacher ? '👩‍🏫 Educator Suite' : '🎓 Student Exam Suite'}
              </span>
            </div>
            
            {/* Hello Greeting */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 flex-wrap">
              <span>Hello, <span className="text-amber-300 cursor-pointer underline decoration-indigo-400 underline-offset-4" onClick={onOpenLanding}>{userName}</span>! 👋</span>
              <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
            </h1>
            
            <p className="text-xs sm:text-sm text-indigo-200/80 max-w-2xl leading-relaxed">
              {isTeacher
                ? 'Welcome to your educator studio! Design practice questions, analyze exam performance targets, and guide your students with voice tutoring.'
                : 'Log your test & exam scores, generate targeted subject practice questions, receive custom exam strategies, and ask AI voice tutor under starry skies!'}
            </p>
          </div>

          {/* Overall Grade Badge & Clear Master Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="p-4 bg-slate-950/80 border border-indigo-500/40 rounded-2xl shadow-lg flex items-center gap-4 shrink-0 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 via-amber-400 via-emerald-400 to-indigo-500 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                {stats.avgPercentage}%
              </div>
              <div>
                <div className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider">Overall Performance</div>
                <div className="text-sm font-extrabold text-white">{stats.gradeTier}</div>
                <div className="text-[11px] text-emerald-400 font-bold mt-0.5">{stats.totalTests} Logged Records</div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleWipeAllHubHistory}
              className="p-3.5 bg-rose-950/90 hover:bg-rose-900 border border-rose-800 text-rose-200 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Wipe out all history entirely (Scores, Practice, Tips & Chat)"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span className="text-[11px]">Wipe All History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Left Column (Score Input & Records) / Right Column (Practice, Tips & Voice Chat) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Subject, Topic & Scores Input Form + History */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Input Form Card */}
          <div className="bg-slate-900/85 border border-indigo-900/50 rounded-2xl p-6 shadow-xl space-y-5 relative overflow-hidden backdrop-blur-md">
            <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-amber-400 via-emerald-400 to-indigo-600 absolute top-0 left-0" />
            
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800/80 text-indigo-300 flex items-center justify-center font-bold">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Score Tracker & Target Setup</h2>
                <p className="text-xs text-indigo-200/70">Enter your subject, topic, and test scores</p>
              </div>
            </div>

            <form onSubmit={handleSaveScoreRecord} className="space-y-4 pt-1">
              {/* Subject Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1">
                    <span>Subject Name</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] text-indigo-300/80 font-semibold">1-Click Quick Picks</span>
                </div>

                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Mathematics, Physics, Chemistry, History..."
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-indigo-900/60 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-indigo-400 transition-all placeholder:text-slate-500"
                />

                {/* Quick Subject Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
                  {quickSubjects.map((s, idx) => {
                    const isSelected = subject.toLowerCase() === s.name.toLowerCase();
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSubject(s.name);
                          setTopic(s.topic);
                        }}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-amber-950/90 border-amber-400 text-amber-300 shadow-xs'
                            : 'bg-slate-950/60 border-indigo-900/60 text-indigo-200/80 hover:border-indigo-700 hover:text-white'
                        }`}
                      >
                        <span>{s.icon}</span>
                        <span>{s.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Topic Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1">
                  <span>Topic / Unit Title</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Calculus Derivatives, Quantum Mechanics, DNA Replication..."
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-indigo-900/60 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-indigo-400 transition-all placeholder:text-slate-500"
                />
              </div>

              {/* Score Inputs Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-indigo-200/80 uppercase tracking-wider">Test Score</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={testScore}
                    onChange={(e) => setTestScore(e.target.value)}
                    placeholder="85"
                    className="w-full px-3 py-2 bg-slate-950/80 border border-indigo-900/60 rounded-lg text-white text-xs font-bold focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-indigo-200/80 uppercase tracking-wider">Exam Score</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={examScore}
                    onChange={(e) => setExamScore(e.target.value)}
                    placeholder="92"
                    className="w-full px-3 py-2 bg-slate-950/80 border border-indigo-900/60 rounded-lg text-white text-xs font-bold focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-indigo-200/80 uppercase tracking-wider">Max Possible</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={maxScore}
                    onChange={(e) => setMaxScore(e.target.value)}
                    placeholder="100"
                    className="w-full px-3 py-2 bg-slate-950/80 border border-indigo-900/60 rounded-lg text-white text-xs font-bold focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              {/* Score Notes */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-indigo-200/80 uppercase tracking-wider">Notes / Goal Focus (Optional)</label>
                <input
                  type="text"
                  value={scoreNotes}
                  onChange={(e) => setScoreNotes(e.target.value)}
                  placeholder="e.g. Scored 85% on practice test, aiming for 95% on final exam..."
                  className="w-full px-3.5 py-2 bg-slate-950/80 border border-indigo-900/60 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400 placeholder:text-slate-500"
                />
              </div>

              {/* Action Buttons Row */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Score Record (+20 XP)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateQuestions}
                    disabled={isGeneratingQuestions}
                    className="py-2 px-3 bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-200 border border-indigo-800/80 font-bold text-[11px] rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{isGeneratingQuestions ? 'Generating...' : 'Practice Questions'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateExamTips}
                    disabled={isGeneratingTips}
                    className="py-2 px-3 bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 border border-amber-800/80 font-bold text-[11px] rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isGeneratingTips ? 'Analyzing...' : 'Get Exam Tips'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Logged Score History Card */}
          <div className="bg-slate-900/85 border border-indigo-900/50 rounded-2xl p-5 shadow-xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-indigo-900/40 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Score History Log ({scoreHistory.length})</span>
              </h3>

              {scoreHistory.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleExportScoreReport}
                    className="px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/80 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                    title="Export score summary report to clipboard"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Export Report</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearScoreHistory}
                    className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 text-rose-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                    title="Erase all score history"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Clear</span>
                  </button>
                </div>
              )}
            </div>

            {scoreHistory.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                No score records logged yet. Enter your scores above!
              </div>
            ) : (
              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {scoreHistory.map((s) => {
                  const avg = Math.round(((s.testScore + s.examScore) / 2) / (s.maxScore || 100) * 100);
                  return (
                    <div key={s.id} className="p-3.5 bg-slate-950/80 border border-indigo-900/40 rounded-xl space-y-1.5 relative group hover:border-indigo-500 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">{s.subject}</span>
                          <h4 className="text-xs font-bold text-white">{s.topic}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold">
                            {avg}%
                          </span>
                          <button
                            onClick={() => handleDeleteScoreRecord(s.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                            title="Delete score record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-indigo-200/80 font-medium">
                        <span>Test: <strong className="text-white">{s.testScore}</strong>/{s.maxScore}</span>
                        <span>Exam: <strong className="text-white">{s.examScore}</strong>/{s.maxScore}</span>
                        <span className="text-indigo-300/60 text-[10px] ml-auto">{s.date}</span>
                      </div>

                      {s.notes && (
                        <p className="text-[11px] text-indigo-200/70 italic bg-slate-900 p-2 rounded-lg border border-indigo-900/30 mt-1">
                          "{s.notes}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Practice Questions, Exam Tips & Voice Tutor Chat */}
        <div className="lg:col-span-7 space-y-6">

          {/* SECTION A: Practice Questions Display (If Generated) */}
          {practiceQuestions.length > 0 && (
            <div className="bg-slate-900/85 border border-indigo-900/50 rounded-2xl p-6 shadow-xl space-y-5 relative overflow-hidden backdrop-blur-md">
              <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-600 absolute top-0 left-0" />
              
              <div className="flex items-center justify-between border-b border-indigo-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-base font-bold text-white">
                    Targeted Practice Questions: <span className="text-indigo-300">{subject}</span> ({topic})
                  </h2>
                </div>
                <button
                  onClick={() => setPracticeQuestions([])}
                  className="text-xs text-indigo-300/70 hover:text-white cursor-pointer"
                >
                  Close
                </button>
              </div>

              {practiceError && (
                <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-xs text-rose-200">
                  {practiceError}
                </div>
              )}

              <div className="space-y-6">
                {practiceQuestions.map((q, idx) => {
                  const selectedOpt = userAnswers[q.id];
                  const isAnswered = Boolean(selectedOpt);
                  const isCorrect = selectedOpt === q.correctOptionId;

                  return (
                    <div key={q.id || idx} className="p-4 bg-slate-950/80 border border-indigo-900/40 rounded-xl space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                          Question {idx + 1}
                        </span>
                        {isAnswered && (
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                            isCorrect ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}>
                            {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            <span>{isCorrect ? 'Correct!' : 'Incorrect'}</span>
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-semibold text-white">{q.question}</p>

                      {/* Option Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt) => {
                          const isSelected = selectedOpt === opt.id;
                          const isCorrectOption = opt.id === q.correctOptionId;

                          let btnStyle = 'bg-slate-900 border-indigo-900/50 text-slate-200 hover:bg-indigo-950';
                          if (isAnswered) {
                            if (isCorrectOption) btnStyle = 'bg-emerald-950 border-emerald-600 text-emerald-200 font-bold';
                            else if (isSelected && !isCorrect) btnStyle = 'bg-rose-950 border-rose-600 text-rose-200';
                          }

                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleSelectOption(q.id, opt.id)}
                              className={`p-2.5 text-left text-xs rounded-xl border transition-all flex items-start gap-2 cursor-pointer ${btnStyle}`}
                            >
                              <span className="font-bold shrink-0">{opt.id}.</span>
                              <span>{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation & ProTip */}
                      {isAnswered && (
                        <div className="pt-2 space-y-2 border-t border-indigo-900/40">
                          <p className="text-xs text-indigo-100 leading-relaxed">
                            <strong className="text-indigo-400">Explanation: </strong>
                            {q.explanation}
                          </p>
                          {q.proTip && (
                            <div className="p-2.5 bg-amber-950/60 border border-amber-800/80 rounded-lg text-xs text-amber-200 font-medium flex items-start gap-1.5">
                              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                              <span><strong>Exam Pro-Tip:</strong> {q.proTip}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION B: Exam Tips & Strategy Display (If Generated) */}
          {examTips && (
            <div className="bg-slate-900/85 border border-amber-900/50 rounded-2xl p-6 shadow-xl space-y-5 relative overflow-hidden backdrop-blur-md">
              <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-rose-400 to-purple-500 absolute top-0 left-0" />
              
              <div className="flex items-center justify-between border-b border-indigo-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  <h2 className="text-base font-bold text-white">
                    Tailored Exam Strategy & Tips: <span className="text-amber-300">{subject}</span>
                  </h2>
                </div>
                <button
                  onClick={() => setExamTips(null)}
                  className="text-xs text-indigo-300/70 hover:text-white cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* Diagnosis Summary */}
              <div className="p-3.5 bg-amber-950/60 border border-amber-800/80 rounded-xl text-xs text-amber-200 font-medium leading-relaxed">
                🎯 <strong>Performance Diagnosis:</strong> {examTips.performanceSummary}
              </div>

              {/* Hacks & Pitfalls Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hacks */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>High-Yield Exam Hacks</span>
                  </h4>
                  <div className="space-y-2">
                    {examTips.examHacks?.map((hack, i) => (
                      <div key={i} className="p-3 bg-slate-950/80 border border-indigo-900/40 rounded-xl text-xs">
                        <div className="font-bold text-white">{hack.title}</div>
                        <div className="text-indigo-200/80 text-[11px] mt-0.5">{hack.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Pitfalls */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Pitfalls to Avoid</span>
                  </h4>
                  <div className="space-y-2">
                    {examTips.commonPitfalls?.map((pit, i) => (
                      <div key={i} className="p-3 bg-rose-950/50 border border-rose-900/60 rounded-xl text-xs">
                        <div className="font-bold text-rose-200">⚠️ {pit.pitfall}</div>
                        <div className="text-slate-200 text-[11px] mt-0.5">✅ Fix: {pit.solution}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mnemonics & Checklist */}
              <div className="p-4 bg-purple-950/50 border border-purple-800/60 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-purple-200 uppercase tracking-wider">
                  🧠 Memory Mnemonics & Formula Visual Hooks
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {examTips.mnemonics?.map((m, i) => (
                    <div key={i} className="p-2.5 bg-slate-950 border border-purple-800/50 rounded-lg text-xs">
                      <span className="font-extrabold text-purple-300">{m.mnemonic}:</span>{' '}
                      <span className="text-slate-200">{m.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION C: AI Tutor Voice & Audio Chat */}
          <div className="bg-slate-900/85 border border-indigo-900/50 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[560px] relative backdrop-blur-md">
            <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-cyan-400 via-indigo-500 to-purple-500" />

            {/* Chat Header */}
            <div className="p-4 bg-slate-950/80 border-b border-indigo-900/40 flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                {/* AI Tutor Avatar in Header */}
                <div className={`w-9 h-9 rounded-2xl bg-gradient-to-tr ${activeChar.bgGradient} text-white flex items-center justify-center font-bold text-lg shadow-lg ring-2 ring-cyan-500/40`}>
                  <span>{activeChar.avatar}</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5 flex-wrap">
                    <span>{activeChar.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${activeChar.badgeClass}`}>
                      {activeChar.title}
                    </span>
                  </h3>
                  <p className="text-[11px] text-indigo-200/70">
                    Chatting with <strong className="text-amber-300">{userName}</strong> ({isTeacher ? 'Teacher' : 'Student'})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenDesigner}
                  className="px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/80 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs hover:scale-105 active:scale-95"
                  title="Switch AI Tutor Persona or theme"
                >
                  <Bot className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Change Persona</span>
                </button>

                {currentlyPlayingMsgId && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-300 text-xs font-bold animate-pulse">
                    <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="hidden sm:inline">Playing Voice...</span>
                  </div>
                )}

                {chatMessages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearChatHistory}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-rose-950/80 text-slate-300 hover:text-rose-200 border border-indigo-900/60 hover:border-rose-800 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    title="Clear chat history"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                    <span className="hidden sm:inline">Clear Chat</span>
                  </button>
                )}
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
              {chatMessages.map((msg) => {
                const isUser = msg.role === 'user';
                const isPlaying = currentlyPlayingMsgId === msg.id;
                const isCopied = copiedMsgId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* AVATAR ICON MODULE */}
                    {isUser ? (
                      /* User Module Icon Avatar */
                      <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shrink-0 ring-2 ring-amber-400/40" title={`${userName} (${isTeacher ? 'Teacher' : 'Student'})`}>
                        {isTeacher ? <UserCheck className="w-4 h-4 text-white" /> : <GraduationCap className="w-4 h-4 text-white" />}
                      </div>
                    ) : (
                      /* AI Module Icon Avatar */
                      <div className={`w-8 h-8 rounded-2xl bg-gradient-to-tr ${activeChar.bgGradient} text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0 ring-2 ring-cyan-400/40`} title={activeChar.name}>
                        <span>{activeChar.avatar}</span>
                      </div>
                    )}

                    {/* MESSAGE CONTAINER */}
                    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[82%] space-y-1`}>
                      
                      {/* Name & Timestamp Header */}
                      <div className="flex items-center gap-1.5 text-[10px] text-indigo-300/70 px-1 font-semibold">
                        {isUser ? (
                          <>
                            <span className="text-amber-300 font-bold">{userName}</span>
                            <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-950 border border-indigo-800 text-indigo-200">
                              {isTeacher ? 'Teacher' : 'Student'}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-cyan-300 font-bold flex items-center gap-1">
                              <span>{activeChar.name}</span>
                              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                            </span>
                          </>
                        )}
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      {/* Bubble Box */}
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 shadow-md relative group ${
                          isUser
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-xs font-medium'
                            : 'bg-slate-900 border border-indigo-900/60 text-slate-100 rounded-tl-xs'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>

                        {/* Action Toolbar (Copy & Voice Playback) */}
                        <div className="pt-2 border-t border-indigo-900/40 flex items-center justify-between gap-2">
                          {/* Copy Button */}
                          <button
                            type="button"
                            onClick={() => handleCopyMessage(msg.text, msg.id)}
                            className="p-1 px-2 rounded-md bg-slate-950/80 hover:bg-slate-800 text-indigo-200/80 hover:text-white text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                            title="Copy message text"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          {/* Voice Audio Message Playback Button for AI Messages */}
                          {!isUser && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => speakTextResponse(msg.text, msg.id)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                  isPlaying
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800'
                                }`}
                              >
                                {isPlaying ? (
                                  <>
                                    <Square className="w-3 h-3 fill-current" />
                                    <span>Stop Audio</span>
                                  </>
                                ) : (
                                  <>
                                    <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                                    <span>Listen Audio</span>
                                  </>
                                )}
                              </button>

                              {isPlaying && (
                                <div className="flex items-center gap-0.5">
                                  <span className="w-1 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                  <span className="w-1 h-4 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                  <span className="w-1 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}

              {isSendingMessage && (
                <div className="flex items-center gap-3 p-3 bg-slate-900 border border-indigo-900/50 rounded-2xl max-w-xs text-xs text-indigo-300">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white animate-spin" />
                  </div>
                  <span>Rainbow Tutor is thinking under starry skies...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompt Suggestion Chips */}
            <div className="px-3 py-2 bg-slate-950/90 border-t border-indigo-900/30 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
              <span className="text-indigo-400/80 font-bold shrink-0 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> Quick Prompts:
              </span>
              <button
                type="button"
                onClick={() => handleSendMessage(`Explain ${topic} in ${subject} simply with a real-world example.`)}
                className="px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800 text-indigo-200 whitespace-nowrap transition-all cursor-pointer shrink-0"
              >
                ⚡ Explain concept simply
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(`Give me 3 high-yield practice questions for ${subject} (${topic}).`)}
                className="px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800 text-indigo-200 whitespace-nowrap transition-all cursor-pointer shrink-0"
              >
                🎯 3 Practice questions
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(`What are common exam traps or mistakes to avoid in ${topic}?`)}
                className="px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800 text-indigo-200 whitespace-nowrap transition-all cursor-pointer shrink-0"
              >
                💡 Common exam traps
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(`Give me a formula memory trick or mnemonic for ${topic}.`)}
                className="px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800 text-indigo-200 whitespace-nowrap transition-all cursor-pointer shrink-0"
              >
                🧠 Formula mnemonic
              </button>
            </div>

            {/* Speech error indicator */}
            {speechError && (
              <div className="px-4 py-1.5 bg-rose-950/90 border-t border-rose-800 text-rose-200 text-[11px] font-medium">
                {speechError}
              </div>
            )}

            {/* Listening Indicator Bar */}
            {isListening && (
              <div className="px-4 py-2 bg-gradient-to-r from-red-500 via-emerald-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-white" />
                  <span>Listening to your voice... Speak your question now!</span>
                </div>
                <button onClick={toggleListening} className="text-xs underline text-white font-bold cursor-pointer">
                  Done
                </button>
              </div>
            )}

            {/* Chat Input Bar */}
            <div className="p-3 bg-slate-950 border-t border-indigo-900/40 flex items-center gap-2">
              {/* Mic / Speech-to-Text Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                    : 'bg-slate-900 hover:bg-indigo-950 text-indigo-300 hover:text-white border-indigo-900/60'
                }`}
                title={isListening ? 'Stop listening' : 'Click to speak your question into speech'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={isListening ? 'Listening to speech...' : `Ask a question about ${subject} (${topic})...`}
                className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-indigo-900/60 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 transition-all placeholder:text-slate-500 font-medium"
              />

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isSendingMessage}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Action Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[120] bg-slate-900 border border-emerald-500/60 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slideUp">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-300">Action Completed</div>
            <div className="text-xs text-slate-200">{toastMessage}</div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {clearModalType && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-3xl shadow-2xl p-6 space-y-5 text-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-950/90 border border-rose-800 text-rose-400 flex items-center justify-center shrink-0 shadow-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-white">
                  {clearModalType === 'score' && 'Clear Score History Log?'}
                  {clearModalType === 'all' && 'Wipe Out ALL History?'}
                  {clearModalType === 'chat' && 'Clear Chat History?'}
                </h3>
                <p className="text-xs text-slate-300/80 leading-relaxed">
                  {clearModalType === 'score' && 'Are you sure you want to permanently erase all logged test and exam score records?'}
                  {clearModalType === 'all' && 'Are you sure you want to wipe out all score records, practice questions, exam tips, and chat history entirely?'}
                  {clearModalType === 'chat' && 'Are you sure you want to clear your conversation history with Rainbow AI Tutor?'}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setClearModalType(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeClearAction}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-extrabold shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>
                  {clearModalType === 'score' && 'Yes, Clear Scores'}
                  {clearModalType === 'all' && 'Yes, Wipe Everything'}
                  {clearModalType === 'chat' && 'Yes, Clear Chat'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

};
