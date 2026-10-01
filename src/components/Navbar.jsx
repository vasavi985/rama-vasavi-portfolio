import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { profileData } from '../data/profile';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['home', 'internships', 'about', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Home', target: 'home' },
    { label: 'Internships', target: 'internships' },
    { label: 'About', target: 'about' },
    { label: 'Projects', target: 'projects' },
    { label: 'Contact', target: 'contact' },
  ];

  return (
    <header className={`navbar-header ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-container">
        {/* Brand / Logo */}
        <a 
          href="#home" 
          onClick={(e) => handleNavClick(e, 'home')} 
          className="navbar-brand"
          aria-label="Rama Vasavi - Home"
        >
          <span className="brand-dot"></span>
          <span className="brand-name">{profileData.name}</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav desktop-nav" aria-label="Main Navigation">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.target} className="nav-item">
                <a
                  href={`#${link.target}`}
                  onClick={(e) => handleNavClick(e, link.target)}
                  className={`nav-link ${activeSection === link.target ? 'nav-link-active' : ''}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions: Theme Toggle, Social Links, and Mobile Menu */}
        <div className="navbar-actions">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          <a
            href={profileData.contact.github.startsWith('http') ? profileData.contact.github : 'https://github.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-social-btn"
            aria-label="GitHub Profile"
            title="GitHub"
          >
            <GithubIcon size={18} />
          </a>
          <a
            href={profileData.contact.linkedin.startsWith('http') ? profileData.contact.linkedin : 'https://linkedin.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-social-btn"
            aria-label="LinkedIn Profile"
            title="LinkedIn"
          >
            <LinkedinIcon size={18} />
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'drawer-open' : ''}`}>
        <ul className="mobile-nav-list">
          {navLinks.map((link) => (
            <li key={link.target} className="mobile-nav-item">
              <a
                href={`#${link.target}`}
                onClick={(e) => handleNavClick(e, link.target)}
                className={`mobile-nav-link ${activeSection === link.target ? 'mobile-nav-active' : ''}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="mobile-social-links">
          <a
            href={profileData.contact.github.startsWith('http') ? profileData.contact.github : 'https://github.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-social-pill"
          >
            <GithubIcon size={16} />
            <span>GitHub</span>
          </a>
          <a
            href={profileData.contact.linkedin.startsWith('http') ? profileData.contact.linkedin : 'https://linkedin.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-social-pill"
          >
            <LinkedinIcon size={16} />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </header>
  );
}
