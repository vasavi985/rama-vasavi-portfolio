import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      role="switch"
      aria-checked={isDark}
    >
      <span className="theme-toggle-track">
        {/* Sun Icon */}
        <span 
          className={`theme-toggle-icon sun-icon ${!isDark ? 'active-mode' : ''}`}
          aria-hidden="true"
        >
          <Sun size={15} strokeWidth={2.4} />
        </span>

        {/* Moon Icon */}
        <span 
          className={`theme-toggle-icon moon-icon ${isDark ? 'active-mode' : ''}`}
          aria-hidden="true"
        >
          <Moon size={14} strokeWidth={2.4} />
        </span>

        {/* Sliding Indicator Thumb */}
        <span 
          className={`theme-toggle-thumb ${isDark ? 'thumb-dark' : 'thumb-light'}`}
          aria-hidden="true"
        />
      </span>
    </button>
  );
}
