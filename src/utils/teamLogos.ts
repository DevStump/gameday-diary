
// Main utility for team logos and names by league
import { mlbLogos } from './team-logos/mlb-logos';
import { nflLogos, getNFLCanonicalAbbreviation } from './team-logos/nfl-logos';
import { mlbNames } from './team-logos/mlb-names';
import { nflNames } from './team-logos/nfl-names';
import { getHistoricalTeamCode } from './team-name-map';

export const getTeamLogo = (teamCode: string, league?: 'MLB' | 'NFL', gameDate?: string): string => {
  if (!teamCode) return '/placeholder.svg';
  
  if (league === 'MLB') {
    // Get historical team code based on game date
    const abbr = getHistoricalTeamCode(teamCode, 'MLB', gameDate);
    return mlbLogos[abbr?.toUpperCase()] || mlbLogos[abbr] || '/placeholder.svg';
  }
  
  if (league === 'NFL') {
    // Get historical team code based on game date
    const abbr = getHistoricalTeamCode(teamCode, 'NFL', gameDate);
    return nflLogos[abbr?.toUpperCase()] || nflLogos[abbr] || '/placeholder.svg';
  }
  
  const logoMap = league === 'NFL' ? nflLogos : mlbLogos;
  return logoMap[teamCode?.toUpperCase()] || logoMap[teamCode] || '/placeholder.svg';
};

export const getTeamAbbreviation = (teamCode: string, league?: 'MLB' | 'NFL', gameDate?: string): string => {
  if (!teamCode) return teamCode;
  
  if (league === 'MLB') {
    // Use historical mapping to get correct abbreviation for the time period
    return getHistoricalTeamCode(teamCode, 'MLB', gameDate);
  }
  
  if (league === 'NFL') {
    // Use historical mapping, then get canonical NFL abbreviation
    const historical = getHistoricalTeamCode(teamCode, 'NFL', gameDate);
    return getNFLCanonicalAbbreviation(historical);
  }
  
  return teamCode;
};

export const formatTeamName = (teamCode: string, league?: 'MLB' | 'NFL', gameDate?: string): string => {
  if (!teamCode) return teamCode;
  
  if (league === 'MLB') {
    // Get historical abbreviation first, then get the short name
    const abbr = getHistoricalTeamCode(teamCode, 'MLB', gameDate);
    return mlbNames[abbr?.toUpperCase()] || mlbNames[abbr] || teamCode;
  }
  
  if (league === 'NFL') {
    // Get historical abbreviation first, then get canonical abbreviation
    const historical = getHistoricalTeamCode(teamCode, 'NFL', gameDate);
    const canonicalAbbr = getNFLCanonicalAbbreviation(historical);
    return nflNames[canonicalAbbr] || teamCode;
  }
  
  const nameMap = league === 'NFL' ? nflNames : mlbNames;
  return nameMap[teamCode?.toUpperCase()] || nameMap[teamCode] || teamCode;
};
