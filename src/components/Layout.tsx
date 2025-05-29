
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Trophy, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { user, signOut, loading } = useAuth();

  const navigation = [
    { name: 'Games', href: '/', icon: Search },
    { name: 'Timeline', href: '/timeline', icon: Calendar, requireAuth: true },
    { name: 'Profile', href: '/profile', icon: User, requireAuth: true },
  ];

  const isActive = (path: string) => location.pathname === path;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-field-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-field-green" />
              <span className="text-xl font-bold text-gray-900">GameDiary</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                if (item.requireAuth && !user) return null;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-field-green bg-green-50'
                        : 'text-gray-600 hover:text-field-green hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Auth Button */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{user.email}</span>
                  <Button variant="outline" size="sm" onClick={signOut}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button size="sm" className="bg-field-green hover:bg-field-dark" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Mobile Navigation */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="flex justify-around">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center py-2 px-3 text-xs ${
                  isActive(item.href)
                    ? 'text-field-green'
                    : 'text-gray-600'
                }`}
              >
                <item.icon className="h-6 w-6 mb-1" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
