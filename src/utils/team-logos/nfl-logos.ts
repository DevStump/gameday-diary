
// NFL team logos mapping - optimized structure with reliable URLs
const nflTeamLogos = {
  'ARI': {
    variations: ['ARI', 'ari', 'crd'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/ari.png'
  },
  'ATL': {
    variations: ['ATL', 'atl'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/atl.png'
  },
  'BAL': {
    variations: ['BAL', 'bal', 'rav'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/bal.png'
  },
  'BUF': {
    variations: ['BUF', 'buf'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/buf.png'
  },
  'CAR': {
    variations: ['CAR', 'car'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/car.png'
  },
  'CHI': {
    variations: ['CHI', 'chi'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/chi.png'
  },
  'CIN': {
    variations: ['CIN', 'cin'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/cin.png'
  },
  'CLE': {
    variations: ['CLE', 'cle'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/cle.png'
  },
  'DAL': {
    variations: ['DAL', 'dal'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png'
  },
  'DEN': {
    variations: ['DEN', 'den'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/den.png'
  },
  'DET': {
    variations: ['DET', 'det'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/det.png'
  },
  'GB': {
    variations: ['GB', 'GNB', 'gnb'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/gb.png'
  },
  'HOU': {
    variations: ['HOU', 'hou', 'htx'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/hou.png'
  },
  'IND': {
    variations: ['IND', 'ind', 'clt'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/ind.png'
  },
  'JAX': {
    variations: ['JAX', 'jax', 'jac'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/jax.png'
  },
  'KC': {
    variations: ['KC', 'kan'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png'
  },
  'LV': {
    variations: ['LV', 'OAK', 'rai'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/lv.png'
  },
  'LAC': {
    variations: ['LAC', 'SD', 'lac', 'sdg'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/lac.png'
  },
  'LAR': {
    variations: ['LAR', 'STL', 'lar', 'ram'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/lar.png'
  },
  'MIA': {
    variations: ['MIA', 'mia'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/mia.png'
  },
  'MIN': {
    variations: ['MIN', 'min'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/min.png'
  },
  'NE': {
    variations: ['NE', 'nwe'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/ne.png'
  },
  'NO': {
    variations: ['NO', 'nor'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/no.png'
  },
  'NYG': {
    variations: ['NYG', 'nyg'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png'
  },
  'NYJ': {
    variations: ['NYJ', 'nyj'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png'
  },
  'PHI': {
    variations: ['PHI', 'phi'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/phi.png'
  },
  'PIT': {
    variations: ['PIT', 'pit'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/pit.png'
  },
  'SF': {
    variations: ['SF', 'SFO', 'sfo'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png'
  },
  'SEA': {
    variations: ['SEA', 'sea'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png'
  },
  'TB': {
    variations: ['TB', 'tam'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/tb.png'
  },
  'TEN': {
    variations: ['TEN', 'ten', 'oti'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/ten.png'
  },
  'WAS': {
    variations: ['WAS', 'WSH', 'was'],
    url: 'https://a.espncdn.com/i/teamlogos/nfl/500/wsh.png'
  }
};

// Generate the final mapping
export const nflLogos: Record<string, string> = {};

// Generate reverse mapping from variations to primary codes
export const nflVariationToPrimary: Record<string, string> = {};

// Map all variations to their corresponding logo URLs and primary codes
Object.entries(nflTeamLogos).forEach(([primaryCode, teamData]) => {
  teamData.variations.forEach(variation => {
    nflLogos[variation] = teamData.url;
    nflVariationToPrimary[variation] = primaryCode;
  });
});

// Function to get canonical NFL abbreviation
export const getNFLCanonicalAbbreviation = (teamCode: string): string => {
  return nflVariationToPrimary[teamCode] || nflVariationToPrimary[teamCode.toUpperCase()] || nflVariationToPrimary[teamCode.toLowerCase()] || teamCode;
};
