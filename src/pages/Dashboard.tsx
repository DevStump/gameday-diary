
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Calendar, MapPin, Trophy, Star, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileStats } from '@/hooks/useProfileStats';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { data: stats, isLoading } = useProfileStats();

  if (!user) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
            <p className="text-gray-600">Please sign in to view your dashboard.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-field-green" />
            <span className="ml-2 text-gray-600">Loading dashboard...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!stats) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
            <p className="text-gray-600">No data available yet. Start adding games to your diary!</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Your game-watching statistics and insights</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Games</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGames}</div>
              <p className="text-xs text-muted-foreground">
                Games logged in diary
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wins Record</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.winRecord?.wins || 0}-{stats.winRecord?.losses || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                When rooting for a team
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attended vs Watched</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.gamesAttended}/{stats.gamesWatched}
              </div>
              <p className="text-xs text-muted-foreground">
                Attended vs Watched
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.avgRating ? stats.avgRating.toFixed(1) : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                Out of 5 stars ({stats.ratedGamesCount} rated)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Venue Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Top Venues
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.attendedVenueBreakdown?.length > 0 ? (
                <div className="space-y-3">
                  {stats.attendedVenueBreakdown.slice(0, 5).map((venue, index) => (
                    <div key={venue.venue} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{venue.venue}</span>
                      <Badge variant="secondary">{venue.count} games</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No attended games logged yet</p>
              )}
            </CardContent>
          </Card>

          {/* Win/Loss Record */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                Team Support Record
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Win Percentage</span>
                  <span className="font-bold text-green-600">
                    {stats.winRecord?.wins && stats.winRecord?.total ? 
                      `${((stats.winRecord.wins / stats.winRecord.total) * 100).toFixed(1)}%` : 
                      'N/A'
                    }
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ 
                      width: stats.winRecord?.wins && stats.winRecord?.total ? 
                        `${(stats.winRecord.wins / stats.winRecord.total) * 100}%` : 
                        '0%' 
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Distribution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Rating Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.ratedGamesCount > 0 ? (
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-3">
                    <span className="w-8 text-sm font-medium">{rating}⭐</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-field-green h-2 rounded-full" 
                        style={{ 
                          width: stats.ratedGamesCount > 0 ? 
                            `${((stats.ratingBreakdown[rating] || 0) / stats.ratedGamesCount) * 100}%` : 
                            '0%' 
                        }}
                      ></div>
                    </div>
                    <span className="w-8 text-sm text-gray-600">
                      {stats.ratingBreakdown[rating] || 0}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No rated games yet. Start rating your game experiences!</p>
            )}
          </CardContent>
        </Card>

        {/* League Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              League Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.leagueBreakdown?.length > 0 ? (
                stats.leagueBreakdown.map((league) => (
                  <div key={league.league} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{league.league}</span>
                    <Badge variant="outline">{league.count} games</Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No games logged yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
