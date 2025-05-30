
import React from 'react';
import { Calendar } from 'lucide-react';

interface GameDateTimeProps {
  date: string;
  gameDateTime?: string;
}

const GameDateTime = ({ date, gameDateTime }: GameDateTimeProps) => {
  const formatDateTime = (dateString: string, datetimeString?: string) => {
    if (datetimeString) {
      try {
        const date = new Date(datetimeString);
        const options: Intl.DateTimeFormatOptions = {
          timeZone: 'America/New_York',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        };
        return date.toLocaleDateString('en-US', options) + ' EST';
      } catch (e) {
        console.error('Error parsing datetime:', e);
      }
    }
    
    const dateParts = dateString.split('-');
    if (dateParts.length === 3) {
      const year = dateParts[0];
      const month = dateParts[1];
      const day = dateParts[2];
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthName = monthNames[parseInt(month) - 1];
      
      return `${monthName} ${parseInt(day)}, ${year}`;
    }
    
    return dateString;
  };

  return (
    <div className="flex items-center justify-center text-sm text-gray-600 mb-1">
      <Calendar className="h-4 w-4 mr-1" />
      {formatDateTime(date, gameDateTime)}
    </div>
  );
};

export default GameDateTime;
