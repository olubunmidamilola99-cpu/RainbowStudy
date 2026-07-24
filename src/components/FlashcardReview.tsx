import React, { useState } from 'react';
import { 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  BrainCircuit, 
  ThumbsUp, 
  Flame, 
  Award,
  ArrowRight
} from 'lucide-react';
import { LearningPath, LearningFragment } from '../types';

interface FlashcardReviewProps {
  paths: LearningPath[];
  onFinishReview: (earnedXp: number) => void;
}

export const FlashcardReview: React.FC<FlashcardReviewProps> = ({
  paths,
  onFinishReview,
}) => {
  // Collect all available fragments from paths
  const allFragments: { fragment: LearningFragment; pathTitle: string }[] = [];
  paths.forEach((p) => {
    p.fragments.forEach((f) => {
      allFragments.push({ fragment: f, pathTitle: p.title });
    });
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  if (allFragments.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <BrainCircuit className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">No Fragments Available</h2>
        <p className="text-xs text-slate-500">Create a path or start learning to populate your flashcard review deck.</p>
      </div>
    );
  }

  const currentItem = allFragments[currentIndex % allFragments.length];
  const { fragment, pathTitle } = currentItem;

  const handleNextCard = (confidence: 'hard' | 'good' | 'easy') => {
    setIsFlipped(false);
    setReviewedCount((prev) => prev + 1);
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">Spaced Repetition Review Deck</h2>
            <p className="text-xs text-slate-500">60-second micro recall for long-term retention</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200/80">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Reviewed: {reviewedCount}</span>
        </div>
      </div>

      {/* Interactive Flashcard */}
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative min-h-[320px] bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-8 shadow-sm cursor-pointer transition-all duration-300 flex flex-col justify-between select-none"
      >
        {/* Top Path Badge */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 border-b border-slate-100 pb-3">
          <span className="text-indigo-600 font-bold truncate max-w-[240px]">{pathTitle}</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {isFlipped ? 'Back (Answer / Takeaways)' : 'Front (Click to Flip)'}
          </span>
        </div>

        {/* Card Main Body */}
        <div className="py-6 space-y-4">
          {!isFlipped ? (
            /* FRONT OF CARD */
            <div className="space-y-3 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 inline-block">
                Node {fragment.order} • {fragment.type}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight">
                {fragment.title}
              </h3>
              <p className="text-xs text-slate-500 max-w-lg mx-auto">
                What are the core takeaways and key definitions for this micro-concept?
              </p>
            </div>
          ) : (
            /* BACK OF CARD */
            <div className="space-y-4 text-left">
              <h4 className="text-sm font-bold text-indigo-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>{fragment.title}</span>
              </h4>

              <div className="space-y-2">
                {fragment.takeaways.map((t, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>

              {fragment.analogy && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-slate-700 italic">
                  💡 "{fragment.analogy}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card Flip Prompt Hint */}
        <div className="text-center text-[11px] text-slate-400 pt-3 border-t border-slate-100">
          {isFlipped ? 'Rate your recall confidence below' : 'Tap card to reveal answer'}
        </div>
      </div>

      {/* Rating Buttons */}
      {isFlipped && (
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleNextCard('hard')}
            className="p-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-rose-800 font-bold text-xs transition-colors cursor-pointer text-center"
          >
            <div>Hard</div>
            <div className="text-[10px] font-normal text-rose-600 mt-0.5">Review Again</div>
          </button>

          <button
            onClick={() => handleNextCard('good')}
            className="p-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-indigo-800 font-bold text-xs transition-colors cursor-pointer text-center"
          >
            <div>Good</div>
            <div className="text-[10px] font-normal text-indigo-600 mt-0.5">+10 XP • 3 Days</div>
          </button>

          <button
            onClick={() => handleNextCard('easy')}
            className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-emerald-800 font-bold text-xs transition-colors cursor-pointer text-center"
          >
            <div>Easy</div>
            <div className="text-[10px] font-normal text-emerald-600 mt-0.5">+20 XP • 7 Days</div>
          </button>
        </div>
      )}

      {/* Done CTA */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => onFinishReview(reviewedCount * 10)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-2"
        >
          <span>Complete Session & Claim XP</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
