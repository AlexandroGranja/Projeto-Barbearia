interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private storage: Map<string, RateLimitEntry> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 5) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const entry = this.storage.get(identifier);

    if (!entry || now > entry.resetTime) {
      // Nova janela de tempo
      this.storage.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      return false;
    }

    // Incrementar contador
    entry.count++;
    return true;
  }

  getRemainingTime(identifier: string): number {
    const entry = this.storage.get(identifier);
    if (!entry) return 0;

    const now = Date.now();
    return Math.max(0, entry.resetTime - now);
  }

  getRemainingRequests(identifier: string): number {
    const entry = this.storage.get(identifier);
    if (!entry) return this.maxRequests;

    return Math.max(0, this.maxRequests - entry.count);
  }

  reset(identifier: string): void {
    this.storage.delete(identifier);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.storage.entries()) {
      if (now > entry.resetTime) {
        this.storage.delete(key);
      }
    }
  }
}

// Instância global para formulários
export const formRateLimiter = new RateLimiter(300000, 3); // 3 tentativas por 5 minutos

// Hook para usar rate limiting
export const useRateLimit = (identifier: string) => {
  const isAllowed = () => formRateLimiter.isAllowed(identifier);
  const getRemainingTime = () => formRateLimiter.getRemainingTime(identifier);
  const getRemainingRequests = () => formRateLimiter.getRemainingRequests(identifier);
  const reset = () => formRateLimiter.reset(identifier);

  return {
    isAllowed,
    getRemainingTime,
    getRemainingRequests,
    reset
  };
};