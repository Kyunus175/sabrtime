const STORAGE_KEY = 'sabrtime-seo-usage';
export const DAILY_FREE_LIMIT = 5;
export interface UsageState { used: number; windowStartedAt: number; }
const emptyUsage = (): UsageState => ({ used: 0, windowStartedAt: Date.now() });
export function getUsage(): UsageState {
  if (typeof window === 'undefined') return emptyUsage();
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as Partial<UsageState> | null;
    if (!parsed || typeof parsed.used !== 'number' || typeof parsed.windowStartedAt !== 'number') return emptyUsage();
    if (Date.now() - parsed.windowStartedAt >= 24 * 60 * 60 * 1000) {
      const reset = emptyUsage(); localStorage.setItem(STORAGE_KEY, JSON.stringify(reset)); return reset;
    }
    return { used: Math.max(0, Math.floor(parsed.used)), windowStartedAt: parsed.windowStartedAt };
  } catch { return emptyUsage(); }
}
export function checkDailyLimit(): boolean { return getUsage().used < DAILY_FREE_LIMIT; }
export function consumeCredit(): UsageState {
  const current = getUsage();
  const next = { ...current, used: Math.min(DAILY_FREE_LIMIT, current.used + 1) };
  if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
export function getCreditBalance(): number { return 0; }
export function canUsePremiumTool(): boolean { return checkDailyLimit(); }
export function resetDailyUsage(): UsageState {
  const reset = emptyUsage();
  if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(reset));
  return reset;
}