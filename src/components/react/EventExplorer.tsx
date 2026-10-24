import React, { useState, useMemo } from 'react';
import type { CallistoEvent } from '../../data/events';
import { playTelemetryBeep } from '../../lib/audio';

interface EventExplorerProps {
  initialEvents: CallistoEvent[];
}

export default function EventExplorer({ initialEvents }: EventExplorerProps): React.ReactElement {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timelineFilter, setTimelineFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');

  const now = new Date().getTime();

  const types = [
    { id: 'all', label: 'All Operations' },
    { id: 'expedition', label: 'Expeditions' },
    { id: 'observation', label: 'Observation Nights' },
    { id: 'hackathon', label: 'Hackathons' },
    { id: 'workshop', label: 'Workshops' },
    { id: 'talk', label: 'Keynotes & Talks' },
    { id: 'social', label: 'Crew Socials' },
  ];

  const filteredEvents = useMemo(() => {
    return initialEvents.filter((ev) => {
      const evTime = new Date(ev.date).getTime();
      const isPast = evTime < now;

      if (timelineFilter === 'upcoming' && isPast) return false;
      if (timelineFilter === 'past' && !isPast) return false;

      if (selectedType !== 'all' && ev.type !== selectedType) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = ev.title.toLowerCase().includes(q);
        const matchesDesc = ev.description.toLowerCase().includes(q);
        const matchesLoc = ev.location.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesLoc) return false;
      }

      return true;
    });
  }, [initialEvents, selectedType, searchQuery, timelineFilter, now]);

  const handleTypeChange = (typeId: string) => {
    setSelectedType(typeId);
    playTelemetryBeep(750, 0.05);
  };

  const handleTimelineChange = (filter: 'upcoming' | 'past' | 'all') => {
    setTimelineFilter(filter);
    playTelemetryBeep( filter === 'upcoming' ? 900 : 600, 0.06);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}
      aria-label="Interactive Expedition Event Browser"
    >
      {/* Controls Console */}
      <div
        style={{
          backgroundColor: 'var(--deep)',
          border: '1px solid color-mix(in srgb, var(--steel) 35%, transparent)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {/* Top Search & Timeline Filter Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          {/* Search Box */}
          <div
            style={{
              position: 'relative',
              flex: '1 1 280px',
            }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search expeditions, targets, or coordinates..."
              aria-label="Search missions by keyword"
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.5rem',
                backgroundColor: 'var(--void)',
                border: '1px solid color-mix(in srgb, var(--steel) 40%, transparent)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--moon)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                outline: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--orbit)';
                e.currentTarget.style.boxShadow = '0 0 12px color-mix(in srgb, var(--orbit) 30%, transparent)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--steel) 40%, transparent)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <svg
              viewBox="0 0 20 20"
              width="16"
              height="16"
              fill="var(--steel)"
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--steel)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
                aria-label="Clear Search"
              >
                &times;
              </button>
            )}
          </div>

          {/* Timeline Tabs */}
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: 'var(--void)',
              padding: '0.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid color-mix(in srgb, var(--steel) 30%, transparent)',
            }}
            role="tablist"
            aria-label="Filter events by timeline"
          >
            {(['upcoming', 'past', 'all'] as const).map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={timelineFilter === tab}
                onClick={() => handleTimelineChange(tab)}
                style={{
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: timelineFilter === tab ? 600 : 500,
                  textTransform: 'uppercase',
                  color: timelineFilter === tab ? 'var(--moon)' : 'var(--star)',
                  backgroundColor:
                    timelineFilter === tab
                      ? 'color-mix(in srgb, var(--orbit) 50%, var(--navy))'
                      : 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab === 'upcoming'
                  ? 'Upcoming'
                  : tab === 'past'
                  ? 'Archive'
                  : 'All Missions'}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.45rem',
            alignItems: 'center',
          }}
          role="group"
          aria-label="Filter by Event Category"
        >
          {types.map((t) => {
            const isSelected = selectedType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleTypeChange(t.id)}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.6875rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: isSelected ? 600 : 400,
                  letterSpacing: '0.04em',
                  color: isSelected ? 'var(--moon)' : 'var(--star)',
                  backgroundColor: isSelected
                    ? 'color-mix(in srgb, var(--astrophage) 25%, var(--navy))'
                    : 'color-mix(in srgb, var(--navy) 40%, transparent)',
                  border: `1px solid ${
                    isSelected
                      ? 'color-mix(in srgb, var(--astrophage) 60%, transparent)'
                      : 'color-mix(in srgb, var(--steel) 25%, transparent)'
                  }`,
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Status Metrics Line */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.6875rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--steel)',
            borderTop: '1px solid color-mix(in srgb, var(--steel) 20%, transparent)',
            paddingTop: '0.75rem',
          }}
        >
          <span>
            SHOWING <strong style={{ color: 'var(--orbit)' }}>{filteredEvents.length}</strong> EXPEDITIONS
          </span>
          <span>CIT DEEP-SPACE LOGS // REAL-TIME QUERY</span>
        </div>
      </div>

      {/* Events Results Grid */}
      {filteredEvents.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredEvents.map((event) => {
            const evDate = new Date(event.date);
            const isPast = evDate.getTime() < now;
            const formattedDate = evDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <article
                key={event.slug}
                style={{
                  backgroundColor: 'var(--deep)',
                  border: '1px solid color-mix(in srgb, var(--steel) 30%, transparent)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--orbit)';
                  e.currentTarget.style.boxShadow = '0 10px 28px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--steel) 30%, transparent)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Header: Type Tag & Status */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        color: 'var(--astrophage)',
                        letterSpacing: '0.08em',
                        padding: '0.2rem 0.5rem',
                        backgroundColor: 'color-mix(in srgb, var(--astrophage) 15%, transparent)',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid color-mix(in srgb, var(--astrophage) 30%, transparent)',
                      }}
                    >
                      {event.type}
                    </span>

                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: isPast ? 'var(--steel)' : '#4ADE80',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: isPast ? 'var(--steel)' : '#4ADE80',
                        }}
                      />
                      {isPast ? 'COMPLETED' : event.registrationOpen ? 'REGISTRATION OPEN' : 'STANDBY'}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.35rem',
                      fontWeight: 600,
                      lineHeight: 1.3,
                      color: 'var(--moon)',
                      margin: '0 0 0.5rem 0',
                    }}
                  >
                    <a
                      href={`/events/${event.slug}`}
                      style={{
                        color: 'inherit',
                        textDecoration: 'none',
                      }}
                    >
                      {event.title}
                    </a>
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--steel)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--steel)' }}>📅</span>
                      <span>{formattedDate}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--steel)' }}>📍</span>
                      <span style={{ color: 'var(--moon)' }}>{event.location}</span>
                    </div>
                  </div>

                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      color: 'var(--steel)',
                      margin: 0,
                    }}
                  >
                    {event.description}
                  </p>
                </div>

                {/* Footer Action */}
                <div
                  style={{
                    borderTop: '1px solid color-mix(in srgb, var(--steel) 20%, transparent)',
                    paddingTop: '0.85rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <a
                    href={`/events/${event.slug}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      color: 'var(--orbit)',
                      textDecoration: 'none',
                      letterSpacing: '0.05em',
                    }}
                  >
                    <span>View Dossier</span>
                    <span>&rarr;</span>
                  </a>

                  {event.registrationOpen && !isPast && (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: 'var(--sol-dust)',
                      }}
                    >
                      {event.capacity ? `${event.capacity} Slots` : 'RSVP Available'}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'var(--deep)',
            border: '1px dashed color-mix(in srgb, var(--steel) 35%, transparent)',
            borderRadius: 'var(--radius-lg)',
            padding: '3.5rem 1.5rem',
            textAlign: 'center',
          }}
          aria-label="Event schedule kept blank for user future events"
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔭</div>
          <h4
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              color: 'var(--moon)',
              margin: '0 0 0.5rem 0',
            }}
          >
            {initialEvents.length === 0 ? 'No events scheduled currently' : 'No missions matched your search query'}
          </h4>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              color: 'var(--steel)',
              maxWidth: '450px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {initialEvents.length === 0
              ? 'Event schedule, dark-sky expeditions, and workshop announcements will be published here in the future.'
              : 'Try clearing your search query or selecting a different category tab.'}
          </p>
          {initialEvents.length > 0 && (
            <button
              onClick={() => {
                setSelectedType('all');
                setSearchQuery('');
                setTimelineFilter('all');
              }}
              style={{
                marginTop: '1.25rem',
                padding: '0.5rem 1rem',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--moon)',
                backgroundColor: 'var(--navy)',
                border: '1px solid var(--orbit)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
              }}
            >
              Reset All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
