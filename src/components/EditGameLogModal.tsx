
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getTeamAbbreviation } from '@/utils/teamLogos';
import { useUpdateGameLog } from '@/hooks/useGameLogs';
import { useQueryClient } from '@tanstack/react-query';

interface EditGameLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameLog: any;
  game: any;
  league: 'MLB';
}

const EditGameLogModal = ({ isOpen, onClose, gameLog, game, league }: EditGameLogModalProps) => {
  const [mode, setMode] = useState<'attended' | 'watched'>(gameLog.mode);
  const [company, setCompany] = useState(gameLog.company || '');
  const [rating, setRating] = useState(gameLog.rating || 0);
  const [rootedFor, setRootedFor] = useState(gameLog.rooted_for || 'none');
  const [notes, setNotes] = useState(gameLog.notes || '');
  const [loading, setLoading] = useState(false);
  
  const updateGameLog = useUpdateGameLog();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (gameLog) {
      setMode(gameLog.mode);
      setCompany(gameLog.company || '');
      setRating(gameLog.rating || 0);
      setRootedFor(gameLog.rooted_for || 'none');
      setNotes(gameLog.notes || '');
    }
  }, [gameLog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Client-side validation and sanitization
      if (!gameLog.id) {
        throw new Error('Game log ID is required');
      }

      const sanitizedData = {
        id: gameLog.id,
        mode,
        company: company.trim().slice(0, 255), // Allow empty strings
        rating: rating || undefined,
        rooted_for: rootedFor === 'none' ? null : rootedFor.trim().slice(0, 100),
        notes: notes.trim().slice(0, 1000), // Allow empty strings
      };

      await updateGameLog.mutateAsync(sanitizedData);

      // Force refresh of logged games data immediately
      await queryClient.invalidateQueries({ queryKey: ['logged-games'] });
      await queryClient.invalidateQueries({ queryKey: ['game-logs'] });

      toast({
        title: 'Success',
        description: 'Diary entry updated successfully!',
      });

      onClose();
    } catch (error) {
      console.error('Error updating game log:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update diary entry.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const homeTeamAbbr = getTeamAbbreviation(game.home_team, league, game.date);
  const awayTeamAbbr = getTeamAbbreviation(game.away_team, league, game.date);
  const gameTitle = `${awayTeamAbbr} @ ${homeTeamAbbr} (${league})`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Diary Entry</DialogTitle>
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
                <SelectItem value="watched">Watched</SelectItem>
                <SelectItem value="attended">Attended</SelectItem>
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
                <SelectItem value={game.away_team}>{awayTeamAbbr}</SelectItem>
                <SelectItem value={game.home_team}>{homeTeamAbbr}</SelectItem>
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
              {loading ? 'Updating...' : 'Update Entry'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditGameLogModal;
