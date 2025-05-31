
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { BarChart3, TrendingUp, Star, Calendar, Target, Plus, MapPin, Users, Trophy, Activity, Check, X, Info, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line } from 'recharts';
import { useProfileStats } from '@/hooks/useProfileStats';
import { formatTeamName, getTeamLogo, getTeamAbbreviation } from '@/utils/teamLogos';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { data: stats, isLoading } = useProfileStats();
  const { user, signOut } = useAuth();
  const [showInfoBanner, setShowInfoBanner] = useState(() => {
    return localStorage.getItem('hideMLBOnlyBanner') !== 'true';
  });

  const dismissBanner = () => {
    setShowInfoBanner(false);
    localStorage.setItem('hideMLBOnlyBanner', 'true');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading your dashboard...</div>
        </div>
      </Layout>
    );
  }

  // Show empty state if no games logged
  if (!stats || stats.totalGames === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
          {/* MLB Only Info Banner */}
          {showInfoBanner && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  🧠 Gameday Diary currently supports MLB only. We're working on NFL next, with NBA to follow!
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={dismissBanner} className="text-blue-600 hover:text-blue-800">
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <BarChart3 className="h-10 w-10 text-field-green" />
              <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <p className="text-lg text-gray-600">
              Your comprehensive game analytics and insights
            </p>
          </div>

          {/* Empty State */}
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No games logged yet</h3>
            <p className="text-gray-600 mb-6">Start building your game analytics by adding games you've watched or attended.</p>
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

  // Data for Watched vs Attended
  const attendancePercentage = stats.totalGames > 0 ? (stats.gamesAttended / stats.totalGames) * 100 : 0;

  const chartConfig = {
    watched: { label: 'Watched', color: '#16a34a' },
    attended: { label: 'Attended', color: '#ca8a04' },
    runs: { label: 'Runs', color: '#2563eb' },
  };

  // Get the count for most visited venue
  const mostVisitedVenueCount = stats.venueBreakdown && stats.venueBreakdown.length > 0 
    ? stats.venueBreakdown[0][1] 
    : 0;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        {/* MLB Only Info Banner */}
        {showInfoBanner && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                🧠 Gameday Diary currently supports MLB only. We're working on NFL next, with NBA to follow!
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={dismissBanner} className="text-blue-600 hover:text-blue-800">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <BarChart3 className="h-10 w-10 text-field-green" />
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <p className="text-lg text-gray-600 mb-2">
            Your comprehensive game analytics and insights
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Info className="h-4 w-4" />
            <span>Data from {stats.timeWindow.start} to {stats.timeWindow.end}</span>
          </div>
        </div>

        {/* Overview Metrics - Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-3xl font-bold text-sports-gold">{stats.avgRating || 'N/A'}</p>
                </div>
                <Star className="h-8 w-8 text-sports-gold opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Most Visited</p>
                  <p className="text-lg font-bold text-gray-900 truncate">
                    {stats.mostVisitedVenue !== 'N/A' 
                      ? `${stats.mostVisitedVenue} (${mostVisitedVenueCount})`
                      : 'N/A'
                    }
                  </p>
                </div>
                <MapPin className="h-8 w-8 text-field-green opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Most Supported</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {stats.mostSupportedTeam && stats.mostSupportedTeam.team !== 'N/A' ? (
                      <>
                        <img
                          src={getTeamLogo(getTeamAbbreviation(stats.mostSupportedTeam.team, 'MLB'), 'MLB')}
                          alt={stats.mostSupportedTeam.team}
                          className="h-6 w-6 object-contain"
                        />
                        <span className="text-lg font-bold text-gray-900">
                          {getTeamAbbreviation(stats.mostSupportedTeam.team, 'MLB')}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          ({stats.mostSupportedTeam.count})
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">N/A</span>
                    )}
                  </div>
                </div>
                <Trophy className="h-8 w-8 text-sports-gold opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Win/Loss Record - moved to left */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-field-green" />
                <span>Win/Loss Record</span>
              </CardTitle>
              <p className="text-sm text-gray-600">Based on teams you rooted for</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Radial Progress Ring */}
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - winPercentage / 100)}`}
                        className="text-field-green transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-field-green">
                          {winPercentage.toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500">Win Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.winRecord.wins}</div>
                    <div className="text-sm text-green-700">Wins</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.winRecord.losses}</div>
                    <div className="text-sm text-red-700">Losses</div>
                  </div>
                </div>

                {/* Last 5 Games Trend - only show rooted games */}
                {stats.last5Games && stats.last5Games.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-600">Last 5 Rooted Games</div>
                    <div className="flex justify-center space-x-1">
                      {stats.last5Games.map((game, index) => (
                        <div
                          key={index}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                            game.won ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        >
                          {game.won ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Team Records */}
                {(stats.teamWinRecord.mostWins || stats.teamWinRecord.mostLosses) && (
                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    {stats.teamWinRecord.mostWins && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Most wins:</span>
                        <span className="font-medium text-green-600">
                          {getTeamAbbreviation(stats.teamWinRecord.mostWins.team, 'MLB')} ({stats.teamWinRecord.mostWins.count})
                        </span>
                      </div>
                    )}
                    {stats.teamWinRecord.mostLosses && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Most losses:</span>
                        <span className="font-medium text-red-600">
                          {getTeamAbbreviation(stats.teamWinRecord.mostLosses.team, 'MLB')} ({stats.teamWinRecord.mostLosses.count})
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Total Runs - moved to right, updated title */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-field-green" />
                <span>Total Runs</span>
              </CardTitle>
              <p className="text-sm text-gray-600">Combined score from attended and watched MLB games</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-600 mb-2 animate-scale-in">
                    {stats.totalRuns.toLocaleString()}
                  </div>
                  <div className="text-lg text-gray-600 mb-2">Total Scored</div>
                  <div className="text-sm text-blue-500 font-medium">
                    {stats.avgRunsPerGame} avg per game
                  </div>
                </div>

                {/* Sparkline Chart */}
                {stats.gameRunsData && stats.gameRunsData.length > 0 && (
                  <div className="h-24">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.gameRunsData}>
                          <Line 
                            type="monotone" 
                            dataKey="runs" 
                            stroke="#2563eb" 
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, fill: "#2563eb" }}
                          />
                          <ChartTooltip 
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-white p-3 border rounded-lg shadow-lg">
                                    <p className="font-medium">{data.teams}</p>
                                    <p className="text-sm text-gray-600">{data.date}</p>
                                    <p className="text-sm">
                                      <span className="font-medium text-blue-600">{data.runs}</span> total runs
                                    </p>
                                    <p className="text-xs text-gray-500">{data.venue}</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                  {stats.highestScoringGame && (
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-medium text-green-700">Highest: {stats.highestScoringGame.runs}</div>
                      <div className="text-green-600">{stats.highestScoringGame.teams}</div>
                    </div>
                  )}
                  {stats.lowestScoringGame && (
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-medium text-blue-700">Lowest: {stats.lowestScoringGame.runs}</div>
                      <div className="text-blue-600">{stats.lowestScoringGame.teams}</div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Enhanced Watched vs Attended */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle>Watched vs Attended</CardTitle>
              <p className="text-sm text-gray-600">How you experience games</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Segmented Progress Bar */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Attended</span>
                    <span className="text-sm font-medium text-gray-600">Watched</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                    <div 
                      className="bg-sports-gold h-4 rounded-l-full transition-all duration-1000 ease-out"
                      style={{ width: `${attendancePercentage}%` }}
                    />
                    <div 
                      className="bg-field-green h-4 rounded-r-full absolute top-0 right-0 transition-all duration-1000 ease-out"
                      style={{ width: `${100 - attendancePercentage}%` }}
                    />
                  </div>
                </div>

                {/* Center Display */}
                <div className="text-center space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-sports-gold">{stats.gamesAttended}</div>
                      <div className="text-sm text-yellow-700">Attended</div>
                      <div className="text-xs text-yellow-600">{attendancePercentage.toFixed(1)}%</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-field-green">{stats.gamesWatched}</div>
                      <div className="text-sm text-green-700">Watched</div>
                      <div className="text-xs text-green-600">{(100 - attendancePercentage).toFixed(1)}%</div>
                    </div>
                  </div>
                  
                  {/* Recent Activity Summary */}
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      {stats.gamesAttended === stats.totalGames 
                        ? "You've attended all your games — nice!"
                        : stats.gamesWatched === stats.totalGames
                        ? "All games watched from home"
                        : `Mix of ${stats.gamesAttended} attended, ${stats.gamesWatched} watched`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Teams */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-field-green" />
                <span>Top Teams</span>
              </CardTitle>
              <p className="text-sm text-gray-600">Games involving these teams</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.teamBreakdown.slice(0, 5).map(([team, count], index) => {
                  const leagueType = 'MLB';
                  
                  return (
                    <div key={team} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-medium text-gray-400">#{index + 1}</div>
                        <img
                          src={getTeamLogo(getTeamAbbreviation(team, leagueType), leagueType)}
                          alt={team}
                          className="h-6 w-6 object-contain"
                        />
                        <span className="font-medium">{getTeamAbbreviation(team, leagueType)}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-field-green">{count}</div>
                        <div className="text-xs text-gray-500">games</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline of Games by Game Date */}
        {stats.gameTimelineData && stats.gameTimelineData.length > 0 && (
          <Card className="animate-slide-up mb-8" style={{ animationDelay: '0.8s' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-field-green" />
                <span>Games by Date</span>
              </CardTitle>
              <p className="text-sm text-gray-600">Games you've logged organized by when they were played (rolling 12 months)</p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ games: { label: 'Games', color: '#16a34a' } }} className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.gameTimelineData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="games" fill="#16a34a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

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

export default Dashboard;
