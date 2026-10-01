import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, FileText, ExternalLink } from 'lucide-react';
import { internshipsData } from '../data/internships';
import './Internships.css';

export default function Internships() {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isManualInteracting, setIsManualInteracting] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const scrollPosRef = useRef(0);
  const isInteractingTimeoutRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Check mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update navigation button states (disable left at start, disable right at end)
  const updateScrollState = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 1) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const atStart = container.scrollLeft <= 4;
    const atEnd = container.scrollLeft >= maxScroll - 4;

    setCanScrollLeft(!atStart);
    setCanScrollRight(!atEnd);

    // If reached the end, stop auto-scrolling permanently
    if (atEnd) {
      setHasFinished(true);
    }
  }, []);

  // Initialize scroll position, observe container width, and compute button states
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollLeft = 0;
    scrollPosRef.current = 0;

    const updateDimensions = () => {
      if (container) {
        container.style.setProperty('--carousel-viewport-w', `${container.clientWidth}px`);
        updateScrollState();
      }
    };

    updateDimensions();

    let resizeObserver;
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(container);
    }

    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [updateScrollState]);

  // Finite Auto-Scroll Animation: [1] -> [2] -> [3] -> [4] -> STOP
  useEffect(() => {
    let animId;
    let lastTime = performance.now();

    const step = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      const container = containerRef.current;

      const shouldAutoScroll =
        container &&
        !hasFinished &&
        !isHovered &&
        !isManualInteracting &&
        !isMobile &&
        !prefersReducedMotion &&
        !isDraggingRef.current;

      if (shouldAutoScroll) {
        const maxScroll = container.scrollWidth - container.clientWidth;

        if (maxScroll <= 1) {
          setHasFinished(true);
          setCanScrollRight(false);
          setCanScrollLeft(false);
        } else {
          // Slow, smooth auto-scroll: ~45px per second
          const speed = 45;
          scrollPosRef.current += speed * dt;

          if (scrollPosRef.current >= maxScroll) {
            scrollPosRef.current = maxScroll;
            container.scrollLeft = maxScroll;
            setHasFinished(true);
            setCanScrollRight(false);
            setCanScrollLeft(true);
          } else {
            container.scrollLeft = scrollPosRef.current;
            if (scrollPosRef.current > 4) {
              setCanScrollLeft(true);
            }
          }
        }
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [hasFinished, isHovered, isManualInteracting, isMobile, prefersReducedMotion]);

  // Handle scroll events (manual scrolling or drag)
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    scrollPosRef.current = container.scrollLeft;
    updateScrollState();
  };

  // Manual Arrow Scroll: Previous (Left)
  const handleScrollLeft = () => {
    const container = containerRef.current;
    if (!container || !canScrollLeft) return;

    setIsManualInteracting(true);
    clearTimeout(isInteractingTimeoutRef.current);
    isInteractingTimeoutRef.current = setTimeout(() => {
      setIsManualInteracting(false);
    }, 2400);

    const card = container.querySelector('.internship-card');
    const scrollStep = card ? card.offsetWidth + 24 : 374;
    const targetScroll = Math.max(0, container.scrollLeft - scrollStep);

    container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    scrollPosRef.current = targetScroll;
  };

  // Manual Arrow Scroll: Next (Right)
  const handleScrollRight = () => {
    const container = containerRef.current;
    if (!container || !canScrollRight) return;

    setIsManualInteracting(true);
    clearTimeout(isInteractingTimeoutRef.current);
    isInteractingTimeoutRef.current = setTimeout(() => {
      setIsManualInteracting(false);
    }, 2400);

    const maxScroll = container.scrollWidth - container.clientWidth;
    const card = container.querySelector('.internship-card');
    const scrollStep = card ? card.offsetWidth + 24 : 374;
    const targetScroll = Math.min(maxScroll, container.scrollLeft + scrollStep);

    container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    scrollPosRef.current = targetScroll;

    if (targetScroll >= maxScroll - 4) {
      setHasFinished(true);
    }
  };

  // Mouse drag support for desktop (guards against clicks on links/buttons)
  const handleMouseDown = (e) => {
    if (isMobile) return;
    if (e.target.closest('a') || e.target.closest('button')) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - containerRef.current.offsetLeft;
    startScrollLeftRef.current = containerRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth;
    const nextScroll = Math.max(0, Math.min(maxScroll, startScrollLeftRef.current - walk));
    containerRef.current.scrollLeft = nextScroll;
    scrollPosRef.current = nextScroll;
    updateScrollState();
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  return (
    <section id="internships" className="section internships-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">EXPERIENCE</span>
          <h2 className="section-title">Internships</h2>
          <p className="section-description">
            Hands-on experience through internships and practical software development programs.
          </p>
        </div>

        {/* Carousel Controls Bar */}
        <div className="carousel-controls-bar">
          <button
            onClick={handleScrollLeft}
            className="carousel-nav-btn"
            aria-label="Previous internship card"
            title="Previous internship"
            disabled={!canScrollLeft}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleScrollRight}
            className="carousel-nav-btn"
            aria-label="Next internship card"
            title="Next internship"
            disabled={!canScrollRight}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Carousel Track Wrapper */}
        <div
          className="internships-carousel-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            handleMouseUpOrLeave();
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
        >
          <div
            ref={containerRef}
            className="internships-carousel-container"
            onScroll={handleScroll}
          >
            {/* EXACTLY 4 CARDS: Displayed once in sequence */}
            <div className="internships-carousel-track">
              {internshipsData.map((item) => (
                <article key={item.id} className="internship-card card">
                  {/* Top Banner: Large Company Logo Header */}
                  <div className="internship-card-banner">
                    <div className="internship-banner-pattern" aria-hidden="true" />
                    <div className="internship-logo-container">
                      <img
                        src={item.logoUrl}
                        alt={`${item.organization} logo`}
                        className="internship-logo-img"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="internship-card-body">
                    <div className="internship-header-info">
                      <h3 className="internship-org-name">{item.organization}</h3>
                      <div className="internship-role-row">
                        <span className="internship-role-title">{item.role}</span>
                      </div>
                    </div>

                    {/* Divider between role and description */}
                    <div className="internship-card-divider" />

                    {/* Description */}
                    <p className="internship-desc">{item.description}</p>

                    {/* View Certificate Button (aligned at bottom via margin-top: auto) */}
                    <div className="internship-card-footer">
                      <a
                        href={item.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="internship-cert-btn"
                        aria-label={`View ${item.organization} certificate in a new tab`}
                      >
                        <FileText size={15} className="cert-btn-icon cert-btn-icon-left" />
                        <span>View Certificate</span>
                        <ExternalLink size={14} className="cert-btn-icon cert-btn-icon-right" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
