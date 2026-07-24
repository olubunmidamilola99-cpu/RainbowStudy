import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Lock, 
  PlayCircle, 
  Clock, 
  Sparkles, 
  Layers, 
  BookOpen, 
  Award, 
  BrainCircuit, 
  ArrowRight,
  Filter,
  Bookmark
} from 'lucide-react';
import { LearningPath, LearningFragment, FragmentStatus } from '../types';

interface PathGraphViewProps {
  path: LearningPath;
  onSelectFragment: (fragment: LearningFragment) => void;
  onOpenGenerator: () => void;
}

export const PathGraphView: React.FC<PathGraphViewProps> = ({
  path,
  onSelectFragment,
  onOpenGenerator,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'unlocked' | 'completed'>('all');

  const totalFragments = path.fragments.length;
  const completedCount = path.fragments.filter((f) => f.status === 'completed' || f.status === 'mastered').length;
  const inProgressCount = path.fragments.filter((f) => f.status === 'in_progress').length;
  const progressPercent = totalFragments > 0 ? Math.round((completedCount / totalFragments) * 100) : 0;

  // Find next active fragment to learn
  const nextFragment = path.fragments.find((f) => f.status === 'in_progress') || path.fragments.find((f) => f.status !== 'locked');

  const filteredFragments = path.fragments.filter((f) => {
    if (filterStatus === 'unlocked') return f.status !== 'locked';
    if (filterStatus === 'completed') return f.status === 'completed' || f.status === 'mastered';
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Path Header Hero Card */}
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm text-slate-800">
        
        <div className="relative z-10 space-y-6">
          
          {/* Top Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                {path.category || 'General Skill'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                Level: {path.skillLevel}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>{path.dailyMinutes} mins/day</span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
              <span>{totalFragments} Fragment Nodes ({path.totalMinutes} mins total)</span>
            </div>
          </div>

          {/* Title & Goal */}
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight leading-tight">
              {path.title}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              {path.targetGoal}
            </p>
          </div>

          {/* Overall Progress Bar */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Pathway Mastery</span>
              </span>
              <span className="text-indigo-600 font-bold">{completedCount} / {totalFragments} Fragments ({progressPercent}%)</span>
            </div>

            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-700 shadow-xs"
                style={{ width: `${Math.max(progressPercent, 4)}%` }}
              />
            </div>
          </div>

          {/* Quick Resume CTA Banner */}
          {nextFragment && (
            <div className="pt-2">
              <div className="p-4 bg-indigo-50/80 border border-indigo-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Up Next in 3 Minutes</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>{nextFragment.title}</span>
                    <span className="text-xs font-normal text-slate-500">({nextFragment.estimatedMinutes} mins)</span>
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-1">{nextFragment.summary}</p>
                </div>

                <button
                  onClick={() => onSelectFragment(nextFragment)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>{nextFragment.status === 'completed' ? 'Review Fragment' : 'Start Fragment'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-800">Fragmented Roadmap Nodes</h2>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-md transition-colors ${
              filterStatus === 'all'
                ? 'bg-white text-indigo-700 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({totalFragments})
          </button>
          <button
            onClick={() => setFilterStatus('unlocked')}
            className={`px-3 py-1 rounded-md transition-colors ${
              filterStatus === 'unlocked'
                ? 'bg-white text-indigo-700 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Unlocked ({completedCount + inProgressCount})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1 rounded-md transition-colors ${
              filterStatus === 'completed'
                ? 'bg-white text-indigo-700 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {/* Phases & Fragments Graph List */}
      <div className="space-y-8">
        {path.phases.map((phase, phaseIdx) => {
          const phaseFragments = filteredFragments.filter((f) => f.phaseId === phase.id);
          if (phaseFragments.length === 0) return null;

          return (
            <div key={phase.id} className="space-y-4">
              
              {/* Phase Header */}
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                  {phase.order}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">{phase.title}</h3>
                  <p className="text-xs text-slate-500">{phase.description}</p>
                </div>
              </div>

              {/* Fragment Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-2 sm:pl-10 relative border-l-2 border-slate-200">
                {phaseFragments.map((fragment, fIdx) => {
                  const isLocked = fragment.status === 'locked';
                  const isCompleted = fragment.status === 'completed' || fragment.status === 'mastered';
                  const isInProgress = fragment.status === 'in_progress';

                  return (
                    <div
                      key={fragment.id}
                      onClick={() => !isLocked && onSelectFragment(fragment)}
                      className={`group relative p-5 rounded-2xl border transition-all ${
                        isLocked
                          ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                          : isInProgress
                          ? 'bg-white border-2 border-indigo-600 shadow-md cursor-pointer hover:border-indigo-700'
                          : isCompleted
                          ? 'bg-white border border-emerald-200 shadow-xs cursor-pointer hover:border-emerald-400'
                          : 'bg-white border border-slate-200 shadow-xs cursor-pointer hover:border-indigo-300'
                      }`}
                    >
                      {/* Left status badge */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          {isCompleted ? (
                            <span className="p-1 rounded-full bg-emerald-100 text-emerald-700">
                              <CheckCircle2 className="w-4 h-4" />
                            </span>
                          ) : isInProgress ? (
                            <span className="p-1 rounded-full bg-indigo-100 text-indigo-700 animate-pulse">
                              <PlayCircle className="w-4 h-4" />
                            </span>
                          ) : (
                            <span className="p-1 rounded-full bg-slate-100 text-slate-400">
                              <Lock className="w-4 h-4" />
                            </span>
                          )}

                          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            Node {fragment.order} • {fragment.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                          <Clock className="w-3 h-3 text-indigo-600" />
                          <span>{fragment.estimatedMinutes}m</span>
                        </div>
                      </div>

                      {/* Fragment Title */}
                      <h4 className={`text-sm font-bold tracking-tight mb-2 group-hover:text-indigo-600 transition-colors ${
                        isLocked ? 'text-slate-400' : 'text-slate-800'
                      }`}>
                        {fragment.title}
                      </h4>

                      {/* Summary */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                        {fragment.summary}
                      </p>

                      {/* Key Terms Preview */}
                      {fragment.keyTerms && fragment.keyTerms.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {fragment.keyTerms.slice(0, 2).map((kt, i) => (
                            <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              {kt.term}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action Line */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                        <span className={
                          isCompleted
                            ? 'text-emerald-600 font-bold'
                            : isInProgress
                            ? 'text-indigo-600 font-bold'
                            : 'text-slate-400'
                        }>
                          {isCompleted ? 'Mastered' : isInProgress ? 'In Progress' : 'Locked'}
                        </span>

                        {!isLocked && (
                          <span className="text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-medium">
                            <span>Open</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
