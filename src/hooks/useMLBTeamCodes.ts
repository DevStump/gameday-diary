import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Baseball Reference specific team code mappings for historical accuracy
const baseballReferenceOverrides: Record<string, string> = {
  'FLA': 'FLO', // Florida Marlins used FLO on Baseball Reference
  'ANA': 'ANA', // Anaheim Angels
  'CAL': 'CAL', // California Angels
  'MON': 'MON', // Montreal Expos
  // Current teams that use different codes on Baseball Reference
  'LA': 'LAN', // Los Angeles Dodgers (using file_code 'LA')
  'LAD': 'LAN', // Los Angeles Dodgers (alternative code)
  'STL': 'SLN', // St. Louis Cardinals
  'CHC': 'CHN', // Chicago Cubs
  'NYM': 'NYN', // New York Mets
  'SF': 'SFN', // San Francisco Giants
  'SD': 'SDN', // San Diego Padres
  'CWS': 'CHA', // Chicago White Sox
  'NYY': 'NYA', // New York Yankees
  'TB': 'TBA', // Tampa Bay Rays
  'KC': 'KCA', // Kansas City Royals
  'WSH': 'WSN', // Washington Nationals
  'WAS': 'WSN', // Washington Nationals (alternative code)
};

// Year-based overrides for teams that changed codes over time
const getYearBasedCode = (teamCode: string, year?: number): string | null => {
  if (!year) return null;
  
  // Florida Marlins: FLA for 2011 and prior should use FLO on Baseball Reference
  if (teamCode.toUpperCase() === 'FLA' && year <= 2011) {
    return 'FLO';
  }
  
  // Miami Marlins: MIA for 2012+ should stay as MIA (no override needed)
  
  return null;
};

export const useMLBTeamCodes = () => {
  return useQuery({
    queryKey: ['mlb-team-codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mlb_teams')
        .select('team_name, team_code, file_code')
        .order('team_name');

      if (error) {
        console.error('Error fetching MLB team codes:', error);
        throw error;
      }

      // Create a mapping from file_code to team_code (what Baseball Reference uses)
      // Ensure keys are uppercase for consistent lookup
      const teamCodeMap: Record<string, string> = {};
      data?.forEach((team) => {
        if (team.file_code && team.team_code) {
          let bbrefCode = team.team_code;
          
          // Apply Baseball Reference specific overrides
          if (baseballReferenceOverrides[team.file_code.toUpperCase()]) {
            bbrefCode = baseballReferenceOverrides[team.file_code.toUpperCase()];
          }
          
          teamCodeMap[team.file_code.toUpperCase()] = bbrefCode;
        }
      });

      // Add additional mappings for common abbreviation variants
      // This ensures we can lookup teams by any common abbreviation format
      const additionalMappings: Record<string, string> = {
        // Dodgers variants
        'LAD': teamCodeMap['LA'] || 'LAN',
        
        // Marlins variants (current)
        'MIA': 'MIA', // Current Miami Marlins use MIA
        
        // Other common variants that might not be in the database
        'CWS': 'CHA', // Chicago White Sox
        'CHW': 'CHA', // Alternative White Sox code
        'TB': 'TBA',  // Tampa Bay Rays
        'TBR': 'TBA', // Alternative Rays code
        'KC': 'KCA',  // Kansas City Royals
        'KCR': 'KCA', // Alternative Royals code
        'SD': 'SDN',  // San Diego Padres
        'SDP': 'SDN', // Alternative Padres code
        'SF': 'SFN',  // San Francisco Giants
        'SFG': 'SFN', // Alternative Giants code
        'WSH': 'WSN', // Washington Nationals
        'WAS': 'WSN', // Alternative Nationals code
      };

      // Merge additional mappings
      Object.entries(additionalMappings).forEach(([key, value]) => {
        teamCodeMap[key] = value;
      });

      console.log('MLB team code mapping (file_code -> bbref_code):', teamCodeMap);
      return teamCodeMap;
    },
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours since team codes don't change often
  });
};

// Helper function to get the correct Baseball Reference code with year consideration
export const getBaseballReferenceCode = (teamCode: string, gameDate?: string): string => {
  const year = gameDate ? new Date(gameDate).getFullYear() : undefined;
  
  // Check for year-based overrides first
  const yearBasedCode = getYearBasedCode(teamCode, year);
  if (yearBasedCode) {
    return yearBasedCode;
  }
  
  // Fall back to standard overrides
  return baseballReferenceOverrides[teamCode.toUpperCase()] || teamCode;
};
