
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star } from 'lucide-react';
import { useAddGameLog } from '@/hooks/useGameLogs';
import { useToast } from '@/hooks/use-toast';
import { getTeamAbbreviation } from '@/utils/teamLogos';

interface GameLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameId: string;
  gameTitle: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
}

const GameLogModal = ({ isOpen, onClose, gameId, gameTitle, homeTeam, awayTeam, league }: GameLogModalProps) => {
  const [mode, setMode] = useState<'attended' | 'watched'>('attended');
  const [company, setCompany] = useState('');
  const [rating, setRating] = useState(0);
  const [rootedFor, setRootedFor] = useState('none');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  
  const addGameLog = useAddGameLog();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Submitting game log with gameId:', gameId);
      
      // Client-side validation
      if (!gameId || gameId.trim() === '') {
        throw new Error('Invalid game ID');
      }

      // Sanitize inputs before sending
      const sanitizedData = {
        game_id: gameId.toString().trim(),
        mode,
        company: company.trim().slice(0, 255) || undefined,
        rating: rating || undefined,
        rooted_for: rootedFor === 'none' ? undefined : rootedFor.trim().slice(0, 100) || undefined,
        notes: notes.trim().slice(0, 1000) || undefined,
      };

      console.log('Sanitized data:', sanitizedData);

      await addGameLog.mutateAsync(sanitizedData);

      toast({
        title: 'Success',
        description: 'Game added to your diary!',
      });

      onClose();
      // Reset form
      setMode('attended');
      setCompany('');
      setRating(0);
      setRootedFor('none');
      setNotes('');
    } catch (error) {
      console.error('Error adding game log:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add game to diary.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Ensure league is properly typed and get team abbreviations
  const leagueType = league.toUpperCase() as 'NFL' | 'MLB';
  const homeTeamAbbr = getTeamAbbreviation(homeTeam, leagueType);
  const awayTeamAbbr = getTeamAbbreviation(awayTeam, leagueType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Game Diary</DialogTitle>
          <p className="text-sm text-gray-600">{gameTitle}</p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">How did you experience this game?</label>
            <Select value={mode} onValueChange={(value: 'attended' | 'watched') => setMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="attended">Attended</SelectItem>
                <SelectItem value="watched">Watched</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Who did you root for?</label>
            <Select value={rootedFor} onValueChange={setRootedFor}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No preference</SelectItem>
                <SelectItem value={awayTeam}>{awayTeamAbbr}</SelectItem>
                <SelectItem value={homeTeam}>{homeTeamAbbr}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Who did you watch with? (optional)</label>
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value.slice(0, 255))}
              placeholder="e.g., Friends, Family, Alone"
              maxLength={255}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Rating (optional)</label>
            <div className="flex items-center space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 cursor-pointer ${
                    star <= rating ? 'text-sports-gold fill-current' : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
              {rating > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setRating(0)}
                  className="text-xs"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Notes (optional)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 1000))}
              placeholder="What made this game memorable?"
              rows={3}
              maxLength={1000}
            />
            <div className="text-xs text-gray-500 mt-1">
              {notes.length}/1000 characters
            </div>
          </div>

          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-field-green hover:bg-field-dark">
              {loading ? 'Adding...' : 'Add to Diary'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GameLogModal;
