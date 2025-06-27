import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star } from 'lucide-react';
import { useAddGameLog, useUpdateGameLog } from '@/hooks/useGameLogs';
import { useToast } from '@/hooks/use-toast';
import { getTeamAbbreviation } from '@/utils/teamLogos';
import { useQueryClient } from '@tanstack/react-query';

interface GameLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  // For add mode
  gameId?: string;
  gameTitle?: string;
  homeTeam?: string;
  awayTeam?: string;
  league?: string;
  venue?: string;
  // For edit mode
  gameLog?: any;
  game?: any;
}

const GameLogModal = ({ 
  isOpen, 
  onClose, 
  mode,
  gameId, 
  gameTitle, 
  homeTeam, 
  awayTeam, 
  league, 
  venue,
  gameLog,
  game
}: GameLogModalProps) => {
  const [experienceMode, setExperienceMode] = useState<'attended' | 'watched'>(
    mode === 'edit' ? gameLog?.mode : 'attended'
  );
  const [company, setCompany] = useState(mode === 'edit' ? gameLog?.company || '' : '');
  const [rating, setRating] = useState(mode === 'edit' ? gameLog?.rating || 0 : 0);
  const [rootedFor, setRootedFor] = useState(mode === 'edit' ? gameLog?.rooted_for || 'none' : 'none');
  const [notes, setNotes] = useState(mode === 'edit' ? gameLog?.notes || '' : '');
  const [loading, setLoading] = useState(false);
  
  const addGameLog = useAddGameLog();
  const updateGameLog = useUpdateGameLog();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (mode === 'edit' && gameLog) {
      setExperienceMode(gameLog.mode);
      setCompany(gameLog.company || '');
      setRating(gameLog.rating || 0);
      setRootedFor(gameLog.rooted_for || 'none');
      setNotes(gameLog.notes || '');
    }
  }, [mode, gameLog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'add') {
        // Client-side validation
        if (!gameId || gameId.trim() === '') {
          throw new Error('Invalid game ID');
        }

        // Sanitize inputs before sending
        const sanitizedData = {
          game_id: gameId.toString().trim(),
          mode: experienceMode,
          company: company.trim().slice(0, 255) || undefined,
          rating: rating || undefined,
          rooted_for: rootedFor === 'none' ? undefined : rootedFor.trim().slice(0, 100) || undefined,
          notes: notes.trim().slice(0, 1000) || undefined,
        };

        await addGameLog.mutateAsync(sanitizedData);

        toast({
          title: 'Success',
          description: 'Game added to your diary!',
        });
      } else {
        // Edit mode
        if (!gameLog.id) {
          throw new Error('Game log ID is required');
        }

        const sanitizedData = {
          id: gameLog.id,
          mode: experienceMode,
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
      }

      onClose();
      // Reset form for add mode
      if (mode === 'add') {
        setExperienceMode('attended');
        setCompany('');
        setRating(0);
        setRootedFor('none');
        setNotes('');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : `Failed to ${mode} diary entry.`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Determine teams and title based on mode
  let displayTitle: string;
  let homeTeamAbbr: string;
  let awayTeamAbbr: string;
  
  if (mode === 'add') {
    const leagueType = league?.toUpperCase() as 'NFL' | 'MLB';
    homeTeamAbbr = getTeamAbbreviation(homeTeam || '', leagueType);
    awayTeamAbbr = getTeamAbbreviation(awayTeam || '', leagueType);
    displayTitle = venue ? `${awayTeamAbbr} @ ${homeTeamAbbr} - ${venue}` : `${awayTeamAbbr} @ ${homeTeamAbbr}`;
  } else {
    homeTeamAbbr = getTeamAbbreviation(game.home_team, league as any, game.date);
    awayTeamAbbr = getTeamAbbreviation(game.away_team, league as any, game.date);
    displayTitle = `${awayTeamAbbr} @ ${homeTeamAbbr} (${league})`;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add Game to Diary' : 'Edit Diary Entry'}</DialogTitle>
          <p className="text-sm text-gray-600">{displayTitle}</p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">How did you experience this game?</label>
            <Select value={experienceMode} onValueChange={(value: 'attended' | 'watched') => setExperienceMode(value)}>
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
                <SelectItem value={mode === 'add' ? awayTeam || '' : game.away_team}>{awayTeamAbbr}</SelectItem>
                <SelectItem value={mode === 'add' ? homeTeam || '' : game.home_team}>{homeTeamAbbr}</SelectItem>
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
              {loading ? (mode === 'add' ? 'Adding...' : 'Updating...') : (mode === 'add' ? 'Add to Diary' : 'Update Entry')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GameLogModal;