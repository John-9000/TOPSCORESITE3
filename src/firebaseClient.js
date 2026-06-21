import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { BASE_MATCHES, MATCHES_BY_ID, mergeMatches } from "./worldCup.js";
import { generatedName } from "./names.js";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseReady = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app;
let auth;
let db;

if (firebaseReady) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export function subscribeAuth(callback) {
  if (!firebaseReady) {
    callback({ user: null, status: "missing-config" });
    return () => {};
  }
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    callback({ user, status: user ? "signed-in" : "signing-in" });
    if (!user) {
      signInAnonymously(auth).catch((error) => callback({ user: null, status: "error", error }));
    }
  });
  return unsubscribe;
}

export async function loadMatches() {
  if (!db || !auth.currentUser) return { matches: BASE_MATCHES, source: "fallback" };
  const snapshot = await getDocs(query(collection(db, "matches"), orderBy("startsAtUtc")));
  const remote = snapshot.docs.map((item) => fromMatchDoc(item.id, item.data())).filter(Boolean);
  return { matches: remote.length ? mergeMatches(remote) : BASE_MATCHES, source: remote.length ? "firebase" : "fallback" };
}

export async function loadMatchDetails(matchId) {
  if (!db || !auth.currentUser) return null;
  const detailsDoc = await getDoc(doc(db, "matchDetails", matchId));
  if (detailsDoc.exists()) return detailsDoc.data();
  const matchDoc = await getDoc(doc(db, "matches", matchId));
  return matchDoc.exists() ? matchDoc.data() : null;
}

export async function loadMyProfile(uid) {
  if (!db || !uid) return null;
  const snapshot = await getDoc(doc(db, "users", uid));
  return snapshot.exists() ? snapshot.data() : null;
}

export async function ensureRemoteProfile(uid, profile, stats) {
  if (!db || !uid) return null;
  const ref = doc(db, "users", uid);
  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (snapshot.exists()) {
      const existing = snapshot.data();
      const next = {
        ...existing,
        displayName: profile.displayName,
        avatarSymbol: profile.avatarSymbol,
        teamCode: profile.teamCode,
      };
      transaction.set(ref, next, { merge: false });
      return next;
    }
    const next = {
      uid,
      displayName: profile.displayName || generatedName(uid),
      avatarSymbol: profile.avatarSymbol || "BALL",
      teamCode: profile.teamCode || "MEX",
      createdAt: serverTimestamp(),
      totalPredictions: stats?.totalPredictions ?? 0,
      points: stats?.points ?? 0,
      correctScores: stats?.correctScores ?? 0,
      correctResults: stats?.correctResults ?? 0,
    };
    transaction.set(ref, next);
    return next;
  });
}

export async function savePrediction(uid, profile, match, prediction) {
  if (!db || !uid) throw new Error("Firebase is not configured or signed in.");
  const ref = doc(db, "matches", match.matchId, "predictions", uid);
  await runTransaction(db, async (transaction) => {
    const existing = await transaction.get(ref);
    transaction.set(ref, {
      userId: uid,
      userName: profile.displayName || generatedName(uid),
      matchId: match.matchId,
      homeScore: prediction.homeScore,
      awayScore: prediction.awayScore,
      scoreKey: `${prediction.homeScore}-${prediction.awayScore}`,
      confidenceStars: 1,
      confidencePercent: 33,
      winnerIfPenalties: match.stage === "GROUP" ? null : prediction.winnerIfPenalties,
      source: prediction.source === "oracle" ? "random" : "manual",
      createdAt: existing.exists() ? existing.data().createdAt : serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
}

export async function loadMyPredictions(uid) {
  if (!db || !uid) return {};
  const result = {};
  await Promise.all(BASE_MATCHES.map(async (match) => {
    const snapshot = await getDoc(doc(db, "matches", match.matchId, "predictions", uid));
    if (snapshot.exists()) result[match.matchId] = fromPrediction(snapshot.data());
  }));
  return result;
}

export async function loadCrowdSummaries() {
  if (!db || !auth.currentUser) return {};
  const snapshot = await getDocs(collection(db, "matchSummaries"));
  return Object.fromEntries(snapshot.docs.map((item) => [item.id, item.data()]));
}

export async function loadLeaderboard() {
  if (!db || !auth.currentUser) return { entries: [], updatedAt: null };
  const summary = await getDoc(doc(db, "leaderboardSummaries", "global"));
  if (summary.exists()) {
    const data = summary.data();
    return { entries: data.topUsers ?? [], updatedAt: data.updatedAt ?? null };
  }
  const snapshot = await getDocs(query(collection(db, "leaderboard"), orderBy("points", "desc"), limit(300)));
  return { entries: snapshot.docs.map((item) => item.data()), updatedAt: null };
}

export async function refreshMatchesByIds(matchIds) {
  if (!db || !auth.currentUser || matchIds.length === 0) return [];
  const chunks = [];
  for (let index = 0; index < matchIds.length; index += 30) chunks.push(matchIds.slice(index, index + 30));
  const results = [];
  for (const chunk of chunks) {
    const snapshot = await getDocs(query(collection(db, "matches"), where(documentId(), "in", chunk)));
    results.push(...snapshot.docs.map((item) => fromMatchDoc(item.id, item.data())).filter(Boolean));
  }
  return results;
}

function fromMatchDoc(id, data) {
  const base = MATCHES_BY_ID[id] ?? MATCHES_BY_ID[data.matchId];
  if (!base) return null;
  const startsAtUtc = timestampToIso(data.kickoffUtc ?? data.startsAtUtc) ?? base.startsAtUtc;
  const home = normalizeTeamCode(data.homeTeamCode ?? data.homeTeamAcronym ?? base.homeTeamCode);
  const away = normalizeTeamCode(data.awayTeamCode ?? data.awayTeamAcronym ?? base.awayTeamCode);
  return {
    ...base,
    matchId: data.matchId ?? id,
    startsAtUtc,
    lockAtUtc: timestampToIso(data.lockAtUtc) ?? new Date(new Date(startsAtUtc).getTime() - 60 * 1000).toISOString(),
    stage: data.stage ?? base.stage,
    groupLetter: data.groupLetter ?? data.group ?? base.groupLetter,
    homeTeamCode: home,
    awayTeamCode: away,
    homePlaceholder: home ? null : (data.homeTeamName ?? base.homePlaceholder),
    awayPlaceholder: away ? null : (data.awayTeamName ?? base.awayPlaceholder),
    stadiumName: data.venueName ?? data.stadiumName ?? base.stadiumName,
    city: data.venueCity ?? data.city ?? base.city,
    country: data.country ?? base.country,
    locationDisplayName: data.locationDisplayName ?? base.locationDisplayName,
    status: normalizeStatus(data.statusShort) ?? data.status ?? base.status,
    actualHomeScore: intOrNull(data.homeScore ?? data.actualHomeScore),
    actualAwayScore: intOrNull(data.awayScore ?? data.actualAwayScore),
    actualHomePenaltyScore: intOrNull(data.penaltyHomeScore ?? data.actualHomePenaltyScore),
    actualAwayPenaltyScore: intOrNull(data.penaltyAwayScore ?? data.actualAwayPenaltyScore),
    winnerAcronym: data.winnerAcronym ?? base.winnerAcronym,
    wentToPenalties: data.wentToPenalties ?? base.wentToPenalties,
    updatedAt: timestampToIso(data.updatedAt),
  };
}

function fromPrediction(data) {
  return {
    homeScore: intOrNull(data.homeScore) ?? 0,
    awayScore: intOrNull(data.awayScore) ?? 0,
    winnerIfPenalties: data.winnerIfPenalties ?? null,
    source: data.source === "random" ? "oracle" : "manual",
    updatedAt: timestampToIso(data.updatedAt) ?? new Date().toISOString(),
    createdAt: timestampToIso(data.createdAt) ?? new Date().toISOString(),
  };
}

function timestampToIso(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (value.seconds) return new Date(value.seconds * 1000).toISOString();
  return null;
}

function intOrNull(value) {
  const number = Number(value);
  return Number.isInteger(number) ? number : null;
}

function normalizeTeamCode(value) {
  const code = String(value ?? "").trim().toUpperCase();
  if (!code) return null;
  return code === "CUR" ? "CUW" : code;
}

function normalizeStatus(value) {
  switch (String(value ?? "").toUpperCase()) {
    case "1H":
    case "HT":
    case "2H":
    case "ET":
    case "BT":
    case "P":
    case "LIVE":
      return "LIVE";
    case "FT":
    case "AET":
    case "PEN":
      return "FINISHED";
    case "PST":
    case "CANC":
    case "ABD":
    case "AWD":
    case "WO":
      return "POSTPONED";
    case "NS":
    case "TBD":
      return "SCHEDULED";
    default:
      return null;
  }
}
