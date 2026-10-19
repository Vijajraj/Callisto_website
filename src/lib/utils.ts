/**
 * Formats an ISO date string into a human-readable display string.
 * Example output: "November 17, 2026"
 */
export function formatDate(
  date: string,
  options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
): string {
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return date;
    }
    return new Intl.DateTimeFormat('en-US', options).format(parsedDate);
  } catch {
    return date;
  }
}

/**
 * Calculates remaining time until a designated target date.
 * Returns an object with days, hours, minutes, and seconds.
 */
export function getTimeUntil(date: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const target = new Date(date).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

/**
 * Calculates the number of Sols (Martian solar days, 24h 39m 35.244s)
 * elapsed since the club's founding date.
 * Default founding date: 2023-09-01T00:00:00Z.
 */
export function getSolCount(foundingDate: string = '2023-09-01T00:00:00Z'): number {
  const start = new Date(foundingDate).getTime();
  const now = Date.now();
  const elapsedMs = Math.max(0, now - start);

  // 1 Martian Sol = 88,775,244 milliseconds (approx. 24.6597 Earth hours)
  const MS_PER_SOL = 88775244;
  return Math.floor(elapsedMs / MS_PER_SOL);
}

/**
 * Combines conditional class names into a single string.
 * Strips falsy, null, and undefined values.
 */
export function cn(
  ...classes: (string | number | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Converts a text string into a URL-safe lowercase slug.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD') // separate accents from characters
    .replace(/[\u0300-\u036f]/g, '') // remove accent diacritics
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric chars
    .replace(/\s+/g, '-') // collapse whitespace to hyphens
    .replace(/-+/g, '-') // collapse consecutive hyphens
    .replace(/^-+|-+$/g, ''); // trim leading & trailing hyphens
}
