
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
        description: 'Game log deleted successfully!',
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete game log.',
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
          <AlertDialogTitle>Delete Game Log</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete your log for <strong>{gameTitle}</strong>? 
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
            {loading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteGameLogModal;
