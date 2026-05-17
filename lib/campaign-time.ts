/** ~10 years — deadlines beyond this are almost always a bad Remix constructor arg */
const MAX_FUTURE_SECONDS = 10 * 365 * 24 * 60 * 60;

/** Unix seconds from chain or JS clock (safe for display math) */
export function deadlineToSeconds(deadlineUnix: bigint | number): number {
  const n = typeof deadlineUnix === "bigint" ? deadlineUnix : BigInt(deadlineUnix);
  if (n <= BigInt(Number.MAX_SAFE_INTEGER)) return Number(n);
  // uint256 larger than JS safe integer — keep second precision via division
  return Number(n / 1_000_000_000n) * 1_000_000_000;
}

/** True when deadline looks like a mistaken constructor value (e.g. billions of minutes). */
export function isDeadlineSuspicious(deadlineUnix: bigint | number): boolean {
  const sec = deadlineToSeconds(deadlineUnix);
  const now = Math.floor(Date.now() / 1000);
  if (sec < 1_000_000_000) return true; // before ~2001
  if (sec - now > MAX_FUTURE_SECONDS) return true;
  return false;
}

export function secondsUntilDeadline(deadlineUnix: bigint | number): number {
  const now = Math.floor(Date.now() / 1000);
  if (isDeadlineSuspicious(deadlineUnix)) return 0;
  return Math.max(0, deadlineToSeconds(deadlineUnix) - now);
}

export function formatCountdown(
  totalSeconds: number,
  options?: { invalid?: boolean }
): string {
  if (options?.invalid) return "Invalid deadline";
  if (totalSeconds <= 0) return "Campaign ended";

  const days = Math.floor(totalSeconds / 86400);
  const hrs = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (days > 0) return `${days}d ${hrs}h ${mins}m`;
  if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
  return `${mins}m ${secs}s`;
}

/** Local date + time (contract deadline is UTC unix; display in user's timezone) */
export function formatDeadlineLocal(deadlineUnix: bigint | number): string {
  if (isDeadlineSuspicious(deadlineUnix)) {
    return "Invalid (check Remix deploy)";
  }
  return new Date(deadlineToSeconds(deadlineUnix) * 1000).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
