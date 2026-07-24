import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  Layers, 
  FileCheck
} from 'lucide-react';
import { LearningPath } from '../types';

interface TextFragmentizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPathCreated: (newPath: LearningPath) => void;
}

const SAMPLE_TEXTS = [
  {
    title: 'PostgreSQL WAL & MVCC Mechanics',
    text: `PostgreSQL implements Multi-Version Concurrency Control (MVCC) to provide transactional isolation with minimal lock contention. Instead of locking rows during updates, PostgreSQL creates a new version (tuple) of the row with updated transaction ID metadata (xmin and xmax). Old tuples remain on disk until removed by VACUUM processes. Write-Ahead Logging (WAL) ensures durability by writing all transaction modifications to a sequential disk log before updating data pages. In the event of a system crash, PostgreSQL replays the WAL files during recovery to bring data pages to a consistent state.`,
  },
  {
    title: 'Docker Container Isolation Principles',
    text: `Containers leverage Linux Kernel Namespaces and Control Groups (cgroups) to provide process isolation without the overhead of a guest operating system hypervisor. Namespaces isolate resources such as Process IDs (PID namespace), Network Interfaces (net namespace), Mount points (mnt namespace), and Users. Control Groups restrict and monitor resource allocation including CPU, memory, disk I/O, and network bandwidth per container. The Union File System (UnionFS) combines read-only base image layers with a single writable top container layer, enabling instant startup times and high disk storage reuse across containers.`,
  },
  {
    title: 'Synaptic Plasticity & Long-Term Potentiation',
    text: `Long-Term Potentiation (LTP) is the persistent strengthening of synapses based on recent patterns of activity. It is widely considered one of the primary cellular mechanisms underlying learning and memory. When high-frequency electrical impulses pass through a presynaptic neuron, glutamate neurotransmitters bind to postsynaptic AMPA and NMDA receptors. The influx of calcium ions through NMDA channels triggers intracellular signal cascades, resulting in the insertion of additional AMPA receptors into the postsynaptic membrane. This increased receptor density enhances future signal transmission efficiency across that specific neural pathway.`,
  },
];

export const TextFragmentizerModal: React.FC<TextFragmentizerModalProps> = ({
  isOpen,
  onClose,
  onPathCreated,
}) => {
  const [sourceText, setSourceText] = useState('');
  const [titleHint, setTitleHint] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFragmentize = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!sourceText.trim() || sourceText.length < 20) {
      setErrorMsg('Please paste at least 20 characters of article or notes text.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/fragmentize/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceText,
          titleHint: titleHint.trim() || 'Deconstructed Notes',
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to fragmentize text');
      }

      const data = await res.json();
      if (data.success && data.path) {
        onPathCreated(data.path);
        onClose();
        setSourceText('');
        setTitleHint('');
      } else {
        throw new Error('Invalid path response');
      }
    } catch (err: any) {
      console.error('Fragmentize failed:', err);
      setErrorMsg(err.message || 'Error processing document. Try a shorter section or retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden text-slate-800">
        
        {/* Header Banner */}
        <div className="relative bg-white p-6 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-800">Text Fragmentizer</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Paste long articles, documentation, or study notes to convert into 3-minute learning cards.
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
        <form onSubmit={handleFragmentize} className="p-6 space-y-5">
          
          {errorMsg && (
            <div className="flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Optional Title Hint */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Document / Article Title (Optional)
            </label>
            <input
              type="text"
              value={titleHint}
              onChange={(e) => setTitleHint(e.target.value)}
              placeholder="e.g. PostgreSQL Architecture Notes, Quantum Mechanics Chapter 2..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition-all placeholder:text-slate-400"
              disabled={isLoading}
            />
          </div>

          {/* Text Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Paste Source Text or Article</span>
              </label>
              <span className="text-[11px] text-slate-500">
                {sourceText.length} characters
              </span>
            </div>

            <textarea
              rows={6}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Paste raw text, research notes, transcript, or complex documentation here..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs leading-relaxed focus:outline-none focus:border-indigo-600 focus:bg-white transition-all placeholder:text-slate-400 resize-none"
              disabled={isLoading}
            />

            {/* Quick Sample Presets */}
            <div className="pt-1">
              <p className="text-[11px] font-medium text-slate-500 mb-2 flex items-center gap-1">
                <FileCheck className="w-3 h-3 text-indigo-600" />
                <span>Or load a sample text to try out:</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_TEXTS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTitleHint(sample.title);
                      setSourceText(sample.text);
                    }}
                    disabled={isLoading}
                    className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-lg transition-colors text-left font-medium"
                  >
                    {sample.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
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
              disabled={isLoading || !sourceText.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Fragmentizing Document...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Deconstruct Into Cards</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
