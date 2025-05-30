
// Main utility for team logos and names by league
import { mlbLogos } from './team-logos/mlb-logos';
import { nflLogos } from './team-logos/nfl-logos';
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

export const getTeamLogo = (teamCode: string, league?: 'MLB' | 'NFL'): string => {
  if (league === 'MLB') {
    // If it's a full team name, convert to abbreviation first
    const abbr = mlbTeamNameToAbbr[teamCode] || teamCode;
    return mlbLogos[abbr?.toUpperCase()] || mlbLogos[abbr] || '/placeholder.svg';
  }
  
  const logoMap = league === 'NFL' ? nflLogos : mlbLogos;
  return logoMap[teamCode?.toUpperCase()] || logoMap[teamCode] || '/placeholder.svg';
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
  
  const nameMap = league === 'NFL' ? nflNames : mlbNames;
  return nameMap[teamCode?.toUpperCase()] || nameMap[teamCode] || teamCode;
};
