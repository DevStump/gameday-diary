import React from 'react';
import Layout from '@/components/Layout';
import { User, TrendingUp, Star, Calendar, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useProfileStats } from '@/hooks/useProfileStats';
import { formatTeamName, getTeamLogo, getTeamAbbreviation } from '@/utils/teamLogos';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const { data: stats, isLoading } = useProfileStats();
  const { user, signOut } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading your summary...</div>
        </div>
      </Layout>
    );
  }

  // Show empty state if no games logged
  if (!stats || stats.totalGames === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <User className="h-10 w-10 text-field-green" />
              <h1 className="text-4xl font-bold text-gray-900">Summary</h1>
            </div>
            <p className="text-lg text-gray-600">
              Track your most-watched teams, top venues, ratings, and game totals — all in one place.
            </p>
          </div>

          {/* Empty State */}
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No games logged yet</h3>
            <p className="text-gray-600 mb-6">Start building your game diary by adding games you've watched or attended.</p>
            <Link to="/">
              <Button className="bg-field-green hover:bg-field-dark">
                <Plus className="h-4 w-4 mr-2" />
                Browse Games
              </Button>
            </Link>
          </div>

          {/* User Info and Sign Out */}
          {user && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">{user.email}</p>
                <Button variant="outline" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  const winPercentage = stats.winRecord.wins + stats.winRecord.losses > 0 
    ? (stats.winRecord.wins / (stats.winRecord.wins + stats.winRecord.losses)) * 100 
    : 0;

  // Data for Watched vs Attended pie chart
  const attendanceData = [
    { name: 'Watched', value: stats.gamesWatched, color: '#16a34a' },
    { name: 'Attended', value: stats.gamesAttended, color: '#ca8a04' },
  ];

  const chartConfig = {
    watched: { label: 'Watched', color: '#16a34a' },
    attended: { label: 'Attended', color: '#ca8a04' },
  };

  // Get the count for most supported team
  const mostSupportedTeamCount = stats.mostSupportedTeam !== 'N/A' 
    ? Object.entries(stats.teamBreakdown).find(([team]) => team === stats.mostSupportedTeam)?.[1] || 0
    : 0;

  // Get the count for most visited venue  
  const mostVisitedVenueCount = stats.mostVisitedVenue !== 'N/A'
    ? stats.venueBreakdown.find(([venue]) => venue === stats.mostVisitedVenue)?.[1] || 0
    : 0;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <User className="h-10 w-10 text-field-green" />
            <h1 className="text-4xl font-bold text-gray-900">Summary</h1>
          </div>
          <p className="text-lg text-gray-600">
            Track your most-watched teams, top venues, ratings, and game totals — all in one place.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Games</p>
                  <p className="text-3xl font-bold text-field-green">{stats.totalGames}</p>
                </div>
                <Calendar className="h-8 w-8 text-field-green opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Runs/Points</p>
                  <p className="text-3xl font-bold text-sports-gold">{stats.totalRuns}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-sports-gold opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.avgRating || 'N/A'}</p>
                </div>
                <Star className="h-8 w-8 text-sports-gold opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Win/Loss Record Featured Graphic */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-field-green" />
                <span>Win/Loss Record</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="mb-6">
                  <div className="text-6xl font-bold text-field-green mb-2">
                    {winPercentage.toFixed(1)}%
                  </div>
                  <div className="text-lg text-gray-600">Win Percentage</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.winRecord.wins}</div>
                    <div className="text-sm text-green-700">Wins</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{stats.winRecord.losses}</div>
                    <div className="text-sm text-red-700">Losses</div>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  Record: {stats.winRecord.wins}-{stats.winRecord.losses}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Watched vs Attended Pie Chart */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle>Watched vs Attended</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {attendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-field-green rounded-full"></div>
                  <span className="text-sm">Watched ({stats.gamesWatched})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-sports-gold rounded-full"></div>
                  <span className="text-sm">Attended ({stats.gamesAttended})</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Most Visited Venue */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle>Most Visited Venue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-field-green mb-2">
                  {stats.mostVisitedVenue}
                </div>
                <div className="text-lg text-gray-600">
                  ({mostVisitedVenueCount} game{mostVisitedVenueCount !== 1 ? 's' : ''})
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Most Supported Team */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <CardTitle>Most Supported Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="flex justify-center items-center space-x-3 mb-2">
                  <img 
                    src={getTeamLogo(stats.mostSupportedTeam, 'MLB')} 
                    alt={stats.mostSupportedTeam}
                    className="h-12 w-12 object-contain flex-shrink-0"
                    style={{
                      filter: 'drop-shadow(0 0 0 transparent)',
                      mixBlendMode: 'multiply'
                    }}
                  />
                  <div className="text-2xl font-bold text-field-green">
                    {getTeamAbbreviation(stats.mostSupportedTeam, 'MLB')}
                  </div>
                </div>
                <div className="text-lg text-gray-600">
                  ({mostSupportedTeamCount} game{mostSupportedTeamCount !== 1 ? 's' : ''})
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Breakdown */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <CardHeader>
              <CardTitle>Top Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.teamBreakdown.map(([team, count], index) => {
                  // Determine league based on team format
                  const league = team.length <= 3 && team === team.toLowerCase() ? 'NFL' : 'MLB';
                  const leagueType = league as 'NFL' | 'MLB';
                  const teamAbbr = getTeamAbbreviation(team, leagueType);
                  
                  return (
                    <div key={team} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={getTeamLogo(team, leagueType)} 
                          alt={team}
                          className="h-8 w-8 object-contain flex-shrink-0"
                          style={{
                            filter: 'drop-shadow(0 0 0 transparent)',
                            mixBlendMode: 'multiply'
                          }}
                        />
                        <span className="font-medium">{teamAbbr}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-field-green">{count}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Info and Sign Out */}
        {user && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">{user.email}</p>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
