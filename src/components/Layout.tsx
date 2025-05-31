import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, User, Search, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import WelcomeModal from '@/components/WelcomeModal';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { user, loading } = useAuth();

  const navigation = [
    { name: 'Games', href: '/', icon: Search },
    { name: 'Diary', href: '/diary', icon: Calendar, requireAuth: true },
    { name: 'Profile', href: '/profile', icon: User, requireAuth: true },
    { name: 'About', href: '/about', icon: Info },
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
      <WelcomeModal />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/4101cd3e-afd4-4dd3-baa0-ef8722d1bcef.png" 
                alt="GamedayDiary Logo" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-gray-900">GamedayDiary</span>
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

            {/* Auth Button - Only show sign in when not authenticated */}
            <div className="flex items-center space-x-4">
              {!user && (
                <Button size="sm" className="bg-field-green hover:bg-field-dark" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with mobile bottom padding when authenticated (bottom nav present) */}
      <main className={`flex-1 ${user ? 'pb-20 md:pb-0' : ''}`}>
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
