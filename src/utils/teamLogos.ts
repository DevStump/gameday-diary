
// Main utility for team logos and names by league
import { mlbLogos } from './team-logos/mlb-logos';
import { nflLogos, getNFLCanonicalAbbreviation } from './team-logos/nfl-logos';
import { mlbNames } from './team-logos/mlb-names';
import { nflNames } from './team-logos/nfl-names';
import { normalizeTeamName, mlbNameToCode, nflNameToCode } from './team-name-map';

export const getTeamLogo = (teamCode: string, league?: 'MLB' | 'NFL'): string => {
  if (!teamCode) return '/placeholder.svg';
  
  if (league === 'MLB') {
    // First try to normalize the team name to get the correct abbreviation
    const abbr = normalizeTeamName(teamCode, 'MLB');
    return mlbLogos[abbr?.toUpperCase()] || mlbLogos[abbr] || '/placeholder.svg';
  }
  
  if (league === 'NFL') {
    // First try to normalize the team name to get the correct abbreviation
    const abbr = normalizeTeamName(teamCode, 'NFL');
    return nflLogos[abbr?.toUpperCase()] || nflLogos[abbr] || '/placeholder.svg';
  }
  
  const logoMap = league === 'NFL' ? nflLogos : mlbLogos;
  return logoMap[teamCode?.toUpperCase()] || logoMap[teamCode] || '/placeholder.svg';
};

export const getTeamAbbreviation = (teamCode: string, league?: 'MLB' | 'NFL'): string => {
  if (!teamCode) return teamCode;
  
  if (league === 'MLB') {
    // Use the normalized mapping to get consistent abbreviations
    return normalizeTeamName(teamCode, 'MLB');
  }
  
  if (league === 'NFL') {
    // Use the normalized mapping, then get canonical NFL abbreviation
    const normalized = normalizeTeamName(teamCode, 'NFL');
    return getNFLCanonicalAbbreviation(normalized);
  }
  
  return teamCode;
};

export const formatTeamName = (teamCode: string, league?: 'MLB' | 'NFL'): string => {
  if (!teamCode) return teamCode;
  
  if (league === 'MLB') {
    // First normalize to get the correct abbreviation, then get the short name
    const abbr = normalizeTeamName(teamCode, 'MLB');
    return mlbNames[abbr?.toUpperCase()] || mlbNames[abbr] || teamCode;
  }
  
  if (league === 'NFL') {
    // First normalize to get the correct abbreviation, then get canonical abbreviation
    const normalized = normalizeTeamName(teamCode, 'NFL');
    const canonicalAbbr = getNFLCanonicalAbbreviation(normalized);
    return nflNames[canonicalAbbr] || teamCode;
  }
  
  const nameMap = league === 'NFL' ? nflNames : mlbNames;
  return nameMap[teamCode?.toUpperCase()] || nameMap[teamCode] || teamCode;
};
