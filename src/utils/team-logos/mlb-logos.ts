// MLB team logos mapping - optimized structure with transparent background sources
const logoUrls: Record<string, string> = {
  // Using ESPN logos which typically have transparent backgrounds
  'ARI': 'https://a.espncdn.com/i/teamlogos/mlb/500/ari.png',
  'ATL': 'https://a.espncdn.com/i/teamlogos/mlb/500/atl.png',
  'BAL': 'https://a.espncdn.com/i/teamlogos/mlb/500/bal.png',
  'BOS': 'https://a.espncdn.com/i/teamlogos/mlb/500/bos.png',
  'CHC': 'https://a.espncdn.com/i/teamlogos/mlb/500/chc.png',
  'CWS': 'https://a.espncdn.com/i/teamlogos/mlb/500/cws.png',
  'CIN': 'https://a.espncdn.com/i/teamlogos/mlb/500/cin.png',
  'CLE': 'https://a.espncdn.com/i/teamlogos/mlb/500/cle.png',
  'COL': 'https://a.espncdn.com/i/teamlogos/mlb/500/col.png',
  'DET': 'https://a.espncdn.com/i/teamlogos/mlb/500/det.png',
  'HOU': 'https://a.espncdn.com/i/teamlogos/mlb/500/hou.png',
  'KC': 'https://a.espncdn.com/i/teamlogos/mlb/500/kc.png',
  'LAA': 'https://a.espncdn.com/i/teamlogos/mlb/500/laa.png',
  'LAD': 'https://a.espncdn.com/i/teamlogos/mlb/500/lad.png',
  'MIA': 'https://a.espncdn.com/i/teamlogos/mlb/500/mia.png',
  'MIL': 'https://a.espncdn.com/i/teamlogos/mlb/500/mil.png',
  'MIN': 'https://a.espncdn.com/i/teamlogos/mlb/500/min.png',
  'NYM': 'https://a.espncdn.com/i/teamlogos/mlb/500/nym.png',
  'NYY': 'https://a.espncdn.com/i/teamlogos/mlb/500/nyy.png',
  'OAK': 'https://a.espncdn.com/i/teamlogos/mlb/500/oak.png',
  'PHI': 'https://a.espncdn.com/i/teamlogos/mlb/500/phi.png',
  'PIT': 'https://a.espncdn.com/i/teamlogos/mlb/500/pit.png',
  'SD': 'https://a.espncdn.com/i/teamlogos/mlb/500/sd.png',
  'SF': 'https://a.espncdn.com/i/teamlogos/mlb/500/sf.png',
  'SEA': 'https://a.espncdn.com/i/teamlogos/mlb/500/sea.png',
  'STL': 'https://a.espncdn.com/i/teamlogos/mlb/500/stl.png',
  'TB': 'https://a.espncdn.com/i/teamlogos/mlb/500/tb.png',
  'TEX': 'https://a.espncdn.com/i/teamlogos/mlb/500/tex.png',
  'TOR': 'https://a.espncdn.com/i/teamlogos/mlb/500/tor.png',
  'WSH': 'https://a.espncdn.com/i/teamlogos/mlb/500/wsh.png',
  
  // Historical team logos - keeping SportsLogos.net for these as ESPN doesn't have them
  'MON': 'https://content.sportslogos.net/logos/54/66/full/montreal_expos_logo_primary_19926140.png',
  'FLA': 'https://content.sportslogos.net/logos/54/60/full/florida_marlins_logo_primary_19935464.png',
  'ANA': 'https://content.sportslogos.net/logos/53/49/full/anaheim_angels_logo_primary_19973619.png',
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
  
  // Cleveland Guardians/Indians
  'CLE': 'CLE',
  
  // Colorado Rockies
  'COL': 'COL',
  
  // Detroit Tigers
  'DET': 'DET',
  
  // Houston Astros
  'HOU': 'HOU',
  
  // Kansas City Royals
  'KC': 'KC', 'KCR': 'KC',
  
  // Los Angeles Angels (and historical)
  'LAA': 'LAA', 'ANA': 'ANA', 'CAL': 'CAL',
  
  // Los Angeles Dodgers
  'LAD': 'LAD',
  
  // Miami Marlins / Florida Marlins
  'MIA': 'MIA', 'FLA': 'FLA',
  
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
  
  // Washington Nationals / Montreal Expos
  'WSH': 'WSH', 'WSN': 'WSH', 'MON': 'MON',
};

// Generate the final mapping
export const mlbLogos: Record<string, string> = {};

// Map all variations to their corresponding logo URLs
Object.entries(teamVariations).forEach(([variation, primaryCode]) => {
  mlbLogos[variation] = logoUrls[primaryCode];
});
