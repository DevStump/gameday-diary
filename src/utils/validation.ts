import { validateAllMappings, validateBoxscoreUrl, MLB_TEAM_MAPPINGS } from './team-mappings';
import { getLogoByYear } from './team-logos/logo-by-year';

// Types for validation results
export interface ValidationResult {
  success: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  summary: {
    totalTeams: number;
    validTeams: number;
    teamsWithErrors: number;
    teamsWithWarnings: number;
  };
}

export interface ValidationError {
  teamCode: string;
  teamName?: string;
  year: number;
  errorType: 'missing_bbref_code' | 'missing_logo' | 'invalid_bbref_url' | 'other';
  message: string;
}

export interface ValidationWarning {
  teamCode: string;
  teamName?: string;
  year: number;
  warningType: 'logo_fallback' | 'other';
  message: string;
}

/**
 * Validates all team mappings for a specific year
 * @param year The year to validate mappings for
 * @returns ValidationResult with details of any issues found
 */
export const validateTeamMappingsForYear = (year: number): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  // Get all mappings for the year
  const { 
    validMappings, 
    invalidMappings, 
    missingBBRefCodes, 
    missingLogoCodes 
  } = validateAllMappings(year);
  
  // Add errors for invalid mappings
  invalidMappings.forEach(team => {
    if (missingBBRefCodes.includes(team.statsApiCode)) {
      errors.push({
        teamCode: team.statsApiCode,
        teamName: team.statsApiName,
        year,
        errorType: 'missing_bbref_code',
        message: `Missing Baseball Reference code for ${team.statsApiName} (${team.statsApiCode})`
      });
    }
    
    if (missingLogoCodes.includes(team.statsApiCode)) {
      errors.push({
        teamCode: team.statsApiCode,
        teamName: team.statsApiName,
        year,
        errorType: 'missing_logo',
        message: `Missing logo code for ${team.statsApiName} (${team.statsApiCode})`
      });
    }
  });
  
  // Validate boxscore URLs for valid mappings
  validMappings.forEach(team => {
    // Create a date string for the middle of the season in the given year
    const dateString = `${year}-06-15`;
    
    // Validate the boxscore URL
    const urlValidation = validateBoxscoreUrl(team.statsApiCode, dateString);
    
    if (!urlValidation.isValid) {
      errors.push({
        teamCode: team.statsApiCode,
        teamName: team.statsApiName,
        year,
        errorType: 'invalid_bbref_url',
        message: `Invalid Baseball Reference URL for ${team.statsApiName}: ${urlValidation.url}`
      });
    }
    
    // Check if logo exists for this team and year
    const logo = getLogoByYear(team.logoCode, year, 'MLB');
    
    if (!logo) {
      warnings.push({
        teamCode: team.statsApiCode,
        teamName: team.statsApiName,
        year,
        warningType: 'logo_fallback',
        message: `No specific logo found for ${team.statsApiName} in ${year}, will use fallback`
      });
    }
  });
  
  // Create summary
  const summary = {
    totalTeams: validMappings.length + invalidMappings.length,
    validTeams: validMappings.length - errors.filter(e => validMappings.some(vm => vm.statsApiCode === e.teamCode)).length,
    teamsWithErrors: [...new Set(errors.map(e => e.teamCode))].length,
    teamsWithWarnings: [...new Set(warnings.map(w => w.teamCode))].length
  };
  
  return {
    success: errors.length === 0,
    errors,
    warnings,
    summary
  };
};

/**
 * Validates team mappings across multiple years
 * @param startYear The first year to validate
 * @param endYear The last year to validate (defaults to current year)
 * @returns Record of validation results by year
 */
export const validateTeamMappingsAcrossYears = (
  startYear: number = 1990, 
  endYear: number = new Date().getFullYear()
): Record<number, ValidationResult> => {
  const results: Record<number, ValidationResult> = {};
  
  for (let year = startYear; year <= endYear; year++) {
    results[year] = validateTeamMappingsForYear(year);
  }
  
  return results;
};

/**
 * Runs a validation of all team mappings and returns a comprehensive report
 * @returns Detailed validation report
 */
export const generateValidationReport = () => {
  const currentYear = new Date().getFullYear();
  
  // Validate current year
  const currentYearValidation = validateTeamMappingsForYear(currentYear);
  
  // Validate historical years (every 5 years)
  const historicalValidations: Record<number, ValidationResult> = {};
  for (let year = 1990; year < currentYear; year += 5) {
    historicalValidations[year] = validateTeamMappingsForYear(year);
  }
  
  // Get all unique teams across all years
  const allTeams = [...new Set(MLB_TEAM_MAPPINGS.map(team => team.statsApiCode))];
  
  return {
    currentYear: currentYearValidation,
    historicalYears: historicalValidations,
    allTeams: allTeams.length,
    summary: {
      totalErrors: currentYearValidation.errors.length + 
                  Object.values(historicalValidations).reduce((sum, val) => sum + val.errors.length, 0),
      totalWarnings: currentYearValidation.warnings.length + 
                    Object.values(historicalValidations).reduce((sum, val) => sum + val.warnings.length, 0)
    }
  };
}; 