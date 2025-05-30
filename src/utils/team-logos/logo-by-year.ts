
// Year-based logo mapping for teams that changed logos over time
export interface LogoByYear {
  [teamCode: string]: {
    [yearRange: string]: string; // e.g., "1990-2010": "logo-url"
  };
}

export const mlbLogosByYear: LogoByYear = {
  'ARI': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'ATL': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'BAL': {
    '2019-current': 'https://content.sportslogos.net/logos/53/52/full/baltimore_orioles_logo_primary_20195398.png',
    '2009-2018': 'https://content.sportslogos.net/logos/53/52/full/baltimore_orioles_logo_primary_20097723.png',
    '1999-2008': 'https://content.sportslogos.net/logos/53/52/full/baltimore_orioles_logo_primary_19999188.png'
  },
  'BOS': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'CHC': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'CIN': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'CLE': {
    '2014-current': 'https://content.sportslogos.net/logos/53/57/full/5347_cleveland_indians-primary-2014.png',
    '1986-2013': 'https://content.sportslogos.net/logos/53/57/full/wnyd2zhh84f50ux4uxyqbktbh.png'
  },
  'COL': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'CWS': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'DET': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'HOU': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'KC': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'LAA': {
    '2016-current': 'https://www.mlbstatic.com/team-logos/108.svg',
    '2005-2015': 'https://www.mlbstatic.com/team-logos/108.svg',
    '1997-2004': 'https://content.sportslogos.net/logos/53/49/full/anaheim_angels_logo_primary_19973619.png',
    '1965-1996': 'https://content.sportslogos.net/logos/53/6521/full/california_angels_logo_primary_19653620.png'
  },
  'LAD': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'MIA': {
    '2012-current': 'https://www.mlbstatic.com/team-logos/146.svg',
    '1993-2011': 'https://content.sportslogos.net/logos/54/60/full/florida_marlins_logo_primary_19935464.png'
  },
  'MIL': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'MIN': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'NYM': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'NYY': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'OAK': {
    '2025-current': 'https://content.sportslogos.net/logos/53/6921/full/athletics__logo_primary_2025_sportslogosnet-5001.png',
    '1993-2024': 'https://content.sportslogos.net/logos/53/69/full/6xk2lpc36146pbg2kydf13e50.png'
  },
  'PHI': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'PIT': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'SD': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'SEA': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'SF': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'STL': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'TB': {
    '2019-current': 'https://content.sportslogos.net/logos/53/2535/full/tampa_bay_rays_logo_primary_20196768.png',
    '2008-2018': 'https://content.sportslogos.net/logos/53/2535/full/tampa_bay_rays_logo_primary_20085870.png',
    '2001-2007': 'https://content.sportslogos.net/logos/53/76/full/tampa_bay_devil_rays_logo_primary_20011851.png',
    '1998-2000': 'https://content.sportslogos.net/logos/53/76/full/tampa_bay_devil_rays_logo_primary_19982847.png'
  },
  'TEX': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'TOR': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'WSH': {
    '2005-current': 'https://www.mlbstatic.com/team-logos/120.svg',
    '1969-2004': 'https://content.sportslogos.net/logos/54/66/full/montreal_expos_logo_primary_19926140.png'
  },
};


export const nflLogosByYear: LogoByYear = {
  'LV': {
    '2020-current': 'https://static.www.nfl.com/league/api/clubs/logos/LV.svg', // Las Vegas Raiders
    '1995-2019': 'https://content.sportslogos.net/logos/7/163/full/oakland_raiders_logo_primary_19953088.png' // Oakland Raiders
  },
  'LAC': {
    '2017-current': 'https://static.www.nfl.com/league/api/clubs/logos/LAC.svg', // Los Angeles Chargers
    '1961-2016': 'https://content.sportslogos.net/logos/7/6446/full/san_diego_chargers_logo_primary_19613089.png' // San Diego Chargers
  },
  'LAR': {
    '2016-current': 'https://static.www.nfl.com/league/api/clubs/logos/LAR.svg', // Los Angeles Rams
    '1995-2015': 'https://content.sportslogos.net/logos/7/5941/full/st_louis_rams_logo_primary_19953090.png' // St. Louis Rams
  }
};

// Helper function to get logo URL based on year
export const getLogoByYear = (teamCode: string, year: number, league: 'MLB' | 'NFL'): string | null => {
  const logoMap = league === 'MLB' ? mlbLogosByYear : nflLogosByYear;
  const teamLogos = logoMap[teamCode];
  
  if (!teamLogos) {
    return null;
  }
  
  // Find the appropriate year range
  for (const [yearRange, logoUrl] of Object.entries(teamLogos)) {
    if (yearRange === 'current' || yearRange.includes('current')) {
      // Handle "YYYY-current" format
      const startYear = parseInt(yearRange.split('-')[0]);
      if (year >= startYear) {
        return logoUrl;
      }
    } else if (yearRange.includes('-')) {
      // Handle "YYYY-YYYY" format
      const [startYear, endYear] = yearRange.split('-').map(y => parseInt(y));
      if (year >= startYear && year <= endYear) {
        return logoUrl;
      }
    }
  }
  
  return null;
};
