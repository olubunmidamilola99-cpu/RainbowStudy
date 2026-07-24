import React, { useMemo } from 'react';
import { ThemePreset } from '../types';

interface StarryNightBackgroundProps {
  themePreset?: ThemePreset;
  enableAnimations?: boolean;
}

export const StarryNightBackground: React.FC<StarryNightBackgroundProps> = ({
  themePreset = 'starlight',
  enableAnimations = true,
}) => {
  // Generate a procedural cluster of stars
  const stars = useMemo(() => {
    const starList = [];
    const count = 90;
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() < 0.2 ? (Math.random() * 2 + 2) : (Math.random() * 1.8 + 0.8);
      const speed = enableAnimations
        ? (i % 3 === 0 ? 'animate-twinkle-fast' : i % 2 === 0 ? 'animate-twinkle-mid' : 'animate-twinkle-slow')
        : 'opacity-60';
      const delay = `${(Math.random() * 5).toFixed(1)}s`;
      const colorClass = i % 5 === 0 ? 'bg-indigo-200 shadow-[0_0_8px_rgba(199,210,254,0.8)]' : i % 7 === 0 ? 'bg-amber-100 shadow-[0_0_6px_rgba(254,243,199,0.8)]' : i % 9 === 0 ? 'bg-cyan-200 shadow-[0_0_8px_rgba(165,243,252,0.8)]' : 'bg-white shadow-[0_0_5px_rgba(255,255,255,0.7)]';

      starList.push({ id: i, x, y, size, speed, delay, colorClass });
    }
    return starList;
  }, [enableAnimations]);

  // Gradient styles per theme preset
  const getThemeGradient = () => {
    switch (themePreset) {
      case 'sunset':
        return 'from-purple-950 via-slate-950 to-amber-950/80';
      case 'emerald':
        return 'from-emerald-950 via-slate-950 to-slate-950';
      case 'twilight':
        return 'from-fuchsia-950 via-slate-950 to-indigo-950';
      case 'daylight':
        return 'from-sky-100 via-slate-100 to-indigo-50';
      case 'starlight':
      default:
        return 'from-indigo-950 via-slate-950 to-slate-950';
    }
  };

  const isDaylight = themePreset === 'daylight';

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-700 ${
      isDaylight ? 'bg-slate-100' : 'bg-slate-950'
    }`}>
      {/* Radial Gradient Base */}
      <div 
        className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${getThemeGradient()} transition-all duration-700 opacity-95`} 
      />

      {/* Cosmic Nebula Glows */}
      {!isDaylight && (
        <>
          <div className={`absolute -top-32 -left-32 w-96 h-96 bg-indigo-900/30 rounded-full blur-3xl ${enableAnimations ? 'animate-nebula' : ''} pointer-events-none`} />
          <div className={`absolute top-1/3 -right-20 w-80 h-80 bg-purple-900/25 rounded-full blur-3xl ${enableAnimations ? 'animate-nebula [animation-delay:3s]' : ''} pointer-events-none`} />
          <div className={`absolute -bottom-20 left-1/4 w-[30rem] h-[30rem] bg-slate-900/40 rounded-full blur-3xl ${enableAnimations ? 'animate-nebula [animation-delay:6s]' : ''} pointer-events-none`} />
        </>
      )}

      {/* Daylight Clouds Effect */}
      {isDaylight && (
        <>
          <div className="absolute top-10 left-10 w-96 h-32 bg-white/60 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-80 h-28 bg-indigo-100/70 rounded-full blur-2xl pointer-events-none" />
        </>
      )}

      {/* Starlight Dust / Star Points */}
      {!isDaylight && stars.map((star) => (
        <div
          key={star.id}
          className={`absolute rounded-full ${star.colorClass} ${star.speed}`}
          style={{
            top: `${star.y}%`,
            left: `${star.x}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
          }}
        />
      ))}

      {/* Symbolic Sparkle Stars */}
      {!isDaylight && (
        <>
          <div className={`absolute top-12 left-10 text-indigo-200/40 ${enableAnimations ? 'animate-float-star' : ''} opacity-60`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>

          <div className={`absolute top-1/4 right-16 text-amber-200/50 ${enableAnimations ? 'animate-float-star [animation-delay:2s]' : ''} opacity-70`}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>

          <div className={`absolute top-2/3 left-1/6 text-cyan-200/40 ${enableAnimations ? 'animate-float-star [animation-delay:4s]' : ''} opacity-50`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>

          {/* Shooting Stars */}
          {enableAnimations && (
            <>
              <div className="absolute top-16 right-12 w-48 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-200 to-white shooting-star-effect transform -rotate-45" />
              <div className="absolute top-2/3 right-1/3 w-60 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-200 to-white shooting-star-effect [animation-delay:4.5s] transform -rotate-45" />
            </>
          )}

          {/* Crescent Moon */}
          <div className="absolute top-8 right-8 opacity-15 pointer-events-none">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-amber-200">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="rgba(254,243,199,0.15)" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
};
