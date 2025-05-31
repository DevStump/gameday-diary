
import React from 'react';

interface GamePitchersProps {
  isFuture?: boolean;
  awayProbablePitcher?: string;
  homeProbablePitcher?: string;
  awayTeam: string;
  homeTeam: string;
}

const GamePitchers = ({ 
  isFuture, 
  awayProbablePitcher, 
  homeProbablePitcher, 
  awayTeam, 
  homeTeam
}: GamePitchersProps) => {
  const getProbablePitchers = () => {
    if (!isFuture || !awayProbablePitcher || !homeProbablePitcher) {
      return null;
    }
    
    return (
      <div className="text-sm text-gray-600">
        <span className="font-medium">Probable Pitchers:</span> {awayProbablePitcher} ({awayTeam}) vs. {homeProbablePitcher} ({homeTeam})
      </div>
    );
  };

  const probablePitchers = getProbablePitchers();

  if (!probablePitchers) {
    return <div className="min-h-[40px]"></div>;
  }

  return (
    <div className="min-h-[40px] flex flex-col justify-start">
      {probablePitchers}
    </div>
  );
};

export default GamePitchers;
