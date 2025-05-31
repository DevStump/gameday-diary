
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { formatTeamName } from '@/utils/teamLogos';
import { useDeleteGameLog } from '@/hooks/useGameLogs';

interface DeleteGameLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameLog: any;
  game: any;
  league: 'NFL' | 'MLB';
}

const DeleteGameLogModal = ({ isOpen, onClose, gameLog, game, league }: DeleteGameLogModalProps) => {
  const [loading, setLoading] = useState(false);
  
  const deleteGameLog = useDeleteGameLog();
  const { toast } = useToast();

  const handleDelete = async () => {
    setLoading(true);

    try {
      await deleteGameLog.mutateAsync(gameLog.id);

      toast({
        title: 'Success',
        description: 'Game removed from diary!',
      });

      // Close modal immediately to provide instant feedback
      onClose();
    } catch (error) {
      console.error('Error deleting game log:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete game log.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const gameTitle = `${formatTeamName(game.away_team, league)} @ ${formatTeamName(game.home_team, league)}`;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove from Diary</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove <strong>{gameTitle}</strong> from your diary? 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Removing...' : 'Remove'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteGameLogModal;
