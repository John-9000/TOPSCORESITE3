const ADJECTIVES = [
  "Rapid", "Golden", "Lucky", "Brave", "Electric", "Clever", "Silent", "Cosmic",
  "Storm", "Velvet", "Neon", "Royal", "Wild", "Prime", "Magic", "Iron",
];

const NOUNS = [
  "Striker", "Keeper", "Captain", "Oracle", "Wizard", "Volley", "Scout", "Tackle",
  "Header", "Whistle", "Boot", "Flag", "Arena", "Dribble", "Corner", "Rocket",
];

export const AVATARS = ["BALL", "BOOT", "NET", "CUP", "VAR", "FLAG", "KIT", "STAR"];

export function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function generatedName(seed) {
  const hash = hashString(seed || "topscore");
  const adjective = ADJECTIVES[hash % ADJECTIVES.length];
  const noun = NOUNS[Math.floor(hash / ADJECTIVES.length) % NOUNS.length];
  const suffix = String(hash % 10000).padStart(4, "0");
  return `${adjective} ${noun} ${suffix}`;
}

export function avatarFor(seed) {
  return AVATARS[hashString(seed) % AVATARS.length];
}
