import { randomUUID } from "node:crypto";

export function ok<T>(data: T) {
  return {
    requestId: randomUUID(),
    success: true,
    data,
    error: null,
  };
}

export function fail(message: string, details?: unknown) {
  return {
    requestId: randomUUID(),
    success: false,
    data: null,
    error: {
      message,
      details: details ?? null,
    },
  };
}
