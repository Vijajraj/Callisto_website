import React, { useState } from 'react';

export interface JoinFormData {
  fullName: string;
  email: string;
  phone: string;
  yearOfStudy: string;
  department: string;
  statementOfIntent: string;
  priorExperience: string;
  referralSource: string;
}

export interface JoinFormProps {
  /** Optional custom departments list override */
  departments?: string[];
  /** Optional custom CSS class name */
  className?: string;
  /** Optional inline style override */
  style?: React.CSSProperties;
  /** Optional callback fired when form is successfully submitted */
  onSuccess?: (data: JoinFormData) => void;
}

const DEFAULT_DEPARTMENTS: string[] = [
  'Deep Space Observational Astronomy',
  'Astrophotography & Telescopic Imaging',
  'Orbital Mechanics & Astrodynamics',
  'Propulsion & Rocketry Systems',
  'Avionics, Flight Software & Telemetry',
  'Planetary Science & Exoplanetary Geology',
  'Radio Astronomy & Deep Space Communications',
  'Space Biology & Astrobiology',
  'Public Outreach & Science Communication',
  'Hardware Instrumentation & Optics',
  'Mission Logistics & Flight Operations',
];

const STUDY_YEARS = [
  { value: '1st', label: '1st Year (Freshman / Cadet)' },
  { value: '2nd', label: '2nd Year (Sophomore / Specialist)' },
  { value: '3rd', label: '3rd Year (Junior / Officer)' },
  { value: '4th', label: '4th Year (Senior / Commander)' },
  { value: 'pg', label: 'Postgraduate / Research Scholar' },
];

const REFERRAL_SOURCES = [
  'Instagram (@callistoclub)',
  'Friend or Peer',
  'Club Event / Stargazing Night',
  'College Website / Portal',
  'Campus Posters / Orientation',
  'Other',
];

/**
 * JoinForm: Recruitment application portal for prospective club crew members.
 * Handles validation, telemetry feedback, loading flight checks, and boarding confirmation.
 */
export default function JoinForm({
  departments = DEFAULT_DEPARTMENTS,
  className,
  style,
  onSuccess,
}: JoinFormProps): React.ReactElement {
  const [formData, setFormData] = useState<JoinFormData>({
    fullName: '',
    email: '',
    phone: '',
    yearOfStudy: '',
    department: '',
    statementOfIntent: '',
    priorExperience: '',
    referralSource: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof JoinFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [confirmationCode, setConfirmationCode] = useState<string>('');

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof JoinFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Crew member full name is required.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Comms email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid comms email address.';
    }

    if (!formData.yearOfStudy) {
      newErrors.yearOfStudy = 'Please select your current year of study.';
    }

    if (!formData.department) {
      newErrors.department = 'Please select a preferred mission department.';
    }

    if (!formData.statementOfIntent.trim()) {
      newErrors.statementOfIntent =
        'Please share why you wish to embark with Callisto.';
    } else if (formData.statementOfIntent.trim().length < 20) {
      newErrors.statementOfIntent =
        'Please provide a bit more detail (minimum 20 characters).';
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

    // Clear error for field being edited
    if (errors[name as keyof JoinFormData]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name as keyof JoinFormData];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      const firstErrorField = document.querySelector('[aria-invalid="true"]') as HTMLElement;
      firstErrorField?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulating network flight check / telemetry transmission
      console.log('[Callisto Telemetry] Dispatching Boarding Application:', formData);
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const code = `CAL-MANIFEST-${new Date().getFullYear()}-${randomSuffix}`;
      setConfirmationCode(code);

      setIsSubmitted(true);
      if (onSuccess) {
        onSuccess(formData);
      }
    } catch (err) {
      console.error('[Callisto Telemetry] Application dispatch error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      yearOfStudy: '',
      department: '',
      statementOfIntent: '',
      priorExperience: '',
      referralSource: '',
    });
    setErrors({});
    setIsSubmitted(false);
    setConfirmationCode('');
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

  // Success Confirmation State
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
          @keyframes checkPop {
            0% { transform: scale(0); opacity: 0; }
            70% { transform: scale(1.15); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>

        {/* Animated Checkmark Badge */}
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
            color: 'var(--moon)',
            marginBottom: 'var(--space-lg)',
            animation: 'checkPop 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="none"
            stroke="var(--astrophage)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
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
          Boarding Request Received
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
          Stand by for confirmation. Mission commanders are reviewing your credentials.
          We will contact you via your comms relay shortly.
        </p>

        {/* Manifest telemetry chip */}
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
          MANIFEST ID: {confirmationCode}
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
            Submit Another Application &rarr;
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
        .callisto-field-input:focus {
          border-color: var(--orbit) !important;
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--orbit) 25%, transparent) !important;
        }
        .callisto-field-input::placeholder {
          color: var(--steel);
          opacity: 0.8;
        }
        .callisto-submit-btn:hover:not(:disabled) {
          background-color: var(--star) !important;
          transform: translateY(-1px);
        }
        .callisto-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      {/* Full Name */}
      <div style={fieldGroupStyle}>
        <label htmlFor="join-fullName" style={labelStyle}>
          Full Name <span style={{ color: 'var(--astrophage)' }}>*</span>
        </label>
        <input
          id="join-fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          placeholder="e.g. Elena Rostova"
          className="callisto-field-input"
          style={{
            ...inputStyle,
            borderColor: errors.fullName ? '#ef4444' : 'var(--steel)',
          }}
        />
        {errors.fullName && (
          <div id="fullName-error" role="alert" style={errorStyle}>
            {errors.fullName}
          </div>
        )}
      </div>

      {/* Email */}
      <div style={fieldGroupStyle}>
        <label htmlFor="join-email" style={labelStyle}>
          Email Address <span style={{ color: 'var(--astrophage)' }}>*</span>
        </label>
        <input
          id="join-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          placeholder="elena@university.edu"
          className="callisto-field-input"
          style={{
            ...inputStyle,
            borderColor: errors.email ? '#ef4444' : 'var(--steel)',
          }}
        />
        {errors.email && (
          <div id="email-error" role="alert" style={errorStyle}>
            {errors.email}
          </div>
        )}
      </div>

      {/* Phone */}
      <div style={fieldGroupStyle}>
        <label htmlFor="join-phone" style={labelStyle}>
          Phone Number <span style={{ color: 'var(--steel)', fontSize: '0.8rem' }}>(Optional)</span>
        </label>
        <input
          id="join-phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1 (555) 019-2834"
          className="callisto-field-input"
          style={inputStyle}
        />
      </div>

      {/* Year of Study */}
      <div style={fieldGroupStyle}>
        <label htmlFor="join-yearOfStudy" style={labelStyle}>
          Year of Study <span style={{ color: 'var(--astrophage)' }}>*</span>
        </label>
        <select
          id="join-yearOfStudy"
          name="yearOfStudy"
          value={formData.yearOfStudy}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!errors.yearOfStudy}
          aria-describedby={errors.yearOfStudy ? 'yearOfStudy-error' : undefined}
          className="callisto-field-input"
          style={{
            ...inputStyle,
            borderColor: errors.yearOfStudy ? '#ef4444' : 'var(--steel)',
            cursor: 'pointer',
          }}
        >
          <option value="" disabled style={{ backgroundColor: 'var(--deep)' }}>
            Select your academic year...
          </option>
          {STUDY_YEARS.map((y) => (
            <option
              key={y.value}
              value={y.value}
              style={{ backgroundColor: 'var(--deep)', color: 'var(--moon)' }}
            >
              {y.label}
            </option>
          ))}
        </select>
        {errors.yearOfStudy && (
          <div id="yearOfStudy-error" role="alert" style={errorStyle}>
            {errors.yearOfStudy}
          </div>
        )}
      </div>

      {/* Department Preference */}
      <div style={fieldGroupStyle}>
        <label htmlFor="join-department" style={labelStyle}>
          Department Preference <span style={{ color: 'var(--astrophage)' }}>*</span>
        </label>
        <select
          id="join-department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!errors.department}
          aria-describedby={errors.department ? 'department-error' : undefined}
          className="callisto-field-input"
          style={{
            ...inputStyle,
            borderColor: errors.department ? '#ef4444' : 'var(--steel)',
            cursor: 'pointer',
          }}
        >
          <option value="" disabled style={{ backgroundColor: 'var(--deep)' }}>
            Select your preferred department...
          </option>
          {departments.map((dept) => (
            <option
              key={dept}
              value={dept}
              style={{ backgroundColor: 'var(--deep)', color: 'var(--moon)' }}
            >
              {dept}
            </option>
          ))}
        </select>
        {errors.department && (
          <div id="department-error" role="alert" style={errorStyle}>
            {errors.department}
          </div>
        )}
      </div>

      {/* Why do you want to join Callisto? */}
      <div style={fieldGroupStyle}>
        <label htmlFor="join-statement" style={labelStyle}>
          Why do you want to join Callisto?{' '}
          <span style={{ color: 'var(--astrophage)' }}>*</span>
        </label>
        <textarea
          id="join-statement"
          name="statementOfIntent"
          rows={4}
          value={formData.statementOfIntent}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!errors.statementOfIntent}
          aria-describedby={errors.statementOfIntent ? 'statement-error' : undefined}
          placeholder="Describe your passion for the cosmos, what you hope to discover, and what motivates you..."
          className="callisto-field-input"
          style={{
            ...inputStyle,
            borderColor: errors.statementOfIntent ? '#ef4444' : 'var(--steel)',
            resize: 'vertical',
            lineHeight: 1.5,
          }}
        />
        {errors.statementOfIntent && (
          <div id="statement-error" role="alert" style={errorStyle}>
            {errors.statementOfIntent}
          </div>
        )}
      </div>

      {/* Any experience with astronomy or space science? */}
      <div style={fieldGroupStyle}>
        <label htmlFor="join-experience" style={labelStyle}>
          Any experience with astronomy or space science?{' '}
          <span style={{ color: 'var(--steel)', fontSize: '0.8rem' }}>
            (Optional — no prior background required)
          </span>
        </label>
        <textarea
          id="join-experience"
          name="priorExperience"
          rows={3}
          value={formData.priorExperience}
          onChange={handleChange}
          placeholder="Telescope operation, coding, CAD, amateur observation, physics coursework, or pure raw curiosity..."
          className="callisto-field-input"
          style={{
            ...inputStyle,
            resize: 'vertical',
            lineHeight: 1.5,
          }}
        />
      </div>

      {/* How did you hear about us? */}
      <div style={fieldGroupStyle}>
        <label htmlFor="join-referral" style={labelStyle}>
          How did you hear about us?{' '}
          <span style={{ color: 'var(--steel)', fontSize: '0.8rem' }}>(Optional)</span>
        </label>
        <select
          id="join-referral"
          name="referralSource"
          value={formData.referralSource}
          onChange={handleChange}
          className="callisto-field-input"
          style={{
            ...inputStyle,
            cursor: 'pointer',
          }}
        >
          <option value="" style={{ backgroundColor: 'var(--deep)' }}>
            Choose an option...
          </option>
          {REFERRAL_SOURCES.map((source) => (
            <option
              key={source}
              value={source}
              style={{ backgroundColor: 'var(--deep)', color: 'var(--moon)' }}
            >
              {source}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <div style={{ marginTop: 'var(--space-xl)', textAlign: 'left' }}>
        <button
          type="submit"
          disabled={isSubmitting}
          className="callisto-submit-btn"
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
              <span>Verifying Telemetry...</span>
            </>
          ) : (
            <>
              {/* Rocket Icon */}
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
                <path d="M12.5 3.5a6 6 0 0 1 4.5 4.5c0 4.5-4.5 8.5-8.5 8.5l-2.5-2.5c0-4 4-8.5 8.5-8.5z" />
                <path d="M6.5 14.5L2.5 16l1.5-4" />
                <circle cx="12.5" cy="8.5" r="1.5" fill="currentColor" />
              </svg>
              <span>Request Boarding</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
