import React, { useMemo } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trophy, TrendingUp, MapPin, Target, BarChart3, Star } from 'lucide-react';
import { useProfileStats } from '@/hooks/useProfileStats';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { getTeamLogo } from '@/utils/teamLogos';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: stats, isLoading } = useProfileStats();

  const winPercentage = useMemo(() => {
    if (!stats?.winRecord) return 0;
    const { wins, losses } = stats.winRecord;
    const totalGames = wins + losses;
    return totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
  }, [stats?.winRecord]);

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = `${(winPercentage / 100) * circumference} ${circumference}`;

  if (authLoading || (user && isLoading)) {
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <BarChart3 className="h-10 w-10 text-field-green" />
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <div className="max-w-5xl mx-auto">
            <p className="text-lg text-gray-600 mb-2">
              Track win/loss records, discover patterns, and explore your baseball viewing habits.
            </p>
            {user && stats && (
              <p className="text-sm text-gray-500">
                {stats.totalGames} games added to diary
              </p>
            )}
          </div>
        </div>

        {/* Show content based on authentication status */}
        {!user ? (
          /* Signed Out State */
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in to see your dashboard</h3>
            <p className="text-gray-600 mb-6">Track your win/loss records, discover patterns, and explore your baseball viewing habits.</p>
            <Link to="/auth">
              <Button className="bg-field-green hover:bg-field-dark">
                Sign In
              </Button>
            </Link>
          </div>
        ) : !stats ? (
          /* Signed In No Data State */
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No game data found</h3>
            <p className="text-gray-600 mb-6">Start adding games to your diary to see your stats!</p>
            <Link to="/">
              <Button className="bg-field-green hover:bg-field-dark">
                Browse Games
              </Button>
            </Link>
          </div>
        ) : (
          /* Signed In With Data - Stats Grid */
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
                {stats.totalGames === 0 ? (
                  <div className="text-center py-6">
                    <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No win/loss record yet</p>
                    <p className="text-xs text-gray-500">Add games to see win/loss record</p>
                  </div>
                ) : (
                  <>
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
                          <div className="text-xs text-gray-600 mb-1">Last {stats.last5Games.length} games</div>
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
                  </>
                )}
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
                {stats.totalGames === 0 ? (
                  <div className="text-center py-6">
                    <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No total runs yet</p>
                    <p className="text-xs text-gray-500">Add games to see total runs</p>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{stats.totalRuns}</div>
                      <div className="text-sm text-gray-600">Combined score from your logged MLB games</div>
                      <div className="text-xs text-gray-500 mt-1">Avg: {stats.avgRunsPerGame} per game</div>
                    </div>

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
                  </>
                )}
              </CardContent>
            </Card>

            {/* Top 5 Venues (Attended) */}
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
                        src={getTeamLogo(stats.mostSupportedTeam.team, 'MLB', '2024')}
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
                        {stats.teamWinRecord.mostWins.count} wins when rooting ({Math.round((stats.teamWinRecord.mostWins.count / stats.mostSupportedTeam.count) * 100)}%)
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
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-orange-500" />
                  <span>Top Teams</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.teamBreakdown.length > 0 ? (
                  <div className="space-y-3">
                    {stats.teamBreakdown.map(([team, count], index) => (
                      <div key={team} className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={getTeamLogo(team, 'MLB', '2024')}
                            alt={`${team} logo`}
                            className="h-6 w-6 object-contain"
                            style={{ maxWidth: '24px', height: '24px', objectFit: 'contain' }}
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
                ) : (
                  <div className="text-center py-6">
                    <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No top teams yet</p>
                    <p className="text-xs text-gray-500">Add games to see top teams</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Game Rating */}
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Star className="h-5 w-5 text-pink-500" />
                  <span>Game Rating</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.ratedGamesCount > 0 ? (
                  <>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">Average rating</div>
                    </div>
                    <div className="pt-3 border-t border-gray-100 space-y-2">
                      <div className="text-xs text-gray-600 mb-2">Rating breakdown</div>
                      <div className="grid grid-cols-5 gap-1 text-xs">
                        {[1, 2, 3, 4, 5].map((rating) => {
                          const count = stats.ratingBreakdown[rating as keyof typeof stats.ratingBreakdown];
                          const percentage = stats.ratedGamesCount > 0 ? Math.round((count / stats.ratedGamesCount) * 100) : 0;
                          return (
                            <div key={rating} className="text-center">
                              <div className="font-medium">{rating}★</div>
                              <div className="text-gray-900 font-semibold">{count}</div>
                              <div className="text-gray-500">({percentage}%)</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <Star className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No average rating yet</p>
                    <p className="text-xs text-gray-500">Rate a game to see your average rating</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
