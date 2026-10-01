import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, MessageSquare, ExternalLink } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { profileData } from '../data/profile';
import { sendContactEmail } from '../services/emailService';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string } | null

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear alert when user starts typing again
    if (status) {
      setStatus(null);
    }
  };

  const validate = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name || name.length < 2) {
      return 'Please enter your name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }

    if (!message || message.length < 5) {
      return 'Please enter your message.';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validate all fields
    const validationError = validate();
    if (validationError) {
      setStatus({
        type: 'error',
        message: validationError
      });
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      // 2. Send email to Vasavi0908@gmail.com with reply-to set to visitor's email
      await sendContactEmail({
        name: formData.name,
        email: formData.email,
        message: formData.message
      });

      // 5. Successful submission: show success message, clear form, no reload
      setStatus({
        type: 'success',
        message: 'Message sent successfully!'
      });
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (err) {
      console.error('Contact form submission error:', err);
      // 6. Sending failed: show failure message, keep entered form data
      setStatus({
        type: 'error',
        message: 'Unable to send message. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Contact</span>
          <h2 className="section-title">Let's Connect</h2>
          <p className="section-description">
            I am open to internship opportunities, full-time roles, and opportunities to contribute to real-world software projects.
          </p>
        </div>

        {/* Perfectly Balanced Two-Column Contact Layout (50% / 50%) */}
        <div className="contact-grid">
          {/* Left Column: Get In Touch */}
          <div className="contact-left-col">
            <div className="contact-info-card card">
              <h3 className="contact-block-title">
                <MessageSquare size={20} className="title-icon" />
                <span>Get In Touch</span>
              </h3>
              <p className="contact-info-desc">
                Feel free to connect directly via email or check out my professional profiles on LinkedIn and GitHub.
              </p>

              <div className="contact-methods-list">
                {/* 1. EMAIL */}
                <a
                  href={`mailto:${profileData.contact.email}`}
                  className="contact-method-item"
                  aria-label={`Send email to ${profileData.contact.email}`}
                >
                  <div className="contact-method-icon email-icon-container">
                    <Mail size={30} strokeWidth={2} />
                  </div>
                  <div className="contact-method-details">
                    <span className="contact-method-label">EMAIL</span>
                    <span className="contact-method-value link">
                      <span>{profileData.contact.email}</span>
                    </span>
                  </div>
                </a>

                {/* 2. LINKEDIN */}
                <a
                  href={profileData.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-method-item"
                  aria-label="Visit Rama Vasavi on LinkedIn (opens in a new tab)"
                >
                  <div className="contact-method-icon linkedin-icon-container">
                    <LinkedinIcon size={30} strokeWidth={2} />
                  </div>
                  <div className="contact-method-details">
                    <span className="contact-method-label">LINKEDIN</span>
                    <span className="contact-method-value link">
                      <span>View LinkedIn Profile</span>
                      <ExternalLink size={13} className="inline-ext" />
                    </span>
                  </div>
                </a>

                {/* 3. GITHUB */}
                <a
                  href={profileData.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-method-item"
                  aria-label="Visit Rama Vasavi on GitHub (opens in a new tab)"
                >
                  <div className="contact-method-icon github-icon-container">
                    <GithubIcon size={30} strokeWidth={2} />
                  </div>
                  <div className="contact-method-details">
                    <span className="contact-method-label">GITHUB</span>
                    <span className="contact-method-value link">
                      <span>View GitHub Profile</span>
                      <ExternalLink size={13} className="inline-ext" />
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Send Message Form */}
          <div className="contact-right-col">
            <div className="contact-form-card card">
              <h3 className="contact-block-title">
                <Send size={20} className="title-icon" />
                <span>Send Message</span>
              </h3>

              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                {/* Status Alert Notification */}
                {status && (
                  <div
                    className={`form-status-alert alert-${status.type}`}
                    role="alert"
                    aria-live="polite"
                  >
                    {status.type === 'success' ? (
                      <CheckCircle2 size={18} className="form-status-icon" />
                    ) : (
                      <AlertCircle size={18} className="form-status-icon" />
                    )}
                    <span>{status.message}</span>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    required
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. john@example.com"
                    required
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    required
                    className="form-control"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary form-submit-btn"
                >
                  <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
