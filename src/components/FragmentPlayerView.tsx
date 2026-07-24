import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  BrainCircuit, 
  HelpCircle, 
  Code, 
  Lightbulb, 
  Send, 
  Loader2, 
  Award, 
  Check, 
  Copy, 
  AlertCircle,
  Play
} from 'lucide-react';
import { LearningFragment, ExplainResponse } from '../types';

interface FragmentPlayerViewProps {
  fragment: LearningFragment;
  pathTitle: string;
  onBack: () => void;
  onCompleteFragment: (fragmentId: string, earnedXp: number) => void;
  onToggleBookmark: (fragment: LearningFragment) => void;
  isBookmarked?: boolean;
}

export const FragmentPlayerView: React.FC<FragmentPlayerViewProps> = ({
  fragment,
  pathTitle,
  onBack,
  onCompleteFragment,
  onToggleBookmark,
  isBookmarked = false,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [userChallengeInput, setUserChallengeInput] = useState('');
  const [isEvaluatingChallenge, setIsEvaluatingChallenge] = useState(false);
  const [challengeEvaluation, setChallengeEvaluation] = useState<any | null>(null);

  // AI Assistant Drawer state
  const [aiExplainMode, setAiExplainMode] = useState<'eli5' | 'analogy' | 'code' | 'deep_dive' | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<ExplainResponse | null>(null);

  // Text-To-Speech (TTS) state
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Copy code state
  const [copiedCode, setCopiedCode] = useState(false);

  // Completion state
  const [isCompleted, setIsCompleted] = useState(fragment.status === 'completed' || fragment.status === 'mastered');

  useEffect(() => {
    // Reset state when fragment changes
    setSelectedOptionId(null);
    setQuizAnswered(false);
    setUserChallengeInput('');
    setChallengeEvaluation(null);
    setAiExplainMode(null);
    setAiResult(null);
    setIsCompleted(fragment.status === 'completed' || fragment.status === 'mastered');

    // Stop speaking if playing
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [fragment.id]);

  // Handle Text-to-Speech
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToRead = `${fragment.title}. ${fragment.summary}. Key takeaways: ${fragment.takeaways.join('. ')}. ${fragment.analogy ? `Analogy: ${fragment.analogy}` : ''}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle AI Explanation request
  const requestAiExplain = async (mode: 'eli5' | 'analogy' | 'code' | 'deep_dive') => {
    setAiExplainMode(mode);
    setAiLoading(true);
    setAiResult(null);

    try {
      const res = await fetch('/api/fragment/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fragmentTitle: fragment.title,
          summary: fragment.summary,
          mode,
        }),
      });

      if (!res.ok) throw new Error('Failed to get explanation');
      const data = await res.json();
      if (data.success) {
        setAiResult(data);
      }
    } catch (err) {
      console.error('AI Explain failed:', err);
    } finally {
      setAiLoading(false);
    }
  };

  // Evaluate Challenge
  const handleEvaluateChallenge = async () => {
    if (!userChallengeInput.trim() || !fragment.challenge) return;

    setIsEvaluatingChallenge(true);
    try {
      const res = await fetch('/api/quiz/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengePrompt: fragment.challenge.prompt,
          userAnswer: userChallengeInput,
        }),
      });

      if (!res.ok) throw new Error('Evaluation failed');
      const data = await res.json();
      if (data.success) {
        setChallengeEvaluation(data.evaluation);
      }
    } catch (err) {
      console.error('Challenge eval error:', err);
    } finally {
      setIsEvaluatingChallenge(false);
    }
  };

  // Copy Code Snippet
  const handleCopyCode = () => {
    if (fragment.codeSnippet) {
      navigator.clipboard.writeText(fragment.codeSnippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Handle Complete
  const handleMarkComplete = () => {
    setIsCompleted(true);
    onCompleteFragment(fragment.id, 25);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 border border-slate-200 rounded-2xl shadow-xs">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Roadmap</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 max-w-[200px] sm:max-w-xs truncate hidden sm:inline font-medium">
            {pathTitle}
          </span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>{fragment.estimatedMinutes} min read</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Read Aloud Button */}
          <button
            onClick={toggleSpeech}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-amber-100 border-amber-300 text-amber-800 animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title="Read Aloud using TTS"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-600" />}
            <span className="hidden sm:inline">{isSpeaking ? 'Stop' : 'Read Aloud'}</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(fragment)}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
            }`}
            title="Bookmark takeaway"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-indigo-600 text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Core Concept Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm text-slate-800 space-y-6">
        
        {/* Title */}
        <div className="space-y-2 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
            <BrainCircuit className="w-4 h-4" />
            <span>Bite-Sized Concept • Node {fragment.order}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight leading-tight">
            {fragment.title}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed pt-1">
            {fragment.summary}
          </p>
        </div>

        {/* Key Takeaways */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Key Takeaways</span>
          </h3>
          <div className="grid grid-cols-1 gap-2.5">
            {fragment.takeaways.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Vocabulary Terms */}
        {fragment.keyTerms && fragment.keyTerms.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Core Vocabulary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fragment.keyTerms.map((kt, idx) => (
                <div key={idx} className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-indigo-700 block">{kt.term}</span>
                  <p className="text-xs text-slate-600">{kt.definition}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analogy Box */}
        {fragment.analogy && (
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Real-World Analogy</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
              "{fragment.analogy}"
            </p>
          </div>
        )}

        {/* Code Snippet Box */}
        {fragment.codeSnippet && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <Code className="w-4 h-4 text-indigo-600" />
                <span>Code / Practical Example</span>
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed shadow-xs">
              <code>{fragment.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* AI Assistant Toolbar */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Understanding Boosters</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => requestAiExplain('eli5')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                aiExplainMode === 'eli5'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Explain Like I'm 5</span>
            </button>

            <button
              onClick={() => requestAiExplain('analogy')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                aiExplainMode === 'analogy'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>More Analogies</span>
            </button>

            <button
              onClick={() => requestAiExplain('code')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                aiExplainMode === 'code'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Show Code Walkthrough</span>
            </button>
          </div>

          {/* AI Response Output Panel */}
          {aiExplainMode && (
            <div className="mt-4 p-5 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-3">
              {aiLoading ? (
                <div className="flex items-center gap-2 text-indigo-700 text-xs font-semibold py-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Edupath AI is generating a tailored breakdown...</span>
                </div>
              ) : aiResult ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      <span>AI Breakdown ({aiExplainMode.toUpperCase()})</span>
                    </span>
                    <button
                      onClick={() => setAiExplainMode(null)}
                      className="text-slate-500 hover:text-slate-700 text-xs font-semibold"
                    >
                      Close
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                    {aiResult.content}
                  </p>

                  {aiResult.keyHighlights && aiResult.keyHighlights.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {aiResult.keyHighlights.map((hl, i) => (
                        <span key={i} className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-white text-indigo-700 border border-indigo-200 shadow-2xs">
                          ✨ {hl}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

        </div>

      </div>

      {/* Micro-Quiz Card */}
      {fragment.quiz && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm text-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>Instant Recall Check (+15 XP)</span>
            </div>

            {quizAnswered && (
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                selectedOptionId === fragment.quiz.correctOptionId
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}>
                {selectedOptionId === fragment.quiz.correctOptionId ? (
                  <>
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Correct (+15 XP)</span>
                  </>
                ) : (
                  <span>Review Concept Below</span>
                )}
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-slate-800">
            {fragment.quiz.question}
          </h3>

          <div className="space-y-2.5">
            {fragment.quiz.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isCorrect = opt.id === fragment.quiz?.correctOptionId;

              let btnClasses = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300';
              if (quizAnswered) {
                if (isCorrect) {
                  btnClasses = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold';
                } else if (isSelected && !isCorrect) {
                  btnClasses = 'bg-rose-50 border-rose-300 text-rose-900';
                }
              } else if (isSelected) {
                btnClasses = 'bg-indigo-50 border-indigo-400 text-indigo-900';
              }

              return (
                <div key={opt.id} className="space-y-1">
                  <button
                    onClick={() => {
                      setSelectedOptionId(opt.id);
                      setQuizAnswered(true);
                    }}
                    className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${btnClasses}`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                      quizAnswered && isCorrect
                        ? 'border-emerald-500 bg-emerald-100 text-emerald-800'
                        : quizAnswered && isSelected && !isCorrect
                        ? 'border-rose-400 bg-rose-100 text-rose-800'
                        : 'border-slate-300 bg-white text-slate-500'
                    }`}>
                      {opt.id.slice(-1).toUpperCase()}
                    </div>
                    <span className="flex-1 leading-relaxed">{opt.text}</span>
                  </button>

                  {/* Option Explanation */}
                  {quizAnswered && (isCorrect || isSelected) && (
                    <div className="pl-9 pr-2 py-1 text-xs text-slate-600 leading-relaxed">
                      💡 {opt.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Mini Practice Challenge */}
      {fragment.challenge && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm text-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
              <span>Micro Practice Challenge</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">{fragment.challenge.title}</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {fragment.challenge.prompt}
          </p>

          <div className="space-y-2">
            <textarea
              rows={3}
              value={userChallengeInput}
              onChange={(e) => setUserChallengeInput(e.target.value)}
              placeholder="Type your solution or thought process..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all resize-none placeholder:text-slate-400"
            />

            <div className="flex items-center justify-between gap-2">
              {fragment.challenge.hint && (
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  💡 Hint: {fragment.challenge.hint}
                </span>
              )}

              <button
                onClick={handleEvaluateChallenge}
                disabled={isEvaluatingChallenge || !userChallengeInput.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ml-auto"
              >
                {isEvaluatingChallenge ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Evaluating...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Evaluate with AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Challenge Evaluation Result */}
          {challengeEvaluation && (
            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-indigo-800">
                <span>AI Evaluation Score: {challengeEvaluation.score}/10</span>
                <span>{challengeEvaluation.passed ? '✅ Great Job!' : '👍 Keep Refining'}</span>
              </div>
              <p className="text-slate-700">{challengeEvaluation.feedback}</p>
              {challengeEvaluation.highlights && (
                <ul className="list-disc pl-4 text-slate-600 space-y-1">
                  {challengeEvaluation.highlights.map((h: string, idx: number) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

        </div>
      )}

      {/* Bottom Complete & Next CTA Banner */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 border border-slate-200 rounded-xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              {isCompleted ? 'Fragment Completed & Mastered' : 'Ready to Complete Fragment?'}
            </h4>
            <p className="text-[11px] text-slate-500">
              {isCompleted ? 'Node complete! Advance to the next fragment node.' : 'Click to lock in +25 XP and unlock the next node.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleMarkComplete}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Award className="w-4 h-4" />
          <span>{isCompleted ? 'Completed (+25 XP)' : 'Mark Complete & Advance'}</span>
        </button>
      </div>

    </div>
  );
};
