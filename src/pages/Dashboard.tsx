
import React, { useMemo } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trophy, TrendingUp, MapPin, Target, BarChart3 } from 'lucide-react';
import { useProfileStats } from '@/hooks/useProfileStats';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts';
import { getTeamLogoUrl } from '@/utils/teamLogos';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: stats, isLoading } = useProfileStats();

  React.useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const winPercentage = useMemo(() => {
    if (!stats?.winRecord) return 0;
    const { wins, losses } = stats.winRecord;
    const totalGames = wins + losses;
    return totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
  }, [stats?.winRecord]);

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = `${(winPercentage / 100) * circumference} ${circumference}`;

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-field-green" />
            <span className="ml-2 text-gray-600">Loading your stats...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!stats) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No game data found</h3>
            <p className="text-gray-600">Start logging games to see your stats here!</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <BarChart3 className="h-10 w-10 text-field-green" />
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <p className="text-lg text-gray-600">
            Your game-watching insights from {stats.timeWindow.start} to {stats.timeWindow.end}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {stats.totalGames} games logged
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Win/Loss Record */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span>Win/Loss Record</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#10b981"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={strokeDasharray}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-900">{winPercentage}%</span>
                  </div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="flex justify-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.winRecord.wins}</div>
                    <div className="text-xs text-gray-600">Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.winRecord.losses}</div>
                    <div className="text-xs text-gray-600">Losses</div>
                  </div>
                </div>
                {stats.last5Games.length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="text-xs text-gray-600 mb-1">Last 5 games</div>
                    <div className="flex justify-center space-x-1">
                      {stats.last5Games.map((game, index) => (
                        <div
                          key={index}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            game.won ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {game.won ? '✓' : '✗'}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Total Runs */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <span>Total Runs</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{stats.totalRuns}</div>
                <div className="text-sm text-gray-600">Combined score from your logged MLB games</div>
                <div className="text-xs text-gray-500 mt-1">Avg: {stats.avgRunsPerGame} per game</div>
              </div>
              
              {stats.gameRunsData.length > 0 && (
                <div className="h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.gameRunsData}>
                      <XAxis dataKey="gameNumber" hide />
                      <YAxis hide />
                      <Line 
                        type="monotone" 
                        dataKey="runs" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="space-y-2 pt-2 border-t border-gray-100">
                {stats.highestScoringGame && (
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Highest:</span> {stats.highestScoringGame.runs} runs
                    <div className="text-gray-500">{stats.highestScoringGame.teams} • {stats.highestScoringGame.date}</div>
                  </div>
                )}
                {stats.lowestScoringGame && (
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Lowest:</span> {stats.lowestScoringGame.runs} runs
                    <div className="text-gray-500">{stats.lowestScoringGame.teams} • {stats.lowestScoringGame.date}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top 3 Venues (Attended) */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-purple-500" />
                <span>Top Venues</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.attendedVenueBreakdown.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600 mb-3">Games attended at venues</div>
                  {stats.attendedVenueBreakdown.map(([venue, count], index) => (
                    <div key={venue} className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-900 truncate" title={venue}>
                          {venue.length > 20 ? `${venue.substring(0, 20)}...` : venue}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {count}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No attended venues yet</p>
                  <p className="text-xs text-gray-500">Visit some games to see your top venues!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Most Supported Team */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Target className="h-5 w-5 text-red-500" />
                <span>Most Supported Team</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.mostSupportedTeam.team !== 'N/A' ? (
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center space-x-3">
                    <img 
                      src={getTeamLogoUrl(stats.mostSupportedTeam.team, 'MLB', '2024')}
                      alt={`${stats.mostSupportedTeam.team} logo`}
                      className="h-6 w-6 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span className="text-lg font-bold text-gray-900">{stats.mostSupportedTeam.team}</span>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {stats.mostSupportedTeam.count} games
                  </Badge>
                  {stats.teamWinRecord.mostWins?.team === stats.mostSupportedTeam.team && (
                    <div className="text-xs text-gray-600">
                      {stats.teamWinRecord.mostWins.count} wins when rooting
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Target className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No team preference yet</p>
                  <p className="text-xs text-gray-500">Root for teams to see your favorite!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Teams */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900">Top Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.teamBreakdown.map(([team, count], index) => (
                  <div key={team} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={getTeamLogoUrl(team, 'MLB', '2024')}
                        alt={`${team} logo`}
                        className="h-6 w-6 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span className="text-sm font-medium text-gray-900">{team}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Game Rating */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900">Game Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-3">
                <div>
                  <div className="text-3xl font-bold text-gray-900">{stats.avgRating}</div>
                  <div className="text-sm text-gray-600">Average rating</div>
                </div>
                {stats.highestRatedGame > 0 && (
                  <div className="pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-600">
                      Highest rated: <span className="font-medium">{stats.highestRatedGame}/5</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
