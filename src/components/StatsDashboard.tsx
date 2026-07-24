import React from 'react';
import { 
  Trophy, 
  Flame, 
  CheckCircle2, 
  Clock, 
  Award, 
  Bookmark, 
  BrainCircuit, 
  Sparkles, 
  Layers,
  Trash2
} from 'lucide-react';
import { UserStats, SavedBookmark, LearningFragment } from '../types';

interface StatsDashboardProps {
  stats: UserStats;
  bookmarks: SavedBookmark[];
  onRemoveBookmark: (id: string) => void;
  onSelectBookmarkedFragment: (fragmentId: string, pathId: string) => void;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  stats,
  bookmarks,
  onRemoveBookmark,
  onSelectBookmarkedFragment,
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm text-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-indigo-600" />
            <span>Learner Profile & Momentum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Micro-Scholar Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Track your fragmental learning momentum, mastered concept nodes, daily streaks, and saved takeaways.
          </p>
        </div>

        {/* Level Badge */}
        <div className="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-xl flex items-center gap-4 shrink-0 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-sm shadow-indigo-100">
            {Math.floor(stats.xp / 100) + 1}
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Current Level</div>
            <div className="text-sm font-bold text-slate-800">
              {stats.xp < 100 ? 'Fragment Apprentice' : stats.xp < 300 ? 'Micro-Scholar' : 'Path Master'}
            </div>
            <div className="text-[11px] text-indigo-700 font-bold mt-0.5">{stats.xp} Total XP</div>
          </div>
        </div>
      </div>

      {/* Grid Metrics Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Streak */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-amber-500">
            <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">Streak</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{stats.streakDays} Days</div>
          <div className="text-[11px] text-slate-500">Daily learning momentum</div>
        </div>

        {/* XP */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-indigo-600">
            <Trophy className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">Score</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{stats.xp} XP</div>
          <div className="text-[11px] text-slate-500">Earned from quizzes & nodes</div>
        </div>

        {/* Fragments Completed */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Nodes</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{stats.completedFragmentsCount}</div>
          <div className="text-[11px] text-slate-500">Mastered concept cards</div>
        </div>

        {/* Total Minutes */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-indigo-600">
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">Time</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{stats.totalTimeMinutesSpent} mins</div>
          <div className="text-[11px] text-slate-500">Total focused learning</div>
        </div>

      </div>

      {/* Badges Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-800">Earned Badges & Milestones</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.badges.map((badge) => (
            <div 
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                badge.unlockedAt
                  ? 'bg-white border-indigo-200 shadow-xs'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-700 font-bold text-lg flex items-center justify-center shrink-0">
                {badge.icon || '🏅'}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-800">{badge.name}</h4>
                <p className="text-[11px] text-slate-500">{badge.description}</p>
                {badge.unlockedAt && (
                  <span className="text-[10px] text-emerald-600 font-bold block pt-1">
                    ✓ Unlocked
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Bookmarks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-800">Saved Takeaways & Bookmarks ({bookmarks.length})</h2>
          </div>
        </div>

        {bookmarks.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-2 shadow-2xs">
            <Bookmark className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-500">No bookmarks saved yet. Click the bookmark icon in any fragment player to save takeaways here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookmarks.map((bm) => (
              <div key={bm.id} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3 relative group">
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">{bm.pathTitle}</span>
                    <h4 className="text-xs font-bold text-slate-800">{bm.fragmentTitle}</h4>
                  </div>
                  <button
                    onClick={() => onRemoveBookmark(bm.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <ul className="space-y-1.5 list-disc pl-4 text-xs text-slate-600">
                  {bm.takeaways.map((t, i) => (
                    <li key={i} className="line-clamp-2">{t}</li>
                  ))}
                </ul>

                <button
                  onClick={() => onSelectBookmarkedFragment(bm.fragmentId, bm.pathId)}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors pt-1 block"
                >
                  Jump to Fragment →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
