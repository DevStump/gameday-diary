
import React from 'react';
import { format, parseISO } from 'date-fns';

interface GameDateTimeProps {
  date: string;
  gameDateTime?: string;
}

const GameDateTime = ({ date, gameDateTime }: GameDateTimeProps) => {
  const formatGameDate = (dateStr: string) => {
    try {
      const gameDate = parseISO(dateStr);
      return format(gameDate, 'MMM d, yyyy');
    } catch (error) {
      return dateStr;
    }
  };

  const formatGameTime = (dateTimeStr: string) => {
    try {
      const gameDateTime = parseISO(dateTimeStr);
      return format(gameDateTime, 'h:mm a');
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="text-center text-sm text-gray-600">
      <div className="leading-tight">{formatGameDate(date)}</div>
      {gameDateTime && (
        <div className="text-xs text-gray-500 leading-tight">
          {formatGameTime(gameDateTime)}
        </div>
      )}
    </div>
  );
};

export default GameDateTime;
