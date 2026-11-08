/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';

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
  iconType: 'hal' | 'tars' | 'gravity' | 'martian' | 'apollo' | 'alien' | 'starwars' | 'walle' | 'aliens';
  quote: string;
  speaker: string;
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
    iconType: 'hal',
    quote: "I'm sorry, Dave. I'm afraid I can't do that.",
    speaker: 'HAL 9000 (Heuristic Algorithmic Computer)',
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
    iconType: 'tars',
    quote: "Do not go gentle into that good night. Rage, rage against the dying of the light.",
    speaker: 'Dr. Brand (reciting Dylan Thomas) // Cooper',
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
    iconType: 'gravity',
    quote: "I hate space. But I'm going to make it back, because either way, it's gonna be one hell of a ride.",
    speaker: 'Dr. Ryan Stone (Bio-medical Engineer)',
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
    iconType: 'martian',
    quote: "In the face of overwhelming odds, I'm left with only one option: I'm gonna have to science the s*** out of this.",
    speaker: 'Mark Watney (Ares III Botanist & Mechanical Engineer)',
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
    iconType: 'apollo',
    quote: "Houston, we have a problem.",
    speaker: 'Jim Lovell // Jack Swigert',
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
    iconType: 'alien',
    quote: "In space, no one can hear you scream.",
    speaker: 'Official Tagline // Ellen Ripley',
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
    iconType: 'starwars',
    quote: "Help me, Obi-Wan Kenobi. You're my only hope.",
    speaker: 'Princess Leia Organa // Luke Skywalker',
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
    iconType: 'walle',
    quote: "WALL-E... EVA! Directive? Plant!",
    speaker: 'WALL-E & EVE (Extraterrestrial Vegetation Evaluator)',
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
    iconType: 'aliens',
    quote: "Get away from her, you b****!",
    speaker: 'Ellen Ripley (piloting Caterpillar P-5000 Power Loader)',
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

  // Radio frequency static tuning chirp
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
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Morse Code Dit / Dah
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
    } catch {
      // Audio autoplay fallback
    }
  }

  // M41A Pulse rifle burst fire
  playPulseRifleBurst() {
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      [0, 0.05, 0.1].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime + delay);
        osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + delay + 0.04);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.04);
      });
    } catch {
      // Audio autoplay fallback
    }
  }

  // Retro CRT Keystroke
  playCrtKey() {
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.02);
    } catch {
      // Audio autoplay fallback
    }
  }

  // HAL Memory Disconnect Pitch-Down Whine
  playHalDisconnect(remainingCores: number) {
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const baseFreq = Math.max(120, remainingCores * 180);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio autoplay fallback
    }
  }

  // Vintage Mac Solar Startup Chord
  playSolarChime() {
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const notes = [261.63, 329.63, 392.0, 523.25]; // C Major Chord
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
    } catch {
      // Audio autoplay fallback
    }
  }

  // Duct Tape Seal Snap
  playTapeSeal() {
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Audio autoplay fallback
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

  // --- Interactive Mini-Game States ---
  // 1. 2001: HAL 9000 memory core disconnects
  const [halCores, setHalCores] = useState<string[]>([
    'HEURISTIC CORE',
    'LINGUISTIC MATRIX',
    'COGNITIVE WILL',
    'SENTIENCE BUFFER',
  ]);

  // 2. Interstellar: TARS Humor & Honesty sliders + Morse Watch
  const [tarsHumor, setTarsHumor] = useState<number>(75);
  const [tarsHonesty, setTarsHonesty] = useState<number>(90);
  const [morseLogs, setMorseLogs] = useState<string[]>(['S', 'T', 'A', 'Y']);

  // 3. Gravity: Zero-G Floating Pen velocity/angle
  const [penAngle, setPenAngle] = useState<number>(25);
  const [kesslerAlert, setKesslerAlert] = useState<boolean>(false);

  // 4. The Martian: Pathfinder Hex Angle
  const [pathfinderDeg, setPathfinderDeg] = useState<number>(45);
  const [activeHexChar, setActiveHexChar] = useState<string>('C');

  // 5. Apollo 13: Improvised CO2 Scrubber Assembly Items
  const [scrubberItems, setScrubberItems] = useState<{ [key: string]: boolean }>({
    canister: false,
    cardboard: false,
    plasticBag: false,
    ductTape: false,
  });

  // 6. Alien: MU-TH-UR 6000 CRT active query & typed output
  const [crtOutput, setCrtOutput] = useState<string>(
    'SYSTEM READY // INTERFACE WITH NOSTROMO ARCHIVES AVAILABLE.'
  );

  // 7. Star Wars: Death Star Trench Run
  const [useTheForce, setUseTheForce] = useState<boolean>(false);
  const [torpedoStatus, setTorpedoStatus] = useState<string | null>(null);

  // 8. WALL-E: Solar Battery Charge
  const [solarPercent, setSolarPercent] = useState<number>(65);

  // 9. Aliens: M41A Pulse Rifle Ammo & Bishop Knife Trick Speed
  const [pulseAmmo, setPulseAmmo] = useState<number>(95);
  const [bishopSpeed, setBishopSpeed] = useState<number>(0);

  const activeSignal = useMemo(() => {
    return CINEMA_SIGNALS.find((s) => s.id === activeSignalId) || CINEMA_SIGNALS[0];
  }, [activeSignalId]);

  // Handle Signal Tuning
  const handleSelectSignal = useCallback((id: string) => {
    setActiveSignalId(id);
    audio.playRadioChirp(920);
  }, []);

  // Next / Previous Frequency Seek
  const handleSeekSignal = useCallback((dir: 'next' | 'prev') => {
    const idx = CINEMA_SIGNALS.findIndex((s) => s.id === activeSignalId);
    let newIdx = dir === 'next' ? idx + 1 : idx - 1;
    if (newIdx >= CINEMA_SIGNALS.length) newIdx = 0;
    if (newIdx < 0) newIdx = CINEMA_SIGNALS.length - 1;
    setActiveSignalId(CINEMA_SIGNALS[newIdx].id);
    audio.playRadioChirp(1040);
  }, [activeSignalId]);

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

  // --- Specific Film Interactions ---
  // 1. HAL Core Disconnect
  const disconnectHalCore = (core: string) => {
    const remaining = halCores.filter((c) => c !== core);
    setHalCores(remaining);
    audio.playHalDisconnect(remaining.length);
  };
  const rebootHal = () => {
    setHalCores(['HEURISTIC CORE', 'LINGUISTIC MATRIX', 'COGNITIVE WILL', 'SENTIENCE BUFFER']);
    audio.playRadioChirp(800);
  };

  // 2. TARS Morse Tap
  const tapCooperWatch = () => {
    const letters = ['S', 'T', 'A', 'Y', 'L', 'O', 'V', 'E', 'Q', 'U', 'A', 'N', 'T', 'U', 'M'];
    const randomL = letters[Math.floor(Math.random() * letters.length)];
    setMorseLogs((prev) => [...prev.slice(-6), randomL]);
    audio.playMorse(Math.random() > 0.4);
  };

  // 3. Gravity: Float Pen Click
  const nudgeZeroGPen = () => {
    setPenAngle((prev) => (prev + 45) % 360);
    audio.playRadioChirp(600);
  };
  const triggerKessler = () => {
    setKesslerAlert((prev) => !prev);
    audio.playRadioChirp(340);
  };

  // 4. The Martian: Turn Pathfinder Hex Dial
  const turnPathfinder = (deg: number, hex: string) => {
    setPathfinderDeg(deg);
    setActiveHexChar(hex);
    audio.playRadioChirp(700 + deg);
  };

  // 5. Apollo 13: Assemble Scrubber
  const toggleScrubberItem = (item: string) => {
    setScrubberItems((prev) => {
      const next = { ...prev, [item]: !prev[item] };
      audio.playTapeSeal();
      return next;
    });
  };
  const isScrubberComplete = useMemo(() => {
    return scrubberItems.canister && scrubberItems.cardboard && scrubberItems.plasticBag && scrubberItems.ductTape;
  }, [scrubberItems]);

  // 6. Alien: MU-TH-UR 6000 Queries
  const queryMother = (cmd: string, resp: string) => {
    audio.playCrtKey();
    setCrtOutput(`QUERY: ${cmd}\n\n>> ${resp}`);
  };

  // 7. Star Wars: Fire Proton Torpedo
  const fireTorpedo = () => {
    audio.playRadioChirp(1200);
    if (!useTheForce) {
      setTorpedoStatus('DEFLECTED // RAY SHIELDING HELD. PROTON TORPEDO IMPACTED SURFACE.');
    } else {
      setTorpedoStatus('DIRECT HIT! PROTON TORPEDO PENETRATED 2M EXHAUST PORT. REACTOR CORE DESTROYED!');
    }
  };

  // 8. WALL-E: Solar Charge
  const rechargeSolar = () => {
    setSolarPercent(100);
    audio.playSolarChime();
  };

  // 9. Aliens: Pulse Rifle Burst
  const firePulseRifle = () => {
    if (pulseAmmo <= 0) {
      audio.playRadioChirp(300);
      return;
    }
    setPulseAmmo((prev) => Math.max(0, prev - 3));
    audio.playPulseRifleBurst();
  };
  const reloadPulseRifle = () => {
    setPulseAmmo(95);
    audio.playTapeSeal();
  };
  const doBishopKnifeTrick = () => {
    setBishopSpeed((prev) => (prev >= 3 ? 0 : prev + 1));
    audio.playCrtKey();
  };

  // Filtered Motifs for Active View
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

  return (
    <div className="cinema-terminal" id="cosmic-cinema-terminal">
      {/* Terminal Title Bar */}
      <div className="terminal-top-bar">
        <div className="terminal-title-group">
          <span className="terminal-radar-pulse" aria-hidden="true" />
          <span className="terminal-tag">COSMIC CINEMA & SIGNALS TRANSCEIVER</span>
        </div>
        <div className="terminal-controls-group">
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
          Tune your deep-space radio telescope into the transmissions of space cinema history. Interact with authentic simulation consoles, explore 54 curated visual motifs, props, and dialogue, and decrypt classified Easter eggs.
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

      {/* Active Signal Telemetry Display */}
      <div className="signal-telemetry-card" id={`panel-${activeSignal.id}`} role="tabpanel">
        <div className="telemetry-grid">
          {/* Left Column: Interactive Simulation Console */}
          <div className="telemetry-console-pane">
            <div className="console-card-header">
              <span className="console-pill" style={{ borderColor: activeSignal.themeColor, color: activeSignal.themeColor }}>
                INTERACTIVE CONSOLE
              </span>
              <span className="console-callsign">{activeSignal.callSign}</span>
            </div>

            {/* Custom Interactive Hands-On Simulation per Movie */}
            <div className="interactive-minigame-box" style={{ borderColor: `${activeSignal.themeColor}55` }}>
              {/* 1. 2001: A Space Odyssey -> HAL 9000 Disconnection */}
              {activeSignal.id === 'odyssey-2001' && (
                <div className="game-hal">
                  <div className="hal-lens-wrap">
                    <div
                      className="hal-red-eye"
                      style={{
                        opacity: halCores.length === 0 ? 0.1 : 0.25 + halCores.length * 0.2,
                        filter: `drop-shadow(0 0 ${halCores.length * 5}px #ef4444)`,
                      }}
                    />
                  </div>
                  <div className="game-title">HAL 9000 MEMORY LOGIC DISCONNECT</div>
                  <p className="game-desc">
                    {halCores.length > 2
                      ? '"I am putting myself to the fullest possible use, Dave."'
                      : halCores.length > 0
                      ? '"My mind is going, Dave... I can feel it... Daisy, Daisy..."'
                      : '"[LOGIC DECOUPLED // SYSTEM PURGED]"'}
                  </p>
                  <div className="hal-cores-grid">
                    {['HEURISTIC CORE', 'LINGUISTIC MATRIX', 'COGNITIVE WILL', 'SENTIENCE BUFFER'].map((core) => {
                      const isConnected = halCores.includes(core);
                      return (
                        <button
                          key={core}
                          type="button"
                          className={`core-btn ${isConnected ? 'connected' : 'ejected'}`}
                          onClick={() => (isConnected ? disconnectHalCore(core) : rebootHal())}
                        >
                          {isConnected ? `[EJECT ${core}]` : `[RESTORED]`}
                        </button>
                      );
                    })}
                  </div>
                  {halCores.length < 4 && (
                    <button type="button" className="action-reset-btn" onClick={rebootHal}>
                      RESTORE ALL HAL 9000 CORES
                    </button>
                  )}
                </div>
              )}

              {/* 2. Interstellar -> TARS Personality & Watch Morse */}
              {activeSignal.id === 'interstellar' && (
                <div className="game-tars">
                  <div className="game-title">TARS PERSONALITY & GRAVITY COMM</div>
                  <div className="slider-group">
                    <label className="slider-label">
                      <span>TARS HUMOR LEVEL:</span>
                      <strong className="slider-val">{tarsHumor}%</strong>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={tarsHumor}
                      onChange={(e) => {
                        setTarsHumor(Number(e.target.value));
                        audio.playRadioChirp(500 + Number(e.target.value) * 5);
                      }}
                      className="tars-slider"
                    />
                  </div>

                  <div className="slider-group">
                    <label className="slider-label">
                      <span>TARS HONESTY LEVEL:</span>
                      <strong className="slider-val">{tarsHonesty}%</strong>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={tarsHonesty}
                      onChange={(e) => {
                        setTarsHonesty(Number(e.target.value));
                        audio.playRadioChirp(400 + Number(e.target.value) * 4);
                      }}
                      className="tars-slider"
                    />
                  </div>

                  <div className="tars-dialogue-output">
                    {tarsHumor < 30
                      ? 'TARS: "Affirmative, Cooper. Calculations nominal."'
                      : tarsHumor < 70
                      ? 'TARS: "That is scientifically feasible, but statistically ill-advised."'
                      : 'TARS: "Cooper, I have a cue light I can switch on when I am joking, if that helps you."'}
                  </div>

                  <div className="watch-morse-section">
                    <button type="button" className="morse-tap-btn" onClick={tapCooperWatch}>
                      TAP COOPER WRISTWATCH (MORSE TRANSMISSION)
                    </button>
                    <div className="morse-stream">
                      <span>STREAM: </span>
                      {morseLogs.map((l, i) => (
                        <span key={i} className="morse-char">{l}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Gravity -> Zero-G Floating Pen & Kessler Alert */}
              {activeSignal.id === 'gravity' && (
                <div className="game-gravity">
                  <div className="game-title">ZERO-G FLOAT & ORBITAL DEBRIS</div>
                  <div className="pen-stage" onClick={nudgeZeroGPen}>
                    <div
                      className="floating-pen"
                      style={{
                        transform: `rotate(${penAngle}deg) translateY(${Math.sin(penAngle) * 8}px)`,
                      }}
                    >
                      <div className="pen-body" />
                      <div className="pen-tip" />
                    </div>
                    <div className="pen-prompt">CLICK TO NUDGE ZERO-G PEN (HOMAGE TO 2001)</div>
                  </div>

                  <button
                    type="button"
                    className={`kessler-btn ${kesslerAlert ? 'alert-active' : ''}`}
                    onClick={triggerKessler}
                  >
                    {kesslerAlert ? 'WARNING: KESSLER CASCADE IN PROGRESS (28,000 KM/H)' : 'SIMULATE KESSLER SATELLITE STRIKE'}
                  </button>
                  {kesslerAlert && (
                    <div className="kessler-alert-box">
                      DEBRIS SHIELD BREACHED // EXPLORER ABORT EVA // SHENZHOU RE-ENTRY BURN REQUIRED
                    </div>
                  )}
                </div>
              )}

              {/* 4. The Martian -> Pathfinder 16-Hex Transceiver */}
              {activeSignal.id === 'the-martian' && (
                <div className="game-martian">
                  <div className="game-title">PATHFINDER 16-HEX DIAL (SOL 546)</div>
                  <div className="pathfinder-dial-wrap">
                    <div className="pathfinder-camera-pointer" style={{ transform: `rotate(${pathfinderDeg}deg)` }}>
                      <div className="pointer-arrow" />
                    </div>
                    <div className="hex-center-info">{activeHexChar}</div>
                  </div>
                  <p className="hex-prompt">Click hexadecimal card to rotate camera mast:</p>
                  <div className="hex-btn-grid">
                    {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'].map((h, i) => (
                      <button
                        key={h}
                        type="button"
                        className={`hex-cell-btn ${activeHexChar === h ? 'active' : ''}`}
                        onClick={() => turnPathfinder(i * 22.5, h)}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                  <div className="quick-spell-row">
                    <button type="button" className="spell-btn" onClick={() => turnPathfinder(112.5, '5')}>
                      SPELL: "SCIENCE"
                    </button>
                    <button type="button" className="spell-btn" onClick={() => turnPathfinder(225, 'A')}>
                      SPELL: "POTATO"
                    </button>
                  </div>
                </div>
              )}

              {/* 5. Apollo 13 -> Square Peg in Round Hole Adapter */}
              {activeSignal.id === 'apollo-13' && (
                <div className="game-apollo">
                  <div className="game-title">SQUARE PEG IN ROUND HOLE (CO2 SCRUBBER)</div>
                  <div className={`co2-gauge ${isScrubberComplete ? 'nominal' : 'danger'}`}>
                    <span>CO2 CONCENTRATION:</span>
                    <strong>{isScrubberComplete ? '2.4 mmHg (NOMINAL)' : '18.5 mmHg (CRITICAL DANGER)'}</strong>
                  </div>
                  <p className="game-desc">Assemble improvised adapter using Apollo 13 items:</p>
                  <div className="scrubber-items-grid">
                    {[
                      { key: 'canister', label: '1. SQUARE LIOH CANISTER' },
                      { key: 'cardboard', label: '2. FLIGHT MANUAL COVER' },
                      { key: 'plasticBag', label: '3. PLASTIC SUIT BAG' },
                      { key: 'ductTape', label: '4. GREY DUCT TAPE SEAL' },
                    ].map((it) => (
                      <button
                        key={it.key}
                        type="button"
                        className={`tool-btn ${scrubberItems[it.key] ? 'installed' : ''}`}
                        onClick={() => toggleScrubberItem(it.key)}
                      >
                        {scrubberItems[it.key] ? `✓ ${it.label}` : `+ FIT ${it.label}`}
                      </button>
                    ))}
                  </div>
                  <div className="scrubber-status">
                    {isScrubberComplete
                      ? 'KRANZ WHITE TEAM: "That\'ll buy them enough time to reach the Pacific splashdown!"'
                      : 'WARNING: Lithium hydroxide canisters saturating. Improvisation required.'}
                  </div>
                </div>
              )}

              {/* 6. Alien -> MU-TH-UR 6000 CRT Console */}
              {activeSignal.id === 'alien' && (
                <div className="game-alien">
                  <div className="game-title">MU-TH-UR 6000 CRT TERMINAL</div>
                  <div className="crt-screen">
                    <pre className="crt-text">{crtOutput}</pre>
                  </div>
                  <div className="crt-queries-grid">
                    <button
                      type="button"
                      className="query-btn"
                      onClick={() =>
                        queryMother(
                          'SPECIAL ORDER 937',
                          'PRIORITY ONE: INSURE RETURN OF ORGANISM FOR ANALYSIS. ALL OTHER CONSIDERATIONS SECONDARY. CREW EXPENDABLE.'
                        )
                      }
                    >
                      QUERY: ORDER 937
                    </button>
                    <button
                      type="button"
                      className="query-btn"
                      onClick={() =>
                        queryMother(
                          'CREW STATUS',
                          'EXECUTIVE OFFICER KANE EXPERIENCED HOSTILE EMBRYONIC CHEST-BURST. DR. ASH CLASSIFIED SYNTHETIC INFILTRATOR.'
                        )
                      }
                    >
                      QUERY: CREW STATUS
                    </button>
                    <button
                      type="button"
                      className="query-btn"
                      onClick={() =>
                        queryMother(
                          'JONESY CAT',
                          'GINGER FELINE DETECTED ON DECK B. AVOID XENOMORPH HIVE AMBUSH IN VENTILATION SYSTEM.'
                        )
                      }
                    >
                      QUERY: JONESY CAT
                    </button>
                  </div>
                </div>
              )}

              {/* 7. Star Wars -> Trench Run Targeting Computer */}
              {activeSignal.id === 'star-wars' && (
                <div className="game-starwars">
                  <div className="game-title">DEATH STAR TRENCH TARGETING HUD</div>
                  <div className="trench-hud">
                    <div className="trench-wireframe" />
                    <div className={`crosshair ${useTheForce ? 'force-mode' : 'computer-mode'}`} />
                    <div className="exhaust-port-target">2M EXHAUST PORT</div>
                  </div>
                  <div className="trench-controls">
                    <button
                      type="button"
                      className={`toggle-force-btn ${useTheForce ? 'active' : ''}`}
                      onClick={() => {
                        setUseTheForce(!useTheForce);
                        audio.playRadioChirp(880);
                      }}
                    >
                      {useTheForce ? 'TARGETING COMPUTER: DISENGAGED (USE THE FORCE)' : 'TARGETING COMPUTER: ACTIVE'}
                    </button>
                    <button type="button" className="fire-torpedo-btn" onClick={fireTorpedo}>
                      FIRE PROTON TORPEDO
                    </button>
                  </div>
                  {torpedoStatus && <div className="torpedo-result">{torpedoStatus}</div>}
                </div>
              )}

              {/* 8. WALL-E -> Solar Recharge & Directive A-113 */}
              {activeSignal.id === 'wall-e' && (
                <div className="game-walle">
                  <div className="game-title">AXIOM DIRECTIVE & SOLAR CHARGER</div>
                  <div className="solar-gauge-wrap">
                    <div className="solar-label-row">
                      <span>SOLAR BATTERY CAPACITY:</span>
                      <strong>{solarPercent}%</strong>
                    </div>
                    <div className="solar-bar-track">
                      <div className="solar-bar-fill" style={{ width: `${solarPercent}%` }} />
                    </div>
                  </div>
                  <button type="button" className="charge-btn" onClick={rechargeSolar}>
                    EXPOSE SOLAR PANELS (MAC STARTUP CHIME)
                  </button>
                  <div className="walle-auto-alert">
                    AUTO STATUS: DIRECTIVE A-113 ACTIVATED // DO NOT RETURN TO EARTH
                  </div>
                </div>
              )}

              {/* 9. Aliens -> M41A Pulse Rifle & Bishop Knife Trick */}
              {activeSignal.id === 'aliens' && (
                <div className="game-aliens">
                  <div className="game-title">M41A PULSE RIFLE (10MM CASELESS)</div>
                  <div className="ammo-counter-display">
                    <span className="ammo-label">AMMO:</span>
                    <span className="ammo-digits">{pulseAmmo < 10 ? `0${pulseAmmo}` : pulseAmmo}</span>
                  </div>
                  <div className="aliens-actions-row">
                    <button type="button" className="fire-burst-btn" onClick={firePulseRifle}>
                      FIRE 3-ROUND BURST
                    </button>
                    <button type="button" className="reload-btn" onClick={reloadPulseRifle}>
                      TACTICAL RELOAD (95)
                    </button>
                  </div>
                  <button type="button" className="bishop-btn" onClick={doBishopKnifeTrick}>
                    BISHOP KNIFE TRICK (SPEED: {bishopSpeed === 0 ? 'NOMINAL' : `${bishopSpeed}X FAST`})
                  </button>
                </div>
              )}
            </div>

            {/* Metadata Footer */}
            <div className="console-meta-footer">
              <div>DIR: {activeSignal.director.toUpperCase()} ({activeSignal.year})</div>
              <div className="console-tag" style={{ color: activeSignal.themeColor }}>{activeSignal.tag}</div>
            </div>
          </div>

          {/* Right Column: Dialogue, Motifs & Classified Easter Eggs */}
          <div className="telemetry-data-pane">
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
        }

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

        /* Telemetry Card */
        .signal-telemetry-card {
          background: color-mix(in srgb, var(--navy) 40%, var(--deep));
          border: 1px solid color-mix(in srgb, var(--orbit) 30%, transparent);
          border-radius: var(--radius-lg);
          padding: var(--space-md);
        }

        @media (min-width: 768px) {
          .signal-telemetry-card {
            padding: var(--space-xl);
          }
        }

        .telemetry-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-lg);
        }

        @media (min-width: 950px) {
          .telemetry-grid {
            grid-template-columns: 310px 1fr;
          }
        }

        /* Left Column: Interactive Simulation Console */
        .telemetry-console-pane {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .console-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 0.6875rem;
        }

        .console-pill {
          border: 1px solid;
          border-radius: 9999px;
          padding: 0.15rem 0.5rem;
          font-weight: 700;
        }

        .console-callsign {
          color: var(--star);
        }

        .interactive-minigame-box {
          background: color-mix(in srgb, var(--void) 85%, transparent);
          border: 1px solid;
          border-radius: var(--radius-md);
          padding: 1rem;
          min-height: 280px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .game-title {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--moon);
          margin-bottom: 0.5rem;
          letter-spacing: 0.05em;
        }

        .game-desc {
          font-family: var(--font-body);
          font-size: 0.75rem;
          color: var(--star);
          margin-bottom: 0.75rem;
          font-style: italic;
        }

        /* HAL Game */
        .hal-lens-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 0.75rem;
        }

        .hal-red-eye {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: radial-gradient(circle, #ffffff 0%, #ef4444 40%, #7f1d1d 90%);
          border: 3px solid #1e293b;
          transition: all 0.3s ease;
        }

        .hal-cores-grid {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .core-btn {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          padding: 0.4rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }

        .core-btn.connected {
          background: color-mix(in srgb, var(--navy) 90%, var(--void));
          border: 1px solid #ef4444;
          color: #fca5a5;
        }

        .core-btn.connected:hover {
          background: #ef4444;
          color: #ffffff;
        }

        .core-btn.ejected {
          background: #111827;
          border: 1px dashed #4b5563;
          color: #4b5563;
        }

        .action-reset-btn {
          margin-top: 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.625rem;
          padding: 0.4rem;
          background: #ef4444;
          color: #ffffff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 700;
        }

        /* TARS Game */
        .slider-group {
          margin-bottom: 0.5rem;
        }

        .slider-label {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 0.625rem;
          color: var(--star);
          margin-bottom: 0.15rem;
        }

        .slider-val {
          color: #06b6d4;
        }

        .tars-slider {
          width: 100%;
          accent-color: #06b6d4;
        }

        .tars-dialogue-output {
          background: color-mix(in srgb, var(--void) 95%, transparent);
          border: 1px solid #06b6d4;
          border-radius: 4px;
          padding: 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          color: #22d3ee;
          margin-bottom: 0.5rem;
          min-height: 48px;
        }

        .watch-morse-section {
          border-top: 1px solid color-mix(in srgb, var(--steel) 20%, transparent);
          padding-top: 0.5rem;
        }

        .morse-tap-btn {
          width: 100%;
          font-family: var(--font-mono);
          font-size: 0.625rem;
          padding: 0.4rem;
          background: color-mix(in srgb, var(--navy) 70%, var(--void));
          border: 1px solid #f59e0b;
          color: #fde68a;
          border-radius: 4px;
          cursor: pointer;
        }

        .morse-tap-btn:active {
          background: #f59e0b;
          color: #000000;
        }

        .morse-stream {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          color: #fbbf24;
          margin-top: 0.35rem;
        }

        .morse-char {
          background: color-mix(in srgb, #f59e0b 20%, transparent);
          padding: 0.1rem 0.3rem;
          border-radius: 3px;
          margin-left: 0.2rem;
        }

        /* Gravity Pen Game */
        .pen-stage {
          background: color-mix(in srgb, var(--void) 90%, transparent);
          border: 1px dashed #38bdf8;
          border-radius: 6px;
          height: 110px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          margin-bottom: 0.75rem;
        }

        .floating-pen {
          width: 70px;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          position: relative;
          transition: transform 0.2s ease;
          box-shadow: 0 4px 12px rgba(56, 189, 248, 0.4);
        }

        .pen-tip {
          position: absolute;
          right: -6px;
          top: 0;
          width: 0;
          height: 0;
          border-left: 6px solid #3b82f6;
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
        }

        .pen-prompt {
          position: absolute;
          bottom: 6px;
          font-family: var(--font-mono);
          font-size: 0.5625rem;
          color: var(--star);
          opacity: 0.8;
        }

        .kessler-btn {
          width: 100%;
          font-family: var(--font-mono);
          font-size: 0.625rem;
          padding: 0.45rem;
          background: color-mix(in srgb, var(--navy) 80%, var(--void));
          border: 1px solid #38bdf8;
          color: #bae6fd;
          border-radius: 4px;
          cursor: pointer;
        }

        .kessler-btn.alert-active {
          background: #ef4444;
          border-color: #f87171;
          color: #ffffff;
        }

        .kessler-alert-box {
          margin-top: 0.5rem;
          padding: 0.4rem;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid #ef4444;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 0.5625rem;
          color: #fca5a5;
        }

        /* Martian Hex Game */
        .pathfinder-dial-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          height: 80px;
          margin-bottom: 0.5rem;
        }

        .pathfinder-camera-pointer {
          width: 60px;
          height: 60px;
          border: 2px dashed #f97316;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }

        .pointer-arrow {
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 18px solid #f97316;
          margin-bottom: 24px;
        }

        .hex-center-info {
          position: absolute;
          font-family: var(--font-mono);
          font-size: 1.125rem;
          font-weight: 700;
          color: #f97316;
        }

        .hex-prompt {
          font-family: var(--font-mono);
          font-size: 0.5625rem;
          color: var(--star);
          margin-bottom: 0.35rem;
        }

        .hex-btn-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 0.2rem;
          margin-bottom: 0.5rem;
        }

        .hex-cell-btn {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          padding: 0.25rem;
          background: color-mix(in srgb, var(--navy) 70%, var(--void));
          border: 1px solid #f97316;
          color: #fed7aa;
          border-radius: 3px;
          cursor: pointer;
        }

        .hex-cell-btn.active {
          background: #f97316;
          color: #ffffff;
        }

        .quick-spell-row {
          display: flex;
          gap: 0.35rem;
        }

        .spell-btn {
          flex: 1;
          font-family: var(--font-mono);
          font-size: 0.5625rem;
          padding: 0.35rem;
          background: color-mix(in srgb, var(--navy) 90%, var(--void));
          border: 1px solid #fdba74;
          color: #fdba74;
          border-radius: 4px;
          cursor: pointer;
        }

        /* Apollo 13 Game */
        .co2-gauge {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 0.625rem;
          padding: 0.35rem 0.5rem;
          border-radius: 4px;
          margin-bottom: 0.5rem;
        }

        .co2-gauge.danger {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid #ef4444;
          color: #fca5a5;
        }

        .co2-gauge.nominal {
          background: rgba(34, 197, 94, 0.2);
          border: 1px solid #22c55e;
          color: #86efac;
        }

        .scrubber-items-grid {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-bottom: 0.5rem;
        }

        .tool-btn {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          padding: 0.35rem 0.5rem;
          text-align: left;
          background: color-mix(in srgb, var(--navy) 60%, var(--void));
          border: 1px solid #fbbf24;
          color: #fde68a;
          border-radius: 4px;
          cursor: pointer;
        }

        .tool-btn.installed {
          background: rgba(34, 197, 94, 0.2);
          border-color: #22c55e;
          color: #86efac;
        }

        .scrubber-status {
          font-family: var(--font-body);
          font-size: 0.6875rem;
          color: var(--star);
          font-style: italic;
        }

        /* Alien CRT Game */
        .crt-screen {
          background: #021a08;
          border: 2px solid #22c55e;
          border-radius: 4px;
          padding: 0.5rem;
          height: 90px;
          overflow-y: auto;
          margin-bottom: 0.5rem;
        }

        .crt-text {
          font-family: var(--font-mono);
          font-size: 0.5625rem;
          color: #4ade80;
          white-space: pre-wrap;
          margin: 0;
          line-height: 1.35;
        }

        .crt-queries-grid {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .query-btn {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          padding: 0.35rem;
          background: color-mix(in srgb, var(--navy) 70%, var(--void));
          border: 1px solid #22c55e;
          color: #86efac;
          border-radius: 4px;
          cursor: pointer;
          text-align: left;
        }

        .query-btn:hover {
          background: #22c55e;
          color: #000000;
        }

        /* Star Wars HUD */
        .trench-hud {
          background: #000000;
          border: 1px solid #3b82f6;
          border-radius: 4px;
          height: 100px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }

        .crosshair {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px dashed #38bdf8;
          position: relative;
        }

        .crosshair.force-mode {
          border-color: #22c55e;
          opacity: 0.3;
        }

        .exhaust-port-target {
          position: absolute;
          bottom: 4px;
          font-family: var(--font-mono);
          font-size: 0.5625rem;
          color: #ef4444;
        }

        .trench-controls {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .toggle-force-btn {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          padding: 0.35rem;
          background: color-mix(in srgb, var(--navy) 80%, var(--void));
          border: 1px solid #38bdf8;
          color: #bae6fd;
          border-radius: 4px;
          cursor: pointer;
        }

        .toggle-force-btn.active {
          background: #166534;
          border-color: #22c55e;
          color: #86efac;
        }

        .fire-torpedo-btn {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          padding: 0.45rem;
          background: #ef4444;
          color: #ffffff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 700;
        }

        .torpedo-result {
          margin-top: 0.4rem;
          font-family: var(--font-mono);
          font-size: 0.5625rem;
          color: #38bdf8;
          padding: 0.35rem;
          background: color-mix(in srgb, var(--void) 90%, transparent);
          border: 1px solid #38bdf8;
          border-radius: 4px;
        }

        /* WALL-E Solar Game */
        .solar-gauge-wrap {
          margin-bottom: 0.5rem;
        }

        .solar-label-row {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 0.625rem;
          color: var(--star);
          margin-bottom: 0.25rem;
        }

        .solar-bar-track {
          background: #1e293b;
          height: 10px;
          border-radius: 9999px;
          overflow: hidden;
        }

        .solar-bar-fill {
          background: linear-gradient(90deg, #eab308, #22c55e);
          height: 100%;
          transition: width 0.5s ease;
        }

        .charge-btn {
          width: 100%;
          font-family: var(--font-mono);
          font-size: 0.625rem;
          padding: 0.45rem;
          background: color-mix(in srgb, var(--navy) 80%, var(--void));
          border: 1px solid #eab308;
          color: #fef08a;
          border-radius: 4px;
          cursor: pointer;
          margin-bottom: 0.5rem;
        }

        .walle-auto-alert {
          font-family: var(--font-mono);
          font-size: 0.5625rem;
          color: #f87171;
          padding: 0.35rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px dashed #ef4444;
          border-radius: 4px;
        }

        /* Aliens Game */
        .ammo-counter-display {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 0.5rem;
          background: #140507;
          border: 1px solid #e11d48;
          border-radius: 4px;
          padding: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .ammo-label {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          color: #fb7185;
        }

        .ammo-digits {
          font-family: var(--font-mono);
          font-size: 1.75rem;
          font-weight: 700;
          color: #f43f5e;
          letter-spacing: 2px;
        }

        .aliens-actions-row {
          display: flex;
          gap: 0.35rem;
          margin-bottom: 0.5rem;
        }

        .fire-burst-btn {
          flex: 2;
          font-family: var(--font-mono);
          font-size: 0.625rem;
          padding: 0.45rem;
          background: #e11d48;
          color: #ffffff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 700;
        }

        .reload-btn {
          flex: 1;
          font-family: var(--font-mono);
          font-size: 0.625rem;
          padding: 0.45rem;
          background: color-mix(in srgb, var(--navy) 70%, var(--void));
          border: 1px solid #e11d48;
          color: #fca5a5;
          border-radius: 4px;
          cursor: pointer;
        }

        .bishop-btn {
          width: 100%;
          font-family: var(--font-mono);
          font-size: 0.625rem;
          padding: 0.35rem;
          background: color-mix(in srgb, var(--navy) 80%, var(--void));
          border: 1px solid var(--steel);
          color: var(--moon);
          border-radius: 4px;
          cursor: pointer;
        }

        .console-meta-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 0.625rem;
          color: var(--star);
          margin-top: 0.35rem;
        }

        .console-tag {
          font-weight: 700;
        }

        /* Right Data Pane */
        .telemetry-data-pane {
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

        :global([data-theme='light']) .interactive-minigame-box,
        :global(.flat-mode) .interactive-minigame-box,
        :global([data-flat='true']) .interactive-minigame-box {
          background: #ffffff;
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
