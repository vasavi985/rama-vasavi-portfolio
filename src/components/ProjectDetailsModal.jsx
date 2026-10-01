import React, { useEffect } from 'react';
import { X, ExternalLink, CheckCircle2, Play, Video, UserCheck, Layers, Info } from 'lucide-react';
import { GithubIcon } from './Icons';
import './ProjectDetailsModal.css';

export default function ProjectDetailsModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!project) return null;

  const isLiveUrlValid = project.liveUrl && project.liveUrl.startsWith('http');
  const isGithubUrlValid = project.githubUrl && project.githubUrl.startsWith('http');
  const hasVideo = Boolean(project.videoUrl && project.videoUrl.trim() !== '');

  const renderVideoPlayer = () => {
    if (!hasVideo) {
      return (
        <div className="video-placeholder-container">
          <div className="video-placeholder-screen">
            <div className="video-icon-circle">
              <Play size={28} className="video-play-icon" />
            </div>
            <h4 className="placeholder-status-title">Project Demo Video Coming Soon</h4>
            <p className="placeholder-status-note">
              To display a demo video, add a video URL or local file path to <code>videoUrl</code> in <code>src/data/projects.js</code>.
            </p>
          </div>
        </div>
      );
    }

    // If it's a YouTube URL or embed
    if (project.videoUrl.includes('youtube.com') || project.videoUrl.includes('youtu.be')) {
      let embedUrl = project.videoUrl;
      if (project.videoUrl.includes('watch?v=')) {
        embedUrl = project.videoUrl.replace('watch?v=', 'embed/');
      }
      return (
        <div className="video-embed-container">
          <iframe
            src={embedUrl}
            title={`${project.title} Demo Video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="video-iframe"
          ></iframe>
        </div>
      );
    }

    // Default HTML5 video player (for mp4, webm, local files)
    return (
      <div className="video-html5-container">
        <video controls className="video-player-element" preload="metadata">
          <source src={project.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-title"
    >
      <div className="modal-dialog card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <h2 id="modal-title" className="modal-title">{project.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close project details"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="modal-body">
          {/* 1. PROJECT DEMO SECTION */}
          <div className="modal-section demo-section">
            <div className="section-label-bar">
              <Video size={16} />
              <span className="section-label-text">PROJECT DEMO</span>
            </div>
            {renderVideoPlayer()}
          </div>

          {/* 2. DESCRIPTION */}
          <div className="modal-section">
            <h3 className="modal-subheading">Project Overview</h3>
            <p className="modal-description">{project.description}</p>
          </div>

          {/* 3. MY CONTRIBUTION / ROLE */}
          <div className="modal-section role-section">
            <h3 className="modal-subheading">
              <UserCheck size={18} className="subheading-icon" />
              <span>Role & Contribution</span>
            </h3>
            <div className="role-card">
              <p className="role-text">{project.role}</p>
            </div>
          </div>

          {/* 4. KEY FEATURES */}
          <div className="modal-section">
            <h3 className="modal-subheading">Key Features</h3>
            <ul className="modal-features-list">
              {project.features.map((feature, idx) => (
                <li key={idx} className="feature-item">
                  <CheckCircle2 size={16} className="feature-check" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 5. TECHNOLOGY STACK */}
          <div className="modal-section">
            <h3 className="modal-subheading">
              <Layers size={18} className="subheading-icon" />
              <span>Technology Stack</span>
            </h3>
            <div className="modal-tech-pills">
              {project.technologies.map((tech, idx) => (
                <span key={idx} className="tech-badge">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="modal-footer">
          <div className="footer-links">
            {isLiveUrlValid ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary modal-action-btn"
              >
                <span>Live Website</span>
                <ExternalLink size={16} />
              </a>
            ) : (
              <button
                type="button"
                className="btn btn-secondary modal-action-btn btn-placeholder"
                title="Configurable in src/data/projects.js"
              >
                <span>[Add Live Website URL]</span>
                <Info size={14} />
              </button>
            )}

            {isGithubUrlValid ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary modal-action-btn"
              >
                <GithubIcon size={16} />
                <span>GitHub</span>
              </a>
            ) : (
              <button
                type="button"
                className="btn btn-secondary modal-action-btn btn-placeholder"
                title="Configurable in src/data/projects.js"
              >
                <GithubIcon size={16} />
                <span>[Add GitHub Repository URL]</span>
              </button>
            )}
          </div>

          <button onClick={onClose} className="btn btn-secondary modal-close-action">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
