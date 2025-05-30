// Historical and current team name mappings
export const mlbNameToCode: Record<string, string> = {
  // Current team names
  "Arizona Diamondbacks": "ARI",
  "Atlanta Braves": "ATL",
  "Baltimore Orioles": "BAL",
  "Boston Red Sox": "BOS",
  "Chicago Cubs": "CHC",
  "Chicago White Sox": "CWS",
  "Cincinnati Reds": "CIN",
  "Cleveland Guardians": "CLE",
  "Colorado Rockies": "COL",
  "Detroit Tigers": "DET",
  "Houston Astros": "HOU",
  "Kansas City Royals": "KC",
  "Los Angeles Angels": "LAA",
  "Los Angeles Dodgers": "LAD",
  "Miami Marlins": "MIA",
  "Milwaukee Brewers": "MIL",
  "Minnesota Twins": "MIN",
  "New York Mets": "NYM",
  "New York Yankees": "NYY",
  "Oakland Athletics": "OAK",
  "Athletics": "OAK", // Handle both "Athletics" and "Oakland Athletics"
  "Philadelphia Phillies": "PHI",
  "Pittsburgh Pirates": "PIT",
  "San Diego Padres": "SD",
  "San Francisco Giants": "SF",
  "Seattle Mariners": "SEA",
  "St. Louis Cardinals": "STL",
  "Tampa Bay Rays": "TB",
  "Texas Rangers": "TEX",
  "Toronto Blue Jays": "TOR",
  "Washington Nationals": "WSH",

  // Historical team names - keep original abbreviations for historical accuracy
  "Florida Marlins": "FLA", // 1993-2011 (keep FLA for historical games)
  "Montreal Expos": "MON", // 1969-2004 (keep MON for historical games)
  "Anaheim Angels": "ANA", // 1997-2004 (keep ANA for historical games)
  "Los Angeles Angels of Anaheim": "LAA", // 2005-2015
  "California Angels": "CAL", // 1965-1996 (keep CAL for historical games)
  "Tampa Bay Devil Rays": "TB", // 1998-2007 (use TB since it's same franchise)
  "Cleveland Indians": "CLE", // Pre-2021 (use CLE since it's same franchise)
  
  // Common shortened versions
  "Diamondbacks": "ARI",
  "Braves": "ATL",
  "Orioles": "BAL",
  "Red Sox": "BOS",
  "Cubs": "CHC",
  "White Sox": "CWS",
  "Reds": "CIN",
  "Guardians": "CLE",
  "Indians": "CLE", // Historical
  "Rockies": "COL",
  "Tigers": "DET",
  "Astros": "HOU",
  "Royals": "KC",
  "Angels": "LAA",
  "Dodgers": "LAD",
  "Marlins": "MIA",
  "Brewers": "MIL",
  "Twins": "MIN",
  "Mets": "NYM",
  "Yankees": "NYY",
  "Phillies": "PHI",
  "Pirates": "PIT",
  "Padres": "SD",
  "Giants": "SF",
  "Mariners": "SEA",
  "Cardinals": "STL",
  "Rays": "TB",
  "Devil Rays": "TB", // Historical
  "Rangers": "TEX",
  "Blue Jays": "TOR",
  "Nationals": "WSH",
  "Expos": "MON", // Historical
};

export const nflNameToCode: Record<string, string> = {
  // Current team names
  "Arizona Cardinals": "ARI",
  "Atlanta Falcons": "ATL",
  "Baltimore Ravens": "BAL",
  "Buffalo Bills": "BUF",
  "Carolina Panthers": "CAR",
  "Chicago Bears": "CHI",
  "Cincinnati Bengals": "CIN",
  "Cleveland Browns": "CLE",
  "Dallas Cowboys": "DAL",
  "Denver Broncos": "DEN",
  "Detroit Lions": "DET",
  "Green Bay Packers": "GB",
  "Houston Texans": "HOU",
  "Indianapolis Colts": "IND",
  "Jacksonville Jaguars": "JAX",
  "Kansas City Chiefs": "KC",
  "Las Vegas Raiders": "LV",
  "Los Angeles Chargers": "LAC",
  "Los Angeles Rams": "LAR",
  "Miami Dolphins": "MIA",
  "Minnesota Vikings": "MIN",
  "New England Patriots": "NE",
  "New Orleans Saints": "NO",
  "New York Giants": "NYG",
  "New York Jets": "NYJ",
  "Philadelphia Eagles": "PHI",
  "Pittsburgh Steelers": "PIT",
  "San Francisco 49ers": "SF",
  "Seattle Seahawks": "SEA",
  "Tampa Bay Buccaneers": "TB",
  "Tennessee Titans": "TEN",
  "Washington Commanders": "WAS",

  // Historical team names - keep original abbreviations for historical accuracy
  "Oakland Raiders": "OAK", // 1995-2019 (keep OAK for historical games)
  "San Diego Chargers": "SD", // 1961-2016 (keep SD for historical games)
  "St. Louis Rams": "STL", // 1995-2015 (keep STL for historical games)
  "Washington Redskins": "WAS", // 1937-2019 (use WAS since it's same franchise)
  "Washington Football Team": "WAS", // 2020-2021
  "Houston Oilers": "HOU", // 1960-1996 (keep HOU for historical games)
  "Tennessee Oilers": "TEN", // 1997-1998
  
  // Common shortened versions
  "Cardinals": "ARI",
  "Falcons": "ATL",
  "Ravens": "BAL",
  "Bills": "BUF",
  "Panthers": "CAR",
  "Bears": "CHI",
  "Bengals": "CIN",
  "Browns": "CLE",
  "Cowboys": "DAL",
  "Broncos": "DEN",
  "Lions": "DET",
  "Packers": "GB",
  "Texans": "HOU",
  "Colts": "IND",
  "Jaguars": "JAX",
  "Chiefs": "KC",
  "Raiders": "LV",
  "Chargers": "LAC",
  "Rams": "LAR",
  "Dolphins": "MIA",
  "Vikings": "MIN",
  "Patriots": "NE",
  "Saints": "NO",
  "Giants": "NYG",
  "Jets": "NYJ",
  "Eagles": "PHI",
  "Steelers": "PIT",
  "49ers": "SF",
  "Seahawks": "SEA",
  "Buccaneers": "TB",
  "Titans": "TEN",
  "Commanders": "WAS",
  
  // Legacy abbreviations
  "Redskins": "WAS",
  "Football Team": "WAS",
  "Oilers": "HOU",
};

// Helper function to get historical team abbreviation based on year
export const getHistoricalTeamCode = (teamName: string, league: 'MLB' | 'NFL', gameDate?: string): string => {
  if (!teamName) return teamName;
  
  const nameMap = league === 'MLB' ? mlbNameToCode : nflNameToCode;
  const year = gameDate ? new Date(gameDate).getFullYear() : new Date().getFullYear();
  
  // Handle MLB historical transitions based on year
  if (league === 'MLB') {
    // Montreal Expos → Washington Nationals (2005)
    if (teamName === 'Washington Nationals' && year <= 2004) {
      return 'MON';
    }
    if (teamName === 'Montreal Expos') {
      return 'MON';
    }
    
    // Florida Marlins → Miami Marlins (2012)
    if (teamName === 'Miami Marlins' && year <= 2011) {
      return 'FLA';
    }
    if (teamName === 'Florida Marlins') {
      return 'FLA';
    }
    
    // Angels historical names
    if (teamName.includes('Angels')) {
      if (year >= 2005 && year <= 2015) return 'LAA'; // Los Angeles Angels of Anaheim
      if (year >= 1997 && year <= 2004) return 'ANA'; // Anaheim Angels
      if (year <= 1996) return 'CAL'; // California Angels
      return 'LAA'; // Current
    }
  }
  
  // Handle NFL historical transitions
  if (league === 'NFL') {
    // Oakland Raiders → Las Vegas Raiders (2020)
    if (teamName === 'Las Vegas Raiders' && year <= 2019) {
      return 'OAK';
    }
    if (teamName === 'Oakland Raiders') {
      return 'OAK';
    }
    
    // San Diego Chargers → Los Angeles Chargers (2017)
    if (teamName === 'Los Angeles Chargers' && year <= 2016) {
      return 'SD';
    }
    if (teamName === 'San Diego Chargers') {
      return 'SD';
    }
    
    // St. Louis Rams → Los Angeles Rams (2016)
    if (teamName === 'Los Angeles Rams' && year >= 1995 && year <= 2015) {
      return 'STL';
    }
    if (teamName === 'St. Louis Rams') {
      return 'STL';
    }
  }
  
  // Try exact match first
  if (nameMap[teamName]) {
    return nameMap[teamName];
  }
  
  // Try case-insensitive match
  const lowerName = teamName.toLowerCase();
  const foundEntry = Object.entries(nameMap).find(([key]) => key.toLowerCase() === lowerName);
  if (foundEntry) {
    return foundEntry[1];
  }
  
  // If no match found, return original name
  console.warn(`No team code mapping found for: ${teamName} (${league})`);
  return teamName;
};

// Helper function to normalize team names to abbreviations (legacy function for compatibility)
export const normalizeTeamName = (teamName: string, league: 'MLB' | 'NFL', gameDate?: string): string => {
  return getHistoricalTeamCode(teamName, league, gameDate);
};
