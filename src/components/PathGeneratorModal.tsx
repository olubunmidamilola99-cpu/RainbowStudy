import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Clock, 
  GraduationCap, 
  Compass, 
  Lightbulb, 
  Loader2, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { SkillLevel, LearningStyle, LearningPath } from '../types';

interface PathGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPathCreated: (newPath: LearningPath) => void;
}

const PRESET_SUGGESTIONS = [
  'PostgreSQL Indexing & High-Performance Query Optimization',
  'Conversational Japanese for 2-Week Travelers',
  'Personal Finance & Low-Cost Index Fund Investing',
  'System Design: Distributed Caching & Load Balancing',
  'Prompt Engineering & Agent Orchestration',
  'Neuroscience of Sleep & Cognitive Performance',
];

export const PathGeneratorModal: React.FC<PathGeneratorModalProps> = ({
  isOpen,
  onClose,
  onPathCreated,
}) => {
  const [topic, setTopic] = useState('');
  const [goal, setGoal] = useState('');
  const [dailyMinutes, setDailyMinutes] = useState<number>(5);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('Intermediate');
  const [learningStyle, setLearningStyle] = useState<LearningStyle>('Balanced');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) {
      setErrorMsg('Please enter a topic or skill to learn.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setLoadingStep(1);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1800);

    try {
      const res = await fetch('/api/path/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          goal,
          dailyMinutes,
          skillLevel,
          learningStyle,
        }),
      });

      clearInterval(stepInterval);

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to generate path');
      }

      const data = await res.json();
      if (data.success && data.path) {
        onPathCreated(data.path);
        onClose();
        setTopic('');
        setGoal('');
      } else {
        throw new Error('Invalid path data returned');
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Path generation failed:', err);
      setErrorMsg(err.message || 'Something went wrong while generating your path. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingStep(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden text-slate-800">
        
        {/* Header Banner */}
        <div className="relative bg-white p-6 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-800">Create Fragmental Path</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                AI breaks your goal down into 2 to 4 minute atomic learning modules.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleGenerate} className="p-6 space-y-6">
          
          {errorMsg && (
            <div className="flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Topic Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              <span>What do you want to learn?</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. React Performance, Modern Economics, Quantum Computing..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-indigo-600 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
              disabled={isLoading}
            />

            {/* Quick Suggestions Chips */}
            <div className="pt-1">
              <p className="text-[11px] font-medium text-slate-500 mb-2 flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-amber-500" />
                <span>Or pick a popular micro-topic:</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_SUGGESTIONS.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTopic(preset)}
                    disabled={isLoading}
                    className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-lg transition-colors text-left font-medium"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Specific Goal Input (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Specific Target Outcome (Optional)
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Be able to optimize slow SQL queries at work within 2 weeks"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition-all placeholder:text-slate-400"
              disabled={isLoading}
            />
          </div>

          {/* Grid Options: Daily Time & Skill Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Daily Commitment */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Daily Time Budget</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[3, 5, 10, 15].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDailyMinutes(mins)}
                    disabled={isLoading}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      dailyMinutes === mins
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {mins} min/d
                  </button>
                ))}
              </div>
            </div>

            {/* Skill Level */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                <span>Skill Level</span>
              </label>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-600 cursor-pointer font-medium"
              >
                <option value="Beginner">Beginner (No Prior Knowledge)</option>
                <option value="Intermediate">Intermediate (Basic Foundation)</option>
                <option value="Advanced">Advanced (Deep Refinement)</option>
                <option value="Fast-Track">Fast-Track (Experienced Developer/Pro)</option>
              </select>
            </div>

          </div>

          {/* Learning Style */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Learning Focus Preference
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'Balanced', label: 'Balanced' },
                { id: 'Practical Code/Cases', label: 'Practical Code' },
                { id: 'Visual & Mental Models', label: 'Analogies & Models' },
                { id: 'Bite-sized Quizzes', label: 'Micro-Quizzes' },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setLearningStyle(style.id as LearningStyle)}
                  disabled={isLoading}
                  className={`py-2 px-2 text-center rounded-xl text-xs font-medium border transition-all cursor-pointer truncate ${
                    learningStyle === style.id
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Generating AI Path...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Build Fragmental Path</span>
                </>
              )}
            </button>
          </div>

          {/* Loading Animation Status Step */}
          {isLoading && (
            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-indigo-700 text-xs font-semibold">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Edupath AI is synthesizing your micro-learning curriculum...</span>
              </div>
              <div className="space-y-1 pl-6 text-[11px] text-slate-600">
                <div className={`flex items-center gap-2 ${loadingStep >= 1 ? 'text-indigo-700 font-semibold' : 'opacity-40'}`}>
                  <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                  <span>Deconstructing "{topic}" into 3-minute atomic concept nodes...</span>
                </div>
                <div className={`flex items-center gap-2 ${loadingStep >= 2 ? 'text-indigo-700 font-semibold' : 'opacity-40'}`}>
                  <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                  <span>Generating real-world analogies, code snippets, & micro-quizzes...</span>
                </div>
                <div className={`flex items-center gap-2 ${loadingStep >= 3 ? 'text-indigo-700 font-semibold' : 'opacity-40'}`}>
                  <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                  <span>Building prerequisite dependency graph & step roadmap...</span>
                </div>
              </div>
            </div>
          )}

        </form>

      </div>
    </div>
  );
};
