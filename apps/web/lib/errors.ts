/**
 * Error handling utilities
 * Provides consistent error handling, retry logic, and user-friendly error messages
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class OllamaError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "OLLAMA_ERROR", 503, details);
    this.name = "OllamaError";
  }
}

export class EmbeddingError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "EMBEDDING_ERROR", 503, details);
    this.name = "EmbeddingError";
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "DATABASE_ERROR", 500, details);
    this.name = "DatabaseError";
  }
}

export class AuthError extends AppError {
  constructor(message: string = "Unauthorized", details?: unknown) {
    super(message, "AUTH_ERROR", 401, details);
    this.name = "AuthError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "VALIDATION_ERROR", 400, details);
    this.name = "ValidationError";
  }
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier?: number;
  retryableErrors?: string[];
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
  retryableErrors: ["ECONNREFUSED", "ETIMEDOUT", "ENOTFOUND", "fetch failed"],
};

/**
 * Retry a function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Check if error is retryable
      const isRetryable = finalConfig.retryableErrors?.some((retryableError) =>
        errorMessage.includes(retryableError)
      );

      if (!isRetryable || attempt === finalConfig.maxAttempts) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = finalConfig.delayMs * Math.pow(finalConfig.backoffMultiplier || 2, attempt - 1);
      console.warn(
        `Attempt ${attempt}/${finalConfig.maxAttempts} failed, retrying in ${delay}ms...`,
        errorMessage
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error("Retry failed");
}

/**
 * Convert technical errors to user-friendly messages
 */
export function getUserFriendlyError(error: unknown): { message: string; code: string } {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
    };
  }

  if (error instanceof Error) {
    // Map common error messages to user-friendly ones
    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes("fetch failed") || errorMessage.includes("network")) {
      return {
        message: "Unable to connect to the AI service. Please check your connection and try again.",
        code: "NETWORK_ERROR",
      };
    }

    if (errorMessage.includes("timeout")) {
      return {
        message: "The request took too long. Please try again.",
        code: "TIMEOUT_ERROR",
      };
    }

    if (errorMessage.includes("unauthorized") || errorMessage.includes("401")) {
      return {
        message: "You need to be logged in to use this feature.",
        code: "AUTH_REQUIRED",
      };
    }

    if (errorMessage.includes("embedding") || errorMessage.includes("embed")) {
      return {
        message: "Unable to process your question. Please try rephrasing it.",
        code: "PROCESSING_ERROR",
      };
    }
  }

  return {
    message: "An unexpected error occurred. Please try again later.",
    code: "UNKNOWN_ERROR",
  };
}

/**
 * Log error with context
 */
export function logError(error: unknown, context?: Record<string, unknown>): void {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (error instanceof AppError) {
    console.error(`[${error.code}] ${error.message}`, {
      statusCode: error.statusCode,
      details: error.details,
      context,
    });
  } else if (error instanceof Error) {
    console.error(`[ERROR] ${error.message}`, {
      stack: isDevelopment ? error.stack : undefined,
      context,
    });
  } else {
    console.error("[ERROR] Unknown error", { error, context });
  }
}

/**
 * Create error response for API routes
 */
export function createErrorResponse(error: unknown, includeDetails: boolean = false) {
  const isDevelopment = process.env.NODE_ENV === "development";
  const userFriendly = getUserFriendlyError(error);

  if (error instanceof AppError) {
    return {
      success: false,
      error: error.code,
      message: userFriendly.message,
      ...(includeDetails || isDevelopment ? { details: error.details } : {}),
    };
  }

  return {
    success: false,
    error: userFriendly.code,
    message: userFriendly.message,
    ...(includeDetails || isDevelopment
      ? { details: error instanceof Error ? error.message : String(error) }
      : {}),
  };
}

