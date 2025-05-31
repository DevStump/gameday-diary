import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Star, Clock, Users, BookOpen, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useLoggedGames } from '@/hooks/useLoggedGames';
import EditGameLogModal from '@/components/EditGameLogModal';
import DeleteGameLogModal from '@/components/DeleteGameLogModal';
import { getTeamAbbreviation } from '@/utils/teamLogos';
import GameTeamDisplay from '@/components/game-card/GameTeamDisplay';
import GameDateTime from '@/components/game-card/GameDateTime';
import GameScore from '@/components/game-card/GameScore';

const Timeline = () => {
  const { user } = useAuth();
  const [selectedGameLog, setSelectedGameLog] = useState<any>(null);
  const [deleteGameLog, setDeleteGameLog] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');

  const { 
    data: loggedGames = [], 
    isLoading, 
    error 
  } = useLoggedGames({
    enabled: !!user
  });

  // Empty state for signed out users
  if (!user) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <Calendar className="h-10 w-10 text-field-green" />
              <h1 className="text-4xl font-bold text-gray-900">Diary</h1>
            </div>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-600 mb-6">
                Your personal timeline of sports memories. Every game you've watched, every moment you've experienced.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  <span className="text-blue-800 font-medium text-lg">Sign in to start your diary</span>
                </div>
                <p className="text-blue-700 mb-4">
                  Create a personal timeline of every game you've experienced. Add photos, notes, and memories to build your sports story.
                </p>
                <Button asChild className="bg-field-green hover:bg-field-dark">
                  <Link to="/auth">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Timeline */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {[1, 2, 3].map((index) => (
                <Card key={index} className="opacity-60">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="bg-gray-100">--</Badge>
                          <span className="text-sm text-gray-500">Sample Game</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Team A vs Team B</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>Stadium Name</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4" />
                            <span>-- / 5</span>
                          </div>
                        </div>
                        <p className="text-gray-600">Your game memories and notes will appear here...</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const handleEdit = (gameLog: any) => {
    setSelectedGameLog(gameLog);
  };

  const handleDelete = (gameLog: any) => {
    setDeleteGameLog(gameLog);
  };

  const groupedGames = loggedGames.reduce((acc: any, game: any) => {
    const gameDate = game.game_date?.split('T')[0] || 'Unknown Date';
    if (!acc[gameDate]) {
      acc[gameDate] = [];
    }
    acc[gameDate].push(game);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedGames).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const filterLoggedGames = (tab: string) => {
    if (tab === 'attended') {
      return loggedGames.filter(game => game.mode === 'attended');
    } else if (tab === 'watched') {
      return loggedGames.filter(game => game.mode === 'watched');
    }
    return loggedGames;
  };

  const filteredGames = filterLoggedGames(activeTab);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-80">
          <Loader2 className="h-8 w-8 animate-spin text-field-green" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center text-red-500">Error loading game logs.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <Calendar className="h-10 w-10 text-field-green" />
            <h1 className="text-4xl font-bold text-gray-900">Diary</h1>
          </div>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600">
              Your personal timeline of sports memories. Every game you've watched, every moment you've experienced.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full justify-center">
            <TabsTrigger value="all" className="data-[state=active]:bg-field-green data-[state=active]:text-white">All Games</TabsTrigger>
            <TabsTrigger value="attended" className="data-[state=active]:bg-field-green data-[state=active]:text-white">Attended</TabsTrigger>
            <TabsTrigger value="watched" className="data-[state=active]:bg-field-green data-[state=active]:text-white">Watched</TabsTrigger>
          </TabsList>
          <TabsContent value="all" />
          <TabsContent value="attended" />
          <TabsContent value="watched" />
        </Tabs>

        {/* Timeline */}
        {filteredGames.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No games logged</h3>
            <p className="text-gray-600">Add games to your diary to start building your timeline.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {sortedDates.map((date) => (
                <div key={date}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                  <div className="space-y-6">
                    {groupedGames[date].map((game: any) => {
                      const homeTeamAbbr = getTeamAbbreviation(game.home_team, game.league, game.game_date);
                      const awayTeamAbbr = getTeamAbbreviation(game.away_team, game.league, game.game_date);

                      return (
                        <Card key={game.id} className="bg-white border-gray-200">
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center">
                                  <Calendar className="h-6 w-6 text-gray-400" />
                                </div>
                              </div>
                              <div className="flex-1">
                                {/* Top badges - compact */}
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300 text-xs px-2 py-0.5">
                                      {game.mode === 'attended' ? 'Attended' : 'Watched'}
                                    </Badge>
                                    <Badge variant={game.league === 'NFL' ? 'default' : 'secondary'} className="bg-field-green text-white text-xs px-2 py-0.5">
                                      {game.league}
                                    </Badge>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button size="icon" variant="outline" onClick={() => handleEdit(game)} className="h-6 w-6 p-1">
                                      <Clock className="h-3 w-3" />
                                    </Button>
                                    <Button size="icon" variant="destructive" onClick={() => handleDelete(game)} className="h-6 w-6 p-1">
                                      <Users className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Venue row - compact */}
                                {game.venue && (
                                  <div className="flex items-center justify-center text-xs text-gray-600 mb-2">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    <span className="text-center truncate">{game.venue}</span>
                                  </div>
                                )}

                                {/* Teams and logos - compact */}
                                <div className="text-center mb-2">
                                  <GameTeamDisplay 
                                    homeTeam={homeTeamAbbr}
                                    awayTeam={awayTeamAbbr}
                                    league={game.league}
                                    isFuture={false}
                                    gameDate={game.game_date}
                                  />
                                </div>

                                {/* Score - compact */}
                                <div className="text-center mb-2">
                                  <GameScore 
                                    league={game.league}
                                    ptsOff={game.pts_off}
                                    ptsDef={game.pts_def}
                                    runsScored={game.runs_scored}
                                    runsAllowed={game.runs_allowed}
                                    isFuture={false}
                                  />
                                </div>

                                {/* Date - compact */}
                                <div className="text-center mb-2">
                                  <GameDateTime date={game.game_date} gameDateTime={game.game_datetime} />
                                </div>

                                {game.rating && (
                                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                    <Star className="h-4 w-4" />
                                    <span>{game.rating} / 5</span>
                                  </div>
                                )}
                                <p className="text-gray-600">{game.notes}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedGameLog && (
        <EditGameLogModal
          isOpen={!!selectedGameLog}
          onClose={() => setSelectedGameLog(null)}
          gameLog={selectedGameLog}
        />
      )}

      {deleteGameLog && (
        <DeleteGameLogModal
          isOpen={!!deleteGameLog}
          onClose={() => setDeleteGameLog(null)}
          gameLog={deleteGameLog}
        />
      )}
    </Layout>
  );
};

export default Timeline;
