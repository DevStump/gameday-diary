
// Main utility for team logos and names by league
import { nflLogos, getNFLCanonicalAbbreviation } from './team-logos/nfl-logos';
import { mlbNames } from './team-logos/mlb-names';
import { nflNames } from './team-logos/nfl-names';
import { getHistoricalTeamCode } from './team-name-map';
import { getLogoByYear } from './team-logos/logo-by-year';

export const getTeamLogo = (teamCode: string, league?: 'MLB' | 'NFL', gameDate?: string): string => {
  if (!teamCode) return '/placeholder.svg';
  
  // Get historical team code based on game date
  const historicalTeamCode = getHistoricalTeamCode(teamCode, league || 'MLB', gameDate);
  
  // For MLB, always try year-based logos first
  if (league === 'MLB') {
    if (gameDate) {
      const year = new Date(gameDate).getFullYear();
      const yearBasedLogo = getLogoByYear(historicalTeamCode, year, 'MLB');
      if (yearBasedLogo) {
        return yearBasedLogo;
      }
    }
    
    // If no game date provided, try to get current logo (assume current year)
    const currentYear = new Date().getFullYear();
    const currentLogo = getLogoByYear(historicalTeamCode, currentYear, 'MLB');
    if (currentLogo) {
      return currentLogo;
    }
    
    return '/placeholder.svg';
  }
  
  // For NFL, use existing logic with year-based fallback
  if (league === 'NFL') {
    if (gameDate) {
      const year = new Date(gameDate).getFullYear();
      const yearBasedLogo = getLogoByYear(historicalTeamCode, year, 'NFL');
      if (yearBasedLogo) {
        return yearBasedLogo;
      }
    }
    
    return nflLogos[historicalTeamCode?.toUpperCase()] || nflLogos[historicalTeamCode] || '/placeholder.svg';
  }
  
  // Default case - try MLB first, then NFL
  if (gameDate) {
    const year = new Date(gameDate).getFullYear();
    
    // Try MLB first
    const mlbLogo = getLogoByYear(historicalTeamCode, year, 'MLB');
    if (mlbLogo) {
      return mlbLogo;
    }
    
    // Try NFL
    const nflLogo = getLogoByYear(historicalTeamCode, year, 'NFL');
    if (nflLogo) {
      return nflLogo;
    }
  }
  
  // Final fallback to NFL logos for non-league-specific calls
  return nflLogos[historicalTeamCode?.toUpperCase()] || nflLogos[historicalTeamCode] || '/placeholder.svg';
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
