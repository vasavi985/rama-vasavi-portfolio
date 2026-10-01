import React, { useState, useRef, useEffect } from 'react';
import { GraduationCap, Code, Layers, Calendar, CheckCircle2 } from 'lucide-react';
import { skillCategories, educationData } from '../data/skills';
import './About.css';

export default function About() {
  const summaryPoints = [
    "Passionate about software development and modern web applications.",
    "Enjoy building clean, responsive, and practical websites.",
    "Continuously learning and turning ideas into real-world digital solutions."
  ];

  const [isRevealed, setIsRevealed] = useState(false);
  const timelineRef = useRef(null);
  const firstDotRef = useRef(null);

  useEffect(() => {
    const updateLine = () => {
      if (!timelineRef.current || !firstDotRef.current) return;
      const timelineRect = timelineRef.current.getBoundingClientRect();
      const firstDotRect = firstDotRef.current.getBoundingClientRect();

      const top = firstDotRect.top + firstDotRect.height / 2 - timelineRect.top;
      timelineRef.current.style.setProperty('--line-top', `${Math.round(top)}px`);
    };

    updateLine();
    window.addEventListener('resize', updateLine);

    let resizeObs;
    if (typeof ResizeObserver !== 'undefined' && timelineRef.current) {
      resizeObs = new ResizeObserver(updateLine);
      resizeObs.observe(timelineRef.current);
    }

    let intersectObs;
    if (typeof IntersectionObserver !== 'undefined' && timelineRef.current) {
      intersectObs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            updateLine();
          }
        },
        { threshold: 0.15 }
      );
      intersectObs.observe(timelineRef.current);
    } else {
      setIsRevealed(true);
    }

    return () => {
      window.removeEventListener('resize', updateLine);
      if (resizeObs) resizeObs.disconnect();
      if (intersectObs) intersectObs.disconnect();
    };
  }, []);

  return (
    <section id="about" className="section about-section">
      <div className="container">
        {/* Section Header: Simply starts with About Me, no top background badge */}
        <div className="section-header">
          <h2 className="section-title">About Me</h2>
          <p className="section-description">
            Academic foundation, software development focus, and continuous learning.
          </p>
        </div>

        {/* Two-Column Equal Height Grid */}
        <div className="about-grid">
          {/* LEFT COLUMN: Professional Summary + Technical Skills */}
          <div className="about-card card">
            {/* 1. Professional Summary with 3 Check-Circle Bullet Points */}
            <div className="about-summary-block">
              <h3 className="about-block-title">
                <Code size={18} className="title-icon" />
                <span>Professional Summary</span>
              </h3>

              <ul className="summary-points-list">
                {summaryPoints.map((point, idx) => (
                  <li key={idx} className="summary-point-item">
                    <CheckCircle2 size={15} className="summary-point-icon" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Divider */}
            <div className="about-card-divider" />

            {/* 2. Technical Skills (5 Compact Categories) */}
            <div className="about-skills-block">
              <h3 className="about-block-title">
                <Layers size={18} className="title-icon" />
                <span>Technical Skills</span>
              </h3>

              <div className="skills-categories-list">
                {skillCategories.map((cat, idx) => (
                  <div key={idx} className="skill-category-group">
                    <span className="skill-category-name">{cat.category}</span>
                    <div className="skill-pills">
                      {cat.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="tech-badge">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Education Timeline */}
          <div className="about-card card">
            <h3 className="about-block-title">
              <GraduationCap size={19} className="title-icon" />
              <span>Education</span>
            </h3>

            <div className={`education-timeline ${isRevealed ? 'revealed' : ''}`} ref={timelineRef}>
              {educationData.map((edu, idx) => (
                <div key={edu.id} className="education-item">
                  <div
                    className="timeline-dot"
                    ref={idx === 0 ? firstDotRef : null}
                  />

                  <div className="education-item-content">
                    <h4 className="education-title">{edu.degree}</h4>
                    <div className="education-institution">{edu.institution}</div>

                    <div className="education-meta">
                      <div className="education-duration">
                        <Calendar size={15} className="education-calendar-icon" />
                        <span>{edu.duration}</span>
                      </div>
                      <div className="education-cgpa">
                        CGPA: {edu.cgpa}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
