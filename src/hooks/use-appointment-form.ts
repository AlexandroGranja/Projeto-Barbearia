import { useState, useCallback } from 'react';
import { useAsyncOperation } from './use-async-operation';
import { useToast } from './use-toast';

interface AppointmentFormData {
  clienteId: string;
  servicoId: string;
  data: string;
  hora: string;
  observacoes: string;
}

interface UseAppointmentFormOptions {
  onSuccess?: (appointment: any) => void;
  onError?: (error: any) => void;
}

export const useAppointmentForm = (options: UseAppointmentFormOptions = {}) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<AppointmentFormData>({
    clienteId: '',
    servicoId: '',
    data: '',
    hora: '',
    observacoes: ''
  });

  const [errors, setErrors] = useState<string[]>([]);

  const submitOperation = useAsyncOperation({
    enableRetry: true,
    onSuccess: (data) => {
      toast({
        title: "Sucesso!",
        description: "Agendamento criado com sucesso.",
      });
      resetForm();
      options.onSuccess?.(data);
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

  const updateField = useCallback((field: keyof AppointmentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors([]);
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      clienteId: '',
      servicoId: '',
      data: '',
      hora: '',
      observacoes: ''
    });
    setErrors([]);
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: string[] = [];

    if (!formData.clienteId) newErrors.push('Cliente é obrigatório');
    if (!formData.servicoId) newErrors.push('Serviço é obrigatório');
    if (!formData.data) newErrors.push('Data é obrigatória');
    if (!formData.hora) newErrors.push('Hora é obrigatória');

    // Validar se a data não é no passado
    const selectedDate = new Date(`${formData.data}T${formData.hora}`);
    if (selectedDate < new Date()) {
      newErrors.push('Data e hora devem ser no futuro');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  }, [formData]);

  const submitForm = useCallback(async (clientesMock: any[], servicosMock: any[]) => {
    if (!validateForm()) {
      return false;
    }

    await submitOperation.execute(async () => {
      const cliente = clientesMock.find(c => c.id === formData.clienteId);
      const servico = servicosMock.find(s => s.id === formData.servicoId);

      if (!cliente || !servico) {
        throw new Error('Cliente ou serviço não encontrado');
      }

      const dataHora = new Date(`${formData.data}T${formData.hora}`);
      
      const novoAgendamento = {
        id: Date.now().toString(),
        clienteId: formData.clienteId,
        cliente,
        servicoId: formData.servicoId,
        servico,
        dataHora,
        status: "agendado",
        observacoes: formData.observacoes,
        valorFinal: servico.preco
      };

      // Aqui você integraria com o Supabase para salvar o agendamento
      // const { error } = await supabase.from('appointments').insert(novoAgendamento);
      // if (error) throw error;

      return novoAgendamento;
    });

    return true;
  }, [formData, validateForm, submitOperation]);

  return {
    formData,
    isLoading: submitOperation.isLoading,
    errors,
    updateField,
    resetForm,
    submitForm,
    clearErrors: () => setErrors([])
  };
};