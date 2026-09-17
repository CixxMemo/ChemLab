/** Accept only a web origin, so a teacher cannot accidentally replace the student route. */
export function parseShareOrigin(input: string): string | null {
  try {
    const url = new URL(input.trim());
    const isWebAddress = url.protocol === 'http:' || url.protocol === 'https:';
    const isOriginOnly = url.pathname === '/' && !url.search && !url.hash;
    if (!isWebAddress || !isOriginOnly || url.username || url.password) return null;
    return url.origin;
  } catch {
    return null;
  }
}

/** Loopback hosts resolve to the student's own phone, not the teacher's computer. */
export function isLoopbackOrigin(origin: string): boolean {
  const hostname = new URL(origin).hostname;
  return hostname === 'localhost' || hostname.startsWith('127.') || hostname === '[::1]' || hostname === '0.0.0.0';
}
