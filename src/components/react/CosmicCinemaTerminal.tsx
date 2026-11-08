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
    astrodynamicsNote: 'The Tycho Magnetic Anomaly (TMA-1) on the Moon emitted a single high-intensity radio pulse aimed directly at Jupiter upon exposure to sunlight. The Discovery One was dispatched on a 18-month interplanetary trajectory utilizing a Jovian gravitational slingshot.',
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

// Lightweight synthesized telemetry audio (zero MP3/WAV files, zero memory leaks)
function playCinemaBeep(freq = 800, duration = 0.08, type: OscillatorType = 'sine') {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.25, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
    setTimeout(() => ctx.close(), Math.ceil(duration * 1000) + 100);
  } catch {
    // Audio context not allowed or unsupported
  }
}

export default function CosmicCinemaTerminal(): React.ReactElement {
  const [activeSignalId, setActiveSignalId] = useState<string>('odyssey-2001');
  const [decryptedSignals, setDecryptedSignals] = useState<{ [key: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const activeSignal = useMemo(() => {
    return CINEMA_SIGNALS.find((s) => s.id === activeSignalId) || CINEMA_SIGNALS[0];
  }, [activeSignalId]);

  const handleSelectSignal = useCallback((id: string) => {
    setActiveSignalId(id);
    playCinemaBeep(920, 0.06, 'triangle');
  }, []);

  const handleDecrypt = useCallback((id: string) => {
    setDecryptedSignals((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    playCinemaBeep(1200, 0.12, 'sawtooth');
  }, []);

  const handleCopySecret = useCallback((text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      playCinemaBeep(1600, 0.08, 'sine');
      setTimeout(() => setCopiedId(null), 2500);
    }
  }, []);

  const filteredMotifs = useMemo(() => {
    if (selectedCategory === 'ALL') return activeSignal.motifs;
    return activeSignal.motifs.filter((m) => m.category === selectedCategory);
  }, [activeSignal, selectedCategory]);

  // Render SVG Holographic Wireframes
  const renderHologram = (type: CinemaSignal['iconType']) => {
    switch (type) {
      case 'hal':
        return (
          <svg viewBox="0 0 160 160" className="hologram-svg" aria-label="HAL 9000 glowing optic scanner">
            <defs>
              <radialGradient id="halEyeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff4d4d" stopOpacity="1" />
                <stop offset="25%" stopColor="#ef4444" stopOpacity="0.9" />
                <stop offset="70%" stopColor="#991b1b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="monolithGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
            <rect x="15" y="15" width="130" height="130" rx="12" fill="#0b0f19" stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.5" />
            <rect x="25" y="25" width="110" height="110" rx="8" fill="#05070e" stroke="#334155" strokeWidth="1" />
            {/* The Monolith Silhouette in Background */}
            <rect x="32" y="36" width="20" height="48" rx="2" fill="url(#monolithGrad)" stroke="#475569" strokeWidth="0.8" opacity="0.65" />
            {/* HAL 9000 Optic Lens */}
            <circle cx="80" cy="80" r="42" fill="#111827" stroke="#475569" strokeWidth="2.5" />
            <circle cx="80" cy="80" r="34" fill="#030712" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 2" />
            <circle cx="80" cy="80" r="24" fill="url(#halEyeGlow)" />
            <circle cx="80" cy="80" r="9" fill="#fee2e2" />
            <circle cx="80" cy="80" r="4" fill="#ffffff" />
            {/* Voice Waveform Telemetry Bars */}
            <line x1="30" y1="118" x2="30" y2="128" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            <line x1="42" y1="114" x2="42" y2="128" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            <line x1="54" y1="110" x2="54" y2="128" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            <line x1="106" y1="110" x2="106" y2="128" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            <line x1="118" y1="114" x2="118" y2="128" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            <line x1="130" y1="118" x2="130" y2="128" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            <text x="80" y="146" textAnchor="middle" fill="#ef4444" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="1.5">
              HAL 9000 // IBM-1
            </text>
          </svg>
        );

      case 'tars':
        return (
          <svg viewBox="0 0 160 160" className="hologram-svg" aria-label="TARS monolithic robot and Gargantua accretion disc">
            <defs>
              <linearGradient id="gargantuaDisc" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Gargantua Relativistic Accretion Lensing */}
            <ellipse cx="80" cy="55" rx="65" ry="16" fill="none" stroke="url(#gargantuaDisc)" strokeWidth="3" />
            <ellipse cx="80" cy="55" rx="50" ry="24" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
            <circle cx="80" cy="55" r="14" fill="#000000" stroke="#06b6d4" strokeWidth="1.5" />
            {/* TARS 4-Monolith Robotic Articulation Wireframe */}
            <g transform="translate(42, 75)">
              <rect x="0" y="0" width="16" height="56" rx="2" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
              <rect x="19" y="0" width="18" height="56" rx="2" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <rect x="40" y="0" width="18" height="56" rx="2" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <rect x="61" y="0" width="16" height="56" rx="2" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
              {/* TARS Monochrome Screen & Settings */}
              <rect x="23" y="8" width="31" height="12" rx="1" fill="#042f2e" stroke="#2dd4bf" strokeWidth="0.8" />
              <text x="38" y="17" textAnchor="middle" fill="#2dd4bf" fontSize="6" fontFamily="var(--font-mono)">
                H:75% H:90%
              </text>
              {/* Cooper's Watch Morse Code Pulse Line */}
              <circle cx="38" cy="36" r="6" fill="none" stroke="#f59e0b" strokeWidth="1" />
              <line x1="38" y1="36" x2="41" y2="33" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" />
            </g>
            <text x="80" y="148" textAnchor="middle" fill="#06b6d4" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="1.5">
              TARS // GARGANTUA 5D
            </text>
          </svg>
        );

      case 'gravity':
        return (
          <svg viewBox="0 0 160 160" className="hologram-svg" aria-label="Orbital Kessler debris cascade and airlock EVA helmet">
            {/* Earth Limb Horizon */}
            <path d="M 0 135 Q 80 100 160 135" fill="none" stroke="#38bdf8" strokeWidth="3" />
            <path d="M 0 135 Q 80 100 160 135 L 160 160 L 0 160 Z" fill="#0369a1" opacity="0.2" />
            {/* Kessler Syndrome Hypervelocity Debris Trajectories */}
            <line x1="10" y1="30" x2="150" y2="45" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6 3" />
            <line x1="140" y1="20" x2="20" y2="70" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="4 2" />
            <circle cx="45" cy="34" r="2" fill="#ef4444" />
            <circle cx="115" cy="41" r="2.5" fill="#f59e0b" />
            <circle cx="85" cy="46" r="1.5" fill="#ffffff" />
            {/* Floating Pen Zero-G Homage */}
            <g transform="translate(115, 65) rotate(35)">
              <rect x="0" y="0" width="4" height="26" rx="1.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
              <polygon points="0,26 4,26 2,32" fill="#3b82f6" />
            </g>
            {/* Astronaut Airlock Fetal Curvature / Helmet */}
            <circle cx="70" cy="78" r="24" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            <ellipse cx="70" cy="78" rx="18" ry="15" fill="#0284c7" fillOpacity="0.4" stroke="#93c5fd" strokeWidth="1" />
            {/* Subtle Reflection Arc */}
            <path d="M 60 70 A 12 12 0 0 1 78 70" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
            <text x="80" y="150" textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="1.2">
              KESSLER // 28,000 KM/H
            </text>
          </svg>
        );

      case 'martian':
        return (
          <svg viewBox="0 0 160 160" className="hologram-svg" aria-label="Ares III Hab and Pathfinder Hexadecimal dial">
            {/* Martian Crater Horizon */}
            <path d="M 10 130 Q 50 115 80 125 T 150 130" fill="none" stroke="#ea580c" strokeWidth="2" />
            {/* Pathfinder 16-Hex Directional Rose */}
            <circle cx="80" cy="72" r="44" fill="#180e08" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4 2" />
            <circle cx="80" cy="72" r="32" fill="none" stroke="#ea580c" strokeWidth="0.8" />
            {/* Radial Hex Point Spokes */}
            {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const x1 = 80 + Math.cos(rad) * 36;
              const y1 = 72 + Math.sin(rad) * 36;
              const x2 = 80 + Math.cos(rad) * 44;
              const y2 = 72 + Math.sin(rad) * 44;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f97316" strokeWidth="1" />;
            })}
            {/* Pathfinder Central Camera Mast */}
            <circle cx="80" cy="72" r="8" fill="#c2410c" stroke="#fed7aa" strokeWidth="1.5" />
            <line x1="80" y1="72" x2="98" y2="60" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
            {/* Sol 546 Potato Sprout Icon in Corner */}
            <path d="M 28 116 Q 34 102 40 116" fill="none" stroke="#84cc16" strokeWidth="1.8" />
            <path d="M 34 108 Q 30 102 24 104" fill="none" stroke="#84cc16" strokeWidth="1.5" />
            <text x="80" y="148" textAnchor="middle" fill="#f97316" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="1.2">
              ARES III // SOL 546 HEX
            </text>
          </svg>
        );

      case 'apollo':
        return (
          <svg viewBox="0 0 160 160" className="hologram-svg" aria-label="Apollo 13 free-return trajectory and square peg in round hole scrubber">
            {/* Moon Silhouette */}
            <circle cx="120" cy="50" r="18" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.2" />
            <circle cx="116" cy="46" r="3" fill="#334155" />
            <circle cx="125" cy="54" r="4" fill="#334155" />
            {/* Earth Silhouette */}
            <circle cx="36" cy="95" r="14" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.2" />
            {/* Free-Return Gravity Slingshot Trajectory Loop */}
            <path d="M 36 90 Q 75 30 118 32 Q 142 50 120 72 Q 80 120 36 100" fill="none" stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="5 3" />
            {/* Improvised CO2 Scrubber (Square Peg in a Round Hole) */}
            <g transform="translate(62, 70)">
              {/* Round Canister Socket */}
              <circle cx="18" cy="18" r="16" fill="#0f172a" stroke="#94a3b8" strokeWidth="1.5" />
              {/* Square Cartridge Adapter with Duct Tape */}
              <rect x="7" y="7" width="22" height="22" rx="1" fill="#475569" stroke="#fbbf24" strokeWidth="1.5" />
              {/* Diagonal Duct Tape Strips */}
              <line x1="5" y1="12" x2="31" y2="12" stroke="#cbd5e1" strokeWidth="2" strokeOpacity="0.8" />
              <line x1="5" y1="24" x2="31" y2="24" stroke="#cbd5e1" strokeWidth="2" strokeOpacity="0.8" />
            </g>
            <text x="80" y="148" textAnchor="middle" fill="#fbbf24" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="1.2">
              APOLLO 13 // FREE-RETURN
            </text>
          </svg>
        );

      case 'alien':
        return (
          <svg viewBox="0 0 160 160" className="hologram-svg" aria-label="MU-TH-UR 6000 green CRT and Xenomorph life cycle">
            {/* Retro CRT Monitor Frame */}
            <rect x="18" y="16" width="124" height="106" rx="8" fill="#021408" stroke="#22c55e" strokeWidth="1.5" />
            {/* Scanlines Effect */}
            <line x1="22" y1="32" x2="138" y2="32" stroke="#22c55e" strokeWidth="0.5" opacity="0.35" />
            <line x1="22" y1="48" x2="138" y2="48" stroke="#22c55e" strokeWidth="0.5" opacity="0.35" />
            <line x1="22" y1="64" x2="138" y2="64" stroke="#22c55e" strokeWidth="0.5" opacity="0.35" />
            <line x1="22" y1="80" x2="138" y2="80" stroke="#22c55e" strokeWidth="0.5" opacity="0.35" />
            <line x1="22" y1="96" x2="138" y2="96" stroke="#22c55e" strokeWidth="0.5" opacity="0.35" />
            {/* Dipping Drinking Bird Silhouette */}
            <g transform="translate(32, 45)">
              <circle cx="8" cy="8" r="5" fill="#ef4444" />
              <line x1="8" y1="13" x2="14" y2="38" stroke="#22c55e" strokeWidth="1.8" />
              <circle cx="14" cy="38" r="7" fill="#3b82f6" />
              <line x1="2" y1="46" x2="26" y2="46" stroke="#475569" strokeWidth="2" />
            </g>
            {/* Biomechanical Egg & Facehugger Outline */}
            <path d="M 98 84 C 84 84 80 50 98 44 C 116 50 112 84 98 84 Z" fill="none" stroke="#22c55e" strokeWidth="1.8" />
            <line x1="90" y1="44" x2="106" y2="44" stroke="#4ade80" strokeWidth="1" strokeDasharray="2 1" />
            <text x="98" y="100" textAnchor="middle" fill="#86efac" fontSize="7" fontFamily="var(--font-mono)">
              ORDER 937
            </text>
            <text x="80" y="148" textAnchor="middle" fill="#22c55e" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="1.2">
              NOSTROMO // MU-TH-UR
            </text>
          </svg>
        );

      case 'starwars':
        return (
          <svg viewBox="0 0 160 160" className="hologram-svg" aria-label="Death Star trench targeting computer wireframe">
            {/* Tatooine Binary Sunset */}
            <circle cx="34" cy="40" r="10" fill="#f59e0b" opacity="0.85" />
            <circle cx="50" cy="46" r="7" fill="#ef4444" opacity="0.8" />
            {/* Trench Wireframe Perspective Grid */}
            <polygon points="20,126 55,68 105,68 140,126" fill="none" stroke="#0284c7" strokeWidth="1.2" />
            <line x1="55" y1="68" x2="55" y2="126" stroke="#0284c7" strokeWidth="1" strokeDasharray="3 2" />
            <line x1="105" y1="68" x2="105" y2="126" stroke="#0284c7" strokeWidth="1" strokeDasharray="3 2" />
            {/* Thermal Exhaust Port 2-Meter Target Circle */}
            <rect x="70" y="70" width="20" height="20" fill="none" stroke="#ef4444" strokeWidth="1.5" />
            <circle cx="80" cy="80" r="6" fill="#ef4444" fillOpacity="0.4" stroke="#ffffff" strokeWidth="1" />
            {/* X-Wing HUD Crosshairs */}
            <circle cx="80" cy="80" r="38" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="8 4" />
            <line x1="80" y1="36" x2="80" y2="124" stroke="#38bdf8" strokeWidth="1.2" />
            <line x1="36" y1="80" x2="124" y2="80" stroke="#38bdf8" strokeWidth="1.2" />
            <text x="80" y="148" textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="1.2">
              RED 5 // TRENCH RUN
            </text>
          </svg>
        );

      case 'walle':
        return (
          <svg viewBox="0 0 160 160" className="hologram-svg" aria-label="WALL-E binoculars and Axiom AUTO red eye">
            {/* WALL-E Binocular Eyes */}
            <g transform="translate(36, 32)">
              <path d="M 4 8 L 36 2 L 40 24 L 8 28 Z" fill="#0f172a" stroke="#eab308" strokeWidth="1.5" />
              <circle cx="22" cy="15" r="9" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.2" />
              <circle cx="22" cy="15" r="4" fill="#0284c7" />

              <path d="M 52 2 L 84 8 L 80 28 L 48 24 Z" fill="#0f172a" stroke="#eab308" strokeWidth="1.5" />
              <circle cx="66" cy="15" r="9" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.2" />
              <circle cx="66" cy="15" r="4" fill="#0284c7" />
              {/* Central Eye Mount Pin */}
              <rect x="36" y="12" width="16" height="4" fill="#94a3b8" />
            </g>
            {/* Solar Battery Gauge */}
            <g transform="translate(46, 68)">
              <rect x="0" y="0" width="68" height="12" rx="2" fill="#042f2e" stroke="#22c55e" strokeWidth="1" />
              <rect x="2" y="2" width="60" height="8" rx="1" fill="#22c55e" />
              <text x="34" y="9" textAnchor="middle" fill="#052e16" fontSize="7" fontWeight="bold" fontFamily="var(--font-mono)">
                SOLAR 100%
              </text>
            </g>
            {/* AUTO Steering Wheel Single Red Optical Sensor */}
            <g transform="translate(64, 88)">
              <circle cx="16" cy="16" r="14" fill="#090d16" stroke="#94a3b8" strokeWidth="2" />
              <circle cx="16" cy="16" r="5" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" />
              <line x1="2" y1="16" x2="30" y2="16" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="16" y1="2" x2="16" y2="30" stroke="#94a3b8" strokeWidth="1.5" />
            </g>
            <text x="80" y="148" textAnchor="middle" fill="#eab308" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="1.2">
              WALL-E // DIRECTIVE A-113
            </text>
          </svg>
        );

      case 'aliens':
        return (
          <svg viewBox="0 0 160 160" className="hologram-svg" aria-label="Caterpillar P-5000 Power Loader clamp and pulse rifle counter">
            {/* Caterpillar P-5000 Power Loader Hydraulic Cage */}
            <g transform="translate(38, 24)">
              {/* Heavy Duty Industrial Yellow Frame */}
              <polygon points="12,10 72,10 64,68 20,68" fill="#1c1917" stroke="#eab308" strokeWidth="2.5" />
              <line x1="20" y1="24" x2="64" y2="24" stroke="#eab308" strokeWidth="1.5" />
              <line x1="22" y1="42" x2="62" y2="42" stroke="#eab308" strokeWidth="1.5" />
              {/* Hydraulic Clamp Piston Claws */}
              <path d="M 6 42 Q -8 52 6 64" fill="none" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
              <path d="M 78 42 Q 92 52 78 64" fill="none" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
            </g>
            {/* M41A Pulse Rifle Ammo Counter: 95 */}
            <g transform="translate(52, 98)">
              <rect x="0" y="0" width="56" height="22" rx="3" fill="#180508" stroke="#e11d48" strokeWidth="1.5" />
              <text x="28" y="16" textAnchor="middle" fill="#f43f5e" fontSize="13" fontWeight="bold" fontFamily="var(--font-mono)" letterSpacing="2">
                95
              </text>
            </g>
            <text x="80" y="148" textAnchor="middle" fill="#e11d48" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="1.2">
              P-5000 POWER LOADER // 95
            </text>
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className="cinema-terminal" id="cosmic-cinema-terminal">
      {/* Terminal Title Bar */}
      <div className="terminal-top-bar">
        <div className="terminal-title-group">
          <span className="terminal-radar-pulse" aria-hidden="true" />
          <span className="terminal-tag">COSMIC CINEMA & EASTER EGGS TRANSCEIVER</span>
        </div>
        <div className="terminal-freq-status">
          <span className="live-pill">9 ICONIC SPACE SCI-FI SIGNALS LOCKED</span>
        </div>
      </div>

      {/* Intro Description */}
      <div className="terminal-intro">
        <p>
          Tune your deep-space radio telescope into the transmissions of cinematic history. Explore the definitive visual motifs, iconic dialogue, key props, and decryptable classified lore from the top 9 space movies.
        </p>
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

      {/* Active Signal Telemetry Display */}
      <div className="signal-telemetry-card" id={`panel-${activeSignal.id}`} role="tabpanel">
        <div className="telemetry-grid">
          {/* Left Column: Hologram & Wireframe */}
          <div className="telemetry-hologram-pane">
            <div className="hologram-viewport">
              <div className="hologram-glow-backdrop" style={{ background: `radial-gradient(circle, ${activeSignal.themeColor}33 0%, transparent 70%)` }} />
              {renderHologram(activeSignal.iconType)}
            </div>
            <div className="hologram-metadata">
              <div className="holo-callsign">{activeSignal.callSign}</div>
              <div className="holo-director">DIR: {activeSignal.director.toUpperCase()} ({activeSignal.year})</div>
              <div className="holo-tag" style={{ borderColor: activeSignal.themeColor, color: activeSignal.themeColor }}>
                {activeSignal.tag}
              </div>
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

            {/* Motifs & Props Filter Header */}
            <div className="motifs-header-row">
              <h4 className="motifs-heading">ICONIC REFERENCES, MOTIFS & PROPS ({activeSignal.motifs.length})</h4>
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

            {/* Classified Easter Egg Decryptor Button */}
            <div className="decrypt-section">
              <button
                type="button"
                className="decrypt-btn"
                style={{ borderColor: activeSignal.themeColor }}
                onClick={() => handleDecrypt(activeSignal.id)}
              >
                <span className="decrypt-radar-icon" aria-hidden="true">✦</span>
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
                      {copiedId === activeSignal.id ? '✓ COPIED TO CLIPBOARD' : 'COPY TRANSMISSION'}
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
            playCinemaBeep(750, 0.05, 'sine');
          }}
          aria-expanded={isDossierOpen}
        >
          <span>{isDossierOpen ? '▲ COLLAPSE COMPLETE 9-FILM EASTER EGG DOSSIER' : '▼ EXPAND COMPLETE 9-FILM EASTER EGG DOSSIER'}</span>
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

        /* Signal Selector Dial Strip */
        .signal-selector-strip {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 0.5rem;
          margin-bottom: var(--space-lg);
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

        @media (min-width: 900px) {
          .telemetry-grid {
            grid-template-columns: 240px 1fr;
          }
        }

        /* Hologram Left Pane */
        .telemetry-hologram-pane {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-sm);
        }

        .hologram-viewport {
          position: relative;
          width: 100%;
          max-width: 200px;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hologram-glow-backdrop {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          pointer-events: none;
        }

        .hologram-svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 0 12px color-mix(in srgb, var(--orbit) 30%, transparent));
        }

        .hologram-metadata {
          text-align: center;
          width: 100%;
        }

        .holo-callsign {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--moon);
          letter-spacing: 0.05em;
        }

        .holo-director {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          color: var(--star);
          margin: 0.25rem 0;
        }

        .holo-tag {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 0.625rem;
          font-weight: 600;
          border: 1px solid;
          border-radius: 9999px;
          padding: 0.15rem 0.5rem;
          margin-top: 0.35rem;
          letter-spacing: 0.05em;
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

        /* Motifs & Filter Header */
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

        :global([data-theme='light']) .signal-dial-btn,
        :global(.flat-mode) .signal-dial-btn,
        :global([data-flat='true']) .signal-dial-btn {
          background: #f8fafc;
          border-color: #e2e8f0;
          color: #334155;
        }

        :global([data-theme='light']) .signal-dial-btn.active,
        :global(.flat-mode) .signal-dial-btn.active,
        :global([data-flat='true']) .signal-dial-btn.active {
          background: #ffffff;
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

        :global([data-theme='light']) .lore-box,
        :global(.flat-mode) .lore-box,
        :global([data-flat='true']) .lore-box {
          background: #ffffff;
          border-color: #cbd5e1;
        }

        :global([data-theme='light']) .lore-text,
        :global(.flat-mode) .lore-text,
        :global([data-flat='true']) .lore-text {
          color: #334155;
        }

        :global([data-theme='light']) .decrypt-btn,
        :global(.flat-mode) .decrypt-btn,
        :global([data-flat='true']) .decrypt-btn {
          background: #ffffff;
          color: #0f172a;
        }

        :global([data-theme='light']) .decrypted-log-panel,
        :global(.flat-mode) .decrypted-log-panel,
        :global([data-flat='true']) .decrypted-log-panel {
          background: #f1f5f9;
        }

        :global([data-theme='light']) .decrypted-title,
        :global(.flat-mode) .decrypted-title,
        :global([data-flat='true']) .decrypted-title {
          color: #0f172a;
        }

        :global([data-theme='light']) .decrypted-body,
        :global(.flat-mode) .decrypted-body,
        :global([data-flat='true']) .decrypted-body {
          color: #334155;
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

        :global([data-theme='light']) .dossier-motif-name,
        :global(.flat-mode) .dossier-motif-name,
        :global([data-flat='true']) .dossier-motif-name {
          color: #0f172a;
        }

        :global([data-theme='light']) .dossier-motif-desc,
        :global(.flat-mode) .dossier-motif-desc,
        :global([data-flat='true']) .dossier-motif-desc {
          color: #475569;
        }
      `}</style>
    </div>
  );
}
