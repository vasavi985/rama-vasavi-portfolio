import React from 'react';
import { ExternalLink, Download } from 'lucide-react';
import './ProjectCard.css';

// Helper to verify if URL is a valid, real web link (rejects placeholder strings like "[Add ...]")
const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) return false;
  if (trimmed === '#' || trimmed === '') return false;
  return trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/');
};

export default function ProjectCard({ project }) {
  const hasLiveUrl = isValidUrl(project.liveUrl);

  const bannerInner = (
    <>
      <div className="project-banner-pattern" aria-hidden="true" />
      {project.image ? (
        <div className="project-image-container">
          <img
            src={project.image}
            alt={`${project.title} screenshot`}
            className="project-card-image"
            loading="lazy"
            draggable={false}
          />
        </div>
      ) : (
        <div className="project-preview-window">
          <div className="project-browser-bar" aria-hidden="true">
            <span className="project-browser-dot dot-red" />
            <span className="project-browser-dot dot-yellow" />
            <span className="project-browser-dot dot-green" />
          </div>
          <div className="project-preview-brand">
            <span className="project-preview-name">{project.title.split('–')[0].trim()}</span>
          </div>
        </div>
      )}
    </>
  );

  return (
    <article className="project-card card">
      {/* 1. Project Image (Clickable: opens live website in a new tab) */}
      {hasLiveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="project-card-banner is-clickable"
          aria-label={`Open live website for ${project.title} in a new tab`}
        >
          {bannerInner}
        </a>
      ) : (
        <div className="project-card-banner" aria-label={project.title}>
          {bannerInner}
        </div>
      )}

      {/* Card Content Below Image */}
      <div className="project-card-body">
        {/* 2. Project Name */}
        <h3 className="project-card-name" title={project.title}>
          {project.title}
        </h3>

        {/* 3. Divider */}
        <div className="project-card-divider" />

        {/* 4. Short Description explaining what the website/project does */}
        <p className="project-card-desc">
          {project.shortDescription}
        </p>

        {/* 5. Action Buttons: "Visit Site" and optional "Download PDF" (e.g. StreamScope) */}
        {(hasLiveUrl || project.pdfUrl) && (
          <div className="project-card-action">
            {hasLiveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-visit-btn"
                aria-label={`Visit ${project.title} website in a new tab`}
              >
                <span>Visit Site</span>
                <ExternalLink size={13} className="project-visit-btn-icon" />
              </a>
            )}

            {project.pdfUrl && (
              <a
                href={project.pdfUrl}
                download="StreamScope-Netflix-Content-Analysis.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="project-visit-btn"
                aria-label={`Download ${project.title} PDF report`}
              >
                <span>Download PDF</span>
                <Download size={13} className="project-visit-btn-icon project-pdf-btn-icon" />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
