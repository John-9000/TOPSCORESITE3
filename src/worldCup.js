export const TEAMS = [
  ["MEX", "Mexico", "A"], ["RSA", "South Africa", "A"], ["KOR", "Korea Republic", "A"], ["CZE", "Czechia", "A"],
  ["CAN", "Canada", "B"], ["BIH", "Bosnia and Herzegovina", "B"], ["QAT", "Qatar", "B"], ["SUI", "Switzerland", "B"],
  ["BRA", "Brazil", "C"], ["MAR", "Morocco", "C"], ["HAI", "Haiti", "C"], ["SCO", "Scotland", "C"],
  ["USA", "United States", "D"], ["PAR", "Paraguay", "D"], ["AUS", "Australia", "D"], ["TUR", "Turkey", "D"],
  ["GER", "Germany", "E"], ["CUW", "Curacao", "E"], ["CIV", "Cote d'Ivoire", "E"], ["ECU", "Ecuador", "E"],
  ["NED", "Netherlands", "F"], ["JPN", "Japan", "F"], ["SWE", "Sweden", "F"], ["TUN", "Tunisia", "F"],
  ["BEL", "Belgium", "G"], ["EGY", "Egypt", "G"], ["IRN", "IR Iran", "G"], ["NZL", "New Zealand", "G"],
  ["ESP", "Spain", "H"], ["CPV", "Cabo Verde", "H"], ["KSA", "Saudi Arabia", "H"], ["URU", "Uruguay", "H"],
  ["FRA", "France", "I"], ["SEN", "Senegal", "I"], ["IRQ", "Iraq", "I"], ["NOR", "Norway", "I"],
  ["ARG", "Argentina", "J"], ["ALG", "Algeria", "J"], ["AUT", "Austria", "J"], ["JOR", "Jordan", "J"],
  ["POR", "Portugal", "K"], ["COD", "Congo DR", "K"], ["UZB", "Uzbekistan", "K"], ["COL", "Colombia", "K"],
  ["ENG", "England", "L"], ["CRO", "Croatia", "L"], ["GHA", "Ghana", "L"], ["PAN", "Panama", "L"],
].map(([code, name, group]) => ({ code, name, group, flag: `/flags/flag_${code.toLowerCase()}.png` }));

export const TEAMS_BY_CODE = Object.fromEntries(TEAMS.map((team) => [team.code, team]));

const groupRows = [
  [1, "2026-06-11T19:00:00Z", "A", "MEX", "RSA", "Estadio Azteca", "Mexico City", "Mexico"],
  [2, "2026-06-12T02:00:00Z", "A", "KOR", "CZE", "Estadio Akron", "Guadalajara", "Mexico"],
  [3, "2026-06-12T19:00:00Z", "B", "CAN", "BIH", "BMO Field", "Toronto", "Canada"],
  [4, "2026-06-13T01:00:00Z", "D", "USA", "PAR", "SoFi Stadium", "Los Angeles", "USA"],
  [5, "2026-06-13T04:00:00Z", "D", "AUS", "TUR", "BC Place", "Vancouver", "Canada"],
  [6, "2026-06-13T19:00:00Z", "B", "QAT", "SUI", "Levi's Stadium", "San Francisco", "USA"],
  [7, "2026-06-13T22:00:00Z", "C", "BRA", "MAR", "MetLife Stadium", "New York/New Jersey", "USA"],
  [8, "2026-06-14T01:00:00Z", "C", "HAI", "SCO", "Gillette Stadium", "Boston", "USA"],
  [9, "2026-06-14T17:00:00Z", "E", "GER", "CUW", "NRG Stadium", "Houston", "USA"],
  [10, "2026-06-14T20:00:00Z", "F", "NED", "JPN", "AT&T Stadium", "Dallas", "USA"],
  [11, "2026-06-14T23:00:00Z", "E", "CIV", "ECU", "Lincoln Financial Field", "Philadelphia", "USA"],
  [12, "2026-06-15T02:00:00Z", "F", "SWE", "TUN", "Estadio BBVA", "Monterrey", "Mexico"],
  [13, "2026-06-15T16:00:00Z", "H", "ESP", "CPV", "Mercedes-Benz Stadium", "Atlanta", "USA"],
  [14, "2026-06-15T19:00:00Z", "G", "BEL", "EGY", "Lumen Field", "Seattle", "USA"],
  [15, "2026-06-15T22:00:00Z", "H", "KSA", "URU", "Hard Rock Stadium", "Miami", "USA"],
  [16, "2026-06-16T01:00:00Z", "G", "IRN", "NZL", "SoFi Stadium", "Los Angeles", "USA"],
  [17, "2026-06-16T19:00:00Z", "I", "FRA", "SEN", "MetLife Stadium", "New York/New Jersey", "USA"],
  [18, "2026-06-16T22:00:00Z", "I", "IRQ", "NOR", "Gillette Stadium", "Boston", "USA"],
  [19, "2026-06-17T01:00:00Z", "J", "ARG", "ALG", "Arrowhead Stadium", "Kansas City", "USA"],
  [20, "2026-06-17T04:00:00Z", "J", "AUT", "JOR", "Levi's Stadium", "San Francisco", "USA"],
  [21, "2026-06-17T17:00:00Z", "K", "POR", "COD", "NRG Stadium", "Houston", "USA"],
  [22, "2026-06-17T20:00:00Z", "L", "ENG", "CRO", "AT&T Stadium", "Dallas", "USA"],
  [23, "2026-06-17T23:00:00Z", "L", "GHA", "PAN", "BMO Field", "Toronto", "Canada"],
  [24, "2026-06-18T02:00:00Z", "K", "UZB", "COL", "Estadio Azteca", "Mexico City", "Mexico"],
  [25, "2026-06-18T16:00:00Z", "A", "CZE", "RSA", "Mercedes-Benz Stadium", "Atlanta", "USA"],
  [26, "2026-06-18T19:00:00Z", "B", "SUI", "BIH", "SoFi Stadium", "Los Angeles", "USA"],
  [27, "2026-06-18T22:00:00Z", "B", "CAN", "QAT", "BC Place", "Vancouver", "Canada"],
  [28, "2026-06-19T01:00:00Z", "A", "MEX", "KOR", "Estadio Akron", "Guadalajara", "Mexico"],
  [29, "2026-06-19T04:00:00Z", "D", "TUR", "PAR", "Levi's Stadium", "San Francisco", "USA"],
  [30, "2026-06-19T19:00:00Z", "D", "USA", "AUS", "Lumen Field", "Seattle", "USA"],
  [31, "2026-06-19T22:00:00Z", "C", "SCO", "MAR", "Gillette Stadium", "Boston", "USA"],
  [32, "2026-06-20T01:00:00Z", "C", "BRA", "HAI", "Lincoln Financial Field", "Philadelphia", "USA"],
  [33, "2026-06-20T04:00:00Z", "F", "TUN", "JPN", "Estadio BBVA", "Monterrey", "Mexico"],
  [34, "2026-06-20T17:00:00Z", "F", "NED", "SWE", "NRG Stadium", "Houston", "USA"],
  [35, "2026-06-20T20:00:00Z", "E", "GER", "CIV", "BMO Field", "Toronto", "Canada"],
  [36, "2026-06-21T00:00:00Z", "E", "ECU", "CUW", "Arrowhead Stadium", "Kansas City", "USA"],
  [37, "2026-06-21T16:00:00Z", "H", "ESP", "KSA", "Mercedes-Benz Stadium", "Atlanta", "USA"],
  [38, "2026-06-21T19:00:00Z", "G", "BEL", "IRN", "SoFi Stadium", "Los Angeles", "USA"],
  [39, "2026-06-21T22:00:00Z", "H", "URU", "CPV", "Hard Rock Stadium", "Miami", "USA"],
  [40, "2026-06-22T01:00:00Z", "G", "NZL", "EGY", "BC Place", "Vancouver", "Canada"],
  [41, "2026-06-22T17:00:00Z", "J", "ARG", "AUT", "AT&T Stadium", "Dallas", "USA"],
  [42, "2026-06-22T21:00:00Z", "I", "FRA", "IRQ", "Lincoln Financial Field", "Philadelphia", "USA"],
  [43, "2026-06-23T00:00:00Z", "I", "NOR", "SEN", "MetLife Stadium", "New York/New Jersey", "USA"],
  [44, "2026-06-23T03:00:00Z", "J", "JOR", "ALG", "Levi's Stadium", "San Francisco", "USA"],
  [45, "2026-06-23T17:00:00Z", "K", "POR", "UZB", "NRG Stadium", "Houston", "USA"],
  [46, "2026-06-23T20:00:00Z", "L", "ENG", "GHA", "Gillette Stadium", "Boston", "USA"],
  [47, "2026-06-23T23:00:00Z", "L", "PAN", "CRO", "BMO Field", "Toronto", "Canada"],
  [48, "2026-06-24T02:00:00Z", "K", "COL", "COD", "Estadio Akron", "Guadalajara", "Mexico"],
  [49, "2026-06-24T19:00:00Z", "B", "SUI", "CAN", "BC Place", "Vancouver", "Canada"],
  [50, "2026-06-24T19:00:00Z", "B", "BIH", "QAT", "Lumen Field", "Seattle", "USA"],
  [51, "2026-06-24T22:00:00Z", "C", "SCO", "BRA", "Hard Rock Stadium", "Miami", "USA"],
  [52, "2026-06-24T22:00:00Z", "C", "MAR", "HAI", "Mercedes-Benz Stadium", "Atlanta", "USA"],
  [53, "2026-06-25T01:00:00Z", "A", "CZE", "MEX", "Estadio Azteca", "Mexico City", "Mexico"],
  [54, "2026-06-25T01:00:00Z", "A", "RSA", "KOR", "Estadio BBVA", "Monterrey", "Mexico"],
  [55, "2026-06-25T20:00:00Z", "E", "CUW", "CIV", "Lincoln Financial Field", "Philadelphia", "USA"],
  [56, "2026-06-25T20:00:00Z", "E", "ECU", "GER", "MetLife Stadium", "New York/New Jersey", "USA"],
  [57, "2026-06-25T23:00:00Z", "F", "JPN", "SWE", "AT&T Stadium", "Dallas", "USA"],
  [58, "2026-06-25T23:00:00Z", "F", "TUN", "NED", "Arrowhead Stadium", "Kansas City", "USA"],
  [59, "2026-06-26T02:00:00Z", "D", "TUR", "USA", "SoFi Stadium", "Los Angeles", "USA"],
  [60, "2026-06-26T02:00:00Z", "D", "PAR", "AUS", "Levi's Stadium", "San Francisco", "USA"],
  [61, "2026-06-26T19:00:00Z", "I", "NOR", "FRA", "Gillette Stadium", "Boston", "USA"],
  [62, "2026-06-26T19:00:00Z", "I", "SEN", "IRQ", "BMO Field", "Toronto", "Canada"],
  [63, "2026-06-27T00:00:00Z", "H", "CPV", "KSA", "NRG Stadium", "Houston", "USA"],
  [64, "2026-06-27T00:00:00Z", "H", "URU", "ESP", "Estadio Akron", "Guadalajara", "Mexico"],
  [65, "2026-06-27T03:00:00Z", "G", "EGY", "IRN", "Lumen Field", "Seattle", "USA"],
  [66, "2026-06-27T03:00:00Z", "G", "NZL", "BEL", "BC Place", "Vancouver", "Canada"],
  [67, "2026-06-27T21:00:00Z", "L", "PAN", "ENG", "MetLife Stadium", "New York/New Jersey", "USA"],
  [68, "2026-06-27T21:00:00Z", "L", "CRO", "GHA", "Lincoln Financial Field", "Philadelphia", "USA"],
  [69, "2026-06-27T23:30:00Z", "K", "COL", "POR", "Hard Rock Stadium", "Miami", "USA"],
  [70, "2026-06-27T23:30:00Z", "K", "COD", "UZB", "Mercedes-Benz Stadium", "Atlanta", "USA"],
  [71, "2026-06-28T02:00:00Z", "J", "ALG", "AUT", "Arrowhead Stadium", "Kansas City", "USA"],
  [72, "2026-06-28T02:00:00Z", "J", "JOR", "ARG", "AT&T Stadium", "Dallas", "USA"],
];

const knockoutRows = [
  [73, "ROUND_OF_32", "2026-06-28T19:00:00Z", "Group A runner-up", "Group B runner-up", "SoFi Stadium", "Los Angeles", "USA"],
  [74, "ROUND_OF_32", "2026-06-29T17:00:00Z", "Group C winner", "Group F runner-up", "BMO Field", "Toronto", "Canada"],
  [75, "ROUND_OF_32", "2026-06-29T20:30:00Z", "Group E winner", "Third place A/B/C/D/F", "AT&T Stadium", "Dallas", "USA"],
  [76, "ROUND_OF_32", "2026-06-30T01:00:00Z", "Group F winner", "Group C runner-up", "Estadio Azteca", "Mexico City", "Mexico"],
  [77, "ROUND_OF_32", "2026-06-30T17:00:00Z", "Group E runner-up", "Group I runner-up", "Lumen Field", "Seattle", "USA"],
  [78, "ROUND_OF_32", "2026-06-30T21:00:00Z", "Group I winner", "Third place C/D/F/G/H", "Mercedes-Benz Stadium", "Atlanta", "USA"],
  [79, "ROUND_OF_32", "2026-07-01T01:00:00Z", "Group A winner", "Third place C/E/F/H/I", "Estadio Azteca", "Mexico City", "Mexico"],
  [80, "ROUND_OF_32", "2026-07-01T16:00:00Z", "Group L winner", "Third place E/H/I/J/K", "Mercedes-Benz Stadium", "Atlanta", "USA"],
  [81, "ROUND_OF_32", "2026-07-01T20:00:00Z", "Group G winner", "Third place A/E/H/I/J", "Levi's Stadium", "San Francisco", "USA"],
  [82, "ROUND_OF_32", "2026-07-02T00:00:00Z", "Group D winner", "Third place B/E/F/I/J", "Lumen Field", "Seattle", "USA"],
  [83, "ROUND_OF_32", "2026-07-02T19:00:00Z", "Group H winner", "Group J runner-up", "Hard Rock Stadium", "Miami", "USA"],
  [84, "ROUND_OF_32", "2026-07-02T23:00:00Z", "Group K runner-up", "Group L runner-up", "BC Place", "Vancouver", "Canada"],
  [85, "ROUND_OF_32", "2026-07-03T03:00:00Z", "Group B winner", "Third place E/F/G/I/J", "Estadio BBVA", "Monterrey", "Mexico"],
  [86, "ROUND_OF_32", "2026-07-03T18:00:00Z", "Group D runner-up", "Group G runner-up", "Gillette Stadium", "Boston", "USA"],
  [87, "ROUND_OF_32", "2026-07-03T22:00:00Z", "Group J winner", "Group H runner-up", "Lincoln Financial Field", "Philadelphia", "USA"],
  [88, "ROUND_OF_32", "2026-07-04T01:30:00Z", "Group K winner", "Third place D/E/I/J/L", "NRG Stadium", "Houston", "USA"],
  [89, "ROUND_OF_16", "2026-07-04T17:00:00Z", "Winner match 73", "Winner match 76", "NRG Stadium", "Houston", "USA"],
  [90, "ROUND_OF_16", "2026-07-04T21:00:00Z", "Winner match 75", "Winner match 78", "Lincoln Financial Field", "Philadelphia", "USA"],
  [91, "ROUND_OF_16", "2026-07-05T20:00:00Z", "Winner match 74", "Winner match 77", "MetLife Stadium", "New York/New Jersey", "USA"],
  [92, "ROUND_OF_16", "2026-07-06T00:00:00Z", "Winner match 79", "Winner match 80", "Estadio Azteca", "Mexico City", "Mexico"],
  [93, "ROUND_OF_16", "2026-07-06T19:00:00Z", "Winner match 84", "Winner match 83", "AT&T Stadium", "Dallas", "USA"],
  [94, "ROUND_OF_16", "2026-07-07T00:00:00Z", "Winner match 82", "Winner match 81", "Lumen Field", "Seattle", "USA"],
  [95, "ROUND_OF_16", "2026-07-07T16:00:00Z", "Winner match 87", "Winner match 86", "Mercedes-Benz Stadium", "Atlanta", "USA"],
  [96, "ROUND_OF_16", "2026-07-07T20:00:00Z", "Winner match 85", "Winner match 88", "BC Place", "Vancouver", "Canada"],
  [97, "QUARTER_FINAL", "2026-07-09T20:00:00Z", "Winner match 90", "Winner match 89", "Gillette Stadium", "Boston", "USA"],
  [98, "QUARTER_FINAL", "2026-07-10T19:00:00Z", "Winner match 93", "Winner match 94", "SoFi Stadium", "Los Angeles", "USA"],
  [99, "QUARTER_FINAL", "2026-07-11T21:00:00Z", "Winner match 91", "Winner match 92", "Hard Rock Stadium", "Miami", "USA"],
  [100, "QUARTER_FINAL", "2026-07-12T01:00:00Z", "Winner match 95", "Winner match 96", "Arrowhead Stadium", "Kansas City", "USA"],
  [101, "SEMI_FINAL", "2026-07-14T19:00:00Z", "Winner match 97", "Winner match 98", "AT&T Stadium", "Dallas", "USA"],
  [102, "SEMI_FINAL", "2026-07-15T19:00:00Z", "Winner match 99", "Winner match 100", "Mercedes-Benz Stadium", "Atlanta", "USA"],
  [103, "THIRD_PLACE", "2026-07-18T21:00:00Z", "Loser match 101", "Loser match 102", "Hard Rock Stadium", "Miami", "USA"],
  [104, "FINAL", "2026-07-19T19:00:00Z", "Winner match 101", "Winner match 102", "MetLife Stadium", "New York/New Jersey", "USA"],
];

function matchId(number) {
  return `wc2026-m${String(number).padStart(3, "0")}`;
}

function lockAt(startsAtUtc) {
  return new Date(new Date(startsAtUtc).getTime() - 60 * 1000).toISOString();
}

function groupMatch([number, startsAtUtc, groupLetter, homeTeamCode, awayTeamCode, stadiumName, city, country]) {
  return {
    matchId: matchId(number),
    matchNumber: number,
    stage: "GROUP",
    groupLetter,
    homeTeamCode,
    awayTeamCode,
    homePlaceholder: null,
    awayPlaceholder: null,
    startsAtUtc,
    lockAtUtc: lockAt(startsAtUtc),
    stadiumName,
    city,
    country,
    locationDisplayName: `${stadiumName}, ${city}, ${country}`,
    status: "SCHEDULED",
  };
}

function knockoutMatch([number, stage, startsAtUtc, homePlaceholder, awayPlaceholder, stadiumName, city, country]) {
  return {
    matchId: matchId(number),
    matchNumber: number,
    stage,
    groupLetter: null,
    homeTeamCode: null,
    awayTeamCode: null,
    homePlaceholder,
    awayPlaceholder,
    startsAtUtc,
    lockAtUtc: lockAt(startsAtUtc),
    stadiumName,
    city,
    country,
    locationDisplayName: `${stadiumName}, ${city}, ${country}`,
    status: "SCHEDULED",
  };
}

export const BASE_MATCHES = [...groupRows.map(groupMatch), ...knockoutRows.map(knockoutMatch)];
export const MATCHES_BY_ID = Object.fromEntries(BASE_MATCHES.map((match) => [match.matchId, match]));

export function stageLabel(stage, groupLetter) {
  if (stage === "GROUP") return `Group ${groupLetter}`;
  return stage.split("_").map((part) => part[0] + part.slice(1).toLowerCase()).join(" ");
}

export function teamName(code, fallback = "TBD") {
  return code ? (TEAMS_BY_CODE[code]?.name ?? code) : fallback;
}

export function teamFlag(code) {
  return code && TEAMS_BY_CODE[code] ? TEAMS_BY_CODE[code].flag : null;
}

export function mergeMatches(remoteMatches) {
  const remoteById = Object.fromEntries(remoteMatches.map((match) => [match.matchId, match]));
  return BASE_MATCHES.map((base) => ({ ...base, ...(remoteById[base.matchId] ?? {}) }))
    .sort((a, b) => new Date(a.startsAtUtc) - new Date(b.startsAtUtc));
}
