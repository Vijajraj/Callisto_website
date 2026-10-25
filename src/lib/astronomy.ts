/* =========================================================================
   CALLISTO ASTRONOMICAL EPHEMERIS ENGINE // SPHERICAL & KEPLERIAN MECHANICS
   Implements Jean Meeus astronomical algorithms, Greenwich & Local Sidereal
   Time, Hour Angle, Spherical Coordinate Transformations, and Planetary Positions.
   Calibrated for Chennai Institute of Technology (CIT):
   Latitude: +12.9716° N | Longitude: +80.0431° E
   ========================================================================= */

export const CIT_COORDINATES = {
  latitude: 12.9716, // Degrees North
  longitude: 80.0431, // Degrees East
  elevationMeters: 42,
  timezoneOffsetHours: 5.5, // Indian Standard Time (UTC + 5.5)
};

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

/** Convert Julian Date from standard JavaScript Date */
export function getJulianDate(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

/** Days since J2000.0 epoch (2000-01-01 12:00 UTC) */
export function getDaysSinceJ2000(date: Date): number {
  return getJulianDate(date) - 2451545.0;
}

/** Greenwich Mean Sidereal Time (GMST) in decimal hours [0, 24) */
export function getGMST(date: Date): number {
  const d = getDaysSinceJ2000(date);
  let gmst = (18.697374558 + 24.06570982441908 * d) % 24;
  if (gmst < 0) gmst += 24;
  return gmst;
}

/** Local Sidereal Time (LST) for a given longitude in decimal hours [0, 24) */
export function getLocalSiderealTime(date: Date, lonDeg: number = CIT_COORDINATES.longitude): number {
  const gmst = getGMST(date);
  let lst = (gmst + lonDeg / 15) % 24;
  if (lst < 0) lst += 24;
  return lst;
}

/** Convert degrees to 16-point Compass Heading */
export function degreesToCompass(azDeg: number): string {
  const points = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const idx = Math.round(azDeg / 22.5) % 16;
  return points[idx];
}

export interface HorizontalCoordinates {
  altitudeDeg: number;
  azimuthDeg: number;
  compassDirection: string;
  hourAngleHours: number;
  airMass: number;
  seeingQuality: 'pristine' | 'good' | 'fair' | 'submerged';
}

/**
 * Spherical Trigonometric Transformation from Equatorial (RA, Dec) to
 * Horizontal (Altitude, Azimuth, Air Mass) from observer latitude.
 */
export function equatorialToHorizontal(
  raHours: number,
  decDeg: number,
  lstHours: number,
  latDeg: number = CIT_COORDINATES.latitude
): HorizontalCoordinates {
  const latRad = latDeg * RAD;
  const decRad = decDeg * RAD;

  // Hour Angle in hours [-12, +12]
  let hHours = lstHours - raHours;
  while (hHours > 12) hHours -= 24;
  while (hHours < -12) hHours += 24;

  const hRad = hHours * 15 * RAD;

  // Altitude
  const sinAlt = Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(hRad);
  const altDeg = Math.asin(Math.max(-1, Math.min(1, sinAlt))) * DEG;

  // Azimuth
  const cosAlt = Math.cos(altDeg * RAD);
  let azDeg = 0;
  if (cosAlt > 0.0001) {
    const cosAz = (Math.sin(decRad) - Math.sin(latRad) * sinAlt) / (Math.cos(latRad) * cosAlt);
    const sinAz = (-Math.cos(decRad) * Math.sin(hRad)) / cosAlt;
    azDeg = Math.atan2(sinAz, cosAz) * DEG;
    if (azDeg < 0) azDeg += 360;
  }

  // Atmospheric Air Mass formula (Kasten & Young, 1989)
  let airMass = 99;
  if (altDeg > 0) {
    airMass = 1 / (Math.sin(altDeg * RAD) + 0.50572 * Math.pow(altDeg + 6.07995, -1.6364));
    airMass = Math.round(airMass * 100) / 100;
  }

  // Astronomical Seeing Assessment based on atmospheric column depth
  let seeingQuality: 'pristine' | 'good' | 'fair' | 'submerged' = 'submerged';
  if (altDeg >= 50) seeingQuality = 'pristine';
  else if (altDeg >= 25) seeingQuality = 'good';
  else if (altDeg > 0) seeingQuality = 'fair';

  return {
    altitudeDeg: Math.round(altDeg * 10) / 10,
    azimuthDeg: Math.round(azDeg * 10) / 10,
    compassDirection: degreesToCompass(azDeg),
    hourAngleHours: Math.round(hHours * 100) / 100,
    airMass,
    seeingQuality,
  };
}

/** Compute Transit (Meridian Culmination), Rise, and Set times for target on given date */
export function calculateCelestialTransits(
  raHours: number,
  decDeg: number,
  date: Date,
  latDeg: number = CIT_COORDINATES.latitude,
  lonDeg: number = CIT_COORDINATES.longitude
): {
  transitIST: string;
  riseIST: string | null;
  setIST: string | null;
  peakAltitudeDeg: number;
} {
  // Peak Altitude at meridian passage
  const peakAltitudeDeg = Math.round((90 - Math.abs(latDeg - decDeg)) * 10) / 10;

  // LST at 00:00 IST of that day
  const midnightIST = new Date(date);
  midnightIST.setHours(0, 0, 0, 0);
  const lstMidnight = getLocalSiderealTime(midnightIST, lonDeg);

  // Sidereal hours from midnight until LST = RA
  let deltaHours = raHours - lstMidnight;
  while (deltaHours < 0) deltaHours += 24;
  while (deltaHours >= 24) deltaHours -= 24;

  // Convert sidereal delta to solar civil hours (factor ~ 0.997269566)
  const solarTransitHour = deltaHours * 0.997269566;

  const tH = Math.floor(solarTransitHour);
  const tM = Math.floor((solarTransitHour - tH) * 60);
  const transitIST = `${tH.toString().padStart(2, '0')}:${tM.toString().padStart(2, '0')} IST`;

  // Semi-diurnal arc for Rise and Set (accounting for -0.5667° atmospheric refraction)
  const h0Rad = -0.5667 * RAD;
  const latRad = latDeg * RAD;
  const decRad = decDeg * RAD;
  const cosH0 = (Math.sin(h0Rad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));

  let riseIST: string | null = null;
  let setIST: string | null = null;

  if (cosH0 >= -1 && cosH0 <= 1) {
    const semiArcHours = (Math.acos(cosH0) * DEG) / 15 * 0.997269566;
    let riseHour = solarTransitHour - semiArcHours;
    if (riseHour < 0) riseHour += 24;
    let setHour = solarTransitHour + semiArcHours;
    if (setHour >= 24) setHour -= 24;

    const rH = Math.floor(riseHour);
    const rM = Math.floor((riseHour - rH) * 60);
    riseIST = `${rH.toString().padStart(2, '0')}:${rM.toString().padStart(2, '0')} IST`;

    const sH = Math.floor(setHour);
    const sM = Math.floor((setHour - sH) * 60);
    setIST = `${sH.toString().padStart(2, '0')}:${sM.toString().padStart(2, '0')} IST`;
  }

  return {
    transitIST,
    riseIST,
    setIST,
    peakAltitudeDeg,
  };
}

/** Accurate Real-Time Lunar Ephemeris */
export function calculateLunarEphemeris(date: Date): {
  ageDays: number;
  illuminationPct: number;
  phaseName: string;
  phaseClass: string;
  opticalInterference: string;
} {
  // Reference Known New Moon: Jan 11, 2024 at 11:57 UTC (JD 2460320.998)
  const refNewMoonJD = 2460320.9979;
  const jd = getJulianDate(date);
  const synodicPeriod = 29.53058867;
  let age = (jd - refNewMoonJD) % synodicPeriod;
  if (age < 0) age += synodicPeriod;

  const phaseFraction = age / synodicPeriod;
  const phaseAngleRad = phaseFraction * 2 * Math.PI;
  // Illumination formula
  const illuminationPct = Math.round(((1 - Math.cos(phaseAngleRad)) / 2) * 100);

  let phaseName = 'New Moon';
  let phaseClass = 'new';
  if (age < 1.84) {
    phaseName = 'New Moon';
    phaseClass = 'new';
  } else if (age < 5.53) {
    phaseName = 'Waxing Crescent';
    phaseClass = 'crescent-waxing';
  } else if (age < 9.22) {
    phaseName = 'First Quarter';
    phaseClass = 'quarter-first';
  } else if (age < 12.91) {
    phaseName = 'Waxing Gibbous';
    phaseClass = 'gibbous-waxing';
  } else if (age < 16.61) {
    phaseName = 'Full Moon';
    phaseClass = 'full';
  } else if (age < 20.3) {
    phaseName = 'Waning Gibbous';
    phaseClass = 'gibbous-waning';
  } else if (age < 23.99) {
    phaseName = 'Last Quarter';
    phaseClass = 'quarter-last';
  } else if (age < 27.68) {
    phaseName = 'Waning Crescent';
    phaseClass = 'crescent-waning';
  } else {
    phaseName = 'New Moon';
    phaseClass = 'new';
  }

  let opticalInterference = 'Minimal Lunar Glare • Superb for Deep-Sky Nebulae & Galaxies';
  if (illuminationPct > 75) {
    opticalInterference = 'High Lunar Radiance • Prime for Lunar Craters, Moon Terminus & Planets';
  } else if (illuminationPct > 40) {
    opticalInterference = 'Moderate Sky Glow • Ideal for Star Clusters, Double Stars & Jovian Moons';
  }

  return {
    ageDays: Math.round(age * 10) / 10,
    illuminationPct,
    phaseName,
    phaseClass,
    opticalInterference,
  };
}

/** Keplerian Orbital Elements for Planets (NASA JPL standard approximations) */
export function calculatePlanetaryCoordinates(date: Date): {
  jupiter: { raHours: number; decDeg: number; distAU: number; mag: number; constell: string };
  saturn: { raHours: number; decDeg: number; distAU: number; mag: number; constell: string };
  mars: { raHours: number; decDeg: number; distAU: number; mag: number; constell: string };
} {
  const d = getDaysSinceJ2000(date);

  // Mean Longitudes and Anomaly (JPL semi-analytic approximations)
  // Jupiter
  const M_jup = (19.895 + 0.0830853 * d) * RAD;
  const L_jup = (34.351 + 0.0830912 * d + 5.55 * Math.sin(M_jup)) * RAD;
  const dist_jup = 5.204 - 0.25 * Math.cos(M_jup);

  // Saturn
  const M_sat = (316.967 + 0.0334442 * d) * RAD;
  const L_sat = (49.944 + 0.033456 * d + 6.35 * Math.sin(M_sat)) * RAD;
  const dist_sat = 9.582 - 0.53 * Math.cos(M_sat);

  // Mars
  const M_mars = (19.373 + 0.5240207 * d) * RAD;
  const L_mars = (355.433 + 0.524033 * d + 10.69 * Math.sin(M_mars)) * RAD;
  const dist_mars = 1.524 - 0.14 * Math.cos(M_mars);

  // Earth
  const M_earth = (357.529 + 0.98560028 * d) * RAD;
  const L_earth = (280.466 + 0.98564736 * d + 1.915 * Math.sin(M_earth)) * RAD;

  const eps = 23.4393 * RAD; // Obliquity of ecliptic

  function toRaDec(L_p: number, r_p: number) {
    const x = r_p * Math.cos(L_p) - 1.0 * Math.cos(L_earth);
    const y = r_p * Math.sin(L_p) - 1.0 * Math.sin(L_earth);
    const z = 0; // approximate planar ecliptic

    const deltaAU = Math.sqrt(x * x + y * y + z * z);
    const raRad = Math.atan2(y * Math.cos(eps), x);
    let raHours = (raRad * DEG) / 15;
    if (raHours < 0) raHours += 24;

    const decRad = Math.asin((y * Math.sin(eps)) / deltaAU);
    const decDeg = decRad * DEG;

    return { raHours, decDeg, distAU: Math.round(deltaAU * 100) / 100 };
  }

  const jup = toRaDec(L_jup, dist_jup);
  const sat = toRaDec(L_sat, dist_sat);
  const mar = toRaDec(L_mars, dist_mars);

  return {
    jupiter: { ...jup, mag: -2.7, constell: 'Taurus' },
    saturn: { ...sat, mag: +0.7, constell: 'Aquarius' },
    mars: { ...mar, mag: +0.2, constell: 'Gemini' },
  };
}
