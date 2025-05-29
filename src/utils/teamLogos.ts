
// Team logo utility - you can replace these placeholder images with actual team logos
export const getTeamLogo = (teamCode: string): string => {
  const logoMap: { [key: string]: string } = {
    // MLB Teams - using placeholder images for now
    'ATH': '/placeholder.svg',
    'HOU': '/placeholder.svg',
    'NYY': 'https://content.sportslogos.net/logos/53/68/full/new_york_yankees_logo_primary_19685115.png,
    'BOS': '/placeholder.svg',
    'LAD': '/placeholder.svg',
    'SF': '/placeholder.svg',
    
    // NFL Teams - using placeholder images for now
    'KC': '/placeholder.svg',
    'BUF': '/placeholder.svg',
    'NE': '/placeholder.svg',
    'MIA': '/placeholder.svg',
    'DAL': '/placeholder.svg',
    'NYG': '/placeholder.svg',
    
    // Default fallback
    'default': '/placeholder.svg'
  };

  return logoMap[teamCode?.toUpperCase()] || logoMap['default'];
};

export const formatTeamName = (teamCode: string): string => {
  const teamNames: { [key: string]: string } = {
    // MLB Teams
    'ATH': 'Athletics',
    'HOU': 'Astros',
    'NYY': 'Yankees',
    'BOS': 'Red Sox',
    'LAD': 'Dodgers',
    'SF': 'Giants',
    
    // NFL Teams
    'KC': 'Chiefs',
    'BUF': 'Bills',
    'NE': 'Patriots',
    'MIA': 'Dolphins',
    'DAL': 'Cowboys',
    'NYG': 'Giants',
  };

  return teamNames[teamCode?.toUpperCase()] || teamCode;
};
