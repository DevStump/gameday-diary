
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
  // Don't show any pitcher information
  return <div className="min-h-[80px]"></div>;
};

export default GamePitchers;
