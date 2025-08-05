import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAsyncOperation } from './use-async-operation';
import { useFormValidation } from './use-form-validation';
import { useDuplicatePrevention } from './use-duplicate-prevention';
import { QueueFormData } from '@/lib/validation';
import { useToast } from './use-toast';
import { useConfirmation } from './use-confirmation';
import { useRateLimit } from '@/lib/rate-limiting';
import { QueueConfirmationModal } from '@/components/queue/queue-confirmation-modal';

interface UseQueueFormOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
  enableDuplicateCheck?: boolean;
  cooldownMinutes?: number;
}

export const useQueueForm = (options: UseQueueFormOptions = {}) => {
  const { toast } = useToast();
  
  // Estados do formulário
  const [formData, setFormData] = useState<QueueFormData>({
    client_name: '',
    client_email: '',
    client_phone: '',
    haircut_type_id: '',
    observations: ''
  });

  // Hooks auxiliares
  const validation = useFormValidation({ 
    validateOnChange: false, 
    sanitizeOnChange: true 
  });

  const duplicateCheck = useDuplicatePrevention({
    cooldownMinutes: options.cooldownMinutes || 30,
    checkEmail: true,
    checkPhone: true
  });

  const confirmation = useConfirmation();
  const rateLimit = useRateLimit(formData.client_email || 'anonymous');

  const submitOperation = useAsyncOperation({
    enableRetry: true,
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Você foi adicionado à fila com sucesso.",
      });
      resetForm();
      options.onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.userMessage,
        variant: "destructive",
      });
      options.onError?.(error);
    }
  });

  // Atualizar campo específico
  const updateField = useCallback((field: keyof QueueFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validation.clearErrors();
    duplicateCheck.reset();
  }, [validation, duplicateCheck]);

  // Resetar formulário
  const resetForm = useCallback(() => {
    setFormData({
      client_name: '',
      client_email: '',
      client_phone: '',
      haircut_type_id: '',
      observations: ''
    });
    validation.clearErrors();
    duplicateCheck.reset();
  }, [validation, duplicateCheck]);

  // Submeter formulário
  const submitForm = useCallback(async (haircutTypes: any[], skipConfirmation = false) => {
    // Verificar rate limiting
    if (!rateLimit.isAllowed()) {
      const remainingTime = Math.ceil(rateLimit.getRemainingTime() / 1000 / 60);
      toast({
        title: "Muitas tentativas",
        description: `Aguarde ${remainingTime} minutos antes de tentar novamente.`,
        variant: "destructive",
      });
      return false;
    }

    // Validar dados
    const validationResult = validation.validateForm(formData);
    
    if (!validationResult.isValid) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, corrija os erros no formulário.",
        variant: "destructive",
      });
      return false;
    }

    // Verificar duplicatas se habilitado
    if (options.enableDuplicateCheck) {
      const duplicateResult = await duplicateCheck.checkForDuplicates(formData);
      
      if (duplicateResult.isDuplicate) {
        toast({
          title: "Agendamento Duplicado",
          description: duplicateResult.message,
          variant: "destructive",
        });
        return false;
      }
    }

    // Se não deve pular confirmação, mostrar modal
    if (!skipConfirmation) {
      const selectedHaircut = haircutTypes.find(h => h.id === formData.haircut_type_id);
      
      confirmation.showConfirmation({
        title: 'Confirmar Entrada na Fila',
        description: 'Revise suas informações antes de confirmar',
        type: 'info',
        confirmText: 'Confirmar e Entrar na Fila',
        onConfirm: () => submitForm(haircutTypes, true)
      });
      
      return false;
    }

    // Submissão real
    await submitOperation.execute(async () => {
      const selectedHaircut = haircutTypes.find(h => h.id === formData.haircut_type_id);
      if (!selectedHaircut) {
        throw new Error("Tipo de corte não encontrado");
      }

      // Buscar próxima posição na fila
      const { data: lastItem } = await supabase
        .from("queue_items")
        .select("position")
        .order("position", { ascending: false })
        .limit(1);

      const nextPosition = lastItem && lastItem.length > 0 ? lastItem[0].position + 1 : 1;

      // Inserir na fila
      const { error } = await supabase
        .from("queue_items")
        .insert({
          client_name: validationResult.sanitizedData.client_name,
          client_email: validationResult.sanitizedData.client_email,
          client_phone: validationResult.sanitizedData.client_phone || null,
          haircut_type_id: validationResult.sanitizedData.haircut_type_id,
          price: selectedHaircut.price,
          position: nextPosition,
          status: "waiting",
          observations: validationResult.sanitizedData.observations || null
        });

      if (error) throw error;

      return { success: true };
    });

    return true;
  }, [formData, validation, duplicateCheck, submitOperation, options, toast, confirmation, rateLimit]);

  return {
    // Estados
    formData,
    isLoading: submitOperation.isLoading || duplicateCheck.isChecking,
    errors: validation.errors,
    isValid: validation.isValid,
    duplicateInfo: duplicateCheck.duplicateInfo,
    
    // Ações
    updateField,
    resetForm,
    submitForm,
    
    // Utilitários
    clearErrors: validation.clearErrors,
    addError: validation.addError
  };
};