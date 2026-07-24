import React from 'react';
import { UserPreferences, ChatCharacterChoice } from '../types';
import { Sparkles, Palette, User, GraduationCap, UserCheck, Bot } from 'lucide-react';

interface NavbarProps {
  prefs: UserPreferences;
  onOpenDesigner: () => void;
  onOpenLanding: () => void;
}

const personaLabels: Record<ChatCharacterChoice, { name: string; avatar: string }> = {
  rainbow: { name: 'Rainbow Tutor', avatar: '🌈' },
  socrates: { name: 'Socrates Prof', avatar: '🏛️' },
  buddy: { name: 'Study Buddy', avatar: '⚡' },
  coach: { name: 'Strict Coach', avatar: '🎯' },
  einstein: { name: 'Einstein Guru', avatar: '🧠' },
  storyteller: { name: 'Storyteller', avatar: '🎨' },
  questmaster: { name: 'Quest Master', avatar: '🎮' },
  calming: { name: 'Calm Mentor', avatar: '🧘' },
  detective: { name: 'Logic Detective', avatar: '🕵️' },
  timetraveler: { name: 'Time Traveler', avatar: '📜' },
  cybercoder: { name: 'Cyber-Coder', avatar: '🤖' },
  wiseowl: { name: 'Wise Owl Dean', avatar: '🦉' },
};

export const Navbar: React.FC<NavbarProps> = ({
  prefs,
  onOpenDesigner,
  onOpenLanding,
}) => {
  const isDaylight = prefs.themePreset === 'daylight';
  const charKey: ChatCharacterChoice = prefs.chatCharacter || 'rainbow';
  const activePersona = personaLabels[charKey] || personaLabels.rainbow;

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 lg:px-8 py-3 shadow-md transition-all ${
      isDaylight
        ? 'bg-white/85 border-slate-200 text-slate-800'
        : 'bg-slate-900/80 border-indigo-900/40 text-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Brand */}
        <div className="flex items-center justify-between md:justify-start gap-4">
          <div className="flex items-center gap-3 text-left cursor-pointer" onClick={onOpenLanding}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 via-amber-400 via-emerald-400 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-900/40">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`font-extrabold tracking-tight text-xl ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                  Rainbow Study
                </span>
                <span className="text-indigo-400 font-extrabold text-xl">
                  AI
                </span>
              </div>
              <p className={`text-[11px] font-medium ${isDaylight ? 'text-slate-500' : 'text-indigo-200/70'}`}>
                Exam Suite & Voice Tutor
              </p>
            </div>
          </div>
        </div>

        {/* User Greeting & Custom Designer Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Active Persona Badge */}
          <button
            type="button"
            onClick={onOpenDesigner}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs hover:scale-105 active:scale-95 ${
              isDaylight
                ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                : 'bg-indigo-950/90 border-indigo-700/80 text-amber-300'
            }`}
            title="Active AI Tutor persona - Click to customize"
          >
            <span className="text-sm">{activePersona.avatar}</span>
            <span className="text-[11px] font-extrabold">{activePersona.name}</span>
          </button>

          {/* Hello [Name] Greeting Pill */}
          <button
            type="button"
            onClick={onOpenLanding}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs hover:scale-105 active:scale-95 ${
              isDaylight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                : 'bg-indigo-950/80 hover:bg-indigo-900 border-indigo-700/80 text-white'
            }`}
            title="Click to edit name or role"
          >
            {prefs.userRole === 'teacher' ? (
              <UserCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            ) : (
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            )}
            <span>
              Hello, <strong className="text-amber-400">{prefs.userName || 'Learner'}</strong>!
            </span>
            <User className="w-3.5 h-3.5 text-indigo-300/70 shrink-0 ml-0.5" />
          </button>

          {/* Custom Designer Trigger Button */}
          <button
            type="button"
            onClick={onOpenDesigner}
            className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white shadow-md flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Customize themes, colors & fonts"
          >
            <Palette className="w-4 h-4 text-white" />
            <span>🎨 Custom Designer</span>
          </button>

        </div>

      </div>
    </header>
  );
};
