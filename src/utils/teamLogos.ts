
// Team logo utility with all MLB and NFL teams
export const getTeamLogo = (teamCode: string): string => {
  const logoMap: { [key: string]: string } = {
    // MLB Teams (30 teams)
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
    
    // Legacy/Alternative MLB codes
    'ATH': 'https://www.mlbstatic.com/team-logos/133.svg', // Oakland Athletics
    
    // NFL Teams (32 teams)
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
    
    // Legacy/Alternative NFL codes
    'GNB': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/k5oxnyitwseuo27mnod9', // Green Bay
    'SFO': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/dxibuyxbk0b9ua5ih9hn', // San Francisco
    'WSH': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/xymxwrxtyj9fhaemhdyd', // Washington
    'OAK': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/gzcojbzcyjgubgyb6xf2', // Las Vegas (formerly Oakland)
    'SD': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/dhfidtn8jrumakbogeu4', // Los Angeles Chargers (formerly San Diego)
    'STL': 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/ayvngv0oygf5ym1p3mhp', // Los Angeles Rams (formerly St. Louis)
    
    // Default fallback
    'default': '/placeholder.svg'
  };

  return logoMap[teamCode?.toUpperCase()] || logoMap['default'];
};

export const formatTeamName = (teamCode: string): string => {
  const teamNames: { [key: string]: string } = {
    // MLB Teams (30 teams)
    'ARI': 'Diamondbacks',
    'ATL': 'Braves',
    'BAL': 'Orioles',
    'BOS': 'Red Sox',
    'CHC': 'Cubs',
    'CWS': 'White Sox',
    'CIN': 'Reds',
    'CLE': 'Guardians',
    'COL': 'Rockies',
    'DET': 'Tigers',
    'HOU': 'Astros',
    'KC': 'Royals',
    'LAA': 'Angels',
    'LAD': 'Dodgers',
    'MIA': 'Marlins',
    'MIL': 'Brewers',
    'MIN': 'Twins',
    'NYM': 'Mets',
    'NYY': 'Yankees',
    'OAK': 'Athletics',
    'PHI': 'Phillies',
    'PIT': 'Pirates',
    'SD': 'Padres',
    'SF': 'Giants',
    'SEA': 'Mariners',
    'STL': 'Cardinals',
    'TB': 'Rays',
    'TEX': 'Rangers',
    'TOR': 'Blue Jays',
    'WSH': 'Nationals',
    
    // Legacy/Alternative MLB codes
    'ATH': 'Athletics',
    
    // NFL Teams (32 teams)
    'ARI': 'Cardinals',
    'ATL': 'Falcons',
    'BAL': 'Ravens',
    'BUF': 'Bills',
    'CAR': 'Panthers',
    'CHI': 'Bears',
    'CIN': 'Bengals',
    'CLE': 'Browns',
    'DAL': 'Cowboys',
    'DEN': 'Broncos',
    'DET': 'Lions',
    'GB': 'Packers',
    'HOU': 'Texans',
    'IND': 'Colts',
    'JAX': 'Jaguars',
    'KC': 'Chiefs',
    'LV': 'Raiders',
    'LAC': 'Chargers',
    'LAR': 'Rams',
    'MIA': 'Dolphins',
    'MIN': 'Vikings',
    'NE': 'Patriots',
    'NO': 'Saints',
    'NYG': 'Giants',
    'NYJ': 'Jets',
    'PHI': 'Eagles',
    'PIT': 'Steelers',
    'SF': '49ers',
    'SEA': 'Seahawks',
    'TB': 'Buccaneers',
    'TEN': 'Titans',
    'WAS': 'Commanders',
    
    // Legacy/Alternative NFL codes
    'GNB': 'Packers',
    'SFO': '49ers',
    'WSH': 'Commanders',
    'OAK': 'Raiders',
    'SD': 'Chargers',
    'STL': 'Rams',
  };

  return teamNames[teamCode?.toUpperCase()] || teamCode;
};
