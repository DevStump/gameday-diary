import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileStats } from '@/hooks/useProfileStats';
import { BarChart3, Trophy, Calendar, MapPin, Target, Star, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getTeamLogo } from '@/utils/teamLogos';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  // Show sign-in prompt for unauthenticated users
  if (!user) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Track your sports viewing stats, discover your favorite teams, and see your game attendance patterns.
            </p>
            <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
              <Trophy className="h-12 w-12 text-field-green mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign In to View Stats</h2>
              <p className="text-gray-600 mb-6">
                Create an account to track your games and see personalized analytics.
              </p>
              <Button asChild className="bg-field-green hover:bg-field-dark">
                <Link to="/auth">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const { data: stats, isLoading } = useProfileStats();

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-64">
            <Loader2 className="h-8 w-8 animate-spin text-field-green" />
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
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
            <p className="text-lg text-gray-600 mb-8">
              Start logging games to see your personalized stats and insights.
            </p>
            <Button asChild className="bg-field-green hover:bg-field-dark">
              <Link to="/">Browse Games</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const winPercentage = stats.totalGames > 0 
    ? Math.round((stats.favoriteTeamWins / stats.totalGames) * 100) 
    : 0;

  const strokeDasharray = `${winPercentage} ${100 - winPercentage}`;

  const attendanceData = [
    { name: 'Attended', value: stats.attendedGames, color: '#22c55e' },
    { name: 'Watched', value: stats.watchedGames, color: '#3b82f6' },
  ];

  const ratingData = stats.ratingDistribution.map(item => ({
    rating: `${item.rating} Star${item.rating !== 1 ? 's' : ''}`,
    count: item.count,
  }));

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Your personal sports viewing analytics</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Games</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGames}</div>
              <p className="text-xs text-muted-foreground">
                Games logged
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attended Games</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.attendedGames}</div>
              <p className="text-xs text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                  {stats.totalGames > 0 ? Math.round((stats.attendedGames / stats.totalGames) * 100) : 0}%
                </Badge> of total games
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favorite Team Wins</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.favoriteTeamWins}</div>
              <p className="text-xs text-muted-foreground">
                {stats.favoriteTeam && (
                  <div className="flex items-center gap-1 mt-1">
                    <img 
                      src={getTeamLogo(stats.favoriteTeam, 'MLB')} 
                      alt={stats.favoriteTeam}
                      className="w-4 h-4"
                    />
                    <Badge variant="outline" className="text-xs">
                      {stats.favoriteTeam}
                    </Badge>
                  </div>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <p className="text-xs text-muted-foreground">
                Out of 5 stars
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Attendance Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {attendanceData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm">{entry.name}: {entry.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rating Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ratingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Teams */}
        {stats.topTeams.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Most Watched Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topTeams.map((team, index) => (
                  <div key={team.team} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <img 
                        src={getTeamLogo(team.team, 'MLB')} 
                        alt={team.team}
                        className="w-6 h-6"
                      />
                      <span className="font-medium">{team.team}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {team.count} game{team.count !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
