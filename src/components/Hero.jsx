import React, { useState, useEffect } from 'react';
import { ArrowRight, Mail, Terminal } from 'lucide-react';
import { profileData } from '../data/profile';
import profilePhoto from '../assets/profile.jpg';
import './Hero.css';

// 5 Curated Dynamic Taglines
const taglines = [
  "Turning ideas into full-stack applications.",
  "Building practical software that solves real-world problems.",
  "Creating scalable applications with clean code.",
  "Exploring data-driven solutions through technology.",
  "Passionate about building useful software."
];

export default function Hero() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [taglineAnimClass, setTaglineAnimClass] = useState('tagline-active');
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Automatic tagline loop: 3s display + 600ms smooth fade & vertical slide
  useEffect(() => {
    const displayDuration = 3000;
    const exitDuration = 600;

    const timer = setInterval(() => {
      // 1. Old tagline smoothly fades out and moves upward slightly
      setTaglineAnimClass('tagline-exit');

      setTimeout(() => {
        // 2. Next tagline smoothly fades in from slightly below
        setTaglineIndex((prev) => (prev + 1) % taglines.length);
        setTaglineAnimClass('tagline-enter');
      }, exitDuration);
    }, displayDuration + exitDuration);

    return () => clearInterval(timer);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize between -1 and +1
    const xPct = (x / rect.width - 0.5) * 2;
    const yPct = (y / rect.height - 0.5) * 2;
    
    // Very subtle tilt: maximum 1.8 degrees
    const maxTilt = 1.8;
    setTilt({
      x: -yPct * maxTilt,
      y: xPct * maxTilt
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section id="home" className="hero-section">
      <div className="container hero-container">
        {/* Left Column: Introduction & Actions */}
        <div className="hero-content">
          <div className="hero-greeting">
            <span className="greeting-badge">
              <Terminal size={14} className="greeting-icon" />
              <span>HI, I'M</span>
            </span>
          </div>

          <h1 className="hero-name">{profileData.name}</h1>

          {/* Fixed Professional Title: Permanently visible, completely static */}
          <div className="hero-fixed-title">
            <span className="hero-title-segment-1">Java Full Stack Developer</span>
            <span className="hero-title-separator">|</span>
            <span className="hero-title-segment-2">Software Engineer</span>
          </div>

          {/* Dynamic Tagline Carousel: Reserved height prevents jumping */}
          <div className="hero-tagline-wrapper">
            <p className={`hero-dynamic-tagline ${taglineAnimClass}`}>
              {taglines[taglineIndex]}
            </p>
          </div>

          {/* Short Bio */}
          <p className="hero-description">
            {profileData.introduction}
          </p>

          {/* Call to Actions */}
          <div className="hero-actions">
            <button onClick={() => scrollTo('projects')} className="btn btn-primary">
              <span>View Projects</span>
              <ArrowRight size={18} />
            </button>
            <button onClick={() => scrollTo('contact')} className="btn btn-secondary">
              <Mail size={18} />
              <span>Contact Me</span>
            </button>
          </div>
        </div>

        {/* Right Column: Clean, Elegant Professional Profile Portrait */}
        <div className="hero-visual">
          <div 
            className="profile-frame-wrapper"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: isHovered 
                ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)` 
                : 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)',
            }}
          >
            {/* The circular photo frame with thick gradient border and subtle shadow/glow */}
            <div className="profile-photo-circle">
              <img
                src={profilePhoto}
                alt="Rama Vasavi - Java Full Stack Developer & Data Science Enthusiast"
                className="profile-image"
              />

              {/* Diagonal Light Reflection Sweep (passes across once on hover) */}
              <div className="photo-light-sweep" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
