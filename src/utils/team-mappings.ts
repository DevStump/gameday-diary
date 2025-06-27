// Comprehensive team mapping system for all data sources
// Maps between StatsAPI, Baseball Reference, and SportsLogos.net

// Types for team mapping
export interface TeamMapping {
  statsApiCode: string;      // Primary ID from StatsAPI
  statsApiName: string;      // Full name from StatsAPI
  bbrefCode: string;         // Baseball Reference code
  logoCode: string;          // Code used for SportsLogos.net
  yearsActive: {
    start: number;
    end?: number;            // undefined means "current"
  };
}

// Master mapping table with year ranges
export const MLB_TEAM_MAPPINGS: TeamMapping[] = [
  // Arizona Diamondbacks
  {
    statsApiCode: 'ARI',
    statsApiName: 'Arizona Diamondbacks',
    bbrefCode: 'ARI',
    logoCode: 'ARI',
    yearsActive: { start: 1998 }
  },
  // Atlanta Braves
  {
    statsApiCode: 'ATL',
    statsApiName: 'Atlanta Braves',
    bbrefCode: 'ATL',
    logoCode: 'ATL',
    yearsActive: { start: 1966 }
  },
  // Baltimore Orioles
  {
    statsApiCode: 'BAL',
    statsApiName: 'Baltimore Orioles',
    bbrefCode: 'BAL',
    logoCode: 'BAL',
    yearsActive: { start: 1954 }
  },
  // Boston Red Sox
  {
    statsApiCode: 'BOS',
    statsApiName: 'Boston Red Sox',
    bbrefCode: 'BOS',
    logoCode: 'BOS',
    yearsActive: { start: 1908 }
  },
  // Chicago Cubs
  {
    statsApiCode: 'CHC',
    statsApiName: 'Chicago Cubs',
    bbrefCode: 'CHN',
    logoCode: 'CHC',
    yearsActive: { start: 1903 }
  },
  // Chicago White Sox
  {
    statsApiCode: 'CWS',
    statsApiName: 'Chicago White Sox',
    bbrefCode: 'CHA',
    logoCode: 'CWS',
    yearsActive: { start: 1901 }
  },
  // Cincinnati Reds
  {
    statsApiCode: 'CIN',
    statsApiName: 'Cincinnati Reds',
    bbrefCode: 'CIN',
    logoCode: 'CIN',
    yearsActive: { start: 1882 }
  },
  // Cleveland Guardians (formerly Indians)
  {
    statsApiCode: 'CLE',
    statsApiName: 'Cleveland Guardians',
    bbrefCode: 'CLE',
    logoCode: 'CLE',
    yearsActive: { start: 2022 }
  },
  // Cleveland Indians (historical)
  {
    statsApiCode: 'CLE',
    statsApiName: 'Cleveland Indians',
    bbrefCode: 'CLE',
    logoCode: 'CLE',
    yearsActive: { start: 1915, end: 2021 }
  },
  // Colorado Rockies
  {
    statsApiCode: 'COL',
    statsApiName: 'Colorado Rockies',
    bbrefCode: 'COL',
    logoCode: 'COL',
    yearsActive: { start: 1993 }
  },
  // Detroit Tigers
  {
    statsApiCode: 'DET',
    statsApiName: 'Detroit Tigers',
    bbrefCode: 'DET',
    logoCode: 'DET',
    yearsActive: { start: 1901 }
  },
  // Houston Astros
  {
    statsApiCode: 'HOU',
    statsApiName: 'Houston Astros',
    bbrefCode: 'HOU',
    logoCode: 'HOU',
    yearsActive: { start: 1962 }
  },
  // Kansas City Royals
  {
    statsApiCode: 'KC',
    statsApiName: 'Kansas City Royals',
    bbrefCode: 'KCA',
    logoCode: 'KC',
    yearsActive: { start: 1969 }
  },
  // Los Angeles Angels (current)
  {
    statsApiCode: 'LAA',
    statsApiName: 'Los Angeles Angels',
    bbrefCode: 'ANA',
    logoCode: 'LAA',
    yearsActive: { start: 2016 }
  },
  // Los Angeles Angels of Anaheim (historical)
  {
    statsApiCode: 'LAA',
    statsApiName: 'Los Angeles Angels of Anaheim',
    bbrefCode: 'ANA',
    logoCode: 'LAA',
    yearsActive: { start: 2005, end: 2015 }
  },
  // Anaheim Angels (historical)
  {
    statsApiCode: 'ANA',
    statsApiName: 'Anaheim Angels',
    bbrefCode: 'ANA',
    logoCode: 'ANA',
    yearsActive: { start: 1997, end: 2004 }
  },
  // California Angels (historical)
  {
    statsApiCode: 'CAL',
    statsApiName: 'California Angels',
    bbrefCode: 'CAL',
    logoCode: 'CAL',
    yearsActive: { start: 1965, end: 1996 }
  },
  // Los Angeles Dodgers
  {
    statsApiCode: 'LAD',
    statsApiName: 'Los Angeles Dodgers',
    bbrefCode: 'LAN',
    logoCode: 'LAD',
    yearsActive: { start: 1958 }
  },
  // Miami Marlins (current)
  {
    statsApiCode: 'MIA',
    statsApiName: 'Miami Marlins',
    bbrefCode: 'MIA',
    logoCode: 'MIA',
    yearsActive: { start: 2012 }
  },
  // Florida Marlins (historical)
  {
    statsApiCode: 'FLA',
    statsApiName: 'Florida Marlins',
    bbrefCode: 'FLO',
    logoCode: 'FLA',
    yearsActive: { start: 1993, end: 2011 }
  },
  // Milwaukee Brewers
  {
    statsApiCode: 'MIL',
    statsApiName: 'Milwaukee Brewers',
    bbrefCode: 'MIL',
    logoCode: 'MIL',
    yearsActive: { start: 1970 }
  },
  // Minnesota Twins
  {
    statsApiCode: 'MIN',
    statsApiName: 'Minnesota Twins',
    bbrefCode: 'MIN',
    logoCode: 'MIN',
    yearsActive: { start: 1961 }
  },
  // New York Mets
  {
    statsApiCode: 'NYM',
    statsApiName: 'New York Mets',
    bbrefCode: 'NYN',
    logoCode: 'NYM',
    yearsActive: { start: 1962 }
  },
  // New York Yankees
  {
    statsApiCode: 'NYY',
    statsApiName: 'New York Yankees',
    bbrefCode: 'NYA',
    logoCode: 'NYY',
    yearsActive: { start: 1903 }
  },
  // Oakland Athletics
  {
    statsApiCode: 'OAK',
    statsApiName: 'Oakland Athletics',
    bbrefCode: 'OAK',
    logoCode: 'OAK',
    yearsActive: { start: 1968 }
  },
  // Philadelphia Phillies
  {
    statsApiCode: 'PHI',
    statsApiName: 'Philadelphia Phillies',
    bbrefCode: 'PHI',
    logoCode: 'PHI',
    yearsActive: { start: 1883 }
  },
  // Pittsburgh Pirates
  {
    statsApiCode: 'PIT',
    statsApiName: 'Pittsburgh Pirates',
    bbrefCode: 'PIT',
    logoCode: 'PIT',
    yearsActive: { start: 1882 }
  },
  // San Diego Padres
  {
    statsApiCode: 'SD',
    statsApiName: 'San Diego Padres',
    bbrefCode: 'SDN',
    logoCode: 'SD',
    yearsActive: { start: 1969 }
  },
  // San Francisco Giants
  {
    statsApiCode: 'SF',
    statsApiName: 'San Francisco Giants',
    bbrefCode: 'SFN',
    logoCode: 'SF',
    yearsActive: { start: 1958 }
  },
  // Seattle Mariners
  {
    statsApiCode: 'SEA',
    statsApiName: 'Seattle Mariners',
    bbrefCode: 'SEA',
    logoCode: 'SEA',
    yearsActive: { start: 1977 }
  },
  // St. Louis Cardinals
  {
    statsApiCode: 'STL',
    statsApiName: 'St. Louis Cardinals',
    bbrefCode: 'SLN',
    logoCode: 'STL',
    yearsActive: { start: 1900 }
  },
  // Tampa Bay Rays (current)
  {
    statsApiCode: 'TB',
    statsApiName: 'Tampa Bay Rays',
    bbrefCode: 'TBA',
    logoCode: 'TB',
    yearsActive: { start: 2008 }
  },
  // Tampa Bay Devil Rays (historical)
  {
    statsApiCode: 'TB',
    statsApiName: 'Tampa Bay Devil Rays',
    bbrefCode: 'TBA',
    logoCode: 'TB',
    yearsActive: { start: 1998, end: 2007 }
  },
  // Texas Rangers
  {
    statsApiCode: 'TEX',
    statsApiName: 'Texas Rangers',
    bbrefCode: 'TEX',
    logoCode: 'TEX',
    yearsActive: { start: 1972 }
  },
  // Toronto Blue Jays
  {
    statsApiCode: 'TOR',
    statsApiName: 'Toronto Blue Jays',
    bbrefCode: 'TOR',
    logoCode: 'TOR',
    yearsActive: { start: 1977 }
  },
  // Washington Nationals (current)
  {
    statsApiCode: 'WSH',
    statsApiName: 'Washington Nationals',
    bbrefCode: 'WSN',
    logoCode: 'WSH',
    yearsActive: { start: 2005 }
  },
  // Montreal Expos (historical)
  {
    statsApiCode: 'MON',
    statsApiName: 'Montreal Expos',
    bbrefCode: 'MON',
    logoCode: 'MON',
    yearsActive: { start: 1969, end: 2004 }
  },
];

// Helper functions

// Get the correct mapping for a team by statsApiCode and year
export const getTeamMapping = (teamCode: string, year: number): TeamMapping | undefined => {
  return MLB_TEAM_MAPPINGS.find(team => 
    team.statsApiCode === teamCode && 
    team.yearsActive.start <= year && 
    (team.yearsActive.end === undefined || team.yearsActive.end >= year)
  );
};

// Get Baseball Reference code for a team
export const getBBRefCode = (teamCode: string, date?: string): string => {
  if (!teamCode) return teamCode;
  
  const year = date ? new Date(date).getFullYear() : new Date().getFullYear();
  const mapping = getTeamMapping(teamCode, year);
  
  return mapping?.bbrefCode || teamCode;
};

// Generate a Baseball Reference boxscore URL
export const generateBoxscoreUrl = (homeTeamCode: string, date: string, gameNumber: string = '0'): string => {
  const year = new Date(date).getFullYear();
  const bbrefCode = getBBRefCode(homeTeamCode, date);
  
  // Format date for Baseball Reference URL (YYYYMMDD)
  const formattedDate = date.replace(/-/g, '');
  
  return `https://www.baseball-reference.com/boxes/${bbrefCode}/${bbrefCode}${formattedDate}${gameNumber}.shtml`;
};

// Get logo code for a team
export const getLogoCode = (teamCode: string, date?: string): string => {
  if (!teamCode) return teamCode;
  
  const year = date ? new Date(date).getFullYear() : new Date().getFullYear();
  const mapping = getTeamMapping(teamCode, year);
  
  return mapping?.logoCode || teamCode;
};

// Validate that a team has proper mappings for all systems
export const validateTeamMapping = (teamCode: string, date?: string): {
  isValid: boolean;
  statsApiCode: string;
  bbrefCode: string;
  logoCode: string;
  mapping?: TeamMapping;
} => {
  if (!teamCode) {
    return { isValid: false, statsApiCode: '', bbrefCode: '', logoCode: '' };
  }
  
  const year = date ? new Date(date).getFullYear() : new Date().getFullYear();
  const mapping = getTeamMapping(teamCode, year);
  
  if (!mapping) {
    return { 
      isValid: false, 
      statsApiCode: teamCode, 
      bbrefCode: getBBRefCode(teamCode, date), 
      logoCode: getLogoCode(teamCode, date)
    };
  }
  
  return {
    isValid: true,
    statsApiCode: mapping.statsApiCode,
    bbrefCode: mapping.bbrefCode,
    logoCode: mapping.logoCode,
    mapping
  };
};

// Utility to validate boxscore URL generation
export const validateBoxscoreUrl = (homeTeamCode: string, date: string, gameNumber: string = '0'): {
  isValid: boolean;
  url: string;
  teamMapping: ReturnType<typeof validateTeamMapping>;
} => {
  const teamMapping = validateTeamMapping(homeTeamCode, date);
  const url = generateBoxscoreUrl(homeTeamCode, date, gameNumber);
  
  // A valid URL should contain the correct Baseball Reference team code
  const isValid = teamMapping.isValid && url.includes(teamMapping.bbrefCode);
  
  return {
    isValid,
    url,
    teamMapping
  };
};

// Utility to validate all mappings in the system
export const validateAllMappings = (year: number = new Date().getFullYear()): {
  validMappings: TeamMapping[];
  invalidMappings: TeamMapping[];
  missingBBRefCodes: string[];
  missingLogoCodes: string[];
} => {
  const validMappings: TeamMapping[] = [];
  const invalidMappings: TeamMapping[] = [];
  const missingBBRefCodes: string[] = [];
  const missingLogoCodes: string[] = [];
  
  // Filter to only teams active in the given year
  const activeTeams = MLB_TEAM_MAPPINGS.filter(
    team => team.yearsActive.start <= year && 
           (team.yearsActive.end === undefined || team.yearsActive.end >= year)
  );
  
  activeTeams.forEach(team => {
    // Check if Baseball Reference code is valid
    if (!team.bbrefCode) {
      missingBBRefCodes.push(team.statsApiCode);
      invalidMappings.push(team);
    } 
    // Check if Logo code is valid
    else if (!team.logoCode) {
      missingLogoCodes.push(team.statsApiCode);
      invalidMappings.push(team);
    }
    else {
      validMappings.push(team);
    }
  });
  
  return {
    validMappings,
    invalidMappings,
    missingBBRefCodes,
    missingLogoCodes
  };
}; 