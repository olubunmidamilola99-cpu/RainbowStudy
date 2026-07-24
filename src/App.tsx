import React, { useState, useEffect } from 'react';
import { UserPreferences } from './types';
import { Navbar } from './components/Navbar';
import { StudyExamHub } from './components/StudyExamHub';
import { StarryNightBackground } from './components/StarryNightBackground';
import { WelcomeLandingModal } from './components/WelcomeLandingModal';
import { CustomDesignerModal } from './components/CustomDesignerModal';

const DEFAULT_PREFS: UserPreferences = {
  userName: '',
  userRole: 'student',
  themePreset: 'starlight',
  fontFamily: 'sans',
  fontScale: 'standard',
  accentColor: 'indigo',
  chatCharacter: 'rainbow',
  enableAnimations: true,
  hasOnboarded: false,
};

export default function App() {
  const [prefs, setPrefs] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('rainbow_user_prefs');
      if (saved) return { ...DEFAULT_PREFS, ...JSON.parse(saved) };
    } catch (e) {
      console.error('Error loading preferences:', e);
    }
    return DEFAULT_PREFS;
  });

  const [isDesignerOpen, setIsDesignerOpen] = useState(false);
  // ALWAYS land on the Landing Platform when refreshing or visiting the app
  const [isLandingOpen, setIsLandingOpen] = useState(true);

  const handleOpenDesigner = () => {
    setIsLandingOpen(false);
    setIsDesignerOpen(true);
  };

  const handleOpenLanding = () => {
    setIsDesignerOpen(false);
    setIsLandingOpen(true);
  };

  // Save preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rainbow_user_prefs', JSON.stringify(prefs));
    } catch (e) {
      console.error('Error saving preferences:', e);
    }
  }, [prefs]);

  const updatePrefs = (updated: Partial<UserPreferences>) => {
    setPrefs((prev) => ({ ...prev, ...updated }));
  };

  const fontClass = prefs.fontFamily === 'serif'
    ? 'font-serif'
    : prefs.fontFamily === 'mono'
    ? 'font-mono'
    : prefs.fontFamily === 'dyslexic'
    ? 'font-sans tracking-wide leading-relaxed font-medium'
    : prefs.fontFamily === 'display'
    ? 'font-sans tracking-tight font-extrabold'
    : prefs.fontFamily === 'rounded'
    ? 'font-sans tracking-normal font-medium'
    : prefs.fontFamily === 'handwriting'
    ? 'font-serif italic tracking-wide'
    : prefs.fontFamily === 'modern'
    ? 'font-sans uppercase tracking-wider font-semibold'
    : 'font-sans';

  const scaleClass = prefs.fontScale === 'large'
    ? 'text-base'
    : prefs.fontScale === 'compact'
    ? 'text-xs'
    : 'text-sm';

  const isDaylight = prefs.themePreset === 'daylight';
  const showWelcomeModal = (!prefs.hasOnboarded || isLandingOpen) && !isDesignerOpen;

  return (
    <div 
      className={`relative min-h-screen ${fontClass} ${scaleClass} antialiased selection:bg-indigo-500 selection:text-white overflow-x-hidden ${
        isDaylight ? 'text-slate-900 bg-slate-100' : 'text-slate-100 bg-slate-950'
      }`}
      data-theme={prefs.themePreset}
      data-accent={prefs.accentColor}
    >
      
      {/* Symbolic Starlight & Night Time Background */}
      <StarryNightBackground 
        themePreset={prefs.themePreset} 
        enableAnimations={prefs.enableAnimations} 
      />

      {/* Rainbow Top Accent Bar */}
      <div className="relative z-50 h-1.5 w-full bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-cyan-400 via-indigo-600 to-purple-600 sticky top-0 shadow-sm" />

      {/* Navbar */}
      <div className="relative z-40">
        <Navbar 
          prefs={prefs}
          onOpenDesigner={handleOpenDesigner}
          onOpenLanding={handleOpenLanding}
        />
      </div>

      {/* Main Container Body */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 pt-6 pb-16">
        <StudyExamHub 
          prefs={prefs}
          onOpenDesigner={handleOpenDesigner}
          onOpenLanding={handleOpenLanding}
        />
      </main>

      {/* Welcome Landing Modal (On First Visit or when user requests) */}
      {showWelcomeModal && (
        <WelcomeLandingModal 
          prefs={prefs}
          onSave={(updated) => updatePrefs(updated)}
          onClose={() => setIsLandingOpen(false)}
          onOpenDesigner={handleOpenDesigner}
          isInitialLanding={!prefs.hasOnboarded}
        />
      )}

      {/* Custom Designer Modal (Themes, Colors, Fonts) */}
      {isDesignerOpen && (
        <CustomDesignerModal 
          prefs={prefs}
          onUpdate={(updated) => updatePrefs(updated)}
          onClose={() => setIsDesignerOpen(false)}
        />
      )}

    </div>
  );
}
