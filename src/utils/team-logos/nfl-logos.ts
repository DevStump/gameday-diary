
// NFL team logos mapping - optimized structure
const logoUrls: Record<string, string> = {
  'ARI': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/u9fltoslqdsyao8cpm0k',
  'ATL': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/d8m7hzpsbrl6pnqht8op',
  'BAL': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/ucsdijmddsqcj1i0nmur',
  'BUF': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/giphcy6ie9mxbnldntsf',
  'CAR': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/ervfzgrqdqpkfcjhu8jq',
  'CHI': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/ra0poua3hivselqbgcbs',
  'CIN': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/okxpteoliyayufypqalq',
  'CLE': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/fgbn8acp4opvyxk13dcy',
  'DAL': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/ieid8hoygzdlmzo0yhqr',
  'DEN': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/t2jwlmj1tmpzcqzf2eav',
  'DET': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/ocvxwnapdvwevupe4tpr',
  'GB': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/k5oxnyitwseuo27mnod9',
  'HOU': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/bpx2n7s8m4u2pz8dbu5m',
  'IND': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/keenyn6qtrzngbcq8bre',
  'JAX': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/qykmj6xgtzpyc7xlzyra',
  'KC': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/ujdzcqep1oxcgbwgz3bz',
  'LV': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/gzcojbzcyjgubgyb6xf2',
  'LAC': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/dhfidtn8jrumakbogeu4',
  'LAR': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/ayvngv0oygf5ym1p3mhp',
  'MIA': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/lits6p8ycth9io9u6dhy',
  'MIN': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/teguylrnqqmfcwxvcmmz',
  'NE': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/moyfxx3dq5pio4aiftnc',
  'NO': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/sk7jkwbuuvmwdfm72cy1',
  'NYG': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/t6mhdmgizi6qhndh8b9p',
  'NYJ': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/ekijosiae96gektbo4iw',
  'PHI': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/puhrqgj71gobgdkdo6uq',
  'PIT': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/xujg9t3escthaxzswjkk',
  'SF': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/dxibuyxbk0b9ua5ih9hn',
  'SEA': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/lcgaue6nzwsmhz7h9zng',
  'TB': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/v8uqiualryypwqgvwcih',
  'TEN': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/pln44vuzugjgipyidsre',
  'WAS': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/xymxwrxtyj9fhaemhdyd',
};

// Team code variations mapping to primary codes
const teamVariations: Record<string, string> = {
  // Arizona Cardinals
  'ARI': 'ARI', 'ari': 'ARI', 'crd': 'ARI',
  
  // Atlanta Falcons
  'ATL': 'ATL', 'atl': 'ATL',
  
  // Baltimore Ravens
  'BAL': 'BAL', 'bal': 'BAL', 'rav': 'BAL',
  
  // Buffalo Bills
  'BUF': 'BUF', 'buf': 'BUF',
  
  // Carolina Panthers
  'CAR': 'CAR', 'car': 'CAR',
  
  // Chicago Bears
  'CHI': 'CHI', 'chi': 'CHI',
  
  // Cincinnati Bengals
  'CIN': 'CIN', 'cin': 'CIN',
  
  // Cleveland Browns
  'CLE': 'CLE', 'cle': 'CLE',
  
  // Dallas Cowboys
  'DAL': 'DAL', 'dal': 'DAL',
  
  // Denver Broncos
  'DEN': 'DEN', 'den': 'DEN',
  
  // Detroit Lions
  'DET': 'DET', 'det': 'DET',
  
  // Green Bay Packers
  'GB': 'GB', 'GNB': 'GB', 'gnb': 'GB',
  
  // Houston Texans
  'HOU': 'HOU', 'hou': 'HOU', 'htx': 'HOU',
  
  // Indianapolis Colts
  'IND': 'IND', 'ind': 'IND', 'clt': 'IND',
  
  // Jacksonville Jaguars
  'JAX': 'JAX', 'jax': 'JAX', 'jac': 'JAX',
  
  // Kansas City Chiefs
  'KC': 'KC', 'kan': 'KC',
  
  // Las Vegas Raiders
  'LV': 'LV', 'OAK': 'LV', 'rai': 'LV',
  
  // Los Angeles Chargers
  'LAC': 'LAC', 'SD': 'LAC', 'lac': 'LAC', 'sdg': 'LAC',
  
  // Los Angeles Rams
  'LAR': 'LAR', 'STL': 'LAR', 'lar': 'LAR', 'ram': 'LAR',
  
  // Miami Dolphins
  'MIA': 'MIA', 'mia': 'MIA',
  
  // Minnesota Vikings
  'MIN': 'MIN', 'min': 'MIN',
  
  // New England Patriots
  'NE': 'NE', 'nwe': 'NE',
  
  // New Orleans Saints
  'NO': 'NO', 'nor': 'NO',
  
  // New York Giants
  'NYG': 'NYG', 'nyg': 'NYG',
  
  // New York Jets
  'NYJ': 'NYJ', 'nyj': 'NYJ',
  
  // Philadelphia Eagles
  'PHI': 'PHI', 'phi': 'PHI',
  
  // Pittsburgh Steelers
  'PIT': 'PIT', 'pit': 'PIT',
  
  // San Francisco 49ers
  'SF': 'SF', 'SFO': 'SF', 'sfo': 'SF',
  
  // Seattle Seahawks
  'SEA': 'SEA', 'sea': 'SEA',
  
  // Tampa Bay Buccaneers
  'TB': 'TB', 'tam': 'TB',
  
  // Tennessee Titans
  'TEN': 'TEN', 'ten': 'TEN', 'oti': 'TEN',
  
  // Washington Commanders
  'WAS': 'WAS', 'WSH': 'WAS', 'was': 'WAS',
};

// Generate the final mapping
export const nflLogos: Record<string, string> = {};

// Map all variations to their corresponding logo URLs
Object.entries(teamVariations).forEach(([variation, primaryCode]) => {
  nflLogos[variation] = logoUrls[primaryCode];
});
