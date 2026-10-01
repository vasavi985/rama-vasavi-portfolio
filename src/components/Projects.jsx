import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { projectsData } from '../data/projects';
import ProjectCard from './ProjectCard';
import './Projects.css';

export default function Projects() {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isManualInteracting, setIsManualInteracting] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 680;
    }
    return false;
  });

  const scrollPosRef = useRef(0);
  const isInteractingTimeoutRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (!window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Check mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 680);
    };
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

  // Finite Auto-Scroll Animation: [1] -> [2] -> ... -> STOP (No infinite looping)
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

    const card = container.querySelector('.project-card');
    const scrollStep = card ? card.offsetWidth + 20 : 374;
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
    const card = container.querySelector('.project-card');
    const scrollStep = card ? card.offsetWidth + 20 : 374;
    const targetScroll = Math.min(maxScroll, container.scrollLeft + scrollStep);

    container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    scrollPosRef.current = targetScroll;

    if (targetScroll >= maxScroll - 4) {
      setHasFinished(true);
    }
  };

  // Mouse drag support for desktop
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
    <section id="projects" className="section projects-section">
      <div className="container">
        {/* Clean Section Header (No Portfolio Pill) */}
        <div className="section-header">
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-description">
            Selected projects built to solve practical problems through modern software development.
          </p>
        </div>

        {/* Carousel Controls Bar */}
        <div className="carousel-controls-bar">
          <button
            onClick={handleScrollLeft}
            className="carousel-nav-btn"
            aria-label="Previous project card"
            title="Previous project"
            disabled={!canScrollLeft}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleScrollRight}
            className="carousel-nav-btn"
            aria-label="Next project card"
            title="Next project"
            disabled={!canScrollRight}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Carousel Track Wrapper */}
        <div
          className="projects-carousel-wrapper"
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
            className="projects-carousel-container"
            onScroll={handleScroll}
          >
            <div className="projects-carousel-track">
              {projectsData.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
