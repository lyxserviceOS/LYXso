// lib/utils/recharts.ts
/**
 * Ensures percent is always a valid number.
 * Recharts label callbacks may receive percent as undefined,
 * so this normalizes it safely.
 */
export function safePercent(percent?: number): number {
  return percent ?? 0;
}
