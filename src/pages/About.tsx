
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Info, User, LogOut, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <Info className="h-10 w-10 text-field-green" />
            <h1 className="text-4xl font-bold text-gray-900">About</h1>
          </div>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600">
              Manage your account and learn more about how GamedayDiary was built. Discover the data sources, team logos, and technology that power your personal sports diary experience.
            </p>
          </div>
        </div>

        {/* App Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>ℹ️</span>
              <span>About This App</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed">
              GamedayDiary helps sports fans track and remember the games they've watched, whether live at the stadium or from home. 
              Create a personal diary of your sports viewing experience with detailed game information, team logos, and your own notes and memories.
            </p>
          </CardContent>
        </Card>

        {/* Feedback Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>✉️</span>
              <span>Got Feedback?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Please feel free to reach out with any feedback, bug reports, and feature requests. Your input helps make GamedayDiary better for everyone!
            </p>
            <a href="mailto:nicholas.piovano@gmail.com?subject=GamedayDiary Feedback">
              <Button className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Send Feedback</span>
              </Button>
            </a>
          </CardContent>
        </Card>
        
        {/* Data Sources */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📊</span>
              <span>Data Sources</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚾</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">MLB Data</h3>
                <p className="text-gray-600 mb-2">
                  Baseball statistics and game information sourced from MLB-StatsAPI
                </p>
                <a 
                  href="https://github.com/toddrob99/MLB-StatsAPI/wiki" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-field-green hover:text-field-dark transition-colors"
                >
                  <span>MLB-StatsAPI Documentation</span>
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Team Logos</h3>
                <p className="text-gray-600 mb-2">
                  All team logos are sourced from SportsLogos.Net, providing high-quality vector graphics for professional sports teams.
                </p>
                <a 
                  href="https://www.sportslogos.net" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-field-green hover:text-field-dark transition-colors"
                >
                  <span>SportsLogos.Net</span>
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Info - Only show if logged in - moved to bottom */}
        {user && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Account</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Signed in as:</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </Layout>
  );
};

export default About;
