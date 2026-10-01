import React from 'react';
import { Eye } from 'lucide-react';
import './Footer.css';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="portfolio-footer">
      <div className="container footer-container">
        <p className="footer-copyright">
          © {currentYear} Rama Vasavi. All rights reserved.
        </p>

        {/* Real Vercel Web Analytics Visitor Badge */}
        <div
          className="visitor-analytics-card"
          title="Real website traffic is securely monitored via Vercel Web Analytics"
          aria-label="Visitors tracked via Vercel Web Analytics"
        >
          <span className="visitor-status-dot" aria-hidden="true" />
          <Eye size={14} className="visitor-card-icon" />
          <span className="visitor-card-label">Visitors</span>
        </div>
      </div>
    </footer>
  );
}
