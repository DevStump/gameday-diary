import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { validateTeamMappingsForYear, generateValidationReport } from '@/utils/validation';
import { MLB_TEAM_MAPPINGS } from '@/utils/team-mappings';

const Admin = () => {
  const { user } = useAuth();
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState<any>(null);
  const [activeYear, setActiveYear] = useState<number>(new Date().getFullYear());
  const [validationTab, setValidationTab] = useState<string>('current');

  const runValidation = async () => {
    setIsValidating(true);
    
    // Small delay to allow UI to update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      const report = generateValidationReport();
      setValidationResults(report);
    } catch (error) {
      console.error('Error running validation:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleYearChange = (year: number) => {
    setActiveYear(year);
  };

  // Get unique years from team mappings for the dropdown
  const getUniqueYears = () => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    
    // Add current year and every 5 years back to 1990
    years.push(currentYear);
    for (let year = currentYear - (currentYear % 5); year >= 1990; year -= 5) {
      if (!years.includes(year)) {
        years.push(year);
      }
    }
    
    // Add important years for team changes
    const specialYears = [2022, 2012, 2008, 2005, 1998, 1993];
    specialYears.forEach(year => {
      if (!years.includes(year) && year <= currentYear) {
        years.push(year);
      }
    });
    
    return years.sort((a, b) => b - a); // Sort descending
  };

  const getResultsForYear = (year: number) => {
    if (!validationResults) return null;
    
    if (year === new Date().getFullYear()) {
      return validationResults.currentYear;
    }
    
    return validationResults.historicalYears[year];
  };

  const renderValidationStatus = () => {
    if (!validationResults) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
          <p className="text-lg font-medium text-gray-700">No validation has been run yet</p>
          <p className="text-gray-500 mt-2">Click the button above to validate team mappings</p>
        </div>
      );
    }

    const currentYearResults = validationResults.currentYear;
    const hasErrors = currentYearResults.errors.length > 0;
    const hasWarnings = currentYearResults.warnings.length > 0;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Validation Summary</h3>
            <p className="text-sm text-gray-500">
              {validationResults.allTeams} total teams across all years
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {!hasErrors ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                All Valid
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center">
                <XCircle className="h-3 w-3 mr-1" />
                {validationResults.summary.totalErrors} Errors
              </Badge>
            )}
            
            {hasWarnings && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {validationResults.summary.totalWarnings} Warnings
              </Badge>
            )}
          </div>
        </div>

        <Tabs defaultValue={validationTab} onValueChange={setValidationTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="current">Current Year</TabsTrigger>
            <TabsTrigger value="historical">Historical</TabsTrigger>
            <TabsTrigger value="errors">Issues</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current">
            {renderYearResults(new Date().getFullYear())}
          </TabsContent>
          
          <TabsContent value="historical">
            <div className="mb-4 flex flex-wrap gap-2">
              {getUniqueYears().map(year => (
                <Button 
                  key={year} 
                  variant={year === activeYear ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleYearChange(year)}
                >
                  {year}
                </Button>
              ))}
            </div>
            {renderYearResults(activeYear)}
          </TabsContent>
          
          <TabsContent value="errors">
            {renderIssuesList()}
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  const renderYearResults = (year: number) => {
    const results = getResultsForYear(year);
    if (!results) return <p>No data for {year}</p>;

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{year} Teams</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {results.summary.validTeams} / {results.summary.totalTeams} valid
            </span>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team</TableHead>
              <TableHead>StatsAPI</TableHead>
              <TableHead>BBRef</TableHead>
              <TableHead>Logo</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MLB_TEAM_MAPPINGS
              .filter(team => 
                team.yearsActive.start <= year && 
                (team.yearsActive.end === undefined || team.yearsActive.end >= year)
              )
              .sort((a, b) => a.statsApiName.localeCompare(b.statsApiName))
              .map(team => {
                const hasError = results.errors.some(e => e.teamCode === team.statsApiCode);
                const hasWarning = results.warnings.some(w => w.teamCode === team.statsApiCode);
                
                return (
                  <TableRow key={`${team.statsApiCode}-${year}`}>
                    <TableCell>{team.statsApiName}</TableCell>
                    <TableCell>{team.statsApiCode}</TableCell>
                    <TableCell>{team.bbrefCode}</TableCell>
                    <TableCell>{team.logoCode}</TableCell>
                    <TableCell>
                      {hasError ? (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Error</Badge>
                      ) : hasWarning ? (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Warning</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Valid</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderIssuesList = () => {
    if (!validationResults) return null;
    
    const allErrors: any[] = [
      ...validationResults.currentYear.errors,
      ...Object.values(validationResults.historicalYears).flatMap((result: any) => result.errors)
    ];
    
    const allWarnings: any[] = [
      ...validationResults.currentYear.warnings,
      ...Object.values(validationResults.historicalYears).flatMap((result: any) => result.warnings)
    ];
    
    return (
      <div className="space-y-6">
        {allErrors.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-red-700">Errors</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Issue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allErrors.map((error, index) => (
                  <TableRow key={`error-${index}`}>
                    <TableCell>{error.teamName || error.teamCode}</TableCell>
                    <TableCell>{error.year}</TableCell>
                    <TableCell>{error.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {allWarnings.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-amber-700">Warnings</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Issue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allWarnings.map((warning, index) => (
                  <TableRow key={`warning-${index}`}>
                    <TableCell>{warning.teamName || warning.teamCode}</TableCell>
                    <TableCell>{warning.year}</TableCell>
                    <TableCell>{warning.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {allErrors.length === 0 && allWarnings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-lg font-medium text-gray-700">No issues found</p>
            <p className="text-gray-500 mt-2">All team mappings are valid across all years</p>
          </div>
        )}
      </div>
    );
  };

  if (!user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="destructive">
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You must be logged in to access the admin area.
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Team Mapping Validation</span>
                <Button 
                  onClick={runValidation} 
                  disabled={isValidating}
                  className="ml-auto"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    'Validate Mappings'
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderValidationStatus()}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Admin; 