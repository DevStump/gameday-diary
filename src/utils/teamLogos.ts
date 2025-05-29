
// Main utility for team logos and names by league
import { mlbLogos } from './team-logos/mlb-logos';
import { nflLogos } from './team-logos/nfl-logos';
import { mlbNames } from './team-logos/mlb-names';
import { nflNames } from './team-logos/nfl-names';

export const getTeamLogo = (teamCode: string, league?: 'MLB' | 'NFL'): string => {
  const logoMap = league === 'NFL' ? nflLogos : mlbLogos;
  return logoMap[teamCode?.toUpperCase()] || logoMap[teamCode] || '/placeholder.svg';
};

export const formatTeamName = (teamCode: string, league?: 'MLB' | 'NFL'): string => {
  const nameMap = league === 'NFL' ? nflNames : mlbNames;
  return nameMap[teamCode?.toUpperCase()] || nameMap[teamCode] || 'Unknown Team';
};
