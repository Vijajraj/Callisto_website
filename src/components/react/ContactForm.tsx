/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

import React, { useState } from 'react';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormProps {
  /** Optional custom CSS class name */
  className?: string;
  /** Optional inline style override */
  style?: React.CSSProperties;
  /** Optional callback fired when form is successfully submitted */
  onSuccess?: (data: ContactFormData) => void;
}

const SUBJECT_OPTIONS = [
  'General Inquiry',
  'Partnership',
  'Sponsorship',
  'Media',
  'Other',
];

/**
 * ContactForm: Communications relay for inquiries, sponsorships, and partnerships.
 * Features client-side validation, ground station telemetry confirmation, and accessible feedback.
 */
export default function ContactForm({
  className,
  style,
  onSuccess,
}: ContactFormProps): React.ReactElement {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [transmissionId, setTransmissionId] = useState<string>('');

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your name.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Comms email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid comms email address.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your message or transmission content.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name as keyof ContactFormData];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      const firstError = document.querySelector('[aria-invalid="true"]') as HTMLElement;
      firstError?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('[Callisto Comms Relay] Transmitting dispatch:', formData);
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const txCode = `SIG-TX-${randomSuffix}`;
      setTransmissionId(txCode);

      setIsSubmitted(true);
      if (onSuccess) {
        onSuccess(formData);
      }
    } catch (err) {
      console.error('[Callisto Comms Relay] Transmission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      subject: 'General Inquiry',
      message: '',
    });
    setErrors({});
    setIsSubmitted(false);
    setTransmissionId('');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: 'var(--deep)',
    border: '1px solid var(--steel)',
    color: 'var(--moon)',
    padding: 'var(--space-sm) var(--space-md)',
    borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9375rem',
    outline: 'none',
    transition: 'border-color 200ms ease, box-shadow 200ms ease',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    fontSize: '0.875rem',
    marginBottom: 'var(--space-xs)',
    color: 'var(--star)',
  };

  const fieldGroupStyle: React.CSSProperties = {
    marginBottom: 'var(--space-lg)',
  };

  const errorStyle: React.CSSProperties = {
    color: '#ef4444',
    fontSize: '0.8rem',
    marginTop: 'var(--space-xs)',
    fontFamily: 'var(--font-mono)',
  };

  if (isSubmitted) {
    return (
      <aside
        className={className}
        role="status"
        aria-live="polite"
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: 'var(--deep)',
          border: '1px solid var(--orbit)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-2xl) var(--space-xl)',
          textAlign: 'center',
          boxShadow: '0 0 24px color-mix(in srgb, var(--orbit) 30%, transparent)',
          ...style,
        }}
      >
        <style>{`
          @keyframes signalPulse {
            0% { transform: scale(0.9); opacity: 0.6; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>

        {/* Transmission Icon */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'color-mix(in srgb, var(--orbit) 20%, transparent)',
            border: '2px solid var(--orbit)',
            color: 'var(--astrophage)',
            marginBottom: 'var(--space-lg)',
            animation: 'signalPulse 600ms ease-out forwards',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
            <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
            <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
            <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1" />
          </svg>
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.875rem',
            color: 'var(--moon)',
            margin: '0 0 var(--space-sm) 0',
            fontWeight: 600,
          }}
        >
          Transmission Confirmed
        </h3>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            color: 'var(--star)',
            lineHeight: 1.6,
            marginBottom: 'var(--space-lg)',
          }}
        >
          Ground station will respond shortly. Your packet has been relayed to the
          expedition coordinators.
        </p>

        {/* Telemetry packet code */}
        <div
          style={{
            display: 'inline-block',
            backgroundColor: 'var(--navy)',
            border: '1px dashed var(--steel)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-xs) var(--space-md)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8125rem',
            color: 'var(--astrophage)',
            letterSpacing: '0.08em',
            marginBottom: 'var(--space-xl)',
          }}
        >
          RELAY PACKET: {transmissionId}
        </div>

        <div>
          <button
            type="button"
            onClick={handleReset}
            style={{
              background: 'transparent',
              border: '1px solid var(--steel)',
              color: 'var(--star)',
              padding: 'var(--space-sm) var(--space-lg)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--orbit)';
              e.currentTarget.style.color = 'var(--moon)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--steel)';
              e.currentTarget.style.color = 'var(--star)';
            }}
          >
            Transmit Another Message &rarr;
          </button>
        </div>
      </aside>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={className}
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <style>{`
        .callisto-contact-input:focus {
          border-color: var(--orbit) !important;
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--orbit) 25%, transparent) !important;
        }
        .callisto-contact-input::placeholder {
          color: var(--steel);
          opacity: 0.8;
        }
        .callisto-contact-btn:hover:not(:disabled) {
          background-color: var(--star) !important;
          transform: translateY(-1px);
        }
        .callisto-contact-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      {/* Name */}
      <div style={fieldGroupStyle}>
        <label htmlFor="contact-name" style={labelStyle}>
          Name <span style={{ color: 'var(--astrophage)' }}>*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          placeholder="Commander / Inquirer Name"
          className="callisto-contact-input"
          style={{
            ...inputStyle,
            borderColor: errors.name ? '#ef4444' : 'var(--steel)',
          }}
        />
        {errors.name && (
          <div id="contact-name-error" role="alert" style={errorStyle}>
            {errors.name}
          </div>
        )}
      </div>

      {/* Email */}
      <div style={fieldGroupStyle}>
        <label htmlFor="contact-email" style={labelStyle}>
          Email <span style={{ color: 'var(--astrophage)' }}>*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          placeholder="contact@example.org"
          className="callisto-contact-input"
          style={{
            ...inputStyle,
            borderColor: errors.email ? '#ef4444' : 'var(--steel)',
          }}
        />
        {errors.email && (
          <div id="contact-email-error" role="alert" style={errorStyle}>
            {errors.email}
          </div>
        )}
      </div>

      {/* Subject */}
      <div style={fieldGroupStyle}>
        <label htmlFor="contact-subject" style={labelStyle}>
          Subject <span style={{ color: 'var(--astrophage)' }}>*</span>
        </label>
        <select
          id="contact-subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          aria-required="true"
          className="callisto-contact-input"
          style={{
            ...inputStyle,
            cursor: 'pointer',
          }}
        >
          {SUBJECT_OPTIONS.map((opt) => (
            <option
              key={opt}
              value={opt}
              style={{ backgroundColor: 'var(--deep)', color: 'var(--moon)' }}
            >
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div style={fieldGroupStyle}>
        <label htmlFor="contact-message" style={labelStyle}>
          Message <span style={{ color: 'var(--astrophage)' }}>*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          placeholder="Type your signal transmission here..."
          className="callisto-contact-input"
          style={{
            ...inputStyle,
            borderColor: errors.message ? '#ef4444' : 'var(--steel)',
            resize: 'vertical',
            lineHeight: 1.5,
          }}
        />
        {errors.message && (
          <div id="contact-message-error" role="alert" style={errorStyle}>
            {errors.message}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div style={{ marginTop: 'var(--space-xl)', textAlign: 'left' }}>
        <button
          type="submit"
          disabled={isSubmitting}
          className="callisto-contact-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-sm)',
            backgroundColor: 'var(--orbit)',
            color: 'var(--void)',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '0.9375rem',
            padding: 'var(--space-sm) var(--space-xl)',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 200ms ease, transform 150ms ease, box-shadow 200ms ease',
            boxShadow: '0 4px 16px color-mix(in srgb, var(--orbit) 35%, transparent)',
          }}
        >
          {isSubmitting ? (
            <>
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{ animation: 'spin 1s linear infinite' }}
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              <span>Relaying Signal...</span>
            </>
          ) : (
            <>
              {/* Transmission Beam Icon */}
              <svg
                viewBox="0 0 20 20"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2.5 10l15-7.5-6.5 15-2.5-6-6-1.5z" />
              </svg>
              <span>Transmit Message</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
