import React from 'react';
import { UserPreferences, UserRole, ThemePreset, FontFamilyChoice, FontScaleChoice, AccentColorChoice, ChatCharacterChoice } from '../types';
import { Palette, X, Check, Type, Sparkles, GraduationCap, UserCheck, Eye, Bot, MessageSquare } from 'lucide-react';

interface CustomDesignerModalProps {
  prefs: UserPreferences;
  onUpdate: (updated: Partial<UserPreferences>) => void;
  onClose: () => void;
}

export const CustomDesignerModal: React.FC<CustomDesignerModalProps> = ({
  prefs,
  onUpdate,
  onClose,
}) => {
  const themes: { id: ThemePreset; name: string; icon: string; desc: string; bgBg: string }[] = [
    { id: 'starlight', name: 'Starlight Night', icon: '🌌', desc: 'Deep obsidian & navy with twinkling stars', bgBg: 'bg-slate-950 border-indigo-500' },
    { id: 'sunset', name: 'Sunset Warmth', icon: '🌅', desc: 'Warm plum, indigo & amber night glow', bgBg: 'bg-purple-950/80 border-amber-500' },
    { id: 'emerald', name: 'Emerald Forest', icon: '🌿', desc: 'Calming sage, dark mint & slate comfort', bgBg: 'bg-emerald-950/80 border-emerald-500' },
    { id: 'twilight', name: 'Cosmic Twilight', icon: '🔮', desc: 'Deep violet, amethyst & magenta starlight', bgBg: 'bg-fuchsia-950/80 border-fuchsia-500' },
    { id: 'daylight', name: 'Daylight Studio', icon: '☁️', desc: 'Clean, crisp soft light theme for bright rooms', bgBg: 'bg-slate-100 text-slate-900 border-slate-400' },
  ];

  const fonts: { id: FontFamilyChoice; name: string; class: string; sample: string }[] = [
    { id: 'sans', name: 'Modern Sans', class: 'font-sans', sample: 'Clean, versatile everyday learning typography.' },
    { id: 'serif', name: 'Academic Serif', class: 'font-serif', sample: 'Traditional, scholarly, high-readability textbook style.' },
    { id: 'mono', name: 'Code Monospace', class: 'font-mono', sample: 'Precise, technical alignment ideal for STEM & coding.' },
    { id: 'dyslexic', name: 'Easy-Read (Accessibility)', class: 'font-sans tracking-wide leading-relaxed font-semibold', sample: 'Enhanced letter spacing for effortless, relaxed reading.' },
    { id: 'display', name: 'High-Impact Display', class: 'font-sans tracking-tight font-extrabold', sample: 'Bold, engaging headlines for maximum focus and retention.' },
    { id: 'rounded', name: 'Friendly Rounded', class: 'font-sans font-medium', sample: 'Warm, approachable rounded text that reduces study fatigue.' },
    { id: 'handwriting', name: 'Creative Handwritten', class: 'font-serif italic tracking-wide', sample: 'Expressive notebook style for informal ideas & study logs.' },
    { id: 'modern', name: 'Urban Clean Modern', class: 'font-sans uppercase tracking-wider font-semibold', sample: 'Sleek contemporary feel with crisp geometric contrast.' },
  ];

  const accents: { id: AccentColorChoice; name: string; bgClass: string; borderClass: string }[] = [
    { id: 'indigo', name: 'Indigo Glow', bgClass: 'bg-indigo-600', borderClass: 'border-indigo-400' },
    { id: 'emerald', name: 'Emerald Flame', bgClass: 'bg-emerald-600', borderClass: 'border-emerald-400' },
    { id: 'rose', name: 'Rose Sparkle', bgClass: 'bg-rose-600', borderClass: 'border-rose-400' },
    { id: 'amber', name: 'Amber Sun', bgClass: 'bg-amber-500', borderClass: 'border-amber-400' },
    { id: 'cyan', name: 'Cyber Cyan', bgClass: 'bg-cyan-500', borderClass: 'border-cyan-400' },
    { id: 'purple', name: 'Royal Amethyst', bgClass: 'bg-purple-600', borderClass: 'border-purple-400' },
    { id: 'violet', name: 'Cosmic Violet', bgClass: 'bg-violet-600', borderClass: 'border-violet-400' },
    { id: 'teal', name: 'Ocean Teal', bgClass: 'bg-teal-500', borderClass: 'border-teal-400' },
    { id: 'fuchsia', name: 'Neon Fuchsia', bgClass: 'bg-fuchsia-600', borderClass: 'border-fuchsia-400' },
    { id: 'orange', name: 'Solar Orange', bgClass: 'bg-orange-500', borderClass: 'border-orange-400' },
  ];

  const fontScales: { id: FontScaleChoice; name: string; desc: string }[] = [
    { id: 'compact', name: 'Compact', desc: 'Denser information view' },
    { id: 'standard', name: 'Standard', desc: 'Balanced default' },
    { id: 'large', name: 'Comfortable Large', desc: 'Larger text for effortless reading' },
  ];

  const chatCharacters: { id: ChatCharacterChoice; name: string; avatar: string; title: string; desc: string; badge: string }[] = [
    { id: 'rainbow', name: 'Rainbow AI Tutor', avatar: '🌈', title: 'Encouraging & Step-by-Step', desc: 'Warm, supportive tutor using engaging analogies & clear steps', badge: 'bg-indigo-950/80 text-indigo-300 border-indigo-700/80' },
    { id: 'socrates', name: 'Socrates Professor', avatar: '🏛️', title: 'Socratic Method & Inquiry', desc: 'Asks guiding questions so you deduce key solutions logically', badge: 'bg-amber-950/80 text-amber-300 border-amber-700/80' },
    { id: 'buddy', name: 'Friendly Study Buddy', avatar: '⚡', title: 'Upbeat & Bite-Sized', desc: 'Energetic peer explanation with quick study hacks & zero fluff', badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80' },
    { id: 'coach', name: 'Strict Exam Coach', avatar: '🎯', title: 'High-Yield Mark Schemes', desc: 'Direct, focuses on exam board rules, traps & time management', badge: 'bg-rose-950/80 text-rose-300 border-rose-700/80' },
    { id: 'einstein', name: 'Einstein Science Guru', avatar: '🧠', title: 'Deep Conceptual Models', desc: 'Breaks down formulas, physical laws & scientific mental models', badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-700/80' },
    { id: 'storyteller', name: 'Memory Storyteller', avatar: '🎨', title: 'Visual Metaphors & Stories', desc: 'Turns complex dates & formulas into unforgettable stories', badge: 'bg-purple-950/80 text-purple-300 border-purple-700/80' },
    { id: 'questmaster', name: 'RPG Quest Master', avatar: '🎮', title: 'Boss Battles & Level-Up', desc: 'Treats exams as epic gaming quests with motivation & XP energy', badge: 'bg-amber-950/80 text-amber-400 border-amber-700/80' },
    { id: 'calming', name: 'Mindful Calming Mentor', avatar: '🧘', title: 'Anti-Anxiety & Zero Stress', desc: 'Soothing, gentle guidance to relieve exam stress & boost confidence', badge: 'bg-teal-950/80 text-teal-300 border-teal-700/80' },
    { id: 'detective', name: 'Logic Detective', avatar: '🕵️', title: 'Forensic Clues & Deduction', desc: 'Solves questions like a crime case with analytical evidence', badge: 'bg-slate-900 text-slate-200 border-slate-700' },
    { id: 'timetraveler', name: 'Historical Time Traveler', avatar: '📜', title: 'Eyewitness Epoch Accounts', desc: 'Explains history & science as if witnessing them firsthand', badge: 'bg-yellow-950/80 text-yellow-300 border-yellow-700/80' },
    { id: 'cybercoder', name: 'Tech Cyber-Coder', avatar: '🤖', title: 'Algorithmic Logic & Debugs', desc: 'Sharp tech logic, pseudocode & bug hunting mindset', badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-700/80' },
    { id: 'wiseowl', name: 'Wise Owl Academy Dean', avatar: '🦉', title: 'Scholarly Depth & Essays', desc: 'Rigorous academic structure, citations & essay outlines', badge: 'bg-indigo-950/80 text-indigo-200 border-indigo-700/80' },
  ];

  const currentCharacter = chatCharacters.find((c) => c.id === (prefs.chatCharacter || 'rainbow')) || chatCharacters[0];

  const handleDone = () => {
    onUpdate({ hasOnboarded: true });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-indigo-500/40 rounded-3xl shadow-2xl overflow-hidden my-8 text-slate-100">
        
        {/* Top Decorative Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-cyan-400 via-indigo-500 to-purple-600" />

        {/* Modal Header */}
        <div className="p-6 border-b border-indigo-900/50 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <span>Theme & Comfort Designer</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h2>
              <p className="text-xs text-indigo-200/70">Tailor fonts, colors, and themes for student & teacher comfort</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDone}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Live Preview Box */}
          <div className="p-4 bg-slate-950/80 border border-indigo-500/30 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-extrabold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Live Comfort Preview</span>
              </span>
              <span className="text-[11px] text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/60">
                {prefs.userRole === 'teacher' ? '👩‍🏫 Educator Workspace' : '🎓 Student Workspace'}
              </span>
            </div>

            <div className={`p-4 rounded-xl border border-indigo-900/40 bg-slate-900 space-y-3 ${
              fonts.find(f => f.id === prefs.fontFamily)?.class || 'font-sans'
            }`}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-white">
                  Hello, <span className="text-amber-300">{prefs.userName || 'Learner'}</span>! 👋
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border flex items-center gap-1.5 ${currentCharacter.badge}`}>
                  <span>{currentCharacter.avatar}</span>
                  <span>{currentCharacter.name}</span>
                </div>
              </div>
              <p className="text-xs text-indigo-200/80 leading-relaxed">
                "{currentCharacter.title}: {currentCharacter.desc}"
              </p>
            </div>
          </div>

          {/* Quick Preset Combos Bar */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Quick One-Touch Studio Combos</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => onUpdate({
                  themePreset: 'starlight',
                  chatCharacter: 'rainbow',
                  fontFamily: 'serif',
                  accentColor: 'indigo',
                })}
                className="p-2.5 rounded-xl border border-indigo-800/80 bg-slate-950/80 hover:bg-indigo-950/80 text-left transition-all cursor-pointer space-y-1"
              >
                <div className="text-xs font-extrabold text-amber-300 flex items-center gap-1">
                  <span>🌌 Starlight Scholar</span>
                </div>
                <div className="text-[10px] text-indigo-200/70">Night + Rainbow + Serif</div>
              </button>

              <button
                type="button"
                onClick={() => onUpdate({
                  themePreset: 'daylight',
                  chatCharacter: 'socrates',
                  fontFamily: 'sans',
                  accentColor: 'cyan',
                })}
                className="p-2.5 rounded-xl border border-indigo-800/80 bg-slate-950/80 hover:bg-indigo-950/80 text-left transition-all cursor-pointer space-y-1"
              >
                <div className="text-xs font-extrabold text-cyan-300 flex items-center gap-1">
                  <span>☁️ Bright Classroom</span>
                </div>
                <div className="text-[10px] text-indigo-200/70">Daylight + Socrates + Sans</div>
              </button>

              <button
                type="button"
                onClick={() => onUpdate({
                  themePreset: 'sunset',
                  chatCharacter: 'coach',
                  fontFamily: 'dyslexic',
                  accentColor: 'rose',
                })}
                className="p-2.5 rounded-xl border border-indigo-800/80 bg-slate-950/80 hover:bg-indigo-950/80 text-left transition-all cursor-pointer space-y-1"
              >
                <div className="text-xs font-extrabold text-rose-300 flex items-center gap-1">
                  <span>🎯 Exam Cram Mode</span>
                </div>
                <div className="text-[10px] text-indigo-200/70">Sunset + Strict Coach + EasyRead</div>
              </button>

              <button
                type="button"
                onClick={() => onUpdate({
                  themePreset: 'emerald',
                  chatCharacter: 'einstein',
                  fontFamily: 'mono',
                  accentColor: 'emerald',
                })}
                className="p-2.5 rounded-xl border border-indigo-800/80 bg-slate-950/80 hover:bg-indigo-950/80 text-left transition-all cursor-pointer space-y-1"
              >
                <div className="text-xs font-extrabold text-emerald-300 flex items-center gap-1">
                  <span>🧠 Science Guru</span>
                </div>
                <div className="text-[10px] text-indigo-200/70">Emerald + Einstein + Mono</div>
              </button>
            </div>
          </div>

          {/* SECTION 0: User Name Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider block">
              0. Your Display Name
            </label>
            <input
              type="text"
              value={prefs.userName || ''}
              onChange={(e) => onUpdate({ userName: e.target.value })}
              placeholder="e.g. Alex, Ms. Johnson, Dr. Smith..."
              className="w-full px-4 py-3 bg-slate-950 border border-indigo-800/80 rounded-xl text-white text-sm font-semibold focus:outline-none focus:border-indigo-400 transition-all placeholder:text-slate-500"
            />
          </div>

          {/* SECTION 1: AI Tutor Chat Character Persona */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-amber-300" />
              <span>1. AI Tutor Chat Character Persona</span>
            </label>
            <p className="text-[11px] text-indigo-200/70">
              Choose how your AI voice assistant and study coach responds during chat and voice tutoring sessions:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {chatCharacters.map((char) => {
                const isSelected = (prefs.chatCharacter || 'rainbow') === char.id;
                return (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => onUpdate({ chatCharacter: char.id })}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-indigo-950 border-amber-400 text-white shadow-lg ring-2 ring-indigo-500/50'
                        : 'bg-slate-950/60 border-indigo-900/40 text-slate-300 hover:border-indigo-700'
                    }`}
                  >
                    <span className="text-3xl shrink-0 p-1 bg-slate-900 rounded-xl border border-indigo-900/50">{char.avatar}</span>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-white">{char.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </div>
                      <div className="text-[10px] font-bold text-amber-300/90">{char.title}</div>
                      <p className="text-[10px] text-indigo-200/70 leading-normal">{char.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 1: User Role */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider block">
              1. Workspace Mode (Teacher vs Student)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onUpdate({ userRole: 'student' })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  prefs.userRole === 'student'
                    ? 'bg-indigo-950 border-indigo-400 text-white shadow-md'
                    : 'bg-slate-950/60 border-indigo-900/40 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-400" />
                  <div>
                    <div className="text-xs font-bold">Student Mode</div>
                    <div className="text-[10px] text-indigo-200/60">Focus on test prep & practice</div>
                  </div>
                </div>
                {prefs.userRole === 'student' && <Check className="w-4 h-4 text-emerald-400" />}
              </button>

              <button
                type="button"
                onClick={() => onUpdate({ userRole: 'teacher' })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  prefs.userRole === 'teacher'
                    ? 'bg-indigo-950 border-indigo-400 text-white shadow-md'
                    : 'bg-slate-950/60 border-indigo-900/40 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="text-xs font-bold">Teacher / Educator Mode</div>
                    <div className="text-[10px] text-indigo-200/60">Generate exam rubrics & tips</div>
                  </div>
                </div>
                {prefs.userRole === 'teacher' && <Check className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>
          </div>

          {/* SECTION 2: Theme Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider block">
              2. Visual Atmosphere & Theme Presets
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {themes.map((t) => {
                const isSelected = prefs.themePreset === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onUpdate({ themePreset: t.id })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-indigo-950 border-amber-400 text-white shadow-md ring-2 ring-indigo-500/50'
                        : 'bg-slate-950/60 border-indigo-900/40 text-slate-300 hover:border-indigo-700'
                    }`}
                  >
                    <span className="text-2xl">{t.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-white">{t.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-indigo-200/70 mt-0.5">{t.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: Highlight Accent Color */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider block">
              3. Highlight Accent Color
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {accents.map((acc) => {
                const isSelected = prefs.accentColor === acc.id;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => onUpdate({ accentColor: acc.id })}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      isSelected
                        ? 'bg-slate-950 border-white text-white ring-2 ring-indigo-400'
                        : 'bg-slate-950/60 border-indigo-900/40 text-slate-300 hover:border-indigo-700'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full ${acc.bgClass} shadow-md inline-block`} />
                    <span className="text-[10px] font-bold">{acc.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: Typography & Reading Comfort */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-amber-400" />
              <span>4. Typography Choice</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {fonts.map((f) => {
                const isSelected = prefs.fontFamily === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => onUpdate({ fontFamily: f.id })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
                      isSelected
                        ? 'bg-indigo-950 border-indigo-400 text-white shadow-md'
                        : 'bg-slate-950/60 border-indigo-900/40 text-slate-300 hover:border-indigo-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{f.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className={`text-[11px] text-indigo-200/70 truncate ${f.class}`}>
                      {f.sample}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 5: Text Scaling */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider block">
              5. Font Size & Density
            </label>
            <div className="grid grid-cols-3 gap-2">
              {fontScales.map((fs) => {
                const isSelected = prefs.fontScale === fs.id;
                return (
                  <button
                    key={fs.id}
                    type="button"
                    onClick={() => onUpdate({ fontScale: fs.id })}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-950 border-indigo-400 text-white font-bold'
                        : 'bg-slate-950/60 border-indigo-900/40 text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">{fs.name}</div>
                    <div className="text-[9px] text-indigo-200/60 mt-0.5">{fs.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 6: Animation Comfort Toggle */}
          <div className="p-3 bg-slate-950/80 border border-indigo-900/50 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Twinkling Starlight Background</span>
              </div>
              <div className="text-[10px] text-indigo-200/70">
                Enable moving stars and shooting stars in the background
              </div>
            </div>

            <button
              type="button"
              onClick={() => onUpdate({ enableAnimations: !prefs.enableAnimations })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                prefs.enableAnimations
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {prefs.enableAnimations ? 'Active' : 'Off'}
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-indigo-900/50 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-indigo-200/70">
            Settings auto-saved to your browser.
          </span>
          <button
            type="button"
            onClick={handleDone}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md cursor-pointer transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
