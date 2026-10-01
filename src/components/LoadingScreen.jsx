import React, { useState, useEffect, useRef } from 'react';
import './LoadingScreen.css';

export default function LoadingScreen({ onFinish, onFadeOut }) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Loading duration: 2.3 seconds for standard, 0.4s if reduced motion
    const duration = prefersReducedMotion ? 400 : 2300;
    const startTime = performance.now();
    let animId;

    const tick = (now) => {
      const elapsed = now - startTime;
      const linearRatio = Math.min(1, elapsed / duration);

      // Smooth custom easing: gentle start, steady acceleration, clean settle
      const easedRatio =
        linearRatio < 0.5
          ? 2 * linearRatio * linearRatio
          : -1 + (4 - 2 * linearRatio) * linearRatio;

      const currentProgress = Math.min(100, Math.round(easedRatio * 100));
      setProgress(currentProgress);

      if (linearRatio < 1) {
        animId = requestAnimationFrame(tick);
      } else {
        // Reached 100%
        if (!hasFinishedRef.current) {
          hasFinishedRef.current = true;
          // Hold briefly at 100% for user satisfaction, then fade out
          const holdTime = prefersReducedMotion ? 100 : 350;
          setTimeout(() => {
            setIsFadingOut(true);
            if (onFadeOut) onFadeOut();
            // After fade transition finishes, notify parent
            const fadeTime = prefersReducedMotion ? 200 : 650;
            setTimeout(() => {
              if (onFinish) onFinish();
            }, fadeTime);
          }, holdTime);
        }
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [onFinish, onFadeOut]);

  return (
    <div
      className={`loading-screen-backdrop ${isFadingOut ? 'is-fading-out' : ''}`}
      aria-live="polite"
      aria-label="Loading portfolio"
      role="status"
    >
      {/* Subtle Ambient Glow Background Orbs */}
      <div className="loading-ambient-orb orb-blue" aria-hidden="true" />
      <div className="loading-ambient-orb orb-purple" aria-hidden="true" />

      {/* Center Content Container */}
      <div className="loading-center-card">
        {/* 1. Small Heading */}
        <span className="loading-eyebrow">LOADING PORTFOLIO</span>

        {/* 2. Main Name with Blue -> Purple -> Pink Gradient */}
        <h1 className="loading-name">Rama Vasavi</h1>

        {/* 3. Role */}
        <p className="loading-role">Java Full Stack Developer</p>

        {/* 4. Progress Bar */}
        <div className="loading-progress-wrapper" aria-hidden="true">
          <div className="loading-progress-track">
            <div
              className="loading-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 5. Percentage Indicator */}
        <div className="loading-percentage-row">
          <span className="loading-percentage">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
