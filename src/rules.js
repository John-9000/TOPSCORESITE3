export const INITIAL_CREDITS = 10;
export const DAILY_TOP_UP = 3;
export const MAX_CREDITS = 99;
export const PREDICTION_COST = 1;
export const ORACLE_COST = 1;
export const LIVE_REFRESH_COST = 3;
export const ORACLE_COOLDOWN_MS = 60 * 1000;
export const MIN_SCORE = 0;
export const MAX_SCORE = 9;

export function calculatePredictionPoints(prediction, match) {
  const finalScore = finalScoreFor(match);
  if (!finalScore || !prediction) return 0;
  if (prediction.homeScore === finalScore.home && prediction.awayScore === finalScore.away) return 100;
  const predictedTotal = prediction.homeScore + prediction.awayScore;
  const actualTotal = finalScore.home + finalScore.away;
  const diff = Math.abs(predictedTotal - actualTotal);
  if (diff === 1) return 50;
  if (diff === 2) return 10;
  return 0;
}

export function finalScoreFor(match) {
  const home = numberOrNull(match.homeScore ?? match.actualHomeScore);
  const away = numberOrNull(match.awayScore ?? match.actualAwayScore);
  if ((match.status ?? "").toUpperCase() !== "FINISHED") return null;
  return home === null || away === null ? null : { home, away };
}

export function normalizeScore(value) {
  const next = Number(value);
  if (!Number.isFinite(next)) return 0;
  return Math.max(MIN_SCORE, Math.min(MAX_SCORE, Math.round(next)));
}

export function isLocked(match, now = Date.now()) {
  return now >= new Date(match.lockAtUtc).getTime();
}

export function canUseOracle(match, now = Date.now()) {
  return !isLocked(match, now);
}

export function numberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function localDateKey(date = new Date()) {
  return date.toLocaleDateString("en-CA");
}

export function normalizedCredits(state, now = new Date()) {
  const today = localDateKey(now);
  if (state.lastDailyTopUpLocalDate === today) return state;
  return {
    credits: Math.min(MAX_CREDITS, Math.max(state.credits, DAILY_TOP_UP)),
    lastDailyTopUpLocalDate: today,
  };
}

export function spendCredits(state, amount) {
  return { ...state, credits: Math.max(0, state.credits - amount) };
}

export function addCredits(state, amount) {
  return { ...state, credits: Math.min(MAX_CREDITS, state.credits + amount) };
}
