
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star } from 'lucide-react';
import { useAddGameLog } from '@/hooks/useGameLogs';
import { useToast } from '@/hooks/use-toast';

interface GameLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameId: string;
  gameTitle: string;
}

const GameLogModal = ({ isOpen, onClose, gameId, gameTitle }: GameLogModalProps) => {
  const [mode, setMode] = useState<'attended' | 'watched'>('watched');
  const [company, setCompany] = useState('');
  const [rating, setRating] = useState(0);
  const [rootedFor, setRootedFor] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  
  const addGameLog = useAddGameLog();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addGameLog.mutateAsync({
        game_id: gameId,
        mode,
        company: company || undefined,
        rating: rating || undefined,
        rooted_for: rootedFor || undefined,
        notes: notes || undefined,
      });

      toast({
        title: 'Success',
        description: 'Game added to your diary!',
      });

      onClose();
      // Reset form
      setMode('watched');
      setCompany('');
      setRating(0);
      setRootedFor('');
      setNotes('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add game to diary.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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
                <SelectItem value="watched">Watched</SelectItem>
                <SelectItem value="attended">Attended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Who did you watch with? (optional)</label>
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., Friends, Family, Alone"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Who did you root for? (optional)</label>
            <Input
              value={rootedFor}
              onChange={(e) => setRootedFor(e.target.value)}
              placeholder="Team name"
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
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What made this game memorable?"
              rows={3}
            />
          </div>

          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
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
