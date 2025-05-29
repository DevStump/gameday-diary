
import React from 'react';
import Layout from '@/components/Layout';
import { Calendar, MapPin, Star, Users, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Timeline = () => {
  // Mock data for demonstration
  const gameEntries = [
    {
      id: '1',
      game: {
        date: '2024-01-15',
        home_team: 'Chiefs',
        away_team: 'Bills',
        league: 'NFL',
        score: '31-17',
        playoff: true
      },
      log: {
        mode: 'attended',
        company: 'Dad and brother',
        rating: 5,
        rooted_for: 'Chiefs',
        notes: 'Amazing playoff atmosphere! The crowd was electric when Mahomes threw that touchdown pass in the 4th quarter.',
        created_at: '2024-01-15T22:30:00Z'
      }
    },
    {
      id: '2',
      game: {
        date: '2024-10-01',
        home_team: 'Dodgers',
        away_team: 'Padres',
        league: 'MLB',
        score: '8-4',
        playoff: true
      },
      log: {
        mode: 'watched',
        company: 'Friends from work',
        rating: 4,
        rooted_for: 'Dodgers',
        notes: 'Great comeback victory! Watched at the local sports bar with the crew.',
        created_at: '2024-10-01T21:45:00Z'
      }
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-sports-gold fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Game Timeline</h1>
          <p className="text-lg text-gray-600">
            Your personal journey through the games you've watched and attended
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          {gameEntries.map((entry, index) => (
            <Card key={entry.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
                  {/* Game Info */}
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant={entry.game.league === 'NFL' ? 'default' : 'secondary'} className="bg-field-green text-white">
                          {entry.game.league}
                        </Badge>
                        {entry.game.playoff && (
                          <Badge variant="outline" className="border-sports-gold text-sports-gold">
                            Playoff
                          </Badge>
                        )}
                        <Badge variant={entry.log.mode === 'attended' ? 'default' : 'secondary'}>
                          {entry.log.mode === 'attended' ? 'Attended' : 'Watched'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(entry.log.created_at)}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {entry.game.away_team} @ {entry.game.home_team}
                    </h3>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(entry.game.date)}
                      </div>
                      <div className="text-lg font-bold text-field-green">
                        {entry.game.score}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-sm font-medium text-gray-700">Rating:</span>
                      <div className="flex">
                        {renderStars(entry.log.rating)}
                      </div>
                    </div>
                  </div>

                  {/* Log Details */}
                  <div className="lg:w-1/3 space-y-3">
                    {entry.log.company && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{entry.log.company}</span>
                      </div>
                    )}

                    {entry.log.rooted_for && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-gray-700">Rooted for {entry.log.rooted_for}</span>
                      </div>
                    )}

                    {entry.log.notes && (
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-700 italic">"{entry.log.notes}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {gameEntries.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No games logged yet</h3>
            <p className="text-gray-600 mb-4">Start building your game diary by adding games you've watched or attended.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Timeline;
