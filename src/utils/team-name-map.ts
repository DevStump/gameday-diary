
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

  // Historical team names → normalize to modern abbreviation
  "Florida Marlins": "MIA", // 1993-2011
  "Montreal Expos": "WSH", // 1969-2004 (became Nationals in 2005)
  "Anaheim Angels": "LAA", // 1997-2004
  "Los Angeles Angels of Anaheim": "LAA", // 2005-2015
  "California Angels": "LAA", // 1965-1996
  "Tampa Bay Devil Rays": "TB", // 1998-2007 (became Rays in 2008)
  "Cleveland Indians": "CLE", // Pre-2021 (became Guardians in 2022)
  
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
  "Expos": "WSH", // Historical
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

  // Historical team names → normalize to modern abbreviation
  "Oakland Raiders": "LV", // 1995-2019 (moved to Las Vegas in 2020)
  "San Diego Chargers": "LAC", // 1961-2016 (moved to LA in 2017)
  "St. Louis Rams": "LAR", // 1995-2015 (moved back to LA in 2016)
  "Washington Redskins": "WAS", // 1937-2019
  "Washington Football Team": "WAS", // 2020-2021
  "Houston Oilers": "TEN", // 1960-1996 (became Titans in 1999)
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
  "Oilers": "TEN",
};

// Helper function to normalize team names to abbreviations
export const normalizeTeamName = (teamName: string, league: 'MLB' | 'NFL'): string => {
  if (!teamName) return teamName;
  
  const nameMap = league === 'MLB' ? mlbNameToCode : nflNameToCode;
  
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
