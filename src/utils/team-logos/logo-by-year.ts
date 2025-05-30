
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
    '2009-current': 'https://content.sportslogos.net/logos/53/53/full/boston_red_sox_logo_primary_20097510.png',
    '1976-2008': 'https://content.sportslogos.net/logos/53/53/full/boston_red_sox_logo_primary_19768800.png'
  },
  'CHC': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'CIN': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'CLE': {
    '2022-current': 'https://content.sportslogos.net/logos/53/6804/full/cleveland_guardians_logo_primary_20227577.png',
    '2014-2021': 'https://content.sportslogos.net/logos/53/57/full/5347_cleveland_indians-primary-2014.png',
    '1986-2013': 'https://content.sportslogos.net/logos/53/57/full/wnyd2zhh84f50ux4uxyqbktbh.png'
  },
  'COL': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'CWS': {
    '1991-current': 'https://content.sportslogos.net/logos/53/55/full/chicago_white_sox_logo_primary_19911413.png'
  },
  'DET': {
    '2016-current': 'https://content.sportslogos.net/logos/53/59/full/detroit_tigers_logo_primary_20162109.png',
    '2006-2015': 'https://content.sportslogos.net/logos/53/59/full/detroit_tigers_logo_primary_20062241.png',
    '1994-2005': 'https://content.sportslogos.net/logos/53/59/full/detroit_tigers_logo_primary_19941509.png'
  },
  'HOU': {
    '2013-current': 'https://content.sportslogos.net/logos/53/4929/full/houston_astros_logo_primary_20137038.png',
    '2000-2012': 'https://content.sportslogos.net/logos/54/61/full/houston_astros_logo_primary_20001925.png'
  },
  'KC': {
    '2019-current': 'https://content.sportslogos.net/logos/53/62/full/kansas_city_royals_logo_primary_20198736.png',
    '2002-2018': 'https://content.sportslogos.net/logos/53/62/full/kansas_city_royals_logo_primary_20028542.png',
    '1993-2001': 'https://content.sportslogos.net/logos/53/62/full/kansas_city_royals_logo_primary_19932555.png'
  },
  'LAA': {
    '2016-current': 'https://content.sportslogos.net/logos/53/6521/full/4389_los_angeles_angels-primary-2016.png',
    '2005-2015': 'https://content.sportslogos.net/logos/53/922/full/wsghhaxkh5qq0hdkbt1b5se41.png',
    '2002-2004': 'https://content.sportslogos.net/logos/53/49/full/anaheim_angels_logo_primary_19973619.png',
    '1997-2001': 'https://content.sportslogos.net/logos/53/6521/full/california_angels_logo_primary_19653620.png'
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
    '2023-current': 'https://content.sportslogos.net/logos/53/65/full/minnesota_twins_logo_primary_2023_sportslogosnet-3953.png',
    '2010-2022': 'https://content.sportslogos.net/logos/53/65/full/minnesota_twins_logo_primary_20102311.png',
    '1994-2009': 'https://content.sportslogos.net/logos/53/65/full/minnesota_twins_logo_primary_1994_sportslogosnet-3849.png'
  },
  'NYM': {
    '2000-current': 'https://content.sportslogos.net/logos/'
  },
  'NYY': {
    '1968-current': 'https://content.sportslogos.net/logos/53/68/full/new_york_yankees_logo_primary_19685115.png'
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
    '1993-current': 'https://content.sportslogos.net/logos/53/75/full/seattle_mariners_logo_primary_19933809.png'
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
    '2024-current': 'https://content.sportslogos.net/logos/53/77/full/texas_rangers_logo_primary_2024_sportslogosnet-5505.png',
    '2003-2023': 'https://content.sportslogos.net/logos/53/77/full/ajfeh4oqeealq37er15r3673h.png',
    '1994-2002': 'https://content.sportslogos.net/logos/53/77/full/iujd65xfkrfaovlu1hzd17kst.png'

  },
  'TOR': {
    '2020-current': 'https://content.sportslogos.net/logos/53/78/full/toronto_blue_jays_logo_primary_20208446.png',
    '2012-2019': 'https://content.sportslogos.net/logos/53/78/full/toronto_blue_jays_logo_primary_20129486.png',
    '2004-2011': 'https://content.sportslogos.net/logos/53/78/full/toronto_blue_jays_logo_primary_20041790.png',
    '2003-2003': 'https://content.sportslogos.net/logos/53/78/full/toronto_blue_jays_logo_primary_20032287.png',
    '1997-2002': 'https://content.sportslogos.net/logos/53/78/full/toronto_blue_jays_logo_primary_19975318.png',
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
