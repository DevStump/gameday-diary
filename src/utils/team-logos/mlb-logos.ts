
// MLB team logos mapping - optimized structure
const logoUrls: Record<string, string> = {
  'ARI': 'https://www.mlbstatic.com/team-logos/109.svg',
  'ATL': 'https://www.mlbstatic.com/team-logos/144.svg',
  'BAL': 'https://www.mlbstatic.com/team-logos/110.svg',
  'BOS': 'https://www.mlbstatic.com/team-logos/111.svg',
  'CHC': 'https://www.mlbstatic.com/team-logos/112.svg',
  'CWS': 'https://www.mlbstatic.com/team-logos/145.svg',
  'CIN': 'https://www.mlbstatic.com/team-logos/113.svg',
  'CLE': 'https://www.mlbstatic.com/team-logos/114.svg',
  'COL': 'https://www.mlbstatic.com/team-logos/115.svg',
  'DET': 'https://www.mlbstatic.com/team-logos/116.svg',
  'HOU': 'https://www.mlbstatic.com/team-logos/117.svg',
  'KC': 'https://www.mlbstatic.com/team-logos/118.svg',
  'LAA': 'https://www.mlbstatic.com/team-logos/108.svg',
  'LAD': 'https://www.mlbstatic.com/team-logos/119.svg',
  'MIA': 'https://www.mlbstatic.com/team-logos/146.svg',
  'MIL': 'https://www.mlbstatic.com/team-logos/158.svg',
  'MIN': 'https://www.mlbstatic.com/team-logos/142.svg',
  'NYM': 'https://www.mlbstatic.com/team-logos/121.svg',
  'NYY': 'https://www.mlbstatic.com/team-logos/147.svg',
  'OAK': 'https://www.mlbstatic.com/team-logos/133.svg',
  'PHI': 'https://www.mlbstatic.com/team-logos/143.svg',
  'PIT': 'https://www.mlbstatic.com/team-logos/134.svg',
  'SD': 'https://www.mlbstatic.com/team-logos/135.svg',
  'SF': 'https://www.mlbstatic.com/team-logos/137.svg',
  'SEA': 'https://www.mlbstatic.com/team-logos/136.svg',
  'STL': 'https://www.mlbstatic.com/team-logos/138.svg',
  'TB': 'https://www.mlbstatic.com/team-logos/139.svg',
  'TEX': 'https://www.mlbstatic.com/team-logos/140.svg',
  'TOR': 'https://www.mlbstatic.com/team-logos/141.svg',
  'WSH': 'https://www.mlbstatic.com/team-logos/120.svg',
};

// Team code variations mapping to primary codes
const teamVariations: Record<string, string> = {
  // Arizona Diamondbacks
  'ARI': 'ARI',
  
  // Atlanta Braves
  'ATL': 'ATL',
  
  // Baltimore Orioles
  'BAL': 'BAL',
  
  // Boston Red Sox
  'BOS': 'BOS',
  
  // Chicago Cubs
  'CHC': 'CHC',
  
  // Chicago White Sox
  'CWS': 'CWS', 'CHW': 'CWS',
  
  // Cincinnati Reds
  'CIN': 'CIN',
  
  // Cleveland Guardians
  'CLE': 'CLE',
  
  // Colorado Rockies
  'COL': 'COL',
  
  // Detroit Tigers
  'DET': 'DET',
  
  // Houston Astros
  'HOU': 'HOU',
  
  // Kansas City Royals
  'KC': 'KC', 'KCR': 'KC',
  
  // Los Angeles Angels
  'LAA': 'LAA',
  
  // Los Angeles Dodgers
  'LAD': 'LAD',
  
  // Miami Marlins
  'MIA': 'MIA',
  
  // Milwaukee Brewers
  'MIL': 'MIL',
  
  // Minnesota Twins
  'MIN': 'MIN',
  
  // New York Mets
  'NYM': 'NYM',
  
  // New York Yankees
  'NYY': 'NYY',
  
  // Oakland Athletics
  'OAK': 'OAK', 'ATH': 'OAK',
  
  // Philadelphia Phillies
  'PHI': 'PHI',
  
  // Pittsburgh Pirates
  'PIT': 'PIT',
  
  // San Diego Padres
  'SD': 'SD', 'SDP': 'SD',
  
  // San Francisco Giants
  'SF': 'SF', 'SFG': 'SF',
  
  // Seattle Mariners
  'SEA': 'SEA',
  
  // St. Louis Cardinals
  'STL': 'STL',
  
  // Tampa Bay Rays
  'TB': 'TB', 'TBR': 'TB',
  
  // Texas Rangers
  'TEX': 'TEX',
  
  // Toronto Blue Jays
  'TOR': 'TOR',
  
  // Washington Nationals
  'WSH': 'WSH', 'WSN': 'WSH',
};

// Generate the final mapping
export const mlbLogos: Record<string, string> = {};

// Map all variations to their corresponding logo URLs
Object.entries(teamVariations).forEach(([variation, primaryCode]) => {
  mlbLogos[variation] = logoUrls[primaryCode];
});
