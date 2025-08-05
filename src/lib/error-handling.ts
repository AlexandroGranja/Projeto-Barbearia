// Tipos de erro personalizados
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  DATABASE = 'DATABASE',
  AUTHENTICATION = 'AUTHENTICATION',
  UNKNOWN = 'UNKNOWN'
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: any;
  timestamp: Date;
  userMessage: string;
}

// Função para classificar erros do Supabase
export const classifySupabaseError = (error: any): AppError => {
  const timestamp = new Date();
  
  // Erro de rede
  if (error.message?.includes('fetch') || error.message?.includes('network')) {
    return {
      type: ErrorType.NETWORK,
      message: error.message,
      details: error,
      timestamp,
      userMessage: 'Problema de conexão. Verifique sua internet e tente novamente.'
    };
  }
  
  // Erro de autenticação
  if (error.message?.includes('auth') || error.status === 401) {
    return {
      type: ErrorType.AUTHENTICATION,
      message: error.message,
      details: error,
      timestamp,
      userMessage: 'Sessão expirada. Faça login novamente.'
    };
  }
  
  // Erro de validação do banco
  if (error.message?.includes('constraint') || error.message?.includes('check')) {
    return {
      type: ErrorType.VALIDATION,
      message: error.message,
      details: error,
      timestamp,
      userMessage: 'Dados inválidos. Verifique as informações e tente novamente.'
    };
  }
  
  // Erro de banco de dados
  if (error.code || error.message?.includes('database')) {
    return {
      type: ErrorType.DATABASE,
      message: error.message,
      details: error,
      timestamp,
      userMessage: 'Erro interno do sistema. Tente novamente em alguns instantes.'
    };
  }
  
  // Erro desconhecido
  return {
    type: ErrorType.UNKNOWN,
    message: error.message || 'Erro desconhecido',
    details: error,
    timestamp,
    userMessage: 'Ocorreu um erro inesperado. Tente novamente.'
  };
};

// Sistema de retry automático
export interface RetryOptions {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier: number;
}

export const withRetry = async <T>(
  operation: () => Promise<T>,
  options: RetryOptions = {
    maxAttempts: 3,
    delayMs: 1000,
    backoffMultiplier: 2
  }
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Se é o último attempt, não tenta novamente
      if (attempt === options.maxAttempts) {
        break;
      }
      
      // Se é erro de validação, não tenta novamente
      const appError = classifySupabaseError(error);
      if (appError.type === ErrorType.VALIDATION || appError.type === ErrorType.AUTHENTICATION) {
        break;
      }
      
      // Aguarda antes de tentar novamente
      const delay = options.delayMs * Math.pow(options.backoffMultiplier, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// Logger de erros
export const logError = (error: AppError, context?: string) => {
  console.error(`[${error.type}] ${context || 'Unknown context'}:`, {
    message: error.message,
    userMessage: error.userMessage,
    timestamp: error.timestamp,
    details: error.details
  });
  
  // Aqui você pode integrar com serviços como Sentry, LogRocket, etc.
  // Sentry.captureException(error);
};