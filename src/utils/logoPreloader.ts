
import { getAllMLBTeamCodes, getAllNFLTeamCodes, getLogoByYear } from './team-logos/logo-by-year';

export const preloadTeamLogos = () => {
  console.log('Preloading team logos with transparent backgrounds...');
  
  const currentYear = new Date().getFullYear();
  
  // Preload MLB logos
  const mlbTeams = getAllMLBTeamCodes();
  mlbTeams.forEach(team => {
    const logoUrl = getLogoByYear(team, currentYear, 'MLB');
    if (logoUrl && logoUrl !== '/placeholder.svg') {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Help with CORS for better loading
      img.src = logoUrl;
    }
  });

  // Preload NFL logos  
  const nflTeams = getAllNFLTeamCodes();
  nflTeams.forEach(team => {
    const logoUrl = getLogoByYear(team, currentYear, 'NFL');
    if (logoUrl && logoUrl !== '/placeholder.svg') {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Help with CORS for better loading
      img.src = logoUrl;
    }
  });

  console.log('Team logos with transparent backgrounds preloading initiated');
};
