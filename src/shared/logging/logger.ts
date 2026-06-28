type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type LogContext = {
  scope?: string;
  [key: string]: unknown;
};

function buildPrefix(level: LogLevel, scope?: string): string {
  if (scope) {
    return `[${level.toUpperCase()}] [${scope}]`;
  }

  return `[${level.toUpperCase()}]`;
}

function writeLog(level: LogLevel, message: string, context?: LogContext): void {
  const prefix = buildPrefix(level, context?.scope);
  const payload = context
    ? Object.fromEntries(
        Object.entries(context).filter(([key, value]) => key !== 'scope' && value !== undefined),
      )
    : undefined;

  if (level === 'debug' && !import.meta.env.DEV) {
    return;
  }

  if (payload && Object.keys(payload).length > 0) {
    console[level](prefix, message, payload);
    return;
  }

  console[level](prefix, message);
}

export const logger = {
  debug(message: string, context?: LogContext): void {
    writeLog('debug', message, context);
  },
  info(message: string, context?: LogContext): void {
    writeLog('info', message, context);
  },
  warn(message: string, context?: LogContext): void {
    writeLog('warn', message, context);
  },
  error(message: string, context?: LogContext): void {
    writeLog('error', message, context);
  },
};
