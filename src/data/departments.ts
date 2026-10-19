export interface Department {
  id: string;
  name: string;
  themedName: string;
  lead: string;
  shipModule: string;
  description: string;
  icon: string; // emoji for now, replaced with SVG later
  color: string; // CSS custom property name
  openRoles: string[];
}

export const departments: Department[] = [
  {
    id: 'general',
    name: 'General Body',
    themedName: 'Starfield',
    lead: 'All Members',
    shipModule: 'Observation Deck',
    description: 'The open heart of our expedition where every stargazer, builder, and enthusiast connects to the wider cosmos. Here, members gather for celestial viewings, open discussions, and collective voyages across astronomical phenomena. No prerequisites required—just an insatiable curiosity for the night sky.',
    icon: '✨',
    color: '--star',
    openRoles: ['Astronomy Enthusiast', 'Stargazing Apprentice', 'Community Contributor'],
  },
  {
    id: 'presidential',
    name: 'Executive Leadership',
    themedName: 'Polaris Circle',
    lead: 'Lathika Rajesh (VP nominee)',
    shipModule: 'Bridge',
    description: 'Steers Callisto Club’s strategic trajectory, mission architecture, and institutional partnerships across academic and scientific spheres. The bridge coordinates cross-functional expeditions and ensures our club-wide milestones align with our overarching charter. Every major astronomical campaign begins with navigational directives charted right here.',
    icon: '🧭',
    color: '--orbit',
    openRoles: ['Chief of Staff Intern', 'Strategic Partnerships Coordinator', 'Executive Logistics Associate'],
  },
  {
    id: 'international',
    name: 'International Relations',
    themedName: 'Constellation Wing',
    lead: 'Harshitha',
    shipModule: 'Comms Array',
    description: 'Beams long-range signals to astronomical societies, university observatories, and global space advocacy coalitions worldwide. This wing bridges cross-cultural dialogues and collaborates on joint observational campaigns that transcend geographic borders. It keeps Callisto synchronized with international celestial initiatives and guest symposiums.',
    icon: '📡',
    color: '--astrophage',
    openRoles: ['Global Outreach Ambassador', 'Cross-Chapter Liaison', 'International Symposium Coordinator'],
  },
  {
    id: 'social-media',
    name: 'Social Media & Communications',
    themedName: 'Orbit Wing',
    lead: 'Mirudhula',
    shipModule: 'Broadcast Bay',
    description: 'Transmits our visual dispatches, astronomical discoveries, and live orbital chronicles across the digital universe. From real-time launch countdowns to viral breakdowns of deep-space imagery, Orbit Wing translates astrophysics into captivating visual narratives. We amplify our crew’s collective voice to engage curious minds beyond the campus perimeter.',
    icon: '🛰️',
    color: '--orbit',
    openRoles: ['Visual Content Creator', 'TikTok/Reels Space Storyteller', 'Digital Campaign Strategist'],
  },
  {
    id: 'content',
    name: 'Content & Editorial',
    themedName: 'Quasar',
    lead: 'TBD',
    shipModule: 'Mission-Log Library',
    description: 'Curates and writes the definitive chronicles, analytical dispatches, and quarterly journals of our astronomical missions. Quasar transforms complex astrodynamic equations and cosmic hypotheses into accessible, peer-reviewed prose. Whether penning field-trip dossiers or deep-sky deep dives, our scribes preserve Callisto’s collective wisdom.',
    icon: '📜',
    color: '--sol-dust',
    openRoles: ['Lead Science Writer', 'Newsletter Editor', 'Technical Archival Specialist'],
  },
  {
    id: 'event',
    name: 'Events & Operations',
    themedName: 'Event Horizon',
    lead: 'Siddh',
    shipModule: 'Launch Pad',
    description: 'Architects and executes high-impact stargazing nights, planetary hackathons, astrophotography workshops, and guest lectures. Event Horizon turns logistical complexities into seamless, awe-inspiring experiences under open skies and darkened auditoriums. Every successful countdown and deployment traces back to this team’s meticulous mission staging.',
    icon: '🚀',
    color: '--astrophage',
    openRoles: ['Expedition Operations Manager', 'Stage & Audio Logistics Lead', 'Stargazing Night Coordinator'],
  },
  {
    id: 'design',
    name: 'Design & Visual Identity',
    themedName: 'Nebula Wing',
    lead: 'Azmina, Mridhula Nataraj',
    shipModule: 'Studio',
    description: 'Shapes Callisto’s visual constellation through immersive digital aesthetics, celestial branding, and editorial typography. Nebula Wing conceives original iconography, campaign posters, UI prototypes, and mission patches that reflect our cosmic ethos. We ensure every touchpoint feels like an interface pulled straight from a futuristic interstellar vessel.',
    icon: '🎨',
    color: '--star',
    openRoles: ['Brand Identity Designer', 'UI/UX Visual Architect', '3D Motion Graphics Artist'],
  },
  {
    id: 'tech',
    name: 'Engineering & Web Systems',
    themedName: 'Tesseract',
    lead: 'Vijay Raj',
    shipModule: 'Engine Room & Server Core',
    description: 'Powers the digital infrastructure, custom orbital telemetry engines, and interactive web experiences for Callisto. Tesseract constructs modern performant software using Astro, React, and edge compute nodes deployed across Cloudflare. When we need interactive star maps, live tracking feeds, or member portals, the engine room brings them to light.',
    icon: '⚡',
    color: '--orbit',
    openRoles: ['Frontend Systems Engineer', 'Interactive Graphics / WebGL Developer', 'Fullstack Platform Engineer'],
  },
  {
    id: 'astronomy',
    name: 'Observational Astronomy',
    themedName: 'LUNAR Society',
    lead: 'Guru',
    shipModule: 'Telescope Bay',
    description: 'Operates our motorized optical arrays, catadioptric scopes, and specialized narrowband filters for planetary and deep-sky imaging. The LUNAR Society tracks lunar geology, occultations, Messier objects, and transient celestial events across the nocturnal sky. Members learn professional astrophotography stacking, star calibration, and optical collimation hands-on.',
    icon: '🔭',
    color: '--sol-dust',
    openRoles: ['Telescope Rig Operator', 'Deep-Sky Astrophotographer', 'Optical Equipment Specialist'],
  },
  {
    id: 'people',
    name: 'People & Crew Culture',
    themedName: 'Stellar Path',
    lead: 'Aishmica Harish',
    shipModule: 'Crew Quarters',
    description: 'Cultivates member onboarding, mentorship flight paths, and team camaraderie across all eleven departmental wings. Stellar Path champions an inclusive and welcoming environment where beginners transform into accomplished flight directors and researchers. We ensure every astronaut finds their crew, develops their skills, and thrives on their journey.',
    icon: '🌌',
    color: '--star',
    openRoles: ['Crew Onboarding Guide', 'Mentorship Program Lead', 'Member Experience Specialist'],
  },
  {
    id: 'research',
    name: 'Astrophysics Research',
    themedName: 'Aether Wing',
    lead: 'Team Leads Only',
    shipModule: 'Laboratory',
    description: 'Conducts formal data reduction, spectral analysis, and exploratory astrophysics projects in collaboration with faculty advisors. Aether Wing investigates exoplanet transit curves, stellar variability, and solar telemetry using open scientific datasets. It serves as our advanced crucible for students preparing for academic publications and graduate space science.',
    icon: '🧪',
    color: '--astrophage',
    openRoles: ['Data Reduction Analyst', 'Spectroscopy Researcher', 'Exoplanet Transit Modeler'],
  },
];

export function getDepartmentById(id: string): Department | undefined {
  return departments.find((d) => d.id === id);
}

export function getDepartmentBySlug(slug: string): Department | undefined {
  return departments.find((d) => d.id === slug);
}
