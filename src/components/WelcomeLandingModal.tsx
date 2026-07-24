import React, { useState } from 'react';
import { UserPreferences, UserRole, ThemePreset, FontFamilyChoice, AccentColorChoice, ChatCharacterChoice } from '../types';
import { Sparkles, GraduationCap, UserCheck, Palette, CheckCircle2, ArrowRight, Bot, Check, Type } from 'lucide-react';

interface WelcomeLandingModalProps {
  prefs: UserPreferences;
  onSave: (updated: Partial<UserPreferences>) => void;
  onClose?: () => void;
  onOpenDesigner?: () => void;
  isInitialLanding?: boolean;
}

export const WelcomeLandingModal: React.FC<WelcomeLandingModalProps> = ({
  prefs,
  onSave,
  onClose,
  onOpenDesigner,
  isInitialLanding = true,
}) => {
  const [name, setName] = useState(prefs.userName || '');
  const [role, setRole] = useState<UserRole>(prefs.userRole || 'student');
  const [preset, setPreset] = useState<ThemePreset>(prefs.themePreset || 'starlight');
  const [font, setFont] = useState<FontFamilyChoice>(prefs.fontFamily || 'sans');
  const [accent, setAccent] = useState<AccentColorChoice>(prefs.accentColor || 'indigo');
  const [character, setCharacter] = useState<ChatCharacterChoice>(prefs.chatCharacter || 'rainbow');

  // Keep state synchronized with incoming prefs (e.g. if updated via CustomDesignerModal)
  React.useEffect(() => {
    if (prefs.userName !== undefined) setName(prefs.userName);
    if (prefs.userRole) setRole(prefs.userRole);
    if (prefs.themePreset) setPreset(prefs.themePreset);
    if (prefs.fontFamily) setFont(prefs.fontFamily);
    if (prefs.accentColor) setAccent(prefs.accentColor);
    if (prefs.chatCharacter) setCharacter(prefs.chatCharacter);
  }, [prefs]);

  const studentCharacters: { id: ChatCharacterChoice; name: string; avatar: string; title: string; desc: string }[] = [
    { id: 'rainbow', name: 'Rainbow AI Tutor', avatar: '🌈', title: 'Encouraging & Step-by-Step', desc: 'Warm analogies & clear structured guidance' },
    { id: 'socrates', name: 'Socrates Professor', avatar: '🏛️', title: 'Socratic Inquiry', desc: 'Asks questions so you deduce solutions logically' },
    { id: 'buddy', name: 'Friendly Study Buddy', avatar: '⚡', title: 'Upbeat & Bite-Sized', desc: 'Fast peer study hacks & zero fluff' },
    { id: 'coach', name: 'Strict Exam Coach', avatar: '🎯', title: 'High-Yield Mark Schemes', desc: 'Direct exam board rules, traps & timing' },
    { id: 'einstein', name: 'Einstein Science Guru', avatar: '🧠', title: 'Deep Conceptual Models', desc: 'Formula breakdowns & physical laws' },
    { id: 'storyteller', name: 'Memory Storyteller', avatar: '🎨', title: 'Visual Metaphors & Stories', desc: 'Turns facts & formulas into memory palaces' },
    { id: 'questmaster', name: 'RPG Quest Master', avatar: '🎮', title: 'Boss Battles & Level-Up', desc: 'Gamer motivation, XP mindsets & boss fights' },
    { id: 'calming', name: 'Mindful Calming Mentor', avatar: '🧘', title: 'Anti-Anxiety & Calm Pace', desc: 'Relieves stress with reassuring guidance' },
    { id: 'detective', name: 'Logic Detective', avatar: '🕵️', title: 'Forensic Evidence & Clues', desc: 'Analyzes cases like a mystery file' },
    { id: 'timetraveler', name: 'Historical Time Traveler', avatar: '📜', title: 'Eyewitness Epoch Accounts', desc: 'Explains history & science as an eyewitness' },
    { id: 'cybercoder', name: 'Tech Cyber-Coder', avatar: '🤖', title: 'Algorithmic Logic & Debugs', desc: 'Sharp coding syntax & logic traps' },
    { id: 'wiseowl', name: 'Wise Owl Academy Dean', avatar: '🦉', title: 'Scholarly Depth & Outlines', desc: 'Rigorous essay outlines & academic depth' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || (role === 'teacher' ? 'Educator' : 'Student');
    onSave({
      userName: finalName,
      userRole: role,
      themePreset: preset,
      fontFamily: font,
      accentColor: accent,
      chatCharacter: character,
      hasOnboarded: true,
    });
    if (onClose) onClose();
  };

  const displayName = name.trim() || (role === 'teacher' ? 'Educator' : 'Student');
  const activeCharObj = studentCharacters.find((c) => c.id === character) || studentCharacters[0];

  const isDaylight = preset === 'daylight';
  const isEmerald = preset === 'emerald';
  const isSunset = preset === 'sunset';

  const cardBgClass = isDaylight
    ? 'bg-white border-slate-300 text-slate-900 shadow-2xl'
    : isEmerald
    ? 'bg-slate-950 border-emerald-500/40 text-slate-100 shadow-2xl'
    : isSunset
    ? 'bg-purple-950/90 border-amber-500/40 text-slate-100 shadow-2xl'
    : 'bg-slate-900 border-indigo-500/40 text-slate-100 shadow-2xl';

  const fontStyleClass = font === 'serif'
    ? 'font-serif'
    : font === 'mono'
    ? 'font-mono'
    : font === 'dyslexic'
    ? 'font-sans tracking-wide leading-relaxed font-semibold'
    : font === 'display'
    ? 'font-sans tracking-tight font-extrabold'
    : font === 'handwriting'
    ? 'font-serif italic'
    : 'font-sans';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn ${fontStyleClass}`}>
      <div className={`relative w-full max-w-2xl rounded-3xl overflow-hidden my-6 border ${cardBgClass}`}>
        
        {/* Decorative Top Accent Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-cyan-400 via-indigo-500 to-purple-600 animate-pulse" />

        <div className="p-5 sm:p-7 space-y-5">
          
          {/* Header */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-950/90 border border-indigo-700 text-amber-300 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>Rainbow Study AI Landing Platform</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome! Customize Your AI Study Space
            </h1>
            <p className="text-xs sm:text-sm opacity-80 max-w-md mx-auto">
              Select your AI Tutor Character Persona, font style, and visual comfort theme before starting.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Live Welcome Preview Banner */}
            <div className={`p-4 rounded-2xl border text-center space-y-1.5 shadow-inner transition-all ${
              isDaylight
                ? 'bg-slate-50 border-slate-300 text-slate-900'
                : 'bg-slate-950/80 border-indigo-500/40 text-white'
            }`}>
              <div className="flex items-center justify-between text-xs font-extrabold">
                <span className="text-amber-400 uppercase tracking-widest text-[10px]">✨ Live Welcome Greeting</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-950 text-indigo-200 border border-indigo-800 flex items-center gap-1">
                  <span>{activeCharObj.avatar}</span>
                  <span>{activeCharObj.name}</span>
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Hello, <span className="text-amber-400 underline decoration-indigo-400 underline-offset-4">{displayName}</span>! 👋
              </div>
              <p className="text-xs opacity-80">
                "{activeCharObj.title}: {activeCharObj.desc}"
              </p>
            </div>

            {/* Input Name & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider block">
                  Your Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex, Ms. Johnson, Dr. Smith..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:border-amber-400 transition-all ${
                    isDaylight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-950 border-indigo-900/80 text-white'
                  }`}
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider block">
                  I am a:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      role === 'student'
                        ? 'bg-indigo-900 border-amber-400 text-amber-300 shadow-md'
                        : isDaylight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-950 border-indigo-950 text-slate-300'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
                    <span>Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`py-2 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      role === 'teacher'
                        ? 'bg-purple-900 border-amber-400 text-amber-300 shadow-md'
                        : isDaylight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-950 border-indigo-950 text-slate-300'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5 text-purple-300" />
                    <span>Teacher</span>
                  </button>
                </div>
              </div>
            </div>

            {/* AI TUTOR STUDENT CHARACTER PICKER */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-amber-400" />
                  <span>Choose Your AI Student Tutor Persona ({studentCharacters.length} Available)</span>
                </span>
                <span className="text-[10px] text-amber-300 font-bold">Pick Any Character</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {studentCharacters.map((char) => {
                  const isSelected = character === char.id;
                  return (
                    <button
                      key={char.id}
                      type="button"
                      onClick={() => setCharacter(char.id)}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2 ${
                        isSelected
                          ? 'bg-indigo-950 border-amber-400 text-white shadow-lg ring-2 ring-indigo-500/50'
                          : isDaylight
                          ? 'bg-slate-100 border-slate-300 text-slate-800 hover:border-indigo-400'
                          : 'bg-slate-950/80 border-indigo-900/60 text-slate-300 hover:border-indigo-700'
                      }`}
                    >
                      <span className="text-xl shrink-0">{char.avatar}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-extrabold flex items-center justify-between">
                          <span className="truncate">{char.name}</span>
                          {isSelected && <Check className="w-3 h-3 text-emerald-400 shrink-0" />}
                        </div>
                        <div className="text-[9px] text-amber-300 font-semibold truncate">{char.title}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme & Font Custom Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Theme Comfort */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>Visual Comfort Theme</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setPreset('starlight')}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                      preset === 'starlight' ? 'bg-indigo-900 border-amber-400 text-amber-300' : 'bg-slate-950/80 border-indigo-950 text-slate-300'
                    }`}
                  >
                    🌌 Starlight
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreset('sunset')}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                      preset === 'sunset' ? 'bg-purple-900 border-amber-400 text-amber-300' : 'bg-slate-950/80 border-indigo-950 text-slate-300'
                    }`}
                  >
                    🌅 Sunset
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreset('emerald')}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                      preset === 'emerald' ? 'bg-emerald-900 border-amber-400 text-emerald-300' : 'bg-slate-950/80 border-indigo-950 text-slate-300'
                    }`}
                  >
                    🌿 Emerald
                  </button>
                </div>
              </div>

              {/* Reading Font */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <Type className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reading Font Style</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setFont('sans')}
                    className={`py-1.5 px-2 rounded-lg border font-sans text-center transition-all cursor-pointer ${
                      font === 'sans' ? 'bg-indigo-900 border-amber-400 text-white' : 'bg-slate-950/80 border-indigo-950 text-slate-300'
                    }`}
                  >
                    Sans
                  </button>
                  <button
                    type="button"
                    onClick={() => setFont('serif')}
                    className={`py-1.5 px-2 rounded-lg border font-serif text-center transition-all cursor-pointer ${
                      font === 'serif' ? 'bg-indigo-900 border-amber-400 text-white' : 'bg-slate-950/80 border-indigo-950 text-slate-300'
                    }`}
                  >
                    Academic
                  </button>
                  <button
                    type="button"
                    onClick={() => setFont('dyslexic')}
                    className={`py-1.5 px-2 rounded-lg border font-sans tracking-wide text-center transition-all cursor-pointer ${
                      font === 'dyslexic' ? 'bg-indigo-900 border-amber-400 text-amber-300' : 'bg-slate-950/80 border-indigo-950 text-slate-300'
                    }`}
                  >
                    Easy-Read
                  </button>
                </div>
              </div>
            </div>

            {/* Submit / Enter Study Space Button & Advanced Designer Button */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-indigo-600 to-purple-600 hover:from-emerald-600 hover:to-purple-700 text-white font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Enter AI Study Space as {displayName} ({activeCharObj.name})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onOpenDesigner && (
                <button
                  type="button"
                  onClick={onOpenDesigner}
                  className="w-full py-2 px-4 rounded-xl border border-indigo-700/60 bg-indigo-950/60 hover:bg-indigo-900/80 text-amber-300 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>Open Full Theme, Color & Font Studio</span>
                </button>
              )}
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

