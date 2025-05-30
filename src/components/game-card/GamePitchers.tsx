
import React from 'react';

interface GamePitchersProps {
  isFuture?: boolean;
  awayProbablePitcher?: string;
  homeProbablePitcher?: string;
  awayTeam: string;
  homeTeam: string;
  winningPitcher?: string;
  losingPitcher?: string;
  savePitcher?: string;
}

const GamePitchers = ({ 
  isFuture, 
  awayProbablePitcher, 
  homeProbablePitcher, 
  awayTeam, 
  homeTeam,
  winningPitcher,
  losingPitcher,
  savePitcher
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

  const getPitchingResults = () => {
    if (isFuture) return null;
    
    const results = [];
    if (winningPitcher) results.push(`WP: ${winningPitcher}`);
    if (losingPitcher) results.push(`LP: ${losingPitcher}`);
    if (savePitcher) results.push(`SV: ${savePitcher}`);
    
    if (results.length === 0) return null;
    
    return (
      <div className="text-sm text-gray-600">
        {results.join(', ')}
      </div>
    );
  };

  const probablePitchers = getProbablePitchers();
  const pitchingResults = getPitchingResults();

  if (!probablePitchers && !pitchingResults) {
    return null;
  }

  return (
    <div className="min-h-[15px] flex flex-col justify-start">
      {pitchingResults}
      {probablePitchers}
    </div>
  );
};

export default GamePitchers;
