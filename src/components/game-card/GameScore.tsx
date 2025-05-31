
import React from 'react';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface GameScoreProps {
  league: 'NFL' | 'MLB';
  ptsOff?: number;
  ptsDef?: number;
  runsScored?: number;
  runsAllowed?: number;
  isFuture?: boolean;
  isToday?: boolean;
}

const GameScore = ({ league, ptsOff, ptsDef, runsScored, runsAllowed, isFuture, isToday }: GameScoreProps) => {
  const getScore = () => {
    if (league === 'NFL' && ptsOff !== undefined && ptsDef !== undefined) {
      if (!isFuture && !isToday && (ptsOff !== 0 || ptsDef !== 0)) {
        return `${ptsDef} - ${ptsOff}`;
      }
    }
    if (league === 'MLB' && runsScored !== undefined && runsAllowed !== undefined) {
      if (!isFuture && !isToday && (runsScored !== 0 || runsAllowed !== 0)) {
        return `${runsAllowed} - ${runsScored}`;
      }
    }
    return null;
  };

  const score = getScore();

  return (
    <div className="h-[32px] flex items-center justify-center">
      {score ? (
        <div className="text-2xl font-bold text-field-green">
          {score}
        </div>
      ) : (
        <Badge variant="outline" className="border-gray-300 text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          Scheduled
        </Badge>
      )}
    </div>
  );
};

export default GameScore;
