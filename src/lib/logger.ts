type LogLevel = "info" | "warn" | "error";

interface LogPayload {
  level: LogLevel;
  message: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

const formatLog = (payload: LogPayload): string => {
  return `[${payload.timestamp}] [${payload.level.toUpperCase()}] ${payload.message} ${
    payload.metadata ? JSON.stringify(payload.metadata) : ""
  }`;
};

export const logger = {
  info: (message: string, metadata?: Record<string, any>) => {
    const payload: LogPayload = {
      level: "info",
      message,
      metadata,
      timestamp: new Date().toISOString(),
    };
    console.log(formatLog(payload));
  },
  warn: (message: string, metadata?: Record<string, any>) => {
    const payload: LogPayload = {
      level: "warn",
      message,
      metadata,
      timestamp: new Date().toISOString(),
    };
    console.warn(formatLog(payload));
  },
  error: (message: string, error?: unknown, metadata?: Record<string, any>) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    const payload: LogPayload = {
      level: "error",
      message: `${message} - ${errorMessage}`,
      metadata: { ...metadata, stack: errorStack },
      timestamp: new Date().toISOString(),
    };
    console.error(formatLog(payload));
  },
};
