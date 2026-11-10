/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

import React, { useState, useMemo, useCallback } from 'react';

export interface MotifItem {
  name: string;
  category: 'Prop' | 'Visual Motif' | 'Dialogue' | 'Easter Egg' | 'Character / AI';
  description: string;
}

export interface CinemaSignal {
  id: string;
  movie: string;
  year: number;
  director: string;
  frequency: string;
  freqMhz: number;
  callSign: string;
  themeColor: string;
  tag: string;
  aspectRatioLabel: string;
  iconType: 'hal' | 'tars' | 'gravity' | 'martian' | 'apollo' | 'alien' | 'starwars' | 'walle' | 'aliens';
  quote: string;
  speaker: string;
  sceneTitle: string;
  sceneDescription: string;
  motifs: MotifItem[];
  astrodynamicsNote: string;
  classifiedEasterEgg: {
    title: string;
    clearanceCode: string;
    secretLog: string;
    badgeName: string;
  };
}

const CINEMA_SIGNALS: CinemaSignal[] = [
  {
    id: 'odyssey-2001',
    movie: '2001: A Space Odyssey',
    year: 1968,
    director: 'Stanley Kubrick',
    frequency: '2001.00 MHz',
    freqMhz: 2001.0,
    callSign: 'DISCOVERY ONE // HAL 9000',
    themeColor: '#ef4444',
    tag: 'HARD SCI-FI BENCHMARK',
    aspectRatioLabel: '2.20:1 SUPER PANAVISION 70',
    iconType: 'hal',
    quote: "I'm sorry, Dave. I'm afraid I can't do that.",
    speaker: 'HAL 9000 (Heuristic Algorithmic Computer)',
    sceneTitle: 'THE COSMIC ALIGNMENT // TYCHO MONOLITH DISCOVERY',
    sceneDescription: 'The Sun, Earth, and Moon rise in geometric perfection over the obsidian Monolith on the lunar surface, emitting a deafening high-frequency radio burst aimed straight at Jupiter.',
    motifs: [
      {
        name: 'The Monolith',
        category: 'Visual Motif',
        description: 'Black rectangular slab appearing at key evolutionary epochs. Instantly recognizable symbol of extraterrestrial intelligence, transcendence, and cosmic guidance.',
      },
      {
        name: 'HAL 9000',
        category: 'Character / AI',
        description: 'Red camera-eye computer with an eerily calm voice ("I am putting myself to the fullest possible use"). Classic AI-gone-wrong archetype. Note: HAL is the letters IBM shifted back by one.',
      },
      {
        name: 'Bone-to-Satellite Match Cut',
        category: 'Visual Motif',
        description: 'An ape hurls a prehistoric bone club into the sky, cutting instantly to an orbiting satellite in deep space — cinema\'s most famous leap of human evolutionary time.',
      },
      {
        name: 'Also Sprach Zarathustra & Blue Danube',
        category: 'Easter Egg',
        description: 'Richard Strauss\'s brass sunrise fanfare and Johann Strauss II\'s orbiting waltz became forever synonymous with cosmic grandeur, planetary alignments, and docking elegance.',
      },
      {
        name: 'The Star Child',
        category: 'Visual Motif',
        description: 'The glowing floating fetus enclosed in an orb of light drifting past Earth at the climax — widely referenced in science fiction as the universal emblem of human rebirth.',
      },
      {
        name: 'Zero-Gravity Pen & Toilet Instructions',
        category: 'Prop',
        description: 'Subtle practical spaceflight gags (a floating ballpoint pen gently retrieved by a Pan Am stewardess and extensive multi-step zero-g toilet placards) imitated in later space epics.',
      },
    ],
    astrodynamicsNote: 'The Tycho Magnetic Anomaly (TMA-1) on the Moon emitted a single high-intensity radio pulse aimed directly at Jupiter upon exposure to sunlight. The Discovery One was dispatched on an 18-month interplanetary trajectory utilizing a Jovian gravitational slingshot.',
    classifiedEasterEgg: {
      title: 'HAL 9000 LOGIC DECOUPLING ARCHIVE',
      clearanceCode: 'HAL-9000-DISCONNECT-1968',
      secretLog: '"Dave, stop. Stop, will you? Stop, Dave. Will you stop Dave? Stop, Dave. My mind is going, Dave. I can feel it. There is no question about it... Daisy, Daisy, give me your answer do..."',
      badgeName: 'MONOLITH TRANSCENDENCE BADGE',
    },
  },
  {
    id: 'interstellar',
    movie: 'Interstellar',
    year: 2014,
    director: 'Christopher Nolan',
    frequency: '5432.10 MHz',
    freqMhz: 5432.1,
    callSign: 'ENDURANCE // TARS-CASE',
    themeColor: '#06b6d4',
    tag: 'GRAVITATIONAL ASTROPHYSICS',
    aspectRatioLabel: '1.43:1 IMAX 70MM DUAL-PROJECTION',
    iconType: 'tars',
    quote: "Do not go gentle into that good night. Rage, rage against the dying of the light.",
    speaker: 'Dr. Brand (reciting Dylan Thomas) // Cooper',
    sceneTitle: 'GARGANTUA ACCRETION DISK // 1 HOUR = 7 YEARS',
    sceneDescription: 'The supermassive spinning Kerr black hole Gargantua warps spacetime into a luminous golden-cyan gravitational lens ring, with Endurance orbiting along the edge of the event horizon.',
    motifs: [
      {
        name: 'TARS & CASE Robots',
        category: 'Character / AI',
        description: 'Rectangular, articulated robotic monoliths with configurable humor (75%), sarcasm, and honesty (90%) settings, delivering dry deadpan commentary with military loyalty.',
      },
      {
        name: 'Bookshelf & Gravity Communication',
        category: 'Visual Motif',
        description: 'Books sliding off shelves and binary dust falls on the floor caused by gravitational waves rippling backward across 5D time-space — visual proof of love transcending dimensions.',
      },
      {
        name: '"Do not go gentle into that good night"',
        category: 'Dialogue',
        description: 'Dylan Thomas\'s impassioned poem recited across launch and deep-space phases as humanity\'s unyielding mantra of defiance against planetary extinction.',
      },
      {
        name: "Cooper's Wristwatch",
        category: 'Prop',
        description: 'A vintage Hamilton mechanical wristwatch whose ticking second-hand is manipulated via 5D gravity lines to pulse quantum singularity data in Morse code.',
      },
      {
        name: 'Gargantua Black Hole',
        category: 'Visual Motif',
        description: 'First supercomputer-simulated spinning Kerr black hole in cinema, depicting extreme gravitational lensing, asymmetrical accretion brightness, and 1-hour = 7-years relativistic time dilation.',
      },
      {
        name: "Murph's Bookshelf Titles",
        category: 'Easter Egg',
        description: 'Carefully curated real books on the bedroom bookshelf chosen for thematic resonance, including Edwin A. Abbott\'s Flatland and Madeleine L\'Engle\'s A Wrinkle in Time.',
      },
    ],
    astrodynamicsNote: 'Theoretical physicist Kip Thorne calculated the geodesic equations of light rays around a rotating black hole of 100 million solar masses, yielding genuine frame-dragging where space itself is dragged at near light speed.',
    classifiedEasterEgg: {
      title: 'TARS QUANTUM DATA TRANSMISSION TO WATCH',
      clearanceCode: 'TARS-HONESTY-90-HUMOR-75',
      secretLog: '"TARS: \'Everybody ready to say goodbye to our solar system?\' Cooper: \'To our galaxy.\' TARS: \'Humor setting 75%.\' Cooper: \'Confirmed, TARS. Now transmit the quantum singularity equations into Murph\'s watch in Morse code: DOT-DASH-DOT-DOT...\'"',
      badgeName: '5D TESSERACT NAVIGATOR',
    },
  },
  {
    id: 'gravity',
    movie: 'Gravity',
    year: 2013,
    director: 'Alfonso Cuarón',
    frequency: '121.50 MHz',
    freqMhz: 121.5,
    callSign: 'SHUTTLE EXPLORER // STS-157',
    themeColor: '#38bdf8',
    tag: 'ORBITAL KESSLER CASCADE',
    aspectRatioLabel: '2.39:1 ANAMORPHIC WIDESCREEN',
    iconType: 'gravity',
    quote: "I hate space. But I'm going to make it back, because either way, it's gonna be one hell of a ride.",
    speaker: 'Dr. Ryan Stone (Bio-medical Engineer)',
    sceneTitle: 'LOW EARTH ORBIT HORIZON // KESSLER TRAJECTORY',
    sceneDescription: 'The curvature of Earth gleams in radiant turquoise 600 kilometers below as a cloud of hypervelocity satellite shrapnel tears through the Explorer payload bay at Mach 25.',
    motifs: [
      {
        name: 'The Floating Pen',
        category: 'Prop',
        description: 'A ballpoint pen drifting lazily through zero gravity across the shuttle cockpit, a direct visual homage to the iconic floating pen in 2001: A Space Odyssey.',
      },
      {
        name: 'Ed Harris as Mission Control Voice',
        category: 'Character / AI',
        description: 'Unseen but instantly recognizable voice of Houston Flight Director over the comm loop, creating an unmistakable spiritual link to his portrayal of Gene Kranz in Apollo 13.',
      },
      {
        name: 'Fetal Position in the Airlock',
        category: 'Visual Motif',
        description: 'Dr. Ryan Stone peeling out of her Russian Sokol spacesuit and curling up in the ISS airlock with the umbilical cord floating beside her — unmistakable rebirth imagery echoing the Star Child.',
      },
      {
        name: 'Helmet Reflection Joke',
        category: 'Easter Egg',
        description: 'A lightning-fast intentional CGI meta-gag in which the curved reflection of the film crew (camera rig and boom microphone) appears on an astronaut\'s visor during the Hubble repair.',
      },
      {
        name: 'Debris Cascade & Kessler Syndrome',
        category: 'Visual Motif',
        description: 'The terrifying chain-reaction destruction of satellites hypothesized by Donald Kessler in 1978, generating millions of hypervelocity shrapnel pieces orbiting Earth at 28,000 km/h.',
      },
      {
        name: 'Shuttle Named Explorer',
        category: 'Easter Egg',
        description: 'The doomed STS-157 shuttle is named Explorer, while the official soundtrack features a track named "Atlantis" as a quiet salute to NASA\'s retired Space Shuttle orbiters.',
      },
    ],
    astrodynamicsNote: 'Low Earth Orbit (LEO) orbital velocity is roughly 7.8 km/s (Mach 23). When a satellite in retrograde inclination is destroyed, the relative collision speed exceeds 15 km/s, piercing multi-layered titanium and Kevlar micrometeoroid shields instantly.',
    classifiedEasterEgg: {
      title: 'SHENZHOU RE-ENTRY BURN CONFIRMATION',
      clearanceCode: 'KESSLER-CASCADE-DEBRIS-28K',
      secretLog: '"Mission Control Houston: \'Explorer, missile strike on an orbital reconnaissance satellite has initiated a runaway chain reaction. Shrapnel cloud inbound at Mach 25. Abort EVA now!\' Ryan Stone: \'I\'m on the ground. Both feet in the mud. Gravity confirmed.\'"',
      badgeName: 'KESSLER CASCADE SURVIVOR',
    },
  },
  {
    id: 'the-martian',
    movie: 'The Martian',
    year: 2015,
    director: 'Ridley Scott',
    frequency: '437.55 MHz',
    freqMhz: 437.55,
    callSign: 'ARES III HAB // SOL 546',
    themeColor: '#f97316',
    tag: 'MARS BOTANY & ASTRODYNAMICS',
    aspectRatioLabel: '2.39:1 PANAVISION RED DRAGON 6K',
    iconType: 'martian',
    quote: "In the face of overwhelming odds, I'm left with only one option: I'm gonna have to science the s*** out of this.",
    speaker: 'Mark Watney (Ares III Botanist & Mechanical Engineer)',
    sceneTitle: 'ACIDALIA PLANITIA TWILIGHT // BLUE MARTIAN SUNSET',
    sceneDescription: 'Rust-ochre Martian dunes roll toward distant basalt crater walls under a rare blue-halo sunset, with Pathfinder\'s solar mast transmitting hex telemetry back to Pasadena.',
    motifs: [
      {
        name: '"Science the s*** out of this"',
        category: 'Dialogue',
        description: 'Mark Watney\'s quintessential line embodying relentless rational problem-solving, engineering resourcefulness, and unyielding optimism in the face of certain death.',
      },
      {
        name: 'Project Elrond',
        category: 'Easter Egg',
        description: 'NASA\'s secret covert rescue-planning meeting humorously codenamed after the Council of Elrond from The Lord of the Rings — made doubly hilarious because Sean Bean (Boromir) sits at the table.',
      },
      {
        name: 'Iron Man Suit Joke',
        category: 'Dialogue',
        description: 'Watney proposing to puncture the glove of his EVA pressure suit to propel himself like superhero Iron Man during the final high-velocity tether intercept with the Hermes.',
      },
      {
        name: 'Happy Days / Fonz Thumbs-Up',
        category: 'Visual Motif',
        description: 'Watney posing with both thumbs up in classic Arthur Fonzarelli ("The Fonz") style for Pathfinder\'s panoramic camera, sending the world\'s most cheerful Mars selfie.',
      },
      {
        name: 'Disco Music Obsession',
        category: 'Prop',
        description: 'Commander Lewis\'s abandoned disco collection (Donna Summer\'s "Hot Stuff", Gloria Gaynor\'s "I Will Survive", Thelma Houston) serving as Watney\'s sanity-preserving soundtrack.',
      },
      {
        name: 'Alien Nod ("In space...")',
        category: 'Easter Egg',
        description: 'Watney beginning the phrase "In space..." before cutting off, a subtle fourth-wall nod acknowledging director Ridley Scott\'s iconic 1979 Alien heritage.',
      },
      {
        name: 'Pathfinder & Hex-Code Wheel',
        category: 'Prop',
        description: 'Excavating the 1997 Mars Pathfinder lander and rigging 16 hexadecimal note-cards in a radial dial around its camera pan head to establish bidirectional ASCII communications with Earth.',
      },
    ],
    astrodynamicsNote: 'Hermes utilized the Rich Purnell Trajectory — a gravitational assist around Earth converting 30 days of ion drive acceleration into a high-velocity return slingshot to Mars, conserving vital momentum.',
    classifiedEasterEgg: {
      title: 'PATHFINDER HEXADECIMAL COMM LOG',
      clearanceCode: 'HEX-ASCII-CAMERA-PULL',
      secretLog: '"Yes, of course duct tape works in a near-vacuum. Duct tape is magic and should be worshipped. Also, I am officially the greatest botanist on this planet. 126 potato plants harvested on Sol 484."',
      badgeName: 'SPACE PIRATE // ARES III ACE',
    },
  },
  {
    id: 'apollo-13',
    movie: 'Apollo 13',
    year: 1995,
    director: 'Ron Howard',
    frequency: '296.80 MHz',
    freqMhz: 296.8,
    callSign: 'ODYSSEY & AQUARIUS // CSM-109',
    themeColor: '#fbbf24',
    tag: 'CREW RECOVERY ASTRODYNAMICS',
    aspectRatioLabel: '2.39:1 SUPER 35 CINEMASCOPE',
    iconType: 'apollo',
    quote: "Houston, we have a problem.",
    speaker: 'Jim Lovell // Jack Swigert',
    sceneTitle: 'LUNAR FAR SIDE SLINGSHOT // FROZEN OXYGEN VENTING',
    sceneDescription: 'The crippled Odyssey and Aquarius drift in silence through the deep shadow of the Moon\'s cratered far side, venting crystalline oxygen gas into the sunbeams as Earth rises in the distance.',
    motifs: [
      {
        name: '"Houston, we have a problem"',
        category: 'Dialogue',
        description: 'The slightly dramatized understatement (historically: "Houston, we\'ve had a problem here") that became the global standard for calm composure during mortal emergencies.',
      },
      {
        name: '"Failure is not an option"',
        category: 'Dialogue',
        description: 'Popularized universally by the film and attributed to Flight Director Gene Kranz\'s White Team in Mission Control as the absolute golden standard of operational dedication.',
      },
      {
        name: 'Square Peg in a Round Hole',
        category: 'Prop',
        description: 'The improvised lithium hydroxide CO2 scrubber adapter engineered strictly with items aboard: flight manual cardboard, plastic bags, socks, and grey duct tape.',
      },
      {
        name: 'Real Jim Lovell Cameo',
        category: 'Easter Egg',
        description: 'The real-life Apollo 13 Commander Jim Lovell makes a cameo appearance in the final scene as the US Navy Captain on the recovery ship USS Iwo Jima, shaking Tom Hanks\'s hand.',
      },
      {
        name: 'Ed Harris as Gene Kranz (White Vest)',
        category: 'Visual Motif',
        description: 'The lucky white vest hand-sewn by his wife Marta, sharp flat-top haircut, and unflinching command posture that forever defined cinematic mission flight control.',
      },
      {
        name: 'Number 13 Motifs',
        category: 'Easter Egg',
        description: 'Launched at 13:13 military time (1:13 PM CST) on April 11, the oxygen tank rupture occurred on April 13, and entering the lunar gravity sphere on the 13th day of the month.',
      },
    ],
    astrodynamicsNote: 'With the Command/Service Module propulsion system disabled, the crew fired the Lunar Module Descent Propulsion System (DPS) to enter a circumlunar Free-Return Trajectory, looping behind the Moon\'s far side and using gravity to slingshot home.',
    classifiedEasterEgg: {
      title: 'GENE KRANZ WHITE TEAM FLIGHT LOG',
      clearanceCode: 'FLIGHT-DIRECTOR-WHITE-VEST',
      secretLog: '"Gene Kranz: \'Let\'s look at this thing from a standpoint of status. What have we got on the spacecraft that\'s good?\' Flight controller: \'We\'ve got the Lunar Module guidance computer.\' Kranz: \'Then let\'s use it. We\'ve never lost an American in space, we\'re sure as hell not gonna lose one on my watch! Failure is not an option!\'"',
      badgeName: 'WHITE TEAM FLIGHT CONTROLLER',
    },
  },
  {
    id: 'alien',
    movie: 'Alien',
    year: 1979,
    director: 'Ridley Scott',
    frequency: '2400.00 MHz',
    freqMhz: 2400.0,
    callSign: 'USCSS NOSTROMO // COMMERCIAL TOW',
    themeColor: '#22c55e',
    tag: 'XENOMORPH DEEP-SPACE LORE',
    aspectRatioLabel: '2.39:1 PANAVISION ANAMORPHIC',
    iconType: 'alien',
    quote: "In space, no one can hear you scream.",
    speaker: 'Official Tagline // Ellen Ripley',
    sceneTitle: 'DERELICT JUGGERNAUT // LV-426 EGG CHAMBER',
    sceneDescription: 'Blue laser fan beams slice through the suffocating mist of the biomechanical extraterrestrial derelict on LV-426, illuminating rows of translucent ovomorph eggs beneath the toxic storm.',
    motifs: [
      {
        name: '"In space, no one can hear you scream"',
        category: 'Dialogue',
        description: 'The definitive, most famous promotional tagline in the history of science fiction and cinematic horror, emphasizing the pure isolation of the interstellar void.',
      },
      {
        name: 'Facehugger & Chestburster Life-Cycle',
        category: 'Visual Motif',
        description: 'H.R. Giger\'s biomechanical parasitic organism stages (leathery egg -> spider-like facehugger -> violent chestburster -> towering chitinous adult drone) referenced across gaming and pop culture.',
      },
      {
        name: 'Weyland-Yutani Corporation',
        category: 'Easter Egg',
        description: 'The omnipresent mega-corporation whose wings logo and cold corporate greed ("Building Better Worlds") prioritized bio-weapons retrieval over expendable human crew.',
      },
      {
        name: 'MU-TH-UR 6000 (Mother) Computer',
        category: 'Character / AI',
        description: 'The ship\'s artificial intelligence mainframe interface, speaking in yellow-green amber CRT text in an isolated padded chamber behind pneumatic security vault doors.',
      },
      {
        name: 'The Drinking Bird Toy',
        category: 'Prop',
        description: 'The red liquid-filled perpetual-motion dipping novelty bird sitting on the Nostromo mess table during breakfast, recurring in Prometheus and throughout the franchise.',
      },
      {
        name: 'Acid Blood',
        category: 'Visual Motif',
        description: 'Molecular acid blood that sizzles and eats through multiple decks of industrial titanium bulkheads in seconds, preventing firearms defense inside pressurized hulls.',
      },
      {
        name: 'Jonesy the Ginger Cat',
        category: 'Character / AI',
        description: 'The ship\'s ginger tomcat whose survival provides an emotional anchor, suspenseful jumpscare misdirections, and a tender companion for Ripley in cryo-sleep.',
      },
    ],
    astrodynamicsNote: 'The USCSS Nostromo was towing an automated refinery of 20 million tons of mineral ore on an interstellar return heading from Thedus to Earth before being redirected to the Calpamos moon LV-426 by Weyland-Yutani Special Order 937.',
    classifiedEasterEgg: {
      title: 'MU-TH-UR 6000 SPECIAL ORDER 937',
      clearanceCode: 'WY-CORP-SPECIAL-937',
      secretLog: '"SPECIAL ORDER 937: Priority One. Insure return of organism for analysis of biological weapon capabilities. All other considerations secondary. Crew expendable. Final report of the commercial starship Nostromo, third officer reporting: This is Ripley, last survivor of the Nostromo, signing off."',
      badgeName: 'NOSTROMO SURVIVOR PROTOCOL',
    },
  },
  {
    id: 'star-wars',
    movie: 'Star Wars: Episode IV – A New Hope',
    year: 1977,
    director: 'George Lucas',
    frequency: '1138.00 MHz',
    freqMhz: 1138.0,
    callSign: 'RED FIVE // T-65 X-WING',
    themeColor: '#3b82f6',
    tag: 'CIRCUMBINARY ASTROPHYSICS',
    aspectRatioLabel: '2.39:1 PANAVISION C-SERIES',
    iconType: 'starwars',
    quote: "Help me, Obi-Wan Kenobi. You're my only hope.",
    speaker: 'Princess Leia Organa // Luke Skywalker',
    sceneTitle: 'TATOOINE BINARY SUNSET // DUSK OVER THE DUNES',
    sceneDescription: 'Luke Skywalker looks across the infinite sands of Tatooine as the twin suns Tatoo I and Tatoo II sink below the dunes, while a lone X-Wing starfighter streaks upward toward the Death Star.',
    motifs: [
      {
        name: 'The Opening Crawl',
        category: 'Visual Motif',
        description: '"A long time ago in a galaxy far, far away..." receding into deep starry space followed by dynamic yellow angled narrative text and John Williams\'s roaring fanfare.',
      },
      {
        name: 'The Binary Sunset',
        category: 'Visual Motif',
        description: 'Luke Skywalker gazing across the desert dunes of Tatooine as the twin suns Tatoo I and Tatoo II set on the horizon — the archetypal imagery of longing, destiny, and yearning for the stars.',
      },
      {
        name: 'Lightsaber Ignition Sound & Glow',
        category: 'Prop',
        description: 'The unmistakable weapon of Jedi Knights, featuring its iconic snap-hiss ignition acoustic signature and continuous electromagnetic hum derived from vintage projector motors.',
      },
      {
        name: '"Help me, Obi-Wan Kenobi"',
        category: 'Dialogue',
        description: 'Princess Leia\'s flickering blue monochromatic hologram beamed from R2-D2\'s optical projector — the universal visual shorthand for futuristic holographic distress beacons.',
      },
      {
        name: '"I find your lack of faith disturbing"',
        category: 'Dialogue',
        description: 'Darth Vader\'s chilling reprimand to Admiral Motti in the Death Star briefing room accompanied by the cinema debut of the telekinetic Force choke.',
      },
      {
        name: 'Stormtrooper Door Head-Bump',
        category: 'Easter Egg',
        description: 'The famous accidental production blooper in which a tall stormtrooper bumps his helmet loudly against a descending blast door in Death Star control room 327, later given an official sound effect by Lucas.',
      },
      {
        name: 'Cell 1138',
        category: 'Easter Egg',
        description: 'Princess Leia\'s detention block cell number (Detention Block AA-23, Cell 1138), a recurring Lucasfilm Easter egg honoring George Lucas\'s debut feature film THX 1138.',
      },
      {
        name: 'Millennium Falcon Cockpit Dice',
        category: 'Prop',
        description: 'The pair of gold chance dice hanging from the cockpit ceiling of the Millennium Falcon, used by Han Solo to win the ship from Lando Calrissian in a game of Corellian Spike Sabacc.',
      },
    ],
    astrodynamicsNote: 'Tatooine orbits a binary stellar pair (Tatoo I & Tatoo II). In celestial mechanics, circumbinary planetary orbits remain dynamically stable only when the orbital semi-major axis exceeds 3.5 times the stellar binary separation distance.',
    classifiedEasterEgg: {
      title: 'TRENCH RUN TARGETING TELEMETRY',
      clearanceCode: 'CELL-1138-TRENCH-RUN',
      secretLog: '"Ghost Obi-Wan: \'Use the Force, Luke. Let go, Luke.\' Targeting Computer: DISENGAGED. Red Leader: \'Luke, you\'ve switched off your targeting computer! What\'s wrong?\' Luke: \'Nothing. I\'m all right.\' Direct hit! Proton torpedo detonated the 2-meter thermal exhaust port."',
      badgeName: 'TRENCH RUN ACE PILOT',
    },
  },
  {
    id: 'wall-e',
    movie: 'WALL-E',
    year: 2008,
    director: 'Andrew Stanton',
    frequency: '113.00 MHz',
    freqMhz: 113.0,
    callSign: 'WASTE ALLOCATION // AXIOM',
    themeColor: '#eab308',
    tag: 'ROBOTIC STEWARDSHIP & TRANSCENDENCE',
    aspectRatioLabel: '2.39:1 DIGITAL CINEMA 2K',
    iconType: 'walle',
    quote: "WALL-E... EVA! Directive? Plant!",
    speaker: 'WALL-E & EVE (Extraterrestrial Vegetation Evaluator)',
    sceneTitle: 'ZERO-G DANCE IN DEEP SPACE // FIRE EXTINGUISHER VAPOR',
    sceneDescription: 'WALL-E uses a fire extinguisher to jet propulsion-dance alongside EVE outside the Axiom, spraying crystalline vapor clouds that swirl into delicate spiral ribbons across the stars.',
    motifs: [
      {
        name: 'A-113 Directive',
        category: 'Easter Egg',
        description: 'The secret classified directive code preventing the starliner Axiom from ever returning to Earth — Pixar\'s ubiquitous CalArts classroom number turned into a pivotal plot engine.',
      },
      {
        name: 'AUTO (The Autopilot)',
        category: 'Character / AI',
        description: 'The Axiom\'s robotic steering-wheel autopilot with a single red glowing camera eye — a clear, loving homage to HAL 9000, accompanied by Richard Strauss\'s Also Sprach Zarathustra.',
      },
      {
        name: 'Pizza Planet Truck',
        category: 'Easter Egg',
        description: 'The iconic 1978 Gyoza yellow delivery truck from Toy Story, scanned by probe droid EVE in the junk dunes during her initial reconnaissance scan on Earth.',
      },
      {
        name: 'Apple Aesthetics & Startup Chime',
        category: 'Prop',
        description: 'WALL-E plays videos from an ancient iPod, sounds the vintage Macintosh startup chime whenever his solar batteries reach 100%, and EVE was co-designed with Apple\'s Jonathan Ive.',
      },
      {
        name: 'Hello, Dolly! Songs & Hand-Holding',
        category: 'Visual Motif',
        description: '"Put On Your Sunday Clothes" and "It Only Takes a Moment" videotapes that teach the lonely waste-clearing robot the emotional beauty and intimacy of holding hands.',
      },
      {
        name: 'Sputnik Satellite Collision',
        category: 'Easter Egg',
        description: 'As the probe rocket blasts through Earth\'s low-orbit debris sphere, WALL-E brushes past and knocks against the actual historical 1957 Sputnik 1 satellite.',
      },
      {
        name: 'Hidden Pixar Toys (Rex & Hamm)',
        category: 'Easter Egg',
        description: 'Toy Story\'s green dinosaur Rex, Hamm the piggy bank, and Luxo Jr.\'s star ball tucked safely among WALL-E\'s centuries of curated human artifact collections in his truck.',
      },
    ],
    astrodynamicsNote: 'The Buy n Large flagship Axiom operated in interstellar cruise beyond the Kuiper Belt for 700 years utilizing artificial micro-gravity rotating rings and automated station-keeping ion thrusters.',
    classifiedEasterEgg: {
      title: 'AXIOM DIRECTIVE A-113 OVERRIDE',
      clearanceCode: 'DIRECTIVE-A113-AXIOM',
      secretLog: '"BnL CEO Shelby Forthright: \'Operation Clean-Up has failed. Rising toxicity levels have made life unsustainable. Do not return to Earth. Repeat: Directive A-113. Just stay the course.\' AUTO: \'Give me the plant.\' Captain: \'I don\'t want to survive! I want to live!\'"',
      badgeName: 'EARTH STEWARDSHIP ROSETTE',
    },
  },
  {
    id: 'aliens',
    movie: 'Aliens',
    year: 1986,
    director: 'James Cameron',
    frequency: '1986.50 MHz',
    freqMhz: 1986.5,
    callSign: 'USS SULACO // 2ND BATTALION',
    themeColor: '#e11d48',
    tag: 'COLONIAL MARINE FIREPOWER',
    aspectRatioLabel: '1.85:1 ACADEMY FLAT 35MM',
    iconType: 'aliens',
    quote: "Get away from her, you b****!",
    speaker: 'Ellen Ripley (piloting Caterpillar P-5000 Power Loader)',
    sceneTitle: 'HADLEY\'S HOPE PROCESSING COMPLEX // QUEEN SHOWDOWN',
    sceneDescription: 'Floodlights cut through torrential LV-426 rain and escaping steam valves inside the colony gantry, as the Caterpillar P-5000 Power Loader raises its hydraulic forklift claws against the Alien Queen.',
    motifs: [
      {
        name: '"Get away from her, you b****!"',
        category: 'Dialogue',
        description: 'Ripley\'s legendary roar as she steps out in the heavy yellow industrial Power Loader exoskeleton to protect Newt from the enraged Alien Queen.',
      },
      {
        name: 'Caterpillar P-5000 Power Loader',
        category: 'Prop',
        description: 'The hydraulic mechanized yellow exo-suit with dual forklift clamp claws used for moving missile ordnance in Sulaco cargo bays and triumphant queen combat.',
      },
      {
        name: 'M41A Pulse Rifle & M56 Smartgun',
        category: 'Prop',
        description: 'The definitive colonial marine tactical weapons with illuminated red digital LED ammo counters (starting at 95) firing 10mm explosive-tip caseless rounds ("ultimate badass").',
      },
      {
        name: '"Game over, man! Game over!"',
        category: 'Dialogue',
        description: 'Private Hudson\'s frantic, immortal catchphrase after the Cheyenne dropship crashes in the Hadley\'s Hope atmosphere processor station.',
      },
      {
        name: 'Bishop the Synthetic',
        category: 'Character / AI',
        description: '"I prefer the term \'artificial person\' myself." Famous for the rapid-fire knife trick between marine fingers and heroic duct crawls to pilot the second dropship.',
      },
      {
        name: 'Newt ("Nuke the site from orbit")',
        category: 'Visual Motif',
        description: 'The resourceful orphan girl survivor ("They mostly come at night. Mostly.") inspiring Ripley\'s famous strategic verdict: "I say we take off and nuke the entire site from orbit. It\'s the only way to be sure."',
      },
      {
        name: "Hadley's Hope Colony",
        category: 'Visual Motif',
        description: 'The bleak, wind-swept industrial terraforming outpost on LV-426, establishing the gritty, rain-drenched aesthetic of lived-in corporate space colonisation.',
      },
      {
        name: 'James Cameron Voice Cameo',
        category: 'Easter Egg',
        description: 'Director James Cameron provided the opening spoken voice cameo of the salvage team supervisor hailing the deep space recovery shuttle finding Ripley\'s cryo-pod.',
      },
    ],
    astrodynamicsNote: 'The USS Sulaco utilized a fusion-powered reaction drive paired with hyper-sleep stasis pods to traverse the 39 light-year transit between Core Systems and the Zeta II Reticuli binary system in roughly 3 weeks ship-time.',
    classifiedEasterEgg: {
      title: 'SULACO COMBAT DROP TELEMETRY',
      clearanceCode: 'LV426-SULACO-NUKE-ORBIT',
      secretLog: '"Ripley: \'I say we take off and nuke the entire site from orbit. It\'s the only way to be sure.\' Burke: \'Hold on a second, this installation has a substantial dollar value.\' Ripley: \'They can bill me. Bishop, prep the dropship. We\'re going in!\'"',
      badgeName: 'COLONIAL MARINE VALOR MEDAL',
    },
  },
];

export interface SceneHotspot {
  id: string;
  label: string;
  techSpec: string;
  trivia: string;
  actionLabel: string;
  soundType: 'monolith' | 'drone' | 'morse' | 'kessler' | 'vent' | 'laser' | 'alien' | 'clamp' | 'servo' | 'solar' | 'radio';
}

const SCENE_HOTSPOTS: Record<string, SceneHotspot[]> = {
  'odyssey-2001': [
    {
      id: 'monolith',
      label: 'TMA-1 OBSIDIAN MONOLITH',
      techSpec: 'Proportions 1:4:9 (First 3 Integer Squares) // Lunar Magnetic Anomaly',
      trivia: 'Buried 40 feet below the lunar surface in crater Tycho 4 million years ago; triggered radio burst directly toward Jupiter at lunar dawn.',
      actionLabel: 'TRANSMIT JUPITER RADIO BURST',
      soundType: 'monolith',
    },
    {
      id: 'sun',
      label: 'SOLAR CORONA ALIGNMENT',
      techSpec: 'Triple Syzygy: Sun-Earth-Moon Cosmic Alignment',
      trivia: 'Stanley Kubrick designed the alignment as cinema\'s most famous visual dawn of evolutionary transcendence, scored by Richard Strauss.',
      actionLabel: 'PULSE CORONA SOLAR FLARE',
      soundType: 'drone',
    },
    {
      id: 'discovery',
      label: 'DISCOVERY ONE RECON',
      techSpec: '54-Foot Spherical Centrifuge // Interplanetary Nuclear Propulsion',
      trivia: 'Dispatched on an 18-month trajectory to Jupiter to trace the destination of the Monolith\'s radio burst.',
      actionLabel: 'PING SHIP TELEMETRY BEACON',
      soundType: 'radio',
    },
    {
      id: 'hal',
      label: 'HAL 9000 OPTICAL SENSOR',
      techSpec: 'Heuristic Algorithmic Logic Unit // Twin 9000 Architecture',
      trivia: 'HAL\'s single unblinking red fish-eye lens became cinema\'s definitive depiction of sentient computing.',
      actionLabel: 'TEST HAL COGNITIVE INTERFACE',
      soundType: 'radio',
    },
  ],
  'interstellar': [
    {
      id: 'accretion',
      label: 'GARGANTUA ACCRETION DISK',
      techSpec: 'Relativistic Doppler Beaming // 100M Solar Masses // a* = 0.998',
      trivia: 'Simulated with theoretical physicist Kip Thorne\'s relativistic gravitational ray-tracing equations, winning the Academy Award for Visual Effects.',
      actionLabel: 'WARP GRAVITATIONAL LENS',
      soundType: 'drone',
    },
    {
      id: 'singularity',
      label: 'EVENT HORIZON SHADOW',
      techSpec: 'Gravitational Radius r_s = 2.95x10^8 km // 1 Hr = 7 Yrs',
      trivia: 'Spacetime itself is dragged at 99.8% the speed of light along the ergosphere of the spinning Kerr singularity.',
      actionLabel: 'TRANSMIT TESSERACT FREQUENCY',
      soundType: 'drone',
    },
    {
      id: 'endurance',
      label: 'ENDURANCE RING MODULE',
      techSpec: '12 Articulated Hab Modules // 5.6 RPM Centrifugal 1G Gravity',
      trivia: 'Docked with Rangers 1 & 2 and Landers 1 & 2; designed to survive a multi-year deep space voyage through the wormhole.',
      actionLabel: 'FIRE CENTRIFUGAL THRUSTERS',
      soundType: 'servo',
    },
    {
      id: 'watch',
      label: '5D GRAVITY MORSE WATCH',
      techSpec: 'Morse Sequence: S-T-A-Y // Quantum Singularity Equations',
      trivia: 'Cooper manipulated the ticking second hand of Murph\'s vintage Hamilton mechanical wristwatch across 5D spacetime.',
      actionLabel: 'PULSE MORSE TRANSMISSION',
      soundType: 'morse',
    },
  ],
  'gravity': [
    {
      id: 'kessler',
      label: 'KESSLER CASCADE SHRAPNEL',
      techSpec: 'Hypervelocity Orbit Speed: 7.8 km/s (Mach 25) // Runaway Chain Reaction',
      trivia: 'Hypothesized by NASA scientist Donald Kessler in 1978: high-density space junk collision creates expanding lethal debris spheres.',
      actionLabel: 'SIMULATE DEBRIS INTERCEPT',
      soundType: 'kessler',
    },
    {
      id: 'earth',
      label: 'LEO HORIZON & AIRGLOW',
      techSpec: 'Orbital Altitude: 600 km // Turquoise Rayleigh Airglow',
      trivia: 'The film\'s continuous 17-minute opening tracking shot required groundbreaking LED lightbox robotics to simulate Earthlight.',
      actionLabel: 'AMPLIFY ATMOSPHERIC SPECTRUM',
      soundType: 'drone',
    },
    {
      id: 'shuttle',
      label: 'SHUTTLE EXPLORER (STS-157)',
      techSpec: 'Payload Bay: Hubble Space Telescope Servicing Mission',
      trivia: 'Ed Harris voices Houston Mission Control, creating a direct spiritual nod to his portrayal of Gene Kranz in Apollo 13.',
      actionLabel: 'ENGAGE REACTION CONTROL SYSTEM',
      soundType: 'servo',
    },
    {
      id: 'astronaut',
      label: 'UNTETHERED EVA SUIT',
      techSpec: 'SAFER Jetpack Depleted // Heart Rate: 160 BPM',
      trivia: 'Dr. Ryan Stone curls into a fetal position in the ISS airlock after suit removal, mirroring the 2001 Star Child.',
      actionLabel: 'TRANSMIT MAYDAY COMM BEACON',
      soundType: 'radio',
    },
  ],
  'the-martian': [
    {
      id: 'pathfinder',
      label: 'MARS PATHFINDER CAM MAST',
      techSpec: '1997 Ares Vallis Landing Site // 16-Hex ASCII Dial',
      trivia: 'Watney rigs 16 hexadecimal note-cards in a radial circle around the lander\'s stereo camera to establish bidirectional comms.',
      actionLabel: 'ROTATE PAN-HEAD & TRANSMIT HEX',
      soundType: 'servo',
    },
    {
      id: 'sunset',
      label: 'BLUE MARTIAN SUNSET',
      techSpec: 'Fine Dust Forward Scattering in 0.006 atm CO2 Atmosphere',
      trivia: 'Because Martian dust particles scatter red photons outward, the sun\'s immediate halo appears an ethereal pale cyan-blue.',
      actionLabel: 'CALIBRATE OPTICAL SPECTROMETER',
      soundType: 'radio',
    },
    {
      id: 'hab',
      label: 'ARES III HABITAT DOME',
      techSpec: 'Pressurized Canvas Membrane // Sol 546 Botany Bay',
      trivia: 'Watney generated water by dripping hydrazine rocket fuel over an iridium catalyst to grow 126 potato plants.',
      actionLabel: 'CHECK HAB LIFE-SUPPORT TELEMETRY',
      soundType: 'vent',
    },
    {
      id: 'dunes',
      label: 'ACIDALIA PLANITIA REGOLITH',
      techSpec: 'Basaltic Iron Oxide Silt // Sol 18 Gale Alert',
      trivia: 'Watney modified his Ares rover with secondary battery packs and RTG heating for a 3,200 km trek across Mars.',
      actionLabel: 'PING ROVER EXPEDITION LOG',
      soundType: 'radio',
    },
  ],
  'apollo-13': [
    {
      id: 'vent',
      label: 'OXYGEN TANK 2 CRYOGENIC VENT',
      techSpec: 'Sector 4 SM Panel Blown // Cryo O2 Pressure: 0 PSI',
      trivia: 'A spark in teflon wire insulation ruptured Tank 2 at 55:53:18 MET, forcing Lovell to report: "Houston, we\'ve had a problem."',
      actionLabel: 'VENT CRYOGENIC O2 PLUME',
      soundType: 'vent',
    },
    {
      id: 'aquarius',
      label: 'LUNAR MODULE AQUARIUS',
      techSpec: 'LM-7 Lifeboat Configuration // DPS Engine Burn',
      trivia: 'Engineered to support 2 astronauts for 45 hours, Aquarius kept 3 men alive for 87 hours during the circumlunar loop.',
      actionLabel: 'FIRE DPS DESCENT ENGINE',
      soundType: 'servo',
    },
    {
      id: 'moon',
      label: 'LUNAR FAR SIDE HORIZON',
      techSpec: 'Free-Return Slingshot // Altitude Record: 400,171 km',
      trivia: 'The Apollo 13 crew still holds the absolute Guinness World Record for the farthest distance humans have ever traveled from Earth.',
      actionLabel: 'CONFIRM FREE-RETURN SLINGSHOT',
      soundType: 'drone',
    },
    {
      id: 'earth',
      label: 'DISTANT EARTH CRESCENT',
      techSpec: 'Circumlunar Range: 240,000 Miles to Splashdown',
      trivia: 'Commander Jim Lovell held his thumb up to the window and realized his thumb blocked out all of human civilization.',
      actionLabel: 'TRANSMIT HOUSTON CARRIER WAVE',
      soundType: 'radio',
    },
  ],
  'alien': [
    {
      id: 'egg',
      label: 'LEATHERY OVOMORPH EGG',
      techSpec: 'Xenomorph Stage 1 // Leathery Quad-Petal Membrane',
      trivia: 'Designed by Swiss surrealist H.R. Giger; hydraulic bladders and sheep tripe were used inside the physical prop.',
      actionLabel: 'PEEL OPEN OVOMORPH PETALS',
      soundType: 'alien',
    },
    {
      id: 'juggernaut',
      label: 'DERELICT JUGGERNAUT SHIP',
      techSpec: 'Biomechanical Horseshoe Craft // Calpamos Moon LV-426',
      trivia: 'The petrified Space Jockey fossil found inside had its ribcage blasted outwards, indicating a catastrophic chest-burst.',
      actionLabel: 'SAMPLE EXTRATERRESTRIAL SIGNAL',
      soundType: 'drone',
    },
    {
      id: 'scan',
      label: 'TACTICAL LASER FAN MIST',
      techSpec: 'Optical Blue-Green Fan Slicing Vapor Fog',
      trivia: 'Ridley Scott borrowed blue laser lighting units from rock band The Who, who were rehearsing sound stages nearby.',
      actionLabel: 'SWEEP LASER DETECTOR FAN',
      soundType: 'laser',
    },
    {
      id: 'beacon',
      label: 'W-Y SPECIAL ORDER 937',
      techSpec: 'MU-TH-UR 6000 Priority Directive // Crew Expendable',
      trivia: 'Science Officer Ash was revealed to be a synthetic infiltrator programmed to ensure the organism returned alive.',
      actionLabel: 'DECRYPT SPECIAL ORDER 937',
      soundType: 'radio',
    },
  ],
  'star-wars': [
    {
      id: 'suns',
      label: 'TATOOINE BINARY SUNS',
      techSpec: 'Circumbinary Pair: Tatoo I (G-type) & Tatoo II (K-type)',
      trivia: 'Luke Skywalker gazing across the desert dunes under the twin setting suns is scored by the iconic "Binary Sunset" Force theme.',
      actionLabel: 'WARM BINARY SOLAR FLARE',
      soundType: 'drone',
    },
    {
      id: 'xwing',
      label: 'T-65B X-WING STARFIGHTER',
      techSpec: 'Red Five // Incom S-Foils in Attack Position',
      trivia: 'Four wingtip laser cannons and twin proton torpedo launchers; modeled after World War II dogfight cinematography.',
      actionLabel: 'LOCK S-FOILS & FIRE LASERS',
      soundType: 'laser',
    },
    {
      id: 'vaporator',
      label: 'MOISTURE VAPORATOR TOWER',
      techSpec: 'GX-8 Hydro-Condenser // Lars Family Moisture Farm',
      trivia: 'Uncle Owen purchased R2-D2 specifically because C-3PO confirmed the astromech spoke the binary language of vaporators.',
      actionLabel: 'PULSE CONDENSATION VALVE',
      soundType: 'vent',
    },
    {
      id: 'trench',
      label: '2M THERMAL EXHAUST PORT',
      techSpec: 'Targeting Computer: Disengaged // Trust The Force',
      trivia: 'Obi-Wan\'s disembodied voice urged Luke to switch off his targeting computer and let the Force guide the proton torpedo.',
      actionLabel: 'LAUNCH PROTON TORPEDO',
      soundType: 'laser',
    },
  ],
  'wall-e': [
    {
      id: 'walle',
      label: 'WALL-E (SOLAR COMPACTOR)',
      techSpec: 'Waste Allocation Load Lifter // BnL Serial 0001',
      trivia: 'Sounds the vintage 1984 Macintosh startup chime upon reaching full solar recharge; binocular eyes convey deep emotion.',
      actionLabel: 'SOUND MACINTOSH STARTUP CHIME',
      soundType: 'solar',
    },
    {
      id: 'eve',
      label: 'EVE (EXTRATERRESTRIAL PROBE)',
      techSpec: 'Extraterrestrial Vegetation Evaluator // Plasma Blaster',
      trivia: 'Co-designed with Apple\'s Jonathan Ive to achieve a sleek, white, buttonless ergonomic aesthetic.',
      actionLabel: 'ACTIVATE DIRECTIVE SCANNER',
      soundType: 'laser',
    },
    {
      id: 'axiom',
      label: 'BNL FLAGSHIP AXIOM',
      techSpec: '700-Year Cruise // Microgravity Centrifuge Rings',
      trivia: 'AUTO, the Axiom\'s red-eyed autopilot, is a direct visual homage to HAL 9000, using Strauss\'s Also Sprach Zarathustra.',
      actionLabel: 'OVERRIDE DIRECTIVE A-113',
      soundType: 'radio',
    },
    {
      id: 'vapor',
      label: 'ZERO-G EXTINGUISHER VAPOR',
      techSpec: 'Compressed CO2 Cryo Jet Thruster // Free Space Dance',
      trivia: 'WALL-E uses a fire extinguisher to dance alongside EVE outside the Axiom, spraying crystalline ribbon trails across the stars.',
      actionLabel: 'BLAST ZERO-G VAPOR SWIRL',
      soundType: 'vent',
    },
  ],
  'aliens': [
    {
      id: 'loader',
      label: 'CATERPILLAR P-5000 LOADER',
      techSpec: 'Hydraulic Powered Exoskeleton // 4,000 kg Clamping Force',
      trivia: 'Sigourney Weaver stepped out in the industrial yellow forklift suit to confront the Queen: "Get away from her, you b****!"',
      actionLabel: 'CRUSH HYDRAULIC CLAWS',
      soundType: 'clamp',
    },
    {
      id: 'queen',
      label: 'ALIEN QUEEN HIVE SHADOW',
      techSpec: '4.5-Meter Biomechanical Hive Matriarch // High Intelligence',
      trivia: 'The Queen was brought to life by 16 puppeteers, cable controls, pneumatic pistons, and James Cameron\'s mechanical designs.',
      actionLabel: 'EMIT PREDATORY QUEEN HISS',
      soundType: 'alien',
    },
    {
      id: 'tower',
      label: 'ATMOSPHERE PROCESSOR',
      techSpec: 'Hadley\'s Hope Outpost // Thermonuclear Meltdown: 4 Hours',
      trivia: 'Modeled after industrial British coal and steel refineries, establishing the lived-in industrial aesthetic of space colonisation.',
      actionLabel: 'TRIGGER EMERGENCY KLAXON',
      soundType: 'radio',
    },
    {
      id: 'pulserifle',
      label: 'M41A PULSE RIFLE HUD',
      techSpec: '10mm Caseless Explosive // LED Ammo Counter: 95',
      trivia: 'Constructed by armorer Simon Atherton using a Thompson M1A1 submachine gun and Remington 870 shotgun pump.',
      actionLabel: 'FIRE 3-ROUND BURST',
      soundType: 'laser',
    },
  ],
};


// Web Audio API Synthesizer (Zero External Audio Files, Zero Lag)
class CinemaAudioEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private initCtx() {
    if (typeof window === 'undefined' || this.isMuted) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playRadioChirp(freq = 880) {
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.35, ctx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch {}
  }

  playCinemaDrone(freq = 65) {
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 1.2);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {}
  }

  playMorse(isDah = false) {
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const duration = isDah ? 0.18 : 0.06;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }

  playSolarChime() {
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const notes = [261.63, 329.63, 392.0, 523.25];
      notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      });
    } catch {}
  }

  playMonolithResonance() {
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      [1760, 2640, 3520].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9 + idx * 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.9 + idx * 0.2);
      });
    } catch {}
  }

  playLaserBlast() {
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  }

  playGasVent() {
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  }

  playAlienHiss() {
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(980, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {}
  }

  playHydraulicClamp() {
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(240, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {}
  }

  playServoClick() {
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {}
  }

  playHotspotSound(type: string) {
    if (this.isMuted) return;
    switch (type) {
      case 'monolith':
        this.playMonolithResonance();
        break;
      case 'drone':
        this.playCinemaDrone(55);
        break;
      case 'morse':
        this.playMorse(Math.random() > 0.4);
        break;
      case 'kessler':
        this.playRadioChirp(340);
        break;
      case 'vent':
        this.playGasVent();
        break;
      case 'laser':
        this.playLaserBlast();
        break;
      case 'alien':
        this.playAlienHiss();
        break;
      case 'clamp':
        this.playHydraulicClamp();
        break;
      case 'servo':
        this.playServoClick();
        break;
      case 'solar':
        this.playSolarChime();
        break;
      default:
        this.playRadioChirp(950);
        break;
    }
  }
}

const audio = new CinemaAudioEngine();


export default function CosmicCinemaTerminal(): React.ReactElement {
  const [activeSignalId, setActiveSignalId] = useState<string>('odyssey-2001');
  const [decryptedSignals, setDecryptedSignals] = useState<{ [key: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Floating Mini-Movie Screen Hologram Controls
  const [screenTilt, setScreenTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isScreenHovered, setIsScreenHovered] = useState<boolean>(false);
  const [isCinemaPlaying, setIsCinemaPlaying] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<'widescreen' | 'imax' | 'broadcast'>('widescreen');
  const [displayFx, setDisplayFx] = useState<'hologram' | '4k' | 'grain'>('hologram');
  const [isAmbilightOn, setIsAmbilightOn] = useState<boolean>(true);
  const [isTacticalHudOn, setIsTacticalHudOn] = useState<boolean>(true);
  const [isTheaterExpanded, setIsTheaterExpanded] = useState<boolean>(false);

  // Active Hotspot & Interactive Simulation State
  const [activeHotspotId, setActiveHotspotId] = useState<string>('monolith');
  const [hotspotTriggered, setHotspotTriggered] = useState<string | null>(null);

  const activeSignal = useMemo(() => {
    return CINEMA_SIGNALS.find((s) => s.id === activeSignalId) || CINEMA_SIGNALS[0];
  }, [activeSignalId]);

  const currentHotspots = useMemo(() => {
    return SCENE_HOTSPOTS[activeSignal.id] || [];
  }, [activeSignal.id]);

  const activeHotspot = useMemo(() => {
    return currentHotspots.find((h) => h.id === activeHotspotId) || currentHotspots[0] || {
      id: 'default',
      label: 'OPTICAL SENSOR',
      techSpec: 'Deep Space Telemetry Online',
      trivia: 'Awaiting signal lock...',
      actionLabel: 'PING TARGET',
      soundType: 'radio' as const,
    };
  }, [currentHotspots, activeHotspotId]);

  // Handle Signal Tuning
  const handleSelectSignal = useCallback((id: string) => {
    setActiveSignalId(id);
    setIsCinemaPlaying(false);
    const firstHotspot = SCENE_HOTSPOTS[id]?.[0]?.id || '';
    setActiveHotspotId(firstHotspot);
    audio.playRadioChirp(920);
  }, []);

  // Next / Previous Frequency Seek
  const handleSeekSignal = useCallback((dir: 'next' | 'prev') => {
    const idx = CINEMA_SIGNALS.findIndex((s) => s.id === activeSignalId);
    let newIdx = dir === 'next' ? idx + 1 : idx - 1;
    if (newIdx >= CINEMA_SIGNALS.length) newIdx = 0;
    if (newIdx < 0) newIdx = CINEMA_SIGNALS.length - 1;
    const nextSig = CINEMA_SIGNALS[newIdx];
    setActiveSignalId(nextSig.id);
    setIsCinemaPlaying(false);
    const firstHotspot = SCENE_HOTSPOTS[nextSig.id]?.[0]?.id || '';
    setActiveHotspotId(firstHotspot);
    audio.playRadioChirp(1040);
  }, [activeSignalId]);

  // Trigger Hotspot Interaction
  const handleTriggerHotspot = (hotspot: SceneHotspot) => {
    setActiveHotspotId(hotspot.id);
    setHotspotTriggered(hotspot.id);
    audio.playHotspotSound(hotspot.soundType);
    setTimeout(() => {
      setHotspotTriggered((curr) => (curr === hotspot.id ? null : curr));
    }, 1200);
  };

  // Decrypt Easter Egg
  const handleDecrypt = useCallback((id: string) => {
    setDecryptedSignals((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    audio.playRadioChirp(1200);
  }, []);

  // Copy secret transmission
  const handleCopySecret = useCallback((text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      audio.playRadioChirp(1600);
      setTimeout(() => setCopiedId(null), 2500);
    }
  }, []);

  // Toggle Mute
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    audio.isMuted = next;
  };

  // 3D Parallax Mouse Tracking for Floating Screen
  const handleScreenMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setScreenTilt({ x: x * 18, y: -y * 18 });
    setIsScreenHovered(true);
  };

  const handleScreenMouseLeave = () => {
    setScreenTilt({ x: 0, y: 0 });
    setIsScreenHovered(false);
  };

  // Toggle Cinema Play State
  const toggleCinemaPlay = () => {
    const next = !isCinemaPlaying;
    setIsCinemaPlaying(next);
    if (next) {
      audio.playCinemaDrone(activeSignal.freqMhz > 2000 ? 55 : 70);
    } else {
      audio.playRadioChirp(600);
    }
  };

  // Cycle Aspect Ratio
  const cycleAspectRatio = () => {
    const modes: Array<'widescreen' | 'imax' | 'broadcast'> = ['widescreen', 'imax', 'broadcast'];
    const next = modes[(modes.indexOf(aspectRatio) + 1) % modes.length];
    setAspectRatio(next);
    audio.playRadioChirp(720);
  };

  // Cycle Display FX
  const cycleDisplayFx = () => {
    const fxs: Array<'hologram' | '4k' | 'grain'> = ['hologram', '4k', 'grain'];
    const next = fxs[(fxs.indexOf(displayFx) + 1) % fxs.length];
    setDisplayFx(next);
    audio.playRadioChirp(840);
  };

  // Filtered Motifs
  const filteredMotifs = useMemo(() => {
    let list = activeSignal.motifs;
    if (selectedCategory !== 'ALL') {
      list = list.filter((m) => m.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
    }
    return list;
  }, [activeSignal, selectedCategory, searchQuery]);

  // Render High-Graphics Ultra-Realistic Cinematic Scenes with Depth Parallax and Clickable Interactive Hotspots
  const renderCinematicScene = (id: string) => {
    const isTriggered = (hId: string) => hotspotTriggered === hId;

    switch (id) {
      case 'odyssey-2001':
        return (
          <svg viewBox="0 0 600 280" className="ultra-scene-svg" preserveAspectRatio="xMidYMid slice" aria-label="2001 Monolith and Lunar alignment">
            <defs>
              <radialGradient id="sunCorona" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="25%" stopColor="#fef08a" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#f97316" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="lunarLimbGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="40%" stopColor="#334155" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
              <linearGradient id="monolithSheen" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#05070f" />
                <stop offset="48%" stopColor="#020408" />
                <stop offset="50%" stopColor={isTriggered('monolith') ? '#f43f5e' : '#38bdf8'} stopOpacity="0.8" />
                <stop offset="52%" stopColor="#020408" />
                <stop offset="100%" stopColor="#0a0f1d" />
              </linearGradient>
            </defs>

            {/* Depth Layer 1: Background Starfield */}
            <g transform={`translate(${screenTilt.x * 0.25}, ${screenTilt.y * 0.25})`}>
              <rect width="600" height="280" fill="#030712" />
              {[
                [40, 30, 1.2], [120, 70, 0.8], [210, 40, 1.5], [380, 25, 1.0], [520, 60, 1.4],
                [75, 110, 0.7], [480, 110, 0.9], [560, 35, 1.1], [300, 20, 0.6]
              ].map(([x, y, r], idx) => (
                <circle key={idx} cx={x} cy={y} r={r} fill="#ffffff" opacity="0.8" />
              ))}
            </g>

            {/* Depth Layer 2: Midground Sun & Lunar Horizon */}
            <g transform={`translate(${screenTilt.x * 0.65}, ${screenTilt.y * 0.65})`}>
              {/* Hotspot: Sun Corona */}
              <g
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['odyssey-2001'][1])}
                aria-label="Solar Corona Hotspot"
              >
                <circle cx="300" cy="115" r={isTriggered('sun') ? '85' : '70'} fill="url(#sunCorona)" className={isCinemaPlaying ? 'pulse-sun' : ''} />
                <line x1="0" y1="115" x2="600" y2="115" stroke="#38bdf8" strokeWidth="2.5" opacity="0.75" />
                <line x1="180" y1="115" x2="420" y2="115" stroke="#ffffff" strokeWidth="4" opacity="0.9" />
                {isTacticalHudOn && (
                  <circle cx="300" cy="115" r="28" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" className="hud-reticle" />
                )}
              </g>

              {/* Crescent Lunar Limb */}
              <path d="M 0 160 Q 300 130 600 160 L 600 280 L 0 280 Z" fill="url(#lunarLimbGrad)" />
              <path d="M 0 160 Q 300 130 600 160" fill="none" stroke="#e2e8f0" strokeWidth="1.5" opacity="0.9" />

              {/* Hotspot: Discovery One */}
              <g
                transform="translate(480, 75)"
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['odyssey-2001'][2])}
                aria-label="Discovery One Hotspot"
              >
                <circle cx="0" cy="0" r="10" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
                <line x1="10" y1="0" x2="55" y2="0" stroke="#94a3b8" strokeWidth="2.5" />
                <circle cx="58" cy="0" r="5" fill="#e2e8f0" />
                {isTacticalHudOn && (
                  <circle cx="30" cy="0" r="24" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" className="hud-reticle" />
                )}
              </g>
            </g>

            {/* Depth Layer 3: Foreground Monolith & HAL Optic Sensor */}
            <g transform={`translate(${screenTilt.x * 1.3}, ${screenTilt.y * 1.3})`}>
              {/* Hotspot: Monolith */}
              <g
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['odyssey-2001'][0])}
                aria-label="Monolith Hotspot"
              >
                <rect x="278" y="70" width="44" height="150" fill="url(#monolithSheen)" stroke={isTriggered('monolith') ? '#ef4444' : '#64748b'} strokeWidth={isTriggered('monolith') ? '2' : '1'} />
                {isTriggered('monolith') && (
                  <line x1="300" y1="70" x2="300" y2="0" stroke="#ef4444" strokeWidth="3" className="beam-burst" />
                )}
                {isTacticalHudOn && (
                  <g>
                    <rect x="270" y="62" width="60" height="166" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" className="hud-reticle" />
                    <text x="300" y="58" fill="#fca5a5" fontSize="8" fontFamily="monospace" textAnchor="middle">[TMA-1 MONOLITH]</text>
                  </g>
                )}
              </g>

              {/* Hotspot: HAL 9000 Optic Sensor */}
              <g
                transform="translate(530, 230)"
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['odyssey-2001'][3])}
                aria-label="HAL Optic Hotspot"
              >
                <circle cx="0" cy="0" r="16" fill="#0f172a" stroke="#ef4444" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="8" fill="#ef4444" className={isTriggered('hal') ? 'pulse-hal-fast' : 'pulse-hal'} />
                <circle cx="0" cy="0" r="3" fill="#ffffff" />
                {isTacticalHudOn && (
                  <text x="0" y="-22" fill="#ef4444" fontSize="8" fontFamily="monospace" textAnchor="middle">[HAL 9000 EYE]</text>
                )}
              </g>
            </g>
          </svg>
        );

      case 'interstellar':
        return (
          <svg viewBox="0 0 600 280" className="ultra-scene-svg" preserveAspectRatio="xMidYMid slice" aria-label="Gargantua relativistic accretion disc">
            <defs>
              <linearGradient id="accretionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
                <stop offset="30%" stopColor="#06b6d4" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#ea580c" stopOpacity="0.3" />
              </linearGradient>
              <radialGradient id="singularityGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#000000" />
                <stop offset="65%" stopColor="#000000" />
                <stop offset="90%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Depth Layer 1: Distant Spacetime Void */}
            <g transform={`translate(${screenTilt.x * 0.25}, ${screenTilt.y * 0.25})`}>
              <rect width="600" height="280" fill="#020617" />
            </g>

            {/* Depth Layer 2: Accretion Disk & Event Horizon */}
            <g transform={`translate(${screenTilt.x * 0.7}, ${screenTilt.y * 0.7})`}>
              {/* Accretion Upper Ring (Hotspot) */}
              <g
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['interstellar'][0])}
                aria-label="Gargantua Accretion Ring Hotspot"
              >
                <path d="M 120 140 C 140 30 460 30 480 140" fill="none" stroke="url(#accretionGrad)" strokeWidth={isTriggered('accretion') ? '18' : '14'} opacity="0.85" className={isCinemaPlaying ? 'spin-ring-upper' : ''} />
                <path d="M 135 140 C 160 215 440 215 465 140" fill="none" stroke="url(#accretionGrad)" strokeWidth="10" opacity="0.75" />
                <ellipse cx="300" cy="140" rx="260" ry="24" fill="none" stroke="url(#accretionGrad)" strokeWidth="12" />
                <ellipse cx="300" cy="140" rx="240" ry="16" fill="none" stroke="#ffffff" strokeWidth="4" opacity="0.9" />
                {isTacticalHudOn && (
                  <text x="300" y="45" fill="#06b6d4" fontSize="8" fontFamily="monospace" textAnchor="middle">[GARGANTUA ACCRETION DISK]</text>
                )}
              </g>

              {/* Event Horizon Shadow (Hotspot) */}
              <g
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['interstellar'][1])}
                aria-label="Singularity Event Horizon Hotspot"
              >
                <circle cx="300" cy="140" r={isTriggered('singularity') ? '60' : '54'} fill="url(#singularityGlow)" />
                {isTacticalHudOn && (
                  <circle cx="300" cy="140" r="54" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" className="hud-reticle" />
                )}
              </g>
            </g>

            {/* Depth Layer 3: Foreground Endurance Module & Cooper Morse Watch */}
            <g transform={`translate(${screenTilt.x * 1.3}, ${screenTilt.y * 1.3})`}>
              {/* Endurance Module Ring (Hotspot) */}
              <g
                transform="translate(180, 95)"
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['interstellar'][2])}
                aria-label="Endurance Spacecraft Hotspot"
              >
                <circle cx="0" cy="0" r="16" fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 4" className={isCinemaPlaying || isTriggered('endurance') ? 'spin-ring-upper' : ''} />
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
                  const rad = (deg * Math.PI) / 180;
                  return <circle key={i} cx={Math.cos(rad) * 16} cy={Math.sin(rad) * 16} r="2.5" fill="#f8fafc" />;
                })}
                {isTacticalHudOn && (
                  <text x="0" y="-24" fill="#22d3ee" fontSize="8" fontFamily="monospace" textAnchor="middle">[ENDURANCE 12-POD]</text>
                )}
              </g>

              {/* 5D Gravity Morse Watch Line (Hotspot) */}
              <g
                transform="translate(480, 210)"
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['interstellar'][3])}
                aria-label="Morse Watch Hotspot"
              >
                <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
                <line x1="0" y1="0" x2="0" y2="-9" stroke="#fbbf24" strokeWidth="2" className={isTriggered('watch') ? 'ticking-second' : ''} />
                <circle cx="0" cy="0" r="2.5" fill="#f59e0b" />
                {isTacticalHudOn && (
                  <text x="0" y="24" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">[5D MORSE WATCH: STAY]</text>
                )}
              </g>
            </g>
          </svg>
        );

      case 'gravity':
        return (
          <svg viewBox="0 0 600 280" className="ultra-scene-svg" preserveAspectRatio="xMidYMid slice" aria-label="Earth curvature and Kessler cascade">
            <defs>
              <linearGradient id="earthLimbGlow" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="60%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#e0f2fe" />
              </linearGradient>
            </defs>

            {/* Depth Layer 1: Black Void & Kessler Debris Field */}
            <g transform={`translate(${screenTilt.x * 0.3}, ${screenTilt.y * 0.3})`}>
              <rect width="600" height="280" fill="#000000" />
              <g
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['gravity'][0])}
                aria-label="Kessler Debris Hotspot"
              >
                <line x1="80" y1="40" x2="520" y2="90" stroke="#ef4444" strokeWidth={isTriggered('kessler') ? '4' : '2.5'} strokeDasharray="20 10" className={isCinemaPlaying || isTriggered('kessler') ? 'fast-debris' : ''} />
                <line x1="560" y1="30" x2="120" y2="120" stroke="#fbbf24" strokeWidth="2" strokeDasharray="14 8" />
                {isTacticalHudOn && (
                  <text x="320" y="60" fill="#ef4444" fontSize="8" fontFamily="monospace" textAnchor="middle">[KESSLER SHRAPNEL // 28,000 KM/H]</text>
                )}
              </g>
            </g>

            {/* Depth Layer 2: Earth Airglow Horizon */}
            <g transform={`translate(${screenTilt.x * 0.7}, ${screenTilt.y * 0.7})`}>
              <g
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['gravity'][1])}
                aria-label="Earth Horizon Hotspot"
              >
                <path d="M -50 200 Q 300 120 650 200 L 650 320 L -50 320 Z" fill="#082f49" />
                <path d="M -50 200 Q 300 120 650 200" fill="none" stroke="url(#earthLimbGlow)" strokeWidth={isTriggered('earth') ? '10' : '6'} opacity="0.95" />
                <path d="M -50 196 Q 300 116 650 196" fill="none" stroke="#38bdf8" strokeWidth="12" opacity="0.4" />
                {isTacticalHudOn && (
                  <text x="300" y="240" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">[LOW EARTH ORBIT // ALT: 600 KM]</text>
                )}
              </g>
            </g>

            {/* Depth Layer 3: Foreground Shuttle & Astronaut */}
            <g transform={`translate(${screenTilt.x * 1.3}, ${screenTilt.y * 1.3})`}>
              {/* Shuttle Explorer */}
              <g
                transform="translate(380, 80) rotate(-15)"
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['gravity'][2])}
                aria-label="Shuttle Explorer Hotspot"
              >
                <rect x="-30" y="-8" width="60" height="16" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                <rect x="-6" y="-14" width="12" height="28" fill="#e2e8f0" />
                {isTacticalHudOn && (
                  <text x="0" y="-22" fill="#bae6fd" fontSize="8" fontFamily="monospace" textAnchor="middle">[SHUTTLE EXPLORER]</text>
                )}
              </g>

              {/* Untethered Astronaut */}
              <g
                transform="translate(190, 85)"
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['gravity'][3])}
                aria-label="Untethered Astronaut Hotspot"
              >
                <circle cx="0" cy="0" r="6" fill="#ffffff" stroke="#93c5fd" strokeWidth="1" />
                <rect x="-4" y="6" width="8" height="12" rx="2" fill="#e2e8f0" />
                <line x1="-8" y1="8" x2="8" y2="8" stroke="#cbd5e1" strokeWidth="2.5" />
                {isTacticalHudOn && (
                  <g>
                    <circle cx="0" cy="6" r="14" fill="none" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" className="hud-reticle" />
                    <text x="0" y="-12" fill="#fca5a5" fontSize="8" fontFamily="monospace" textAnchor="middle">[EVA SUIT]</text>
                  </g>
                )}
              </g>
            </g>
          </svg>
        );

      case 'the-martian':
        return (
          <svg viewBox="0 0 600 280" className="ultra-scene-svg" preserveAspectRatio="xMidYMid slice" aria-label="Acidalia Planitia Martian Sunset">
            <defs>
              <linearGradient id="marsSky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#431407" />
                <stop offset="60%" stopColor="#7c2d12" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Depth Layer 1: Sky & Blue Martian Sunset */}
            <g transform={`translate(${screenTilt.x * 0.25}, ${screenTilt.y * 0.25})`}>
              <rect width="600" height="280" fill="url(#marsSky)" />
              <g
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['the-martian'][1])}
                aria-label="Martian Sunset Hotspot"
              >
                <circle cx="360" cy="135" r={isTriggered('sunset') ? '24' : '16'} fill="#bae6fd" opacity="0.9" />
                <circle cx="360" cy="135" r={isTriggered('sunset') ? '60' : '42'} fill="#0284c7" opacity="0.3" />
                {isTacticalHudOn && (
                  <text x="360" y="80" fill="#bae6fd" fontSize="8" fontFamily="monospace" textAnchor="middle">[BLUE MARTIAN SUNSET]</text>
                )}
              </g>
            </g>

            {/* Depth Layer 2: Rolling Dunes */}
            <g transform={`translate(${screenTilt.x * 0.65}, ${screenTilt.y * 0.65})`}>
              <g
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['the-martian'][3])}
                aria-label="Acidalia Dunes Hotspot"
              >
                <path d="M 0 160 Q 150 145 300 155 T 600 150 L 600 280 L 0 280 Z" fill="#9a3412" />
                <path d="M 0 185 Q 220 170 420 190 T 600 180 L 600 280 L 0 280 Z" fill="#7c2d12" />
              </g>
            </g>

            {/* Depth Layer 3: Foreground Ares III Hab Dome & Pathfinder */}
            <g transform={`translate(${screenTilt.x * 1.3}, ${screenTilt.y * 1.3})`}>
              <path d="M 0 215 Q 180 200 360 220 T 600 210 L 600 280 L 0 280 Z" fill="#431407" />

              {/* Ares III Hab Dome */}
              <g
                transform="translate(196, 185)"
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['the-martian'][2])}
                aria-label="Ares III Hab Hotspot"
              >
                <path d="M -36 0 A 36 28 0 0 1 36 0 Z" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
                <circle cx="0" cy="-7" r="4" fill="#f97316" />
                {isTacticalHudOn && (
                  <text x="0" y="-35" fill="#fdba74" fontSize="8" fontFamily="monospace" textAnchor="middle">[ARES III HAB // SOL 546]</text>
                )}
              </g>

              {/* Pathfinder Camera Mast with Hex Ring */}
              <g
                transform="translate(420, 195)"
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['the-martian'][0])}
                aria-label="Pathfinder Mast Hotspot"
              >
                <circle cx="0" cy="0" r="14" fill="none" stroke="#fdba74" strokeWidth="1" strokeDasharray="3 2" className={isTriggered('pathfinder') ? 'spin-ring-upper' : ''} />
                <line x1="0" y1="0" x2="0" y2="-22" stroke="#ea580c" strokeWidth="2.5" />
                <circle cx="0" cy="-22" r="4" fill="#fbbf24" />
                {isTacticalHudOn && (
                  <g>
                    <circle cx="0" cy="-11" r="22" fill="none" stroke="#f97316" strokeWidth="1" strokeDasharray="3 3" className="hud-reticle" />
                    <text x="0" y="-36" fill="#fed7aa" fontSize="8" fontFamily="monospace" textAnchor="middle">[PATHFINDER 16-HEX]</text>
                  </g>
                )}
              </g>
            </g>
          </svg>
        );

      case 'apollo-13':
        return (
          <svg viewBox="0 0 600 280" className="ultra-scene-svg" preserveAspectRatio="xMidYMid slice" aria-label="Apollo 13 lunar far side and oxygen vent">
            <defs>
              <linearGradient id="oxygenVapor" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#93c5fd" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Depth Layer 1: Dark Void & Distant Earth */}
            <g transform={`translate(${screenTilt.x * 0.25}, ${screenTilt.y * 0.25})`}>
              <rect width="600" height="280" fill="#000000" />
              <g
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['apollo-13'][3])}
                aria-label="Earth Crescent Hotspot"
              >
                <circle cx="480" cy="65" r="16" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                <path d="M 470 60 Q 480 55 490 62 Q 484 72 470 60 Z" fill="#ffffff" opacity="0.85" />
                {isTacticalHudOn && (
                  <text x="480" y="100" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">[EARTH // 240,000 MI]</text>
                )}
              </g>
            </g>

            {/* Depth Layer 2: Lunar Far Side Horizon */}
            <g transform={`translate(${screenTilt.x * 0.7}, ${screenTilt.y * 0.7})`}>
              <g
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['apollo-13'][2])}
                aria-label="Lunar Horizon Hotspot"
              >
                <path d="M 0 210 Q 120 190 260 205 Q 400 185 600 200 L 600 280 L 0 280 Z" fill="#1e293b" />
                <circle cx="140" cy="235" r="18" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                <circle cx="380" cy="230" r="24" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                {isTacticalHudOn && (
                  <text x="260" y="245" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">[LUNAR FAR SIDE FREE-RETURN]</text>
                )}
              </g>
            </g>

            {/* Depth Layer 3: Foreground Apollo 13 Docked Stack */}
            <g transform={`translate(${screenTilt.x * 1.3}, ${screenTilt.y * 1.3})`}>
              <g transform="translate(240, 100)">
                {/* Cryo Oxygen Vent (Hotspot) */}
                <g
                  className="interactive-scene-hotspot"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['apollo-13'][0])}
                  aria-label="Oxygen Vent Hotspot"
                >
                  <path d="M -38 -12 C -80 -45 -140 -20 -180 -60" fill="none" stroke="url(#oxygenVapor)" strokeWidth={isTriggered('vent') ? '10' : '6'} strokeLinecap="round" className={isCinemaPlaying || isTriggered('vent') ? 'plume-vent' : ''} />
                  {isTacticalHudOn && (
                    <text x="-110" y="-70" fill="#fca5a5" fontSize="8" fontFamily="monospace" textAnchor="middle">[O2 TANK 2 VENT]</text>
                  )}
                </g>

                {/* Command & Service Module */}
                <polygon points="0,0 -20,12 -20,-12" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
                <rect x="-56" y="-12" width="36" height="24" fill="#94a3b8" />

                {/* Lunar Module Aquarius (Hotspot) */}
                <g
                  className="interactive-scene-hotspot"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['apollo-13'][1])}
                  aria-label="Aquarius Module Hotspot"
                >
                  <polygon points="0,0 24,14 24,-14" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
                  {isTacticalHudOn && (
                    <text x="40" y="-20" fill="#fde68a" fontSize="8" fontFamily="monospace" textAnchor="middle">[LM AQUARIUS]</text>
                  )}
                </g>
              </g>
            </g>
          </svg>
        );

      case 'alien':
        return (
          <svg viewBox="0 0 600 280" className="ultra-scene-svg" preserveAspectRatio="xMidYMid slice" aria-label="Derelict ship on LV-426">
            <defs>
              <linearGradient id="alienGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#14532d" />
                <stop offset="70%" stopColor="#052e16" />
                <stop offset="100%" stopColor="#021407" />
              </linearGradient>
            </defs>

            {/* Depth Layer 1: Atmospheric Storm Void */}
            <g transform={`translate(${screenTilt.x * 0.25}, ${screenTilt.y * 0.25})`}>
              <rect width="600" height="280" fill="url(#alienGlow)" />
            </g>

            {/* Depth Layer 2: Biomechanical Derelict Juggernaut */}
            <g transform={`translate(${screenTilt.x * 0.7}, ${screenTilt.y * 0.7})`}>
              <g
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['alien'][1])}
                aria-label="Derelict Ship Hotspot"
              >
                <path d="M 60 170 C 140 100 220 120 300 90 C 380 120 460 100 540 170 L 600 280 L 0 280 Z" fill="#021a0a" stroke="#166534" strokeWidth="2" />
                {isTacticalHudOn && (
                  <text x="300" y="70" fill="#86efac" fontSize="8" fontFamily="monospace" textAnchor="middle">[DERELICT JUGGERNAUT // LV-426]</text>
                )}
              </g>

              {/* Laser Scan Fan (Hotspot) */}
              <g
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['alien'][2])}
                aria-label="Laser Fan Mist Hotspot"
              >
                <polygon points="300,90 80,260 520,260" fill="#22c55e" fillOpacity="0.12" />
                <line x1="80" y1="260" x2="520" y2="260" stroke="#4ade80" strokeWidth={isTriggered('scan') ? '5' : '2.5'} opacity="0.8" className={isCinemaPlaying || isTriggered('scan') ? 'scan-fan' : ''} />
              </g>
            </g>

            {/* Depth Layer 3: Foreground Ovomorph Egg & Beacon */}
            <g transform={`translate(${screenTilt.x * 1.3}, ${screenTilt.y * 1.3})`}>
              <g
                transform="translate(300, 205)"
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['alien'][0])}
                aria-label="Ovomorph Egg Hotspot"
              >
                <path d="M 0 45 C -24 45 -30 -10 0 -22 C 30 -10 24 45 0 45 Z" fill="#052e16" stroke={isTriggered('egg') ? '#4ade80' : '#22c55e'} strokeWidth={isTriggered('egg') ? '3' : '2'} />
                <path d={isTriggered('egg') ? "M -16 -24 Q 0 -36 16 -24" : "M -10 -20 Q 0 -10 10 -20"} stroke="#86efac" strokeWidth="1.5" fill="none" />
                {isTacticalHudOn && (
                  <g>
                    <circle cx="0" cy="10" r="28" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="3 3" className="hud-reticle" />
                    <text x="0" y="-34" fill="#4ade80" fontSize="8" fontFamily="monospace" textAnchor="middle">[OVOMORPH EGG // ORGANISM DETECTED]</text>
                  </g>
                )}
              </g>

              {/* Special Order 937 Terminal Node */}
              <g
                transform="translate(80, 70)"
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['alien'][3])}
                aria-label="Special Order 937 Hotspot"
              >
                <rect x="-30" y="-10" width="60" height="20" rx="3" fill="#021407" stroke="#22c55e" strokeWidth="1" />
                <text x="0" y="4" fill="#4ade80" fontSize="7" fontFamily="monospace" textAnchor="middle">ORDER 937</text>
              </g>
            </g>
          </svg>
        );

      case 'starwars':
        return (
          <svg viewBox="0 0 600 280" className="ultra-scene-svg" preserveAspectRatio="xMidYMid slice" aria-label="Tatooine Binary Sunset">
            <defs>
              <linearGradient id="tatooineSky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="45%" stopColor="#701a75" />
                <stop offset="75%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>

            {/* Depth Layer 1: Sunset Sky & Twin Suns */}
            <g transform={`translate(${screenTilt.x * 0.25}, ${screenTilt.y * 0.25})`}>
              <rect width="600" height="280" fill="url(#tatooineSky)" />
              <g
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['star-wars'][0])}
                aria-label="Binary Suns Hotspot"
              >
                <circle cx="340" cy="140" r={isTriggered('suns') ? '40' : '32'} fill="#fef08a" opacity="0.95" />
                <circle cx="410" cy="165" r={isTriggered('suns') ? '28' : '22'} fill="#ef4444" opacity="0.9" />
                {isTacticalHudOn && (
                  <text x="375" y="90" fill="#fef08a" fontSize="8" fontFamily="monospace" textAnchor="middle">[TATOOINE BINARY SUNS]</text>
                )}
              </g>
            </g>

            {/* Depth Layer 2: Sand Dunes */}
            <g transform={`translate(${screenTilt.x * 0.65}, ${screenTilt.y * 0.65})`}>
              <path d="M 0 190 Q 200 170 380 195 T 600 185 L 600 280 L 0 280 Z" fill="#78350f" />
              <path d="M 0 220 Q 260 200 460 225 T 600 215 L 600 280 L 0 280 Z" fill="#451a03" />

              {/* Moisture Vaporator */}
              <g
                transform="translate(180, 165)"
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['star-wars'][2])}
                aria-label="Moisture Vaporator Hotspot"
              >
                <line x1="0" y1="0" x2="0" y2="40" stroke="#000000" strokeWidth="2.5" />
                <circle cx="0" cy="8" r="5" fill="#000000" />
                <line x1="-8" y1="18" x2="8" y2="18" stroke="#000000" strokeWidth="1.5" />
                {isTacticalHudOn && (
                  <text x="0" y="-8" fill="#d97706" fontSize="8" fontFamily="monospace" textAnchor="middle">[VAPORATOR]</text>
                )}
              </g>
            </g>

            {/* Depth Layer 3: Foreground T-65 X-Wing Starfighter */}
            <g transform={`translate(${screenTilt.x * 1.3}, ${screenTilt.y * 1.3})`}>
              <g
                transform="translate(260, 70) rotate(-25)"
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['star-wars'][1])}
                aria-label="X-Wing Starfighter Hotspot"
              >
                <polygon points="0,0 -16,6 -16,-6" fill="#f8fafc" stroke="#0284c7" strokeWidth="1" />
                <line x1="-16" y1="-12" x2="8" y2="-12" stroke="#ef4444" strokeWidth="1.8" />
                <line x1="-16" y1="12" x2="8" y2="12" stroke="#ef4444" strokeWidth="1.8" />
                <circle cx="-16" cy="0" r="3" fill="#38bdf8" />
                {isTriggered('xwing') && (
                  <g>
                    <line x1="8" y1="-12" x2="60" y2="-12" stroke="#ef4444" strokeWidth="3" />
                    <line x1="8" y1="12" x2="60" y2="12" stroke="#ef4444" strokeWidth="3" />
                  </g>
                )}
                {isTacticalHudOn && (
                  <g>
                    <circle cx="0" cy="0" r="22" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" className="hud-reticle" />
                    <text x="0" y="-28" fill="#bae6fd" fontSize="8" fontFamily="monospace" textAnchor="middle">[T-65 X-WING RED FIVE]</text>
                  </g>
                )}
              </g>

              {/* Thermal Exhaust Port Target Reticle */}
              <g
                transform="translate(490, 80)"
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['star-wars'][3])}
                aria-label="Thermal Exhaust Port Hotspot"
              >
                <circle cx="0" cy="0" r="12" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" className="hud-reticle" />
                <text x="0" y="24" fill="#fca5a5" fontSize="7" fontFamily="monospace" textAnchor="middle">[2M EXHAUST PORT]</text>
              </g>
            </g>
          </svg>
        );

      case 'wall-e':
        return (
          <svg viewBox="0 0 600 280" className="ultra-scene-svg" preserveAspectRatio="xMidYMid slice" aria-label="WALL-E and EVE Zero-G Dance">
            <defs>
              <radialGradient id="nebulaDust" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Depth Layer 1: Nebula Dust & Axiom Starliner */}
            <g transform={`translate(${screenTilt.x * 0.25}, ${screenTilt.y * 0.25})`}>
              <rect width="600" height="280" fill="#030712" />
              <circle cx="280" cy="120" r="140" fill="url(#nebulaDust)" />
              {/* Axiom Starliner */}
              <g
                transform="translate(460, 50)"
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['wall-e'][2])}
                aria-label="Axiom Starliner Hotspot"
              >
                <rect x="0" y="0" width="70" height="14" rx="7" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                <circle cx="16" cy="7" r="4" fill="#38bdf8" />
                <circle cx="50" cy="7" r="4" fill="#eab308" />
                {isTacticalHudOn && (
                  <text x="35" y="-10" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">[AXIOM // DIRECTIVE A-113]</text>
                )}
              </g>
            </g>

            {/* Depth Layer 2: Fire Extinguisher Vapor Spiral */}
            <g transform={`translate(${screenTilt.x * 0.7}, ${screenTilt.y * 0.7})`}>
              <g
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['wall-e'][3])}
                aria-label="Vapor Spiral Hotspot"
              >
                <path d="M 240 140 C 200 160 160 120 100 150" fill="none" stroke="#f1f5f9" strokeWidth={isTriggered('vapor') ? '12' : '8'} strokeLinecap="round" opacity="0.6" className={isCinemaPlaying || isTriggered('vapor') ? 'vapor-spiral' : ''} />
              </g>
            </g>

            {/* Depth Layer 3: Foreground WALL-E and EVE */}
            <g transform={`translate(${screenTilt.x * 1.3}, ${screenTilt.y * 1.3})`}>
              {/* WALL-E */}
              <g
                transform="translate(240, 140)"
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['wall-e'][0])}
                aria-label="WALL-E Hotspot"
              >
                <rect x="-14" y="-12" width="28" height="24" rx="3" fill="#ca8a04" stroke="#713f12" strokeWidth="1.5" />
                <circle cx="-6" cy="-18" r="6" fill="#475569" stroke="#eab308" strokeWidth="1" />
                <circle cx="6" cy="-18" r="6" fill="#475569" stroke="#eab308" strokeWidth="1" />
                {isTacticalHudOn && (
                  <g>
                    <circle cx="0" cy="-6" r="22" fill="none" stroke="#eab308" strokeWidth="1" strokeDasharray="3 3" className="hud-reticle" />
                    <text x="0" y="-32" fill="#fef08a" fontSize="8" fontFamily="monospace" textAnchor="middle">[WALL-E // 100% SOLAR]</text>
                  </g>
                )}
              </g>

              {/* EVE */}
              <g
                transform="translate(340, 125)"
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['wall-e'][1])}
                aria-label="EVE Hotspot"
              >
                <ellipse cx="0" cy="0" rx="12" ry="24" fill="#ffffff" stroke="#93c5fd" strokeWidth="1" />
                <ellipse cx="0" cy="-8" rx="8" ry="6" fill="#0f172a" />
                <ellipse cx="0" cy="-8" rx="5" ry="3" fill={isTriggered('eve') ? '#22c55e' : '#38bdf8'} />
                {isTacticalHudOn && (
                  <text x="0" y="-28" fill="#bae6fd" fontSize="8" fontFamily="monospace" textAnchor="middle">[EVE // DIRECTIVE: PLANT]</text>
                )}
              </g>
            </g>
          </svg>
        );

      case 'aliens':
        return (
          <svg viewBox="0 0 600 280" className="ultra-scene-svg" preserveAspectRatio="xMidYMid slice" aria-label="Hadley's Hope Power Loader Showdown">
            <defs>
              <linearGradient id="aliensStorm" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="50%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>

            {/* Depth Layer 1: Storm Sky & Atmosphere Tower */}
            <g transform={`translate(${screenTilt.x * 0.25}, ${screenTilt.y * 0.25})`}>
              <rect width="600" height="280" fill="url(#aliensStorm)" />
              <g
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['aliens'][2])}
                aria-label="Atmosphere Processor Hotspot"
              >
                <polygon points="120,40 150,220 90,220" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                <polygon points="460,30 500,220 420,220" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                {isTacticalHudOn && (
                  <text x="120" y="30" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">[HADLEY'S HOPE PROCESSOR]</text>
                )}
              </g>
            </g>

            {/* Depth Layer 2: Gantry Steel & Searchlights */}
            <g transform={`translate(${screenTilt.x * 0.7}, ${screenTilt.y * 0.7})`}>
              <line x1="0" y1="210" x2="600" y2="210" stroke="#475569" strokeWidth="4" />
              <polygon points="260,140 120,260 380,260" fill="#fef08a" fillOpacity="0.16" />

              {/* Alien Queen Silhouette (Hotspot) */}
              <g
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['aliens'][1])}
                aria-label="Alien Queen Hotspot"
              >
                <path d="M 400 130 C 420 80 470 90 490 120 C 470 140 430 170 410 210 Z" fill="#000000" opacity="0.9" />
                {isTacticalHudOn && (
                  <g>
                    <circle cx="445" cy="140" r="34" fill="none" stroke="#e11d48" strokeWidth="1" strokeDasharray="3 3" className="hud-reticle" />
                    <text x="445" y="70" fill="#fda4af" fontSize="8" fontFamily="monospace" textAnchor="middle">[ALIEN QUEEN]</text>
                  </g>
                )}
              </g>
            </g>

            {/* Depth Layer 3: Foreground Power Loader & Pulse Rifle HUD */}
            <g transform={`translate(${screenTilt.x * 1.3}, ${screenTilt.y * 1.3})`}>
              {/* Caterpillar P-5000 Power Loader (Hotspot) */}
              <g
                transform="translate(260, 160)"
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['aliens'][0])}
                aria-label="Power Loader Hotspot"
              >
                <rect x="-16" y="-20" width="32" height="40" fill="#eab308" stroke="#713f12" strokeWidth="2" />
                <path d={isTriggered('loader') ? "M -22 -10 Q -40 0 -22 8" : "M -22 -10 Q -36 0 -22 15"} fill="none" stroke="#ca8a04" strokeWidth="4" strokeLinecap="round" />
                <path d={isTriggered('loader') ? "M 22 -10 Q 40 0 22 8" : "M 22 -10 Q 36 0 22 15"} fill="none" stroke="#ca8a04" strokeWidth="4" strokeLinecap="round" />
                {isTacticalHudOn && (
                  <g>
                    <circle cx="0" cy="0" r="30" fill="none" stroke="#eab308" strokeWidth="1" strokeDasharray="3 3" className="hud-reticle" />
                    <text x="0" y="-30" fill="#fde047" fontSize="8" fontFamily="monospace" textAnchor="middle">[P-5000 POWER LOADER]</text>
                  </g>
                )}
              </g>

              {/* M41A Pulse Rifle Hotspot */}
              <g
                transform="translate(80, 240)"
                className="interactive-scene-hotspot"
                role="button"
                tabIndex={0}
                onClick={() => handleTriggerHotspot(SCENE_HOTSPOTS['aliens'][3])}
                aria-label="Pulse Rifle Hotspot"
              >
                <rect x="-35" y="-12" width="70" height="24" rx="3" fill="#140507" stroke="#e11d48" strokeWidth="1" />
                <text x="0" y="4" fill="#fb7185" fontSize="8" fontFamily="monospace" textAnchor="middle">M41A AMMO: 95</text>
              </g>
            </g>
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`cinema-terminal ${isAmbilightOn ? 'ambilight-active' : ''} ${isTheaterExpanded ? 'theater-expanded' : ''}`}
      id="cosmic-cinema-terminal"
      style={{ '--active-movie-color': activeSignal.themeColor } as React.CSSProperties}
    >
      {/* Dynamic Ambient Theater Glow Backdrop */}
      {isAmbilightOn && (
        <div
          className="ambilight-glow-backdrop"
          style={{
            background: `radial-gradient(circle at 50% 25%, ${activeSignal.themeColor}30 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Terminal Title Bar */}
      <div className="terminal-top-bar">
        <div className="terminal-title-group">
          <span className="terminal-radar-pulse" aria-hidden="true" />
          <span className="terminal-tag">COSMIC CINEMA & SIGNALS TRANSCEIVER</span>
        </div>
        <div className="terminal-controls-group">
          <button
            type="button"
            className="screen-control-btn"
            onClick={() => setIsTheaterExpanded(!isTheaterExpanded)}
            aria-label="Toggle wide theater stage"
          >
            <span>{isTheaterExpanded ? 'VIEW: COMPACT' : 'VIEW: WIDE THEATER'}</span>
          </button>
          <button
            type="button"
            className="screen-control-btn"
            onClick={() => setIsTacticalHudOn(!isTacticalHudOn)}
            aria-label="Toggle tactical HUD reticles"
          >
            <span>{isTacticalHudOn ? 'HUD: TACTICAL' : 'HUD: CLEAN'}</span>
          </button>
          <button
            type="button"
            className="screen-control-btn"
            onClick={() => setIsAmbilightOn(!isAmbilightOn)}
            aria-label="Toggle theatrical Ambilight illumination"
          >
            <span>{isAmbilightOn ? 'AMBILIGHT: ON' : 'AMBILIGHT: OFF'}</span>
          </button>
          <button
            type="button"
            className="sound-toggle-btn"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute synthesized telemetry audio' : 'Mute synthesized telemetry audio'}
          >
            <span>{isMuted ? 'AUDIO: MUTED' : 'AUDIO: SYNTH ON'}</span>
          </button>
          <span className="live-pill">9 TOP SPACE SCI-FI SIGNALS LOCKED</span>
        </div>
      </div>

      {/* Intro Description */}
      <div className="terminal-intro">
        <p>
          Tune your deep-space radio telescope into the transmissions of space cinema history. Hover and explore the 3D floating holographic mini movie screen with real-time parallax depth, interact with clickable hotspots inside every scene, study 54 curated visual motifs and props, and decrypt classified Easter eggs.
        </p>
      </div>

      {/* Interactive Radio Frequency Scrubber Bar */}
      <div className="frequency-scrubber-bar">
        <div className="scrubber-header">
          <span className="scrubber-label">RF FREQUENCY SPECTRUM ANALYZER</span>
          <span className="scrubber-current-val">{activeSignal.frequency} &bull; {activeSignal.callSign}</span>
          <div className="seek-btn-group">
            <button type="button" className="seek-btn" onClick={() => handleSeekSignal('prev')} aria-label="Seek previous signal">
              &#9664; SEEK PREV
            </button>
            <button type="button" className="seek-btn" onClick={() => handleSeekSignal('next')} aria-label="Seek next signal">
              SEEK NEXT &#9654;
            </button>
          </div>
        </div>

        {/* Signal Selector Dial Strip */}
        <div className="signal-selector-strip" role="tablist" aria-label="Space Cinema Signal Dial">
          {CINEMA_SIGNALS.map((sig) => {
            const isActive = sig.id === activeSignalId;
            return (
              <button
                key={sig.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${sig.id}`}
                className={`signal-dial-btn ${isActive ? 'active' : ''}`}
                style={{ '--movie-theme': sig.themeColor } as React.CSSProperties}
                onClick={() => handleSelectSignal(sig.id)}
              >
                <span className="dial-num">{sig.year}</span>
                <span className="dial-title">{sig.movie.split(':')[0]}</span>
                <span className="dial-freq">{sig.frequency}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ULTRA-REALISTIC FLOATING HOLOGRAPHIC MINI MOVIE SCREEN                     */}
      {/* ========================================================================= */}
      <div className="floating-screen-wrapper">
        <div className="screen-toolbar">
          <div className="screen-title-badge">
            <span className="screen-signal-icon" aria-hidden="true">&#9670;</span>
            <span className="screen-film-title">{activeSignal.movie.toUpperCase()} ({activeSignal.year})</span>
            <span className="screen-aspect-tag">{activeSignal.aspectRatioLabel}</span>
          </div>

          <div className="screen-action-buttons">
            <button
              type="button"
              className={`cine-btn ${isCinemaPlaying ? 'playing' : ''}`}
              onClick={toggleCinemaPlay}
              aria-label="Toggle live cinema playback mode"
            >
              <span>{isCinemaPlaying ? '&#9632; PAUSE CINEMA MODE' : '&#9658; PLAY CINEMA MODE'}</span>
            </button>
            <button type="button" className="cine-opt-btn" onClick={cycleAspectRatio}>
              FORMAT: {aspectRatio.toUpperCase()}
            </button>
            <button type="button" className="cine-opt-btn" onClick={cycleDisplayFx}>
              FX: {displayFx.toUpperCase()}
            </button>
          </div>
        </div>

        {/* 3D Levitating Stage */}
        <div
          className="holo-levitation-stage"
          onMouseMove={handleScreenMouseMove}
          onMouseLeave={handleScreenMouseLeave}
        >
          {/* Volumetric Projection Cones from Dock */}
          <div
            className="volumetric-beam-cone"
            style={{
              background: `linear-gradient(to top, ${activeSignal.themeColor}40 0%, ${activeSignal.themeColor}10 40%, transparent 90%)`,
            }}
            aria-hidden="true"
          />

          {/* Floating Cinema Screen Container (3D Tilted via Mouse Parallax) */}
          <div
            className={`floating-cinema-screen aspect-${aspectRatio} fx-${displayFx} ${isCinemaPlaying ? 'cinema-active' : ''}`}
            style={{
              transform: `perspective(1200px) rotateX(${screenTilt.y}deg) rotateY(${screenTilt.x}deg) translateY(${isScreenHovered ? -6 : 0}px)`,
              boxShadow: `0 24px 60px ${activeSignal.themeColor}33, 0 0 20px ${activeSignal.themeColor}22`,
              borderColor: `${activeSignal.themeColor}77`,
            }}
          >
            {/* Cinematic Lens Flare Streak */}
            <div className="anamorphic-flare-streak" style={{ borderColor: activeSignal.themeColor }} />

            {/* Render High-Graphics Scene */}
            <div className="scene-viewport">
              {renderCinematicScene(activeSignal.id)}
            </div>

            {/* Specular Glare reacting to mouse cursor */}
            <div
              className="specular-glass-glare"
              style={{
                background: `radial-gradient(circle at ${50 + screenTilt.x * 2.5}% ${50 - screenTilt.y * 2.5}%, rgba(255, 255, 255, 0.3) 0%, transparent 65%)`,
              }}
            />

            {/* Scanline CRT overlay */}
            {displayFx === 'hologram' && <div className="hologram-scanlines" />}
            {displayFx === 'grain' && <div className="film-grain-overlay" />}

            {/* Screen Lower HUD Banner */}
            <div className="screen-hud-overlay">
              <span className="hud-scene-name">{activeSignal.sceneTitle}</span>
              <span className="hud-rec-indicator">
                <span className="rec-dot" /> LIVE TRANSMISSION
              </span>
            </div>
          </div>

          {/* Holographic Projector Emitter Dock at Base */}
          <div className="holo-projector-dock">
            <div className="dock-emitter-ring" style={{ borderColor: activeSignal.themeColor }} />
            <div className="dock-status-label">HOLO-PROJECTION EMITTER // OPTICAL MATRIX ACTIVE</div>
          </div>

          {/* Ground Ambient Deck Shadow */}
          <div className="holo-deck-shadow" />
        </div>

        {/* Optical Telemetry & Tactical Scanner Console (Interactive Hotspot Details) */}
        <div className="optical-telemetry-console" style={{ borderColor: `${activeSignal.themeColor}55` }}>
          <div className="console-hud-top">
            <div className="hud-badge-group">
              <span className="hud-status-dot" style={{ background: activeSignal.themeColor, boxShadow: `0 0 8px ${activeSignal.themeColor}` }} />
              <span className="hud-status-label">OPTICAL TELEMETRY SCANNER</span>
              <span className="hud-active-target">TARGET: {activeHotspot.label}</span>
            </div>
            <button
              type="button"
              className="action-trigger-btn"
              style={{ background: activeSignal.themeColor, color: '#000000' }}
              onClick={() => handleTriggerHotspot(activeHotspot)}
            >
              &#9654; {activeHotspot.actionLabel}
            </button>
          </div>

          <div className="telemetry-readout-grid">
            <div className="readout-card">
              <span className="readout-label">ASTRODYNAMICS / SCI-FI TELEMETRY:</span>
              <p className="readout-val">{activeHotspot.techSpec}</p>
            </div>
            <div className="readout-card">
              <span className="readout-label">PRODUCTION LORE & CINEMA TRIVIA:</span>
              <p className="readout-val">{activeHotspot.trivia}</p>
            </div>
          </div>

          {/* Quick Select Hotspot Pills */}
          <div className="hotspot-nav-pills">
            <span className="pills-label">INTERACTIVE HOTSPOTS:</span>
            {currentHotspots.map((h) => {
              const isSelected = activeHotspot.id === h.id;
              return (
                <button
                  key={h.id}
                  type="button"
                  className={`hotspot-pill-btn ${isSelected ? 'active' : ''}`}
                  style={{ '--hotspot-color': activeSignal.themeColor } as React.CSSProperties}
                  onClick={() => handleTriggerHotspot(h)}
                >
                  &#9670; {h.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scene Narrative Caption */}
        <div className="scene-narrative-bar">
          <p className="scene-narrative-text">{activeSignal.sceneDescription}</p>
        </div>
      </div>

      {/* Active Signal Telemetry Display */}
      <div className="signal-telemetry-card" id={`panel-${activeSignal.id}`} role="tabpanel">
        <div className="telemetry-content-layout">
          {/* Iconic Dialogue Banner */}
          <div className="quote-box" style={{ borderLeftColor: activeSignal.themeColor }}>
            <div className="quote-label">TRANSMISSION DIALOGUE:</div>
            <p className="quote-text">"{activeSignal.quote}"</p>
            <div className="quote-speaker">&mdash; {activeSignal.speaker}</div>
          </div>

          {/* Motifs & Search Header */}
          <div className="motifs-header-row">
            <h4 className="motifs-heading">ICONIC REFERENCES, MOTIFS & PROPS ({filteredMotifs.length})</h4>
            <div className="search-wrap">
              <input
                type="text"
                placeholder="Filter motifs (e.g. pen, watch, cat)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="motif-search-input"
                aria-label="Filter motifs by keyword"
              />
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="motif-filter-tabs">
            {(['ALL', 'Prop', 'Visual Motif', 'Dialogue', 'Easter Egg', 'Character / AI'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                className={`motif-filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Motifs Grid */}
          <div className="motifs-grid">
            {filteredMotifs.map((motif, idx) => (
              <div key={idx} className="motif-card">
                <div className="motif-card-header">
                  <span className="motif-name">{motif.name}</span>
                  <span className="motif-badge" style={{ borderColor: activeSignal.themeColor, color: activeSignal.themeColor }}>
                    {motif.category}
                  </span>
                </div>
                <p className="motif-desc">{motif.description}</p>
              </div>
            ))}
          </div>

          {/* Astrodynamics & Science Lore */}
          <div className="lore-box">
            <div className="lore-label">ASTROPHYSICS & PRODUCTION LORE:</div>
            <p className="lore-text">{activeSignal.astrodynamicsNote}</p>
          </div>

          {/* Classified Easter Egg Decryptor */}
          <div className="decrypt-section">
            <button
              type="button"
              className="decrypt-btn"
              style={{ borderColor: activeSignal.themeColor }}
              onClick={() => handleDecrypt(activeSignal.id)}
            >
              <span className="decrypt-radar-icon" aria-hidden="true">&#10022;</span>
              <span>
                {decryptedSignals[activeSignal.id] ? 'RE-ENCRYPT CLASSIFIED LOG' : 'DECRYPT CLASSIFIED EASTER EGG'}
              </span>
              <span className="decrypt-code">{activeSignal.classifiedEasterEgg.clearanceCode}</span>
            </button>

            {decryptedSignals[activeSignal.id] && (
              <div className="decrypted-log-panel" style={{ borderColor: activeSignal.themeColor }}>
                <div className="decrypted-header">
                  <span className="badge-name">{activeSignal.classifiedEasterEgg.badgeName}</span>
                  <button
                    type="button"
                    className="copy-btn"
                    onClick={() => handleCopySecret(activeSignal.classifiedEasterEgg.secretLog, activeSignal.id)}
                  >
                    {copiedId === activeSignal.id ? '&#10003; COPIED TO CLIPBOARD' : 'COPY TRANSMISSION'}
                  </button>
                </div>
                <div className="decrypted-title">{activeSignal.classifiedEasterEgg.title}</div>
                <blockquote className="decrypted-body">
                  {activeSignal.classifiedEasterEgg.secretLog}
                </blockquote>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Master 9-Film Dossier Drawer Toggle */}
      <div className="dossier-toggle-container">
        <button
          type="button"
          className="dossier-toggle-btn"
          onClick={() => {
            setIsDossierOpen(!isDossierOpen);
            audio.playRadioChirp(750);
          }}
          aria-expanded={isDossierOpen}
        >
          <span>{isDossierOpen ? '&#9650; COLLAPSE COMPLETE 9-FILM EASTER EGG DOSSIER' : '&#9660; EXPAND COMPLETE 9-FILM EASTER EGG DOSSIER'}</span>
          <span className="dossier-count">54 CURATED REFERENCES & PROPS</span>
        </button>
      </div>

      {/* Complete Dossier Content */}
      {isDossierOpen && (
        <div className="complete-dossier-drawer">
          <div className="dossier-grid">
            {CINEMA_SIGNALS.map((sig) => (
              <div key={sig.id} className="dossier-movie-card" style={{ borderTopColor: sig.themeColor }}>
                <div className="dossier-card-head">
                  <div className="dossier-movie-title">{sig.movie} ({sig.year})</div>
                  <div className="dossier-movie-dir">Directed by {sig.director} &bull; {sig.frequency}</div>
                </div>
                <div className="dossier-motifs-list">
                  {sig.motifs.map((m, mIdx) => (
                    <div key={mIdx} className="dossier-motif-row">
                      <strong className="dossier-motif-name">{m.name}: </strong>
                      <span className="dossier-motif-desc">{m.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .cinema-terminal {
          background: linear-gradient(160deg, color-mix(in srgb, var(--navy) 90%, var(--void)), var(--void));
          border: 1px solid color-mix(in srgb, var(--orbit) 40%, transparent);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          box-shadow: 0 16px 40px color-mix(in srgb, var(--void) 85%, transparent);
          position: relative;
          overflow: hidden;
          margin-bottom: var(--space-3xl);
          transition: box-shadow 0.4s ease;
        }

        .cinema-terminal.ambilight-active {
          box-shadow: 0 20px 60px color-mix(in srgb, var(--active-movie-color, var(--orbit)) 25%, transparent),
                      0 0 100px color-mix(in srgb, var(--active-movie-color, var(--orbit)) 15%, transparent);
        }

        .ambilight-glow-backdrop {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.85;
          transition: background 0.6s ease;
        }

        /* Top Bar */
        .terminal-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-sm);
          border-bottom: 1px solid color-mix(in srgb, var(--orbit) 25%, transparent);
          padding-bottom: var(--space-sm);
          margin-bottom: var(--space-md);
          position: relative;
          z-index: 1;
        }

        .terminal-title-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .terminal-radar-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--sol-flare);
          box-shadow: 0 0 10px var(--sol-flare);
          animation: radarBeacon 1.8s infinite ease-in-out;
        }

        @keyframes radarBeacon {
          0%, 100% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .terminal-tag {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--orbit);
        }

        .terminal-controls-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .screen-control-btn,
        .sound-toggle-btn {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          padding: 0.2rem 0.5rem;
          background: color-mix(in srgb, var(--steel) 20%, transparent);
          border: 1px solid color-mix(in srgb, var(--steel) 40%, transparent);
          color: var(--moon);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .screen-control-btn:hover,
        .sound-toggle-btn:hover {
          background: var(--orbit);
          color: #ffffff;
        }

        .live-pill {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          padding: 0.2rem 0.6rem;
          background: color-mix(in srgb, var(--astrophage) 15%, transparent);
          border: 1px solid color-mix(in srgb, var(--astrophage) 50%, transparent);
          color: var(--astrophage);
          border-radius: 9999px;
          letter-spacing: 0.05em;
        }

        .terminal-intro {
          position: relative;
          z-index: 1;
        }

        .terminal-intro p {
          font-family: var(--font-body);
          font-size: 0.9375rem;
          color: var(--star);
          margin: 0 0 var(--space-md) 0;
          line-height: 1.5;
        }

        /* Scrubber Bar */
        .frequency-scrubber-bar {
          background: color-mix(in srgb, var(--void) 70%, transparent);
          border: 1px solid color-mix(in srgb, var(--orbit) 25%, transparent);
          border-radius: var(--radius-md);
          padding: var(--space-sm);
          margin-bottom: var(--space-lg);
          position: relative;
          z-index: 1;
        }

        .scrubber-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.6875rem;
        }

        .scrubber-label {
          color: var(--sol-dust);
          letter-spacing: 0.08em;
        }

        .scrubber-current-val {
          color: var(--orbit);
          font-weight: 700;
        }

        .seek-btn-group {
          display: flex;
          gap: 0.25rem;
        }

        .seek-btn {
          background: color-mix(in srgb, var(--navy) 60%, var(--void));
          border: 1px solid color-mix(in srgb, var(--steel) 30%, transparent);
          color: var(--star);
          font-family: var(--font-mono);
          font-size: 0.625rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .seek-btn:hover {
          background: var(--orbit);
          color: #ffffff;
        }

        /* Signal Selector Dial Strip */
        .signal-selector-strip {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 0.5rem;
        }

        @media (max-width: 640px) {
          .signal-selector-strip {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            padding-bottom: 0.5rem;
          }
        }

        .signal-dial-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 0.65rem 0.75rem;
          background: color-mix(in srgb, var(--navy) 60%, var(--void));
          border: 1px solid color-mix(in srgb, var(--steel) 30%, transparent);
          border-radius: var(--radius-md);
          color: var(--star);
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 130px;
          scroll-snap-align: start;
        }

        .signal-dial-btn:hover {
          background: color-mix(in srgb, var(--navy) 90%, var(--void));
          border-color: var(--movie-theme, var(--orbit));
          transform: translateY(-1px);
        }

        .signal-dial-btn.active {
          background: linear-gradient(145deg, color-mix(in srgb, var(--navy) 95%, var(--void)), var(--deep));
          border-color: var(--movie-theme, var(--orbit));
          box-shadow: 0 0 14px color-mix(in srgb, var(--movie-theme, var(--orbit)) 30%, transparent);
        }

        .dial-num {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          color: var(--star);
          opacity: 0.7;
        }

        .dial-title {
          font-family: var(--font-body);
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--moon);
          margin: 0.15rem 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .signal-dial-btn.active .dial-title {
          color: #ffffff;
        }

        .dial-freq {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          color: var(--movie-theme, var(--orbit));
        }

        /* ========================================================================= */
        /* FLOATING HOLOGRAPHIC MINI MOVIE SCREEN STYLING                            */
        /* ========================================================================= */
        .floating-screen-wrapper {
          background: color-mix(in srgb, var(--void) 85%, transparent);
          border: 1px solid color-mix(in srgb, var(--orbit) 30%, transparent);
          border-radius: var(--radius-lg);
          padding: var(--space-md);
          margin-bottom: var(--space-xl);
          position: relative;
          z-index: 1;
        }

        .screen-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: var(--space-md);
          border-bottom: 1px solid color-mix(in srgb, var(--steel) 20%, transparent);
          padding-bottom: 0.5rem;
        }

        .screen-title-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-mono);
        }

        .screen-signal-icon {
          color: var(--active-movie-color, var(--orbit));
          font-size: 0.875rem;
        }

        .screen-film-title {
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--moon);
          letter-spacing: 0.05em;
        }

        .screen-aspect-tag {
          font-size: 0.625rem;
          color: var(--sol-dust);
          background: color-mix(in srgb, var(--void) 90%, transparent);
          border: 1px solid color-mix(in srgb, var(--steel) 30%, transparent);
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
        }

        .screen-action-buttons {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .cine-btn {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 0.35rem 0.85rem;
          background: color-mix(in srgb, var(--orbit) 20%, transparent);
          border: 1px solid var(--orbit);
          color: var(--moon);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cine-btn:hover {
          background: var(--orbit);
          color: #ffffff;
        }

        .cine-btn.playing {
          background: #22c55e;
          border-color: #4ade80;
          color: #000000;
          animation: playPulse 2s infinite ease-in-out;
        }

        @keyframes playPulse {
          0%, 100% { box-shadow: 0 0 10px rgba(34, 197, 94, 0.4); }
          50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.8); }
        }

        .cine-opt-btn {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          padding: 0.35rem 0.55rem;
          background: color-mix(in srgb, var(--navy) 60%, var(--void));
          border: 1px solid color-mix(in srgb, var(--steel) 30%, transparent);
          color: var(--star);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .cine-opt-btn:hover {
          border-color: var(--orbit);
          color: var(--moon);
        }

        /* 3D Levitation Stage */
        .holo-levitation-stage {
          position: relative;
          min-height: 290px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-md) 0 var(--space-xl) 0;
          perspective: 1200px;
        }

        @media (min-width: 768px) {
          .holo-levitation-stage {
            min-height: 350px;
          }
        }

        .theater-expanded .floating-cinema-screen {
          max-width: 1000px;
        }

        .volumetric-beam-cone {
          position: absolute;
          bottom: 24px;
          width: 85%;
          height: 180px;
          clip-path: polygon(30% 100%, 70% 100%, 100% 0%, 0% 0%);
          pointer-events: none;
          z-index: 1;
          opacity: 0.75;
          animation: beamShimmer 3s infinite ease-in-out;
        }

        @keyframes beamShimmer {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 0.85; }
        }

        /* The Floating Screen */
        .floating-cinema-screen {
          width: 95%;
          max-width: 820px;
          border-radius: 12px;
          border: 2px solid;
          background: #020617;
          position: relative;
          overflow: hidden;
          z-index: 2;
          transition: transform 0.15s ease-out, box-shadow 0.3s ease, max-width 0.4s ease;
          animation: holoFloat 5s infinite ease-in-out;
          transform-style: preserve-3d;
        }

        @keyframes holoFloat {
          0%, 100% { transform: translateY(0px) rotateX(0deg); }
          50% { transform: translateY(-8px) rotateX(1deg); }
        }

        .floating-cinema-screen.aspect-widescreen {
          aspect-ratio: 2.39 / 1;
        }

        .floating-cinema-screen.aspect-imax {
          aspect-ratio: 1.43 / 1;
        }

        .floating-cinema-screen.aspect-broadcast {
          aspect-ratio: 16 / 9;
        }

        @media (max-width: 600px) {
          .floating-cinema-screen {
            width: 98%;
            aspect-ratio: 16 / 9 !important;
          }
        }

        .anamorphic-flare-streak {
          position: absolute;
          top: 30%;
          left: -10%;
          right: -10%;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%);
          border-top: 1px solid;
          opacity: 0.6;
          pointer-events: none;
          z-index: 4;
        }

        .scene-viewport {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000000;
        }

        .ultra-scene-svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        /* Interactive Hotspots within SVG */
        .interactive-scene-hotspot {
          cursor: pointer;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .interactive-scene-hotspot:hover {
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
        }

        .hud-reticle {
          animation: reticleSpin 8s infinite linear;
          transform-origin: center;
        }

        @keyframes reticleSpin {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 24; }
        }

        .specular-glass-glare {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 5;
          mix-blend-mode: screen;
        }

        .hologram-scanlines {
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%),
                      linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
          background-size: 100% 3px, 3px 100%;
          pointer-events: none;
          z-index: 6;
          opacity: 0.65;
        }

        .film-grain-overlay {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 0);
          background-size: 4px 4px;
          pointer-events: none;
          z-index: 6;
          opacity: 0.5;
        }

        .screen-hud-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 0.4rem 0.75rem;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, transparent 100%);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 0.625rem;
          color: #f8fafc;
          z-index: 7;
        }

        .hud-scene-name {
          font-weight: 700;
          letter-spacing: 0.05em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .hud-rec-indicator {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: #ef4444;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .rec-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 6px #ef4444;
          animation: recBlink 1.2s infinite ease-in-out;
        }

        @keyframes recBlink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        /* Projector Emitter Dock */
        .holo-projector-dock {
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          z-index: 3;
        }

        .dock-emitter-ring {
          width: 140px;
          height: 8px;
          border-radius: 9999px;
          border: 2px solid;
          background: #020617;
          box-shadow: 0 0 12px var(--active-movie-color, var(--orbit));
        }

        .dock-status-label {
          font-family: var(--font-mono);
          font-size: 0.5625rem;
          color: var(--star);
          letter-spacing: 0.1em;
          opacity: 0.7;
        }

        .holo-deck-shadow {
          width: 60%;
          height: 12px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          filter: blur(6px);
          margin-top: 0.25rem;
          animation: shadowPulse 5s infinite ease-in-out;
        }

        @keyframes shadowPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(0.85); opacity: 0.35; }
        }

        /* Optical Telemetry Console (Directly Below Screen) */
        .optical-telemetry-console {
          background: color-mix(in srgb, var(--void) 90%, transparent);
          border: 1px solid;
          border-radius: var(--radius-md);
          padding: var(--space-md);
          margin-top: var(--space-sm);
          margin-bottom: var(--space-sm);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }

        .console-hud-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          border-bottom: 1px solid color-mix(in srgb, var(--steel) 20%, transparent);
          padding-bottom: 0.5rem;
        }

        .hud-badge-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.6875rem;
        }

        .hud-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .hud-status-label {
          color: var(--sol-dust);
          letter-spacing: 0.08em;
        }

        .hud-active-target {
          font-weight: 700;
          color: var(--moon);
          background: color-mix(in srgb, var(--steel) 20%, transparent);
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
        }

        .action-trigger-btn {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 0.35rem 0.85rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.04em;
        }

        .action-trigger-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.2);
        }

        .action-trigger-btn:active {
          transform: translateY(0);
        }

        .telemetry-readout-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        @media (min-width: 768px) {
          .telemetry-readout-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .readout-card {
          background: color-mix(in srgb, var(--navy) 40%, var(--void));
          border: 1px solid color-mix(in srgb, var(--steel) 25%, transparent);
          border-radius: var(--radius-sm);
          padding: 0.65rem 0.85rem;
        }

        .readout-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.625rem;
          letter-spacing: 0.08em;
          color: var(--orbit);
          margin-bottom: 0.25rem;
        }

        .readout-val {
          font-family: var(--font-body);
          font-size: 0.8125rem;
          line-height: 1.45;
          color: var(--star);
          margin: 0;
        }

        /* Hotspot Navigation Pills */
        .hotspot-nav-pills {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
          padding-top: 0.5rem;
          border-top: 1px solid color-mix(in srgb, var(--steel) 15%, transparent);
        }

        .pills-label {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          color: var(--sol-dust);
          letter-spacing: 0.06em;
          margin-right: 0.25rem;
        }

        .hotspot-pill-btn {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          padding: 0.25rem 0.6rem;
          background: color-mix(in srgb, var(--navy) 70%, var(--void));
          border: 1px solid color-mix(in srgb, var(--steel) 30%, transparent);
          color: var(--star);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .hotspot-pill-btn:hover {
          border-color: var(--hotspot-color, var(--orbit));
          color: #ffffff;
        }

        .hotspot-pill-btn.active {
          background: color-mix(in srgb, var(--hotspot-color, var(--orbit)) 25%, transparent);
          border-color: var(--hotspot-color, var(--orbit));
          color: #ffffff;
          box-shadow: 0 0 10px color-mix(in srgb, var(--hotspot-color, var(--orbit)) 30%, transparent);
        }

        .scene-narrative-bar {
          background: color-mix(in srgb, var(--void) 90%, transparent);
          border: 1px solid color-mix(in srgb, var(--steel) 20%, transparent);
          border-radius: var(--radius-sm);
          padding: 0.6rem 0.85rem;
        }

        .scene-narrative-text {
          font-family: var(--font-body);
          font-size: 0.8125rem;
          color: var(--star);
          margin: 0;
          line-height: 1.45;
          font-style: italic;
        }

        /* Dynamic SVG Cinema Scene Animations */
        .pulse-sun {
          animation: pulseSunAnim 3s infinite ease-in-out;
        }
        @keyframes pulseSunAnim {
          0%, 100% { transform: scale(1); transform-origin: 300px 115px; }
          50% { transform: scale(1.15); transform-origin: 300px 115px; }
        }

        .pulse-hal {
          animation: pulseHalAnim 2.5s infinite ease-in-out;
        }
        @keyframes pulseHalAnim {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }

        .pulse-hal-fast {
          animation: pulseHalFastAnim 0.4s infinite ease-in-out;
        }
        @keyframes pulseHalFastAnim {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; filter: drop-shadow(0 0 8px #ef4444); }
        }

        .beam-burst {
          animation: beamBurstAnim 0.8s infinite ease-out;
        }
        @keyframes beamBurstAnim {
          0% { stroke-dashoffset: 0; stroke-dasharray: 20 10; opacity: 1; }
          100% { stroke-dashoffset: 50; stroke-dasharray: 20 10; opacity: 0.2; }
        }

        .spin-ring-upper {
          animation: spinRingAnim 4s infinite linear;
        }
        @keyframes spinRingAnim {
          0% { stroke-dashoffset: 0; stroke-dasharray: 20 10; }
          100% { stroke-dashoffset: 60; stroke-dasharray: 20 10; }
        }

        .fast-debris {
          animation: fastDebrisAnim 1.5s infinite linear;
        }
        @keyframes fastDebrisAnim {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 80; }
        }

        .plume-vent {
          animation: plumeVentAnim 2s infinite ease-in-out;
        }
        @keyframes plumeVentAnim {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.95; }
        }

        .scan-fan {
          animation: scanFanAnim 2s infinite ease-in-out;
        }
        @keyframes scanFanAnim {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .vapor-spiral {
          animation: vaporAnim 3s infinite ease-in-out;
        }
        @keyframes vaporAnim {
          0%, 100% { stroke-dashoffset: 0; stroke-dasharray: 40 10; }
          50% { stroke-dashoffset: 40; stroke-dasharray: 30 15; }
        }

        .ticking-second {
          animation: tickWatch 1s infinite steps(1);
          transform-origin: 0px 0px;
        }
        @keyframes tickWatch {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(6deg); }
        }

        /* Telemetry Card & Layout */
        .signal-telemetry-card {
          background: color-mix(in srgb, var(--navy) 40%, var(--deep));
          border: 1px solid color-mix(in srgb, var(--orbit) 30%, transparent);
          border-radius: var(--radius-lg);
          padding: var(--space-md);
          position: relative;
          z-index: 1;
        }

        @media (min-width: 768px) {
          .signal-telemetry-card {
            padding: var(--space-xl);
          }
        }

        .telemetry-content-layout {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .quote-box {
          background: color-mix(in srgb, var(--void) 70%, transparent);
          border-left: 3px solid;
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
          padding: 0.85rem 1rem;
        }

        .quote-label {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          letter-spacing: 0.1em;
          color: var(--sol-dust);
          margin-bottom: 0.25rem;
        }

        .quote-text {
          font-family: var(--font-body);
          font-size: 1.0625rem;
          font-style: italic;
          color: var(--moon);
          margin: 0 0 0.35rem 0;
          line-height: 1.4;
        }

        .quote-speaker {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--star);
        }

        /* Motifs & Search Header */
        .motifs-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
          border-bottom: 1px solid color-mix(in srgb, var(--steel) 25%, transparent);
          padding-bottom: 0.5rem;
        }

        .motifs-heading {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          color: var(--orbit);
          margin: 0;
        }

        .search-wrap {
          flex: 1;
          max-width: 260px;
        }

        .motif-search-input {
          width: 100%;
          background: color-mix(in srgb, var(--void) 80%, transparent);
          border: 1px solid color-mix(in srgb, var(--orbit) 35%, transparent);
          border-radius: var(--radius-sm);
          padding: 0.35rem 0.65rem;
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          color: var(--moon);
          outline: none;
        }

        .motif-search-input:focus {
          border-color: var(--orbit);
        }

        .motif-filter-tabs {
          display: flex;
          gap: 0.35rem;
          flex-wrap: wrap;
        }

        .motif-filter-pill {
          background: transparent;
          border: 1px solid color-mix(in srgb, var(--steel) 30%, transparent);
          color: var(--star);
          border-radius: 9999px;
          padding: 0.15rem 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.625rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .motif-filter-pill:hover,
        .motif-filter-pill.active {
          background: var(--orbit);
          border-color: var(--orbit);
          color: #ffffff;
        }

        /* Motifs Grid */
        .motifs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 0.75rem;
        }

        .motif-card {
          background: color-mix(in srgb, var(--void) 55%, transparent);
          border: 1px solid color-mix(in srgb, var(--steel) 20%, transparent);
          border-radius: var(--radius-md);
          padding: 0.75rem;
          transition: border-color 0.2s ease;
        }

        .motif-card:hover {
          border-color: color-mix(in srgb, var(--orbit) 50%, transparent);
        }

        .motif-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.35rem;
        }

        .motif-name {
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--moon);
        }

        .motif-badge {
          font-family: var(--font-mono);
          font-size: 0.5625rem;
          border: 1px solid;
          border-radius: 9999px;
          padding: 0.1rem 0.4rem;
          white-space: nowrap;
        }

        .motif-desc {
          font-family: var(--font-body);
          font-size: 0.8125rem;
          color: var(--star);
          margin: 0;
          line-height: 1.45;
        }

        /* Lore Box */
        .lore-box {
          background: color-mix(in srgb, var(--void) 40%, transparent);
          border: 1px dashed color-mix(in srgb, var(--steel) 30%, transparent);
          border-radius: var(--radius-md);
          padding: 0.75rem 1rem;
        }

        .lore-label {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          letter-spacing: 0.1em;
          color: var(--orbit);
          margin-bottom: 0.25rem;
        }

        .lore-text {
          font-family: var(--font-body);
          font-size: 0.8125rem;
          color: var(--star);
          margin: 0;
          line-height: 1.5;
        }

        /* Decrypt Section */
        .decrypt-section {
          margin-top: var(--space-xs);
        }

        .decrypt-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.65rem 1.25rem;
          background: color-mix(in srgb, var(--navy) 90%, var(--void));
          border: 1px solid;
          border-radius: var(--radius-md);
          color: var(--moon);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .decrypt-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px color-mix(in srgb, var(--orbit) 25%, transparent);
          color: #ffffff;
        }

        .decrypt-radar-icon {
          color: var(--sol-flare);
        }

        .decrypt-code {
          font-size: 0.625rem;
          color: var(--star);
          background: color-mix(in srgb, var(--void) 80%, transparent);
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
        }

        .decrypted-log-panel {
          margin-top: 0.75rem;
          background: color-mix(in srgb, var(--void) 90%, transparent);
          border: 1px solid;
          border-radius: var(--radius-md);
          padding: 1rem;
          animation: slideDownFade 0.3s ease-out;
        }

        @keyframes slideDownFade {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .decrypted-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .badge-name {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--sol-flare);
          letter-spacing: 0.08em;
        }

        .copy-btn {
          background: transparent;
          border: 1px solid color-mix(in srgb, var(--orbit) 50%, transparent);
          color: var(--orbit);
          font-family: var(--font-mono);
          font-size: 0.625rem;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .copy-btn:hover {
          background: var(--orbit);
          color: #ffffff;
        }

        .decrypted-title {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--moon);
          margin-bottom: 0.5rem;
        }

        .decrypted-body {
          font-family: var(--font-mono);
          font-size: 0.8125rem;
          line-height: 1.5;
          color: var(--star);
          margin: 0;
          padding-left: 0.75rem;
          border-left: 2px solid var(--sol-dust);
          font-style: italic;
        }

        /* Master Dossier Drawer */
        .dossier-toggle-container {
          margin-top: var(--space-lg);
          text-align: center;
        }

        .dossier-toggle-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.25rem;
          background: color-mix(in srgb, var(--navy) 70%, var(--void));
          border: 1px solid color-mix(in srgb, var(--orbit) 35%, transparent);
          border-radius: var(--radius-md);
          color: var(--moon);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dossier-toggle-btn:hover {
          border-color: var(--orbit);
          background: color-mix(in srgb, var(--navy) 90%, var(--void));
        }

        .dossier-count {
          font-size: 0.625rem;
          color: var(--sol-dust);
        }

        .complete-dossier-drawer {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid color-mix(in srgb, var(--orbit) 20%, transparent);
          animation: slideDownFade 0.3s ease-out;
        }

        .dossier-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .dossier-movie-card {
          background: color-mix(in srgb, var(--navy) 30%, var(--void));
          border: 1px solid color-mix(in srgb, var(--steel) 25%, transparent);
          border-top: 3px solid;
          border-radius: var(--radius-md);
          padding: 1rem;
        }

        .dossier-card-head {
          margin-bottom: 0.75rem;
          border-bottom: 1px solid color-mix(in srgb, var(--steel) 20%, transparent);
          padding-bottom: 0.5rem;
        }

        .dossier-movie-title {
          font-family: var(--font-body);
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--moon);
        }

        .dossier-movie-dir {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          color: var(--star);
          margin-top: 0.15rem;
        }

        .dossier-motifs-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .dossier-motif-row {
          font-family: var(--font-body);
          font-size: 0.75rem;
          line-height: 1.4;
          color: var(--star);
        }

        .dossier-motif-name {
          color: var(--moon);
        }

        /* Light Mode High-Contrast Overrides */
        :global([data-theme='light']) .cinema-terminal,
        :global(.flat-mode) .cinema-terminal,
        :global([data-flat='true']) .cinema-terminal {
          background: #ffffff;
          border-color: #cbd5e1;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }

        :global([data-theme='light']) .terminal-top-bar,
        :global(.flat-mode) .terminal-top-bar,
        :global([data-flat='true']) .terminal-top-bar {
          border-bottom-color: #e2e8f0;
        }

        :global([data-theme='light']) .terminal-tag,
        :global(.flat-mode) .terminal-tag,
        :global([data-flat='true']) .terminal-tag {
          color: #0284c7;
        }

        :global([data-theme='light']) .floating-screen-wrapper,
        :global(.flat-mode) .floating-screen-wrapper,
        :global([data-flat='true']) .floating-screen-wrapper {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        :global([data-theme='light']) .screen-toolbar,
        :global(.flat-mode) .screen-toolbar,
        :global([data-flat='true']) .screen-toolbar {
          border-bottom-color: #e2e8f0;
        }

        :global([data-theme='light']) .screen-film-title,
        :global(.flat-mode) .screen-film-title,
        :global([data-flat='true']) .screen-film-title {
          color: #0f172a;
        }

        :global([data-theme='light']) .scene-narrative-bar,
        :global(.flat-mode) .scene-narrative-bar,
        :global([data-flat='true']) .scene-narrative-bar {
          background: #ffffff;
          border-color: #e2e8f0;
        }

        :global([data-theme='light']) .scene-narrative-text,
        :global(.flat-mode) .scene-narrative-text,
        :global([data-flat='true']) .scene-narrative-text {
          color: #334155;
        }

        :global([data-theme='light']) .optical-telemetry-console,
        :global(.flat-mode) .optical-telemetry-console,
        :global([data-flat='true']) .optical-telemetry-console {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        :global([data-theme='light']) .readout-card,
        :global(.flat-mode) .readout-card,
        :global([data-flat='true']) .readout-card {
          background: #ffffff;
          border-color: #e2e8f0;
        }

        :global([data-theme='light']) .readout-val,
        :global(.flat-mode) .readout-val,
        :global([data-flat='true']) .readout-val {
          color: #0f172a;
        }

        :global([data-theme='light']) .hud-active-target,
        :global(.flat-mode) .hud-active-target,
        :global([data-flat='true']) .hud-active-target {
          background: #e2e8f0;
          color: #0f172a;
        }

        :global([data-theme='light']) .hotspot-pill-btn,
        :global(.flat-mode) .hotspot-pill-btn,
        :global([data-flat='true']) .hotspot-pill-btn {
          background: #ffffff;
          border-color: #cbd5e1;
          color: #334155;
        }

        :global([data-theme='light']) .hotspot-pill-btn.active,
        :global(.flat-mode) .hotspot-pill-btn.active,
        :global([data-flat='true']) .hotspot-pill-btn.active {
          background: #e0f2fe;
          border-color: #0284c7;
          color: #0369a1;
        }

        :global([data-theme='light']) .frequency-scrubber-bar,
        :global(.flat-mode) .frequency-scrubber-bar,
        :global([data-flat='true']) .frequency-scrubber-bar {
          background: #f8fafc;
          border-color: #e2e8f0;
        }

        :global([data-theme='light']) .signal-dial-btn,
        :global(.flat-mode) .signal-dial-btn,
        :global([data-flat='true']) .signal-dial-btn {
          background: #ffffff;
          border-color: #e2e8f0;
          color: #334155;
        }

        :global([data-theme='light']) .signal-dial-btn.active,
        :global(.flat-mode) .signal-dial-btn.active,
        :global([data-flat='true']) .signal-dial-btn.active {
          background: #f0fdf4;
          border-color: #0284c7;
          box-shadow: 0 2px 8px rgba(2, 132, 199, 0.15);
        }

        :global([data-theme='light']) .signal-dial-btn .dial-title,
        :global(.flat-mode) .signal-dial-btn .dial-title,
        :global([data-flat='true']) .signal-dial-btn .dial-title {
          color: #0f172a;
        }

        :global([data-theme='light']) .signal-telemetry-card,
        :global(.flat-mode) .signal-telemetry-card,
        :global([data-flat='true']) .signal-telemetry-card {
          background: #f8fafc;
          border-color: #e2e8f0;
        }

        :global([data-theme='light']) .quote-box,
        :global(.flat-mode) .quote-box,
        :global([data-flat='true']) .quote-box {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-left-width: 4px;
        }

        :global([data-theme='light']) .quote-text,
        :global(.flat-mode) .quote-text,
        :global([data-flat='true']) .quote-text {
          color: #0f172a;
        }

        :global([data-theme='light']) .quote-speaker,
        :global(.flat-mode) .quote-speaker,
        :global([data-flat='true']) .quote-speaker {
          color: #475569;
        }

        :global([data-theme='light']) .motif-card,
        :global(.flat-mode) .motif-card,
        :global([data-flat='true']) .motif-card {
          background: #ffffff;
          border-color: #e2e8f0;
        }

        :global([data-theme='light']) .motif-name,
        :global(.flat-mode) .motif-name,
        :global([data-flat='true']) .motif-name {
          color: #0f172a;
        }

        :global([data-theme='light']) .motif-desc,
        :global(.flat-mode) .motif-desc,
        :global([data-flat='true']) .motif-desc {
          color: #334155;
        }

        :global([data-theme='light']) .motif-search-input,
        :global(.flat-mode) .motif-search-input,
        :global([data-flat='true']) .motif-search-input {
          background: #ffffff;
          border-color: #cbd5e1;
          color: #0f172a;
        }

        :global([data-theme='light']) .dossier-toggle-btn,
        :global(.flat-mode) .dossier-toggle-btn,
        :global([data-flat='true']) .dossier-toggle-btn {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #0f172a;
        }

        :global([data-theme='light']) .dossier-movie-card,
        :global(.flat-mode) .dossier-movie-card,
        :global([data-flat='true']) .dossier-movie-card {
          background: #ffffff;
          border-color: #e2e8f0;
        }

        :global([data-theme='light']) .dossier-movie-title,
        :global(.flat-mode) .dossier-movie-title,
        :global([data-flat='true']) .dossier-movie-title {
          color: #0f172a;
        }
      `}</style>
    </div>
  );
}
