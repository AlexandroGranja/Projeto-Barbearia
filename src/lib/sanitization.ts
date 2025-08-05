// Funções de sanitização de dados
export const sanitizeString = (input: string): string => {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove caracteres HTML básicos
    .replace(/\s+/g, ' '); // Normaliza espaços múltiplos
};

export const sanitizeEmail = (email: string): string => {
  if (!email) return '';
  
  return email
    .trim()
    .toLowerCase()
    .replace(/[<>]/g, '');
};

export const sanitizePhone = (phone: string): string => {
  if (!phone) return '';
  
  // Remove tudo exceto números, parênteses, espaços e hífens
  return phone
    .trim()
    .replace(/[^0-9()\s-]/g, '');
};

export const sanitizeObservations = (observations: string): string => {
  if (!observations) return '';
  
  return observations
    .trim()
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .substring(0, 500); // Limita a 500 caracteres
};

// Função para sanitizar dados completos do formulário
export const sanitizeQueueFormData = (data: any): QueueFormData => {
  return {
    client_name: sanitizeString(data.client_name || ''),
    client_email: sanitizeEmail(data.client_email || ''),
    client_phone: sanitizePhone(data.client_phone || ''),
    haircut_type_id: sanitizeString(data.haircut_type_id || ''),
    observations: sanitizeObservations(data.observations || '')
  };
};

export interface QueueFormData {
  client_name: string;
  client_email: string;
  client_phone?: string;
  haircut_type_id: string;
  observations?: string;
}