// Year-based logo mapping for teams that changed logos over time
export interface LogoByYear {
  [teamCode: string]: {
    [yearRange: string]: string; // e.g., "1990-2010": "logo-url"
  };
}

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

export const mlbLogosByYear: LogoByYear = {
  'ARI': {
    '2024-current': 'https://content.sportslogos.net/logos/54/50/full/arizona_diamondbacks_logo_primary_2024_sportslogosnet-3125.png',
    '2012-2023': 'https://content.sportslogos.net/logos/54/50/full/arizona_diamondbacks_logo_primary_20123733.png',
    '2007-2011': 'https://content.sportslogos.net/logos/54/50/full/arizona_diamondbacks_logo_primary_20075619.png',
    '1998-2006': 'https://content.sportslogos.net/logos/54/50/full/arizona_diamondbacks_logo_primary_19981620.png'
  },
  'ATL': {
    '2022-current': 'https://content.sportslogos.net/logos/54/51/full/3kgwjp6heowkeg3w8zoow9ggy.png',
    '2018-2021': 'https://content.sportslogos.net/logos/54/51/full/7150_atlanta_braves-primary-2018.png',
    '1987-2017': 'https://content.sportslogos.net/logos/54/51/full/atlanta_braves_logo_primary_20221869.png',
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
    '1979-current': 'https://content.sportslogos.net/logos/54/54/full/chicago_cubs_logo_primary_19792956.png'
  },
  'CIN': {
    '2013-current': 'https://content.sportslogos.net/logos/54/56/full/cincinnati_reds_logo_primary_20133208.png',
    '1999-2012': 'https://content.sportslogos.net/logos/54/56/full/cincinnati_reds_logo_primary_19997337.png',
  },
  'CLE': {
    '2022-current': 'https://content.sportslogos.net/logos/53/6804/full/cleveland_guardians_logo_primary_20227577.png',
    '2014-2021': 'https://content.sportslogos.net/logos/53/57/full/5347_cleveland_indians-primary-2014.png',
    '1986-2013': 'https://content.sportslogos.net/logos/53/57/full/wnyd2zhh84f50ux4uxyqbktbh.png'
  },
  'COL': {
    '2017-current': 'https://content.sportslogos.net/logos/54/58/full/colorado_rockies_logo_primary_20171892.png',
    '1993-2016': 'https://content.sportslogos.net/logos/54/58/full/colorado_rockies_logo_primary_19932879.png'
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
  'ANA': {
    '2016-current': 'https://content.sportslogos.net/logos/53/6521/full/4389_los_angeles_angels-primary-2016.png',
    '2005-2015': 'https://content.sportslogos.net/logos/53/922/full/wsghhaxkh5qq0hdkbt1b5se41.png',
    '2002-2004': 'https://content.sportslogos.net/logos/53/49/full/anaheim_angels_logo_primary_19973619.png',
    '2000-2001': 'https://content.sportslogos.net/logos/53/49/full/anaheim_angels_logo_primary_19973619.png',
    '1997-1999': 'https://content.sportslogos.net/logos/53/6521/full/california_angels_logo_primary_19653620.png'
  },
  'CAL': {
    '1965-1996': 'https://content.sportslogos.net/logos/53/6521/full/california_angels_logo_primary_19653620.png'
  },
  'LAD': {
    '2012-current': 'https://content.sportslogos.net/logos/54/63/full/los_angeles_dodgers_logo_primary_20127886.png',
    '1979-2011': 'https://content.sportslogos.net/logos/54/63/full/los_angeles_dodgers_logo_primary_19792530.png'
  },
  'MIA': {
    '2019-current': 'https://content.sportslogos.net/logos/54/3637/full/miami_marlins_logo_primary_20194007.png',
    '2017-2018': 'https://content.sportslogos.net/logos/54/3637/full/miami_marlins_logo_primary_20179087.png',
    '2012-2016': 'https://content.sportslogos.net/logos/54/3637/full/miami_marlins_logo_primary_20128805.png',
    '1993-2011': 'https://content.sportslogos.net/logos/54/60/full/florida_marlins_logo_primary_19935464.png'
  },
  'MIL': {
    '2020-current': 'https://content.sportslogos.net/logos/54/64/full/6474_milwaukee_brewers-primary-2020.png',
    '2018-2019': 'https://content.sportslogos.net/logos/54/64/full/milwaukee_brewers_logo_primary_20187469.png',
    '2000-2017': 'https://content.sportslogos.net/logos/54/64/full/milwaukee_brewers_logo_primary_20004922.png'
  },
  'MIN': {
    '2023-current': 'https://content.sportslogos.net/logos/53/65/full/minnesota_twins_logo_primary_2023_sportslogosnet-3953.png',
    '2010-2022': 'https://content.sportslogos.net/logos/53/65/full/minnesota_twins_logo_primary_20102311.png',
    '1994-2009': 'https://content.sportslogos.net/logos/53/65/full/minnesota_twins_logo_primary_1994_sportslogosnet-3849.png'
  },
  'NYM': {
    '1999-current': 'https://content.sportslogos.net/logos/54/67/full/new_york_mets_logo_primary_1999sportslogosnet8711.png'
  },
  'NYY': {
    '1968-current': 'https://content.sportslogos.net/logos/53/68/full/new_york_yankees_logo_primary_19685115.png'
  },
  'OAK': {
    '2025-current': 'https://content.sportslogos.net/logos/53/6921/full/athletics__logo_primary_2025_sportslogosnet-5001.png',
    '1993-2024': 'https://content.sportslogos.net/logos/53/69/full/6xk2lpc36146pbg2kydf13e50.png'
  },
  'PHI': {
    '2019-current': 'https://content.sportslogos.net/logos/54/70/full/philadelphia_phillies_logo_primary_20193931.png',
    '1992-2018': 'https://content.sportslogos.net/logos/54/70/full/philadelphia_phillies_logo_primary_19922235.png'
  },
  'PIT': {
    '2014-current': 'https://content.sportslogos.net/logos/54/71/full/1250_pittsburgh_pirates-primary-2014.png',
    '1997-2013': 'https://content.sportslogos.net/logos/54/71/full/uorovupw0jagctt6iu1huivi9.png'
  },
  'SD': {
    '2020-current': 'https://content.sportslogos.net/logos/54/73/full/7517_san_diego_padres-primary-2020.png',
    '2015-2019': 'https://content.sportslogos.net/logos/54/73/full/4344_san_diego_padres-primary-2015.png',
    '2012-2014': 'https://content.sportslogos.net/logos/54/73/full/ebjtzdtqw33dahm7k8zojhe45.png',
    '2011-2011': 'https://content.sportslogos.net/logos/54/73/full/xsq9eeflri96j9uo52fg1vk6o.png',
    '2004-2010': 'https://content.sportslogos.net/logos/54/73/full/5gasxjdlnb5gfhhgeey3z8aob.png',
    '1992-2003': 'https://content.sportslogos.net/logos/54/73/full/mb1r3sruahwcke10gaxlg8pxr.png'
  },
  'SEA': {
    '1993-current': 'https://content.sportslogos.net/logos/53/75/full/seattle_mariners_logo_primary_19933809.png'
  },
  'SF': {
    '2000-current': 'https://content.sportslogos.net/logos/54/74/full/san_francisco_giants_logo_primary_20002208.png'
  },
  'STL': {
    '1999-current': 'https://content.sportslogos.net/logos/54/72/full/3zhma0aeq17tktge1huh7yok5.png'
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
    '2011-current': 'https://content.sportslogos.net/logos/54/578/full/washington_nationals_logo_primary_20117280.png',
    '2005-2010': 'https://content.sportslogos.net/logos/54/578/full/x1hlmovt2m0mgs7ghwzgu6lht.png',
    '1992-2004': 'https://content.sportslogos.net/logos/54/66/full/montreal_expos_logo_primary_19926140.png'
  },
};

export const nflLogosByYear: LogoByYear = {
  'LV': {
    '2020-current': 'https://static.www.nfl.com/league/api/clubs/logos/LV.svg',
    '1995-2019': 'https://content.sportslogos.net/logos/7/163/full/oakland_raiders_logo_primary_19953088.png'
  },
  'LAC': {
    '2017-current': 'https://static.www.nfl.com/league/api/clubs/logos/LAC.svg',
    '1961-2016': 'https://content.sportslogos.net/logos/7/6446/full/san_diego_chargers_logo_primary_19613089.png'
  },
  'LAR': {
    '2016-current': 'https://static.www.nfl.com/league/api/clubs/logos/LAR.svg',
    '1995-2015': 'https://content.sportslogos.net/logos/7/5941/full/st_louis_rams_logo_primary_19953090.png'
  }
};

// Helper function to resolve team code variations
const resolveTeamCode = (teamCode: string): string => {
  return teamVariations[teamCode?.toUpperCase()] || teamCode;
};

// Helper function to get logo URL based on year
export const getLogoByYear = (teamCode: string, year: number, league: 'MLB' | 'NFL'): string | null => {
  // Resolve team code variations first
  const resolvedTeamCode = resolveTeamCode(teamCode);
  
  const logoMap = league === 'MLB' ? mlbLogosByYear : nflLogosByYear;
  const teamLogos = logoMap[resolvedTeamCode];
  
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

// Function to get all team codes for preloading
export const getAllMLBTeamCodes = (): string[] => {
  return Object.keys(mlbLogosByYear);
};

export const getAllNFLTeamCodes = (): string[] => {
  return Object.keys(nflLogosByYear);
};
