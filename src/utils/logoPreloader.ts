
import { getTeamLogo } from './teamLogos';

// All team codes for both leagues
const MLB_TEAMS = [
  'ARI', 'ATL', 'BAL', 'BOS', 'CHC', 'CWS', 'CIN', 'CLE', 'COL', 'DET',
  'HOU', 'KC', 'LAA', 'LAD', 'MIA', 'MIL', 'MIN', 'NYM', 'NYY', 'OAK',
  'PHI', 'PIT', 'SD', 'SF', 'SEA', 'STL', 'TB', 'TEX', 'TOR', 'WSH'
];

const NFL_TEAMS = [
  'ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI', 'CIN', 'CLE', 'DAL', 'DEN',
  'DET', 'GB', 'HOU', 'IND', 'JAX', 'KC', 'LV', 'LAC', 'LAR', 'MIA',
  'MIN', 'NE', 'NO', 'NYG', 'NYJ', 'PHI', 'PIT', 'SF', 'SEA', 'TB',
  'TEN', 'WAS'
];

export const preloadTeamLogos = () => {
  console.log('Preloading team logos with transparent backgrounds...');
  
  // Preload MLB logos
  MLB_TEAMS.forEach(team => {
    const logoUrl = getTeamLogo(team, 'MLB');
    if (logoUrl !== '/placeholder.svg') {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Help with CORS for better loading
      img.src = logoUrl;
    }
  });

  // Preload NFL logos
  NFL_TEAMS.forEach(team => {
    const logoUrl = getTeamLogo(team, 'NFL');
    if (logoUrl !== '/placeholder.svg') {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Help with CORS for better loading
      img.src = logoUrl;
    }
  });

  console.log('Team logos with transparent backgrounds preloading initiated');
};
