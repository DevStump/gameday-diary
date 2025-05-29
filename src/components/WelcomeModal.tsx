
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Pen, Search, BookOpen, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome modal before
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-gray-900 mb-4">
            📝 Welcome to GameDiary!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-center">
          <p className="text-lg text-gray-700 leading-relaxed">
            Relive every game you've watched — whether you were in the stadium or on the couch.
          </p>
          
          <div className="space-y-3 text-left">
            <div className="flex items-start space-x-3">
              <Search className="h-5 w-5 text-field-green mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Search thousands of NFL & MLB games</span>
            </div>
            
            <div className="flex items-start space-x-3">
              <BookOpen className="h-5 w-5 text-field-green mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Add games to your personal diary</span>
            </div>
            
            <div className="flex items-start space-x-3">
              <Trophy className="h-5 w-5 text-field-green mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Track teams you've rooted for — and whether they won or lost</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mt-4">
            Start by browsing your favorite team's past games and build your timeline.
          </p>
          
          <Button 
            className="w-full bg-field-green hover:bg-field-dark mt-6"
            onClick={handleClose}
            asChild
          >
            <Link to="/">Browse Games</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
