
// Year-based logo mapping for teams that changed logos over time
export interface LogoByYear {
  [teamCode: string]: {
    [yearRange: string]: string; // e.g., "1990-2010": "logo-url"
  };
}

export const mlbLogosByYear: LogoByYear = {
  'MIA': {
    '2012-current': 'https://www.mlbstatic.com/team-logos/146.svg', // Miami Marlins
    '1993-2011': 'https://content.sportslogos.net/logos/54/60/full/florida_marlins_logo_primary_19935464.png' // Florida Marlins
  },
  'LAA': {
    '2016-current': 'https://www.mlbstatic.com/team-logos/108.svg', // Los Angeles Angels
    '2005-2015': 'https://www.mlbstatic.com/team-logos/108.svg', // Los Angeles Angels of Anaheim
    '1997-2004': 'https://content.sportslogos.net/logos/53/49/full/anaheim_angels_logo_primary_19973619.png', // Anaheim Angels
    '1965-1996': 'https://content.sportslogos.net/logos/53/6521/full/california_angels_logo_primary_19653620.png' // California Angels
  },
  'WSH': {
    '2005-current': 'https://www.mlbstatic.com/team-logos/120.svg', // Washington Nationals
    '1969-2004': 'https://content.sportslogos.net/logos/54/66/full/montreal_expos_logo_primary_19926140.png' // Montreal Expos
  },
  'TB': {
    '2008-current': 'https://www.mlbstatic.com/team-logos/139.svg', // Tampa Bay Rays
    '1998-2007': 'https://content.sportslogos.net/logos/54/3020/full/tampa_bay_devil_rays_logo_primary_19985456.png' // Tampa Bay Devil Rays
  },
  'CLE': {
    '2022-current': 'https://www.mlbstatic.com/team-logos/114.svg', // Cleveland Guardians
    '1915-2021': 'https://content.sportslogos.net/logos/54/57/full/cleveland_indians_logo_primary_19485457.png' // Cleveland Indians
  }
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
