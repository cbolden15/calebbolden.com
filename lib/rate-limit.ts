type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/**
 * Drop buckets whose window has already closed. Without this the map grows
 * once per distinct key for the life of the process, and the keys are client
 * IPs, so the ceiling is "every address that ever hit the route".
 */
function sweepExpired(now: number): void {
  for (const [key, bucket] of buckets) {
    if (now >= bucket.resetAt) {
      buckets.delete(key);
    }
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now()
): { allowed: boolean; remaining: number } {
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    // Sweep before the write so the bucket we are about to set survives it.
    sweepExpired(now);
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count };
}

export function __resetRateLimit(): void {
  buckets.clear();
}

/** Test-only: lets the eviction sweep be observed. */
export function __rateLimitSize(): number {
  return buckets.size;
}
