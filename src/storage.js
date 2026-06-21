import { DAILY_TOP_UP, INITIAL_CREDITS, normalizedCredits } from "./rules.js";
import { avatarFor, generatedName } from "./names.js";

const prefix = "topscore_web_";

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(prefix + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(prefix + key, JSON.stringify(value));
}

export function readCredits() {
  const state = readJson("credits", {
    credits: INITIAL_CREDITS,
    lastDailyTopUpLocalDate: null,
  });
  const normalized = normalizedCredits(state);
  writeCredits(normalized);
  return normalized;
}

export function writeCredits(state) {
  writeJson("credits", state);
}

export function readProfile(localId) {
  const profile = readJson("profile", null);
  if (profile?.localId) return profile;
  const id = localId || crypto.randomUUID();
  const next = {
    localId: id,
    displayName: generatedName(id),
    avatarSymbol: avatarFor(id),
    teamCode: "MEX",
    createdAt: new Date().toISOString(),
    lastTeamChangeAt: null,
  };
  writeProfile(next);
  return next;
}

export function writeProfile(profile) {
  writeJson("profile", profile);
}

export function readPredictions() {
  return readJson("predictions", {});
}

export function writePredictions(predictions) {
  writeJson("predictions", predictions);
}

export function readOracleUse() {
  return readJson("oracle_use", {});
}

export function writeOracleUse(value) {
  writeJson("oracle_use", value);
}

export function readAchievements() {
  return readJson("achievements", {});
}

export function writeAchievements(value) {
  writeJson("achievements", value);
}

export { DAILY_TOP_UP };
