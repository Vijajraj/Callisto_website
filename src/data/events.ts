export interface CallistoEvent {
  slug: string;
  title: string;
  date: string; // ISO date string
  endDate?: string;
  description: string;
  longDescription: string;
  location: string;
  type: 'observation' | 'talk' | 'workshop' | 'hackathon' | 'social' | 'expedition';
  image?: string;
  speakers?: string[];
  capacity?: number;
  registrationOpen: boolean;
}

export const events: CallistoEvent[] = [
  {
    slug: 'leonid-meteor-dark-sky-2026',
    title: 'Leonid Meteor Shower & Dark Sky Expedition',
    date: '2026-11-17T21:00:00Z',
    endDate: '2026-11-18T05:00:00Z',
    description: 'An overnight field expedition to pristine Bortle Class 2 skies to observe the annual Leonid meteor shower peak and deep-sky nebulae.',
    longDescription: 'Pack your thermal gear and red-light headlamps for Callisto’s signature autumn expedition. We head out to High Desert Dark Sky Reserve for an all-night observational campaign. We will deploy our computerized Schmidt-Cassegrain telescope array alongside wide-field astrophotography rigs. In addition to recording Leonid meteor counts for the International Meteor Organization database, senior members will conduct guided sky tours through the Taurus and Orion complexes. Registration includes chartered transport, camp warming supplies, and hot midnight rations.',
    location: 'High Desert Dark Sky Reserve (Outpost Charlie)',
    type: 'expedition',
    image: '/images/events/leonid-expedition.jpg',
    speakers: ['Guru (Observational Astronomy Lead)', 'Dr. Evelyn Vance (Guest Astrophysicist)'],
    capacity: 45,
    registrationOpen: true,
  },
  {
    slug: 'exoplanet-hackathon-2026',
    title: 'Exoplanet Transit Modeling Hackathon: Signal from the Deep',
    date: '2026-12-05T09:00:00Z',
    endDate: '2026-12-06T18:00:00Z',
    description: 'A 36-hour weekend sprint applying photometric data reduction and machine learning algorithms to candidate exoplanet light curves from space telescopes.',
    longDescription: 'Calling all coders, data scientists, and astrophysicists! Tesseract and Aether Wing are teaming up to host our winter hackathon. Teams will analyze raw light curve telemetry from spaceborne observatories to detect minute transit dips caused by candidate exoplanets orbiting distant K-dwarfs. Mentors will provide starter Python pipelines using Lightkurve and custom neural network models. Winning submissions receive research grants, club badges, and potential co-authorship on an upcoming club research report.',
    location: 'Tesseract Systems Lab & Virtual Grid',
    type: 'hackathon',
    image: '/images/events/exoplanet-hackathon.jpg',
    speakers: ['Vijay Raj (Tech Lead)', 'Prof. Marcus Thorne (Exoplanet Research Institute)'],
    capacity: 60,
    registrationOpen: true,
  },
  {
    slug: 'perseid-stargazing-clinic-2026',
    title: 'Perseid Stargazing & Astrophotography Clinic',
    date: '2026-08-12T20:00:00Z',
    endDate: '2026-08-13T03:00:00Z',
    description: 'An open campus observation night capturing the peak of the Perseid meteor swarm with motorized tracking mounts.',
    longDescription: 'Our annual Perseid gathering brought over 120 students and community stargazers to the science quad. Equipped with 8-inch Dobsonians and dedicated CMOS astro-cams, attendees learned long-exposure framing and post-processing calibration techniques. Highlights included multiple -3 magnitude bolide fireballs bursting through Perseus and Cassiopeia.',
    location: 'Campus Astronomical Observatory Lawn',
    type: 'observation',
    image: '/images/events/perseid-night.jpg',
    speakers: ['Guru (LUNAR Society)', 'Azmina (Design & Visual Identity)'],
    capacity: 150,
    registrationOpen: false,
  },
  {
    slug: 'keynote-ocean-moons-2026',
    title: 'Keynote: Interstellar Voyagers and Ocean Moons',
    date: '2026-06-20T17:30:00Z',
    endDate: '2026-06-20T19:30:00Z',
    description: 'Distinguished guest lecture exploring sub-surface oceans and astrobiology on Europa, Enceladus, and our club namesake, Callisto.',
    longDescription: 'Dr. Sarah Chen from the Planetary Habitability Laboratory joined Callisto Club for a standing-room-only symposium. The lecture delved into tidal heating mechanisms, plume chemistry, and the instrumentation aboard next-generation flagship orbiters. The evening concluded with an extended Q&A panel featuring our presidential leadership and student research teams.',
    location: 'Newton Science Auditorium & Live Stream',
    type: 'talk',
    image: '/images/events/ocean-moons-talk.jpg',
    speakers: ['Dr. Sarah Chen (Planetary Habitability Lab)', 'Lathika Rajesh (VP Nominee)'],
    capacity: 200,
    registrationOpen: false,
  },
  {
    slug: 'narrowband-deep-sky-workshop-2026',
    title: 'Narrowband Deep-Sky Imaging Workshop',
    date: '2026-04-18T14:00:00Z',
    endDate: '2026-04-18T18:00:00Z',
    description: 'Hands-on tutorial mastering hydrogen-alpha, oxygen-III, and sulfur-II filter stacking and PixInsight image calibration.',
    longDescription: 'Astrophotographers gathered in the media lab for an intensive workshop on handling narrowband optical data. Attendees processed real telemetry captured during our spring emission nebula campaign. The session covered dark frame subtraction, flat field normalization, and Hubble Palette (SHO) false-color matrix compositing.',
    location: 'Digital Media Arts Suite 4B',
    type: 'workshop',
    image: '/images/events/narrowband-workshop.jpg',
    speakers: ['Guru (LUNAR Society)', 'Mridhula Nataraj (Nebula Wing)'],
    capacity: 30,
    registrationOpen: false,
  },
  {
    slug: 'vernal-equinox-mixer-2026',
    title: 'Vernal Equinox Cosmic Mixer',
    date: '2026-03-21T18:30:00Z',
    endDate: '2026-03-21T22:00:00Z',
    description: 'Club social welcoming new recruits with space trivia, telescope speed-alignments, and celestial-themed mocktails.',
    longDescription: 'To celebrate the celestial mechanics of equal day and night, the Stellar Path team hosted our spring equinox gathering. Over 90 members across all 11 wings mingled over space trivia, constellation identification games, and a speed-collimation tournament. It set the stage for our summer research and outreach cohorts.',
    location: 'Observatory Rooftop & Common Lounge',
    type: 'social',
    image: '/images/events/equinox-mixer.jpg',
    speakers: ['Aishmica Harish (Stellar Path Lead)', 'Siddh (Event Horizon Lead)'],
    capacity: 100,
    registrationOpen: false,
  },
];

export function getUpcomingEvents(): CallistoEvent[] {
  const now = Date.now();
  const upcoming = events.filter((e) => new Date(e.date).getTime() >= now);

  if (upcoming.length > 0) {
    return upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // Fallback for demo environments if current system date is beyond 2026
  return events
    .filter((e) => e.registrationOpen)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getPastEvents(): CallistoEvent[] {
  const now = Date.now();
  const past = events.filter((e) => new Date(e.date).getTime() < now && !e.registrationOpen);

  if (past.length > 0) {
    return past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Fallback for demo environments
  return events
    .filter((e) => !e.registrationOpen)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getEventBySlug(slug: string): CallistoEvent | undefined {
  return events.find((e) => e.slug === slug);
}
