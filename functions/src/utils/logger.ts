/**
 * React-Collage-B — Structured Production Logger
 */

export interface LogPayload {
  requestId?: string;
  route?: string;
  method?: string;
  status?: number;
  durationMs?: number;
  userId?: string;
  errorCode?: string;
  [key: string]: unknown;
}

class Logger {
  private format(level: "INFO" | "WARN" | "ERROR", message: string, payload?: LogPayload): string {
    const timestamp = new Date().toISOString();
    const data = payload ? ` ${JSON.stringify(payload)}` : "";
    return `[${timestamp}] [${level}] ${message}${data}`;
  }

  info(message: string, payload?: LogPayload): void {
    console.log(this.format("INFO", message, payload));
  }

  warn(message: string, payload?: LogPayload): void {
    console.warn(this.format("WARN", message, payload));
  }

  error(message: string, error?: Error | unknown, payload?: LogPayload): void {
    const errPayload = {
      ...payload,
      errorMessage: error instanceof Error ? error.message : String(error),
      stack: process.env.NODE_ENV === "development" && error instanceof Error ? error.stack : undefined,
    };
    console.error(this.format("ERROR", message, errPayload));
  }
}

export const logger = new Logger();
