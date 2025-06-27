// Simple logger utility for development
// In production, console statements are removed by babel plugin

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enabledInDev: boolean;
  minLevel: LogLevel;
}

const config: LoggerConfig = {
  enabledInDev: import.meta.env.DEV,
  minLevel: 'debug'
};

const levels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private shouldLog(level: LogLevel): boolean {
    if (!config.enabledInDev) return false;
    return levels[level] >= levels[config.minLevel];
  }

  private formatMessage(level: LogLevel, message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${this.context}]`;
    
    if (data) {
      console.log(prefix, message, data);
    } else {
      console.log(prefix, message);
    }
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog('debug')) {
      this.formatMessage('debug', message, data);
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog('info')) {
      this.formatMessage('info', message, data);
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog('warn')) {
      console.warn(`[${this.context}]`, message, data);
    }
  }

  error(message: string, error?: any): void {
    // Always log errors
    console.error(`[${this.context}]`, message, error);
  }
}

// Factory function to create logger instances
export const createLogger = (context: string): Logger => {
  return new Logger(context);
};

// Example usage:
// const logger = createLogger('GameCard');
// logger.debug('Component rendered', { gameId: 123 });
// logger.error('Failed to load game', error);