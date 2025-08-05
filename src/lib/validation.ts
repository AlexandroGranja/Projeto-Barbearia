// Funções de validação centralizadas
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateClientName = (name: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!name || name.trim().length === 0) {
    errors.push('Nome é obrigatório');
  } else if (name.trim().length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres');
  } else if (name.trim().length > 100) {
    errors.push('Nome deve ter no máximo 100 caracteres');
  } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name.trim())) {
    errors.push('Nome deve conter apenas letras e espaços');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || email.trim().length === 0) {
    errors.push('Email é obrigatório');
  } else if (!emailRegex.test(email.trim())) {
    errors.push('Email deve ter um formato válido');
  } else if (email.trim().length > 255) {
    errors.push('Email deve ter no máximo 255 caracteres');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePhone = (phone: string): ValidationResult => {
  const errors: string[] = [];
  const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  
  if (phone && phone.trim().length > 0) {
    if (!phoneRegex.test(phone.trim())) {
      errors.push('Telefone deve estar no formato (XX) XXXXX-XXXX');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateHaircutType = (haircutTypeId: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!haircutTypeId || haircutTypeId.trim().length === 0) {
    errors.push('Tipo de corte é obrigatório');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateObservations = (observations: string): ValidationResult => {
  const errors: string[] = [];
  
  if (observations && observations.trim().length > 500) {
    errors.push('Observações devem ter no máximo 500 caracteres');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Função para validar formulário completo de fila
export interface QueueFormData {
  client_name: string;
  client_email: string;
  client_phone?: string;
  haircut_type_id: string;
  observations?: string;
}

export const validateQueueForm = (data: QueueFormData): ValidationResult => {
  const allErrors: string[] = [];
  
  const nameValidation = validateClientName(data.client_name);
  const emailValidation = validateEmail(data.client_email);
  const phoneValidation = validatePhone(data.client_phone || '');
  const haircutValidation = validateHaircutType(data.haircut_type_id);
  const observationsValidation = validateObservations(data.observations || '');
  
  allErrors.push(...nameValidation.errors);
  allErrors.push(...emailValidation.errors);
  allErrors.push(...phoneValidation.errors);
  allErrors.push(...haircutValidation.errors);
  allErrors.push(...observationsValidation.errors);
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};