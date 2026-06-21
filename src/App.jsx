import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  BellRing,
  ChevronLeft,
  ChevronRight,
  Info,
  X,
} from "lucide-react";
import {
  firebaseReady,
  loadMatches,
  loadMatchDetails,
  refreshMatchesByIds,
  subscribeAuth,
} from "./firebaseClient.js";
import {
  BASE_MATCHES,
  stageLabel,
  teamFlag,
  teamName,
} from "./worldCup.js";
import { finalScoreFor } from "./rules.js";

const matchFilters = [
  ["future", "Future"],
  ["past", "Past"],
  ["all", "All"],
];

const PAGE_SIZE = 9;
const reminderKey = "topscore_web_match_reminders";
const scoreCacheKey = "topscore_web_score_cache_v2";
const liveRefreshKey = "topscore_web_live_refresh_v1";
const LIVE_REFRESH_INTERVAL_MS = 5 * 60 * 1000;
const PAST_SCORE_RETRY_INTERVAL_MS = 10 * 60 * 1000;
const LIVE_MATCH_WINDOW_MS = 2.5 * 60 * 60 * 1000;
const googlePlayUrl = "https://play.google.com/store/apps/details?id=com.unrstudio.topscore&hl=en";

export function App() {
  const [authState, setAuthState] = useState({ user: null, status: firebaseReady ? "booting" : "missing-config" });
  const [matches, setMatches] = useState(() => applyScoreCache(BASE_MATCHES));
  const [filter, setFilter] = useState("future");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [details, setDetails] = useState(null);
  const [reminders, setReminders] = useState(() => readReminders());
  const [message, setMessage] = useState("");
  const matchesRef = useRef(matches);

  useEffect(() => subscribeAuth(setAuthState), []);

  useEffect(() => {
    matchesRef.current = matches;
  }, [matches]);

  useEffect(() => {
    if (!authState.user) return undefined;
    let disposed = false;

    async function loadRemoteMatches() {
      try {
        const result = await loadMatches();
        if (!disposed) setMatches(applyScoreCache(result.matches));
      } catch (error) {
        if (!disposed) setMessage(error.message || "Unable to connect to Firebase match data.");
      }
    }

    loadRemoteMatches();
    return () => {
      disposed = true;
    };
  }, [authState.user]);

  useEffect(() => {
    if (!authState.user) return undefined;
    let disposed = false;
    let timerId;

    async function refreshCachedScores() {
      const now = Date.now();
      const cache = readScoreCache();
      const currentMatches = matchesRef.current;
      const pastMissingIds = currentMatches
        .filter((match) => isPastMatch(match, now) && !scoreFor(match) && shouldRetryPastScore(cache.matches[match.matchId], now))
        .map((match) => match.matchId);
      const liveIds = currentMatches
        .filter((match) => isLiveMatch(match, now))
        .map((match) => match.matchId);
      const shouldRefreshLive = liveIds.length > 0 && now - readLiveRefreshAt() >= LIVE_REFRESH_INTERVAL_MS;
      const refreshIds = [...new Set([...pastMissingIds, ...(shouldRefreshLive ? liveIds : [])])];

      if (refreshIds.length > 0) {
        try {
          const remoteMatches = await refreshMatchesByIds(refreshIds);
          if (disposed) return;
          writeScoreCache(remoteMatches, pastMissingIds);
          if (shouldRefreshLive) writeLiveRefreshAt(now);
          setMatches((current) => applyScoreCache(mergeMatchUpdates(current, remoteMatches)));
        } catch (error) {
          if (!disposed) setMessage(error.message || "Unable to load match scores.");
        }
      } else {
        setMatches((current) => applyScoreCache(current));
      }

      timerId = window.setTimeout(refreshCachedScores, LIVE_REFRESH_INTERVAL_MS);
    }

    refreshCachedScores();
    return () => {
      disposed = true;
      if (timerId) window.clearTimeout(timerId);
    };
  }, [authState.user]);

  useEffect(() => {
    writeReminders(reminders);
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return undefined;

    const timers = Object.entries(reminders)
      .filter(([, enabled]) => enabled)
      .map(([matchId]) => matches.find((match) => match.matchId === matchId))
      .filter(Boolean)
      .map((match) => {
        const alertAt = new Date(match.startsAtUtc).getTime() - 15 * 60 * 1000;
        const delay = alertAt - Date.now();
        if (delay < 0 || delay > 24 * 60 * 60 * 1000) return null;
        return window.setTimeout(() => {
          new Notification("TopScore match reminder", {
            body: `${teamName(match.homeTeamCode, match.homePlaceholder)} vs ${teamName(match.awayTeamCode, match.awayPlaceholder)} starts soon.`,
          });
        }, delay);
      })
      .filter(Boolean);

    return () => timers.forEach(window.clearTimeout);
  }, [matches, reminders]);

  const visibleMatches = useMemo(() => {
    return matches.filter((match) => {
      const isPast = isPastMatch(match);
      const matchesTime =
        filter === "all" ||
        (filter === "future" && !isPast) ||
        (filter === "past" && isPast);
      return matchesTime;
    });
  }, [matches, filter]);

  async function openMatch(match) {
    setSelectedMatch(match);
    setDetails(null);
    try {
      setDetails(await loadMatchDetails(match.matchId));
    } catch {
      setDetails(null);
    }
  }

  async function toggleReminder(match) {
    const enabled = !reminders[match.matchId];
    if (enabled && typeof Notification !== "undefined" && Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setMessage("Match reminder saved locally. Browser notifications are not enabled.");
      }
    } else if (enabled && typeof Notification === "undefined") {
      setMessage("Match reminder saved locally. Browser notifications are unavailable here.");
    }
    setReminders((current) => ({ ...current, [match.matchId]: enabled }));
    if (enabled) setMessage("Match reminder saved on this device.");
  }

  return (
    <div className="appShell">
      <main className="mainGrid">
        <section className="phoneSurface">
          <MatchesView
            matches={visibleMatches}
            filter={filter}
            reminders={reminders}
            onFilter={setFilter}
            onMatchInfo={openMatch}
            onReminder={toggleReminder}
          />
        </section>
      </main>

      {selectedMatch && (
        <ScoreModal
          match={selectedMatch}
          details={details}
          reminderEnabled={Boolean(reminders[selectedMatch.matchId])}
          onReminder={() => toggleReminder(selectedMatch)}
          onClose={() => setSelectedMatch(null)}
        />
      )}

      {message && (
        <div className="toast" role="status">
          <span>{message}</span>
          <button onClick={() => setMessage("")} aria-label="Dismiss"><X size={16} /></button>
        </div>
      )}
    </div>
  );
}

function MatchesView({
  matches,
  filter,
  reminders,
  onFilter,
  onMatchInfo,
  onReminder,
}) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const pageStart = (page - 1) * PAGE_SIZE;
  const pagedMatches = matches.slice(pageStart, pageStart + PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  function goToPage(nextPage) {
    const boundedPage = Math.min(Math.max(1, nextPage), pageCount);
    setPage(boundedPage);
    window.scrollTo({ top: 0 });
  }

  return (
    <>
      <div className="bannerRow">
        <button className="brandBanner" type="button" onClick={() => goToPage(1)} aria-label="Go to first page">
          <img className="brandIcon" src="/assets/sports-soccer.svg" alt="" />
          <span className="brandWords">
            <strong>TOP<span>SCORE</span></strong>
            <small>WORLD CUP 2026</small>
          </span>
        </button>
        <div className="storeBlock">
          <div className="promoList" aria-label="TopScore highlights">
            <p className="promoLine">
              <img src="/assets/sports-soccer.svg" alt="" />
              <span>Live scores for World Cup 2026</span>
            </p>
            <p className="promoLine">
              <img src="/assets/sports-soccer.svg" alt="" />
              <span>Community predictions</span>
            </p>
          </div>
          <a className="playStoreButton" href={googlePlayUrl} target="_blank" rel="noreferrer" aria-label="Get TopScore on Google Play">
            <img src="/assets/google-play-store-badge.svg" alt="Get it on Google Play" />
          </a>
        </div>
      </div>

      <div className="segmented" role="tablist" aria-label="Match filters">
        {matchFilters.map(([id, label]) => (
          <button key={id} className={filter === id ? "active" : ""} onClick={() => onFilter(id)}>
            <span className="radioMark" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {matches.length > PAGE_SIZE && (
        <nav className="pagination" aria-label="Match pages">
          <button type="button" onClick={() => goToPage(page - 1)} disabled={page === 1} aria-label="Previous page">
            <ChevronLeft size={22} />
          </button>
          <span className="pageCountText" aria-current="page">Page {page}/{pageCount}</span>
          <button type="button" onClick={() => goToPage(page + 1)} disabled={page === pageCount} aria-label="Next page">
            <ChevronRight size={22} />
          </button>
        </nav>
      )}

      <div className="matchList">
        {matches.length === 0 ? (
          <p className="emptyState">No matches found.</p>
        ) : pagedMatches.map((match) => (
          <MatchCard
            key={match.matchId}
            match={match}
            reminderEnabled={Boolean(reminders[match.matchId])}
            onInfo={() => onMatchInfo(match)}
            onReminder={() => onReminder(match)}
          />
        ))}
      </div>
    </>
  );
}

function MatchCard({ match, reminderEnabled, onInfo, onReminder }) {
  const isLive = isLiveMatch(match);
  const displayScore = scoreFor(match) ?? (isLive ? { home: 0, away: 0 } : null);
  return (
    <article className={`matchCard ${isLive ? "isLive" : ""}`}>
      <div className="matchHeader">
        <div>
          <strong>{stageLabel(match.stage, match.groupLetter)}</strong>
          <span>{formatLongDate(match.startsAtUtc)}</span>
        </div>
        <div className="matchTools">
          <button className="infoButton" onClick={onInfo} aria-label="Match info" title="Match info"><Info size={22} /></button>
          {isLive ? (
            <span className="livePill"><span />Live</span>
          ) : (
            <button onClick={onReminder} className={`reminderButton ${reminderEnabled ? "enabled" : ""}`} aria-label="Toggle match reminder" title="Toggle match reminder">
              {reminderEnabled ? <BellRing size={23} /> : <Bell size={23} />}
            </button>
          )}
        </div>
      </div>

      <div className="teamsRow">
        <TeamBlock code={match.homeTeamCode} placeholder={match.homePlaceholder} />
        <div className="scoreStack">
          <strong>{displayScore ? `${displayScore.home} : ${displayScore.away}` : "- : -"}</strong>
          {isLive && <span>{elapsedMatchClock(match.startsAtUtc)}</span>}
        </div>
        <TeamBlock code={match.awayTeamCode} placeholder={match.awayPlaceholder} right />
      </div>
    </article>
  );
}

function TeamBlock({ code, placeholder, right = false }) {
  const flag = teamFlag(code);
  const name = teamName(code, placeholder).toUpperCase();
  return (
    <div className={`teamBlock ${right ? "right" : ""}`}>
      {flag ? <img src={flag} alt="" loading="lazy" decoding="async" /> : <span className="flagFallback">TBD</span>}
      <strong>{name}</strong>
    </div>
  );
}

function ScoreModal({ match, details, reminderEnabled, onReminder, onClose }) {
  const isLive = isLiveMatch(match);
  const displayScore = scoreFor(match) ?? (isLive ? { home: 0, away: 0 } : null);
  return (
    <div className="modalBackdrop">
      <section className="modal scoreModal">
        <div className="modalHeader">
          <div>
            <strong>{stageLabel(match.stage, match.groupLetter)}</strong>
            <span>{formatLongDate(match.startsAtUtc)}</span>
          </div>
          <button className="closeButton" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <div className="modalScore">
          <TeamBlock code={match.homeTeamCode} placeholder={match.homePlaceholder} />
          <strong>{displayScore ? `${displayScore.home} : ${displayScore.away}` : "- : -"}</strong>
          <TeamBlock code={match.awayTeamCode} placeholder={match.awayPlaceholder} right />
        </div>
        <div className="modalInfo">
          <span>{match.locationDisplayName}</span>
          <span>Status: {details?.statusLong ?? match.status}</span>
          {match.updatedAt && <span>Updated: {formatShortDate(match.updatedAt)}</span>}
        </div>
        <button className="primaryButton" onClick={onReminder}>
          {reminderEnabled ? <BellRing size={18} /> : <Bell size={18} />}
          {reminderEnabled ? "Reminder on" : "Remind me"}
        </button>
      </section>
    </div>
  );
}

function formatLongDate(value) {
  const date = new Date(value);
  const monthDay = new Intl.DateTimeFormat(undefined, { month: "long", day: "numeric" }).format(date);
  const weekday = new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(date);
  const time = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", timeZoneName: "short" }).format(date);
  return `${monthDay}, ${weekday} - ${time}`;
}

function formatShortDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function elapsedMatchClock(value) {
  const minutes = Math.max(1, Math.min(120, Math.floor((Date.now() - new Date(value).getTime()) / 60000) + 1));
  return `${String(minutes).padStart(2, "0")}:00`;
}

function scoreFor(match) {
  const home = numberOrNull(match.homeScore ?? match.actualHomeScore);
  const away = numberOrNull(match.awayScore ?? match.actualAwayScore);
  if (home === null || away === null) return finalScoreFor(match);
  return { home, away };
}

function isPastMatch(match, now = Date.now()) {
  const status = String(match.status ?? "").toUpperCase();
  if (status === "FINISHED") return true;
  if (isLiveMatch(match, now)) return false;
  return new Date(match.startsAtUtc).getTime() < now;
}

function isLiveMatch(match, now = Date.now()) {
  const status = String(match.status ?? "").toUpperCase();
  if (status === "LIVE") return true;
  if (status === "FINISHED") return false;
  const startsAt = new Date(match.startsAtUtc).getTime();
  return startsAt <= now && now < startsAt + LIVE_MATCH_WINDOW_MS;
}

function applyScoreCache(matches) {
  const cache = readScoreCache();
  return matches.map((match) => {
    const cached = cache.matches[match.matchId];
    const homeScore = numberOrNull(cached?.homeScore);
    const awayScore = numberOrNull(cached?.awayScore);
    if (homeScore === null || awayScore === null) return match;
    return {
      ...match,
      status: cached.status ?? match.status,
      actualHomeScore: homeScore,
      actualAwayScore: awayScore,
      updatedAt: cached.updatedAt ?? match.updatedAt,
    };
  });
}

function mergeMatchUpdates(currentMatches, remoteMatches) {
  if (!remoteMatches.length) return currentMatches;
  const remoteById = Object.fromEntries(remoteMatches.map((match) => [match.matchId, match]));
  return currentMatches.map((match) => ({ ...match, ...(remoteById[match.matchId] ?? {}) }));
}

function readScoreCache() {
  try {
    const value = JSON.parse(localStorage.getItem(scoreCacheKey) || "{}");
    return { matches: value.matches && typeof value.matches === "object" ? value.matches : {} };
  } catch {
    return { matches: {} };
  }
}

function writeScoreCache(remoteMatches, attemptedPastIds = []) {
  const now = new Date().toISOString();
  const cache = readScoreCache();
  const nextMatches = { ...cache.matches };

  for (const matchId of attemptedPastIds) {
    nextMatches[matchId] = {
      ...(nextMatches[matchId] ?? {}),
      attemptedAt: now,
    };
  }

  for (const match of remoteMatches) {
    const score = scoreFor(match);
    if (!score) continue;
    nextMatches[match.matchId] = {
      homeScore: score.home,
      awayScore: score.away,
      status: match.status,
      updatedAt: match.updatedAt ?? now,
      attemptedAt: now,
    };
  }

  localStorage.setItem(scoreCacheKey, JSON.stringify({ matches: nextMatches }));
}

function shouldRetryPastScore(cacheEntry, now) {
  if (!cacheEntry?.attemptedAt) return true;
  const attemptedAt = new Date(cacheEntry.attemptedAt).getTime();
  return !Number.isFinite(attemptedAt) || now - attemptedAt >= PAST_SCORE_RETRY_INTERVAL_MS;
}

function readLiveRefreshAt() {
  const value = Number(localStorage.getItem(liveRefreshKey));
  return Number.isFinite(value) ? value : 0;
}

function writeLiveRefreshAt(value) {
  localStorage.setItem(liveRefreshKey, String(value));
}

function numberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function readReminders() {
  try {
    return JSON.parse(localStorage.getItem(reminderKey) || "{}");
  } catch {
    return {};
  }
}

function writeReminders(value) {
  localStorage.setItem(reminderKey, JSON.stringify(value));
}
