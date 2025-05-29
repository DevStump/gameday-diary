
import React from 'react';
import Layout from '@/components/Layout';
import { Trophy, TrendingUp, MapPin, Calendar, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const Profile = () => {
  // Mock data for demonstration
  const stats = {
    totalGames: 47,
    gamesWatched: 32,
    gamesAttended: 15,
    avgRating: 4.2,
    totalPoints: 2847,
    winRecord: { wins: 28, losses: 19 },
    favoriteVenues: [
      { name: 'Arrowhead Stadium', count: 5 },
      { name: 'Kauffman Stadium', count: 4 },
      { name: 'Lambeau Field', count: 3 }
    ],
    monthlyActivity: [
      { month: 'Jan', games: 8 },
      { month: 'Feb', games: 3 },
      { month: 'Mar', games: 6 },
      { month: 'Apr', games: 9 },
      { month: 'May', games: 7 },
      { month: 'Jun', games: 4 }
    ]
  };

  const winPercentage = (stats.winRecord.wins / (stats.winRecord.wins + stats.winRecord.losses)) * 100;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <Trophy className="h-10 w-10 text-field-green" />
            <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
          </div>
          <p className="text-lg text-gray-600">
            Your game-watching statistics and achievements
          </p>
        </div>

        {/* Stats Grid */}
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
                  <p className="text-sm font-medium text-gray-600">Attended</p>
                  <p className="text-3xl font-bold text-sports-gold">{stats.gamesAttended}</p>
                </div>
                <MapPin className="h-8 w-8 text-sports-gold opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.avgRating}</p>
                </div>
                <Star className="h-8 w-8 text-sports-gold opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Win %</p>
                  <p className="text-3xl font-bold text-field-green">{winPercentage.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-field-green opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Detailed Stats */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-field-green" />
                <span>Game Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Watched vs Attended */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Watched vs Attended</span>
                  <span className="text-sm text-gray-500">{stats.gamesWatched + stats.gamesAttended} total</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Watched: {stats.gamesWatched}</span>
                    <span>{((stats.gamesWatched / stats.totalGames) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(stats.gamesWatched / stats.totalGames) * 100} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Attended: {stats.gamesAttended}</span>
                    <span>{((stats.gamesAttended / stats.totalGames) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={(stats.gamesAttended / stats.totalGames) * 100} 
                    className="h-2" 
                    style={{ 
                      background: 'linear-gradient(to right, rgb(255, 179, 0) 0%, rgb(255, 179, 0) 100%)'
                    }}
                  />
                </div>
              </div>

              {/* Win/Loss Record */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Win/Loss Record</span>
                  <span className="text-sm text-gray-500">{stats.winRecord.wins}-{stats.winRecord.losses}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-green-600">Wins: {stats.winRecord.wins}</span>
                  <span className="text-red-600">Losses: {stats.winRecord.losses}</span>
                </div>
                <Progress value={winPercentage} className="h-2" />
              </div>

              {/* Total Points/Runs */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Points/Runs Witnessed</p>
                  <p className="text-4xl font-bold text-field-green">{stats.totalPoints.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Favorite Venues */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-sports-gold" />
                <span>Favorite Venues</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.favoriteVenues.map((venue, index) => (
                  <div key={venue.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-field-green text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900">{venue.name}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {venue.count} games
                    </div>
                  </div>
                ))}
              </div>

              {/* Monthly Activity Chart Placeholder */}
              <div className="mt-8">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Monthly Activity</h4>
                <div className="grid grid-cols-6 gap-2">
                  {stats.monthlyActivity.map((month) => (
                    <div key={month.month} className="text-center">
                      <div 
                        className="bg-field-green rounded mb-1"
                        style={{ 
                          height: `${Math.max(month.games * 8, 8)}px`,
                          opacity: Math.min(month.games / 10 + 0.3, 1)
                        }}
                      ></div>
                      <div className="text-xs text-gray-600">{month.month}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
