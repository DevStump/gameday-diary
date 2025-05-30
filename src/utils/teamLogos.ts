
// Main utility for team logos and names by league
import { mlbLogos } from './team-logos/mlb-logos';
import { nflLogos, getNFLCanonicalAbbreviation } from './team-logos/nfl-logos';
import { mlbNames } from './team-logos/mlb-names';
import { nflNames } from './team-logos/nfl-names';

// Map full team names to abbreviations for MLB
const mlbTeamNameToAbbr: Record<string, string> = {
  'Arizona Diamondbacks': 'ARI',
  'Atlanta Braves': 'ATL',
  'Baltimore Orioles': 'BAL',
  'Boston Red Sox': 'BOS',
  'Chicago Cubs': 'CHC',
  'Chicago White Sox': 'CWS',
  'Cincinnati Reds': 'CIN',
  'Cleveland Guardians': 'CLE',
  'Colorado Rockies': 'COL',
  'Detroit Tigers': 'DET',
  'Houston Astros': 'HOU',
  'Kansas City Royals': 'KC',
  'Los Angeles Angels': 'LAA',
  'Los Angeles Dodgers': 'LAD',
  'Miami Marlins': 'MIA',
  'Milwaukee Brewers': 'MIL',
  'Minnesota Twins': 'MIN',
  'New York Mets': 'NYM',
  'New York Yankees': 'NYY',
  'Oakland Athletics': 'OAK',
  'Athletics': 'OAK', // Handle both "Athletics" and "Oakland Athletics"
  'Philadelphia Phillies': 'PHI',
  'Pittsburgh Pirates': 'PIT',
  'San Diego Padres': 'SD',
  'San Francisco Giants': 'SF',
  'Seattle Mariners': 'SEA',
  'St. Louis Cardinals': 'STL',
  'Tampa Bay Rays': 'TB',
  'Texas Rangers': 'TEX',
  'Toronto Blue Jays': 'TOR',
  'Washington Nationals': 'WSH'
};

// Map full team names to abbreviations for NFL
const nflTeamNameToAbbr: Record<string, string> = {
  'Arizona Cardinals': 'ARI',
  'Atlanta Falcons': 'ATL',
  'Baltimore Ravens': 'BAL',
  'Buffalo Bills': 'BUF',
  'Carolina Panthers': 'CAR',
  'Chicago Bears': 'CHI',
  'Cincinnati Bengals': 'CIN',
  'Cleveland Browns': 'CLE',
  'Dallas Cowboys': 'DAL',
  'Denver Broncos': 'DEN',
  'Detroit Lions': 'DET',
  'Green Bay Packers': 'GB',
  'Houston Texans': 'HOU',
  'Indianapolis Colts': 'IND',
  'Jacksonville Jaguars': 'JAX',
  'Kansas City Chiefs': 'KC',
  'Las Vegas Raiders': 'LV',
  'Los Angeles Chargers': 'LAC',
  'Los Angeles Rams': 'LAR',
  'Miami Dolphins': 'MIA',
  'Minnesota Vikings': 'MIN',
  'New England Patriots': 'NE',
  'New Orleans Saints': 'NO',
  'New York Giants': 'NYG',
  'New York Jets': 'NYJ',
  'Philadelphia Eagles': 'PHI',
  'Pittsburgh Steelers': 'PIT',
  'San Francisco 49ers': 'SF',
  'Seattle Seahawks': 'SEA',
  'Tampa Bay Buccaneers': 'TB',
  'Tennessee Titans': 'TEN',
  'Washington Commanders': 'WAS'
};

export const getTeamLogo = (teamCode: string, league?: 'MLB' | 'NFL'): string => {
  if (league === 'MLB') {
    // If it's a full team name, convert to abbreviation first
    const abbr = mlbTeamNameToAbbr[teamCode] || teamCode;
    return mlbLogos[abbr?.toUpperCase()] || mlbLogos[abbr] || '/placeholder.svg';
  }
  
  if (league === 'NFL') {
    // If it's a full team name, convert to abbreviation first
    const abbr = nflTeamNameToAbbr[teamCode] || teamCode;
    return nflLogos[abbr?.toUpperCase()] || nflLogos[abbr] || '/placeholder.svg';
  }
  
  const logoMap = league === 'NFL' ? nflLogos : mlbLogos;
  return logoMap[teamCode?.toUpperCase()] || logoMap[teamCode] || '/placeholder.svg';
};

export const getTeamAbbreviation = (teamCode: string, league?: 'MLB' | 'NFL'): string => {
  if (league === 'MLB') {
    // If it's a full team name, convert to abbreviation
    const abbr = mlbTeamNameToAbbr[teamCode];
    if (abbr) return abbr;
    // If it's already an abbreviation, return as is
    return teamCode;
  }
  
  if (league === 'NFL') {
    // If it's a full team name, convert to abbreviation
    const abbr = nflTeamNameToAbbr[teamCode];
    if (abbr) return abbr;
    // Get canonical NFL abbreviation for any variation
    return getNFLCanonicalAbbreviation(teamCode);
  }
  
  return teamCode;
};

export const formatTeamName = (teamCode: string, league?: 'MLB' | 'NFL'): string => {
  if (league === 'MLB') {
    // If it's already a full team name, return the short version
    if (mlbTeamNameToAbbr[teamCode]) {
      const abbr = mlbTeamNameToAbbr[teamCode];
      return mlbNames[abbr] || teamCode;
    }
    // Otherwise treat as abbreviation
    return mlbNames[teamCode?.toUpperCase()] || mlbNames[teamCode] || teamCode;
  }
  
  if (league === 'NFL') {
    // Get canonical abbreviation first for NFL
    const canonicalAbbr = getNFLCanonicalAbbreviation(teamCode);
    return nflNames[canonicalAbbr] || teamCode;
  }
  
  const nameMap = league === 'NFL' ? nflNames : mlbNames;
  return nameMap[teamCode?.toUpperCase()] || nameMap[teamCode] || teamCode;
};
