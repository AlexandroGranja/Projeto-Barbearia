import { useState, useCallback } from 'react';

interface DuplicatePreventionOptions {
  cooldownMinutes?: number;
  checkEmail?: boolean;
  checkPhone?: boolean;
}

export const useDuplicatePrevention = (options: DuplicatePreventionOptions = {}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [duplicateInfo, setDuplicateInfo] = useState<{ isDuplicate: boolean; message: string } | null>(null);

  const checkForDuplicates = useCallback(async (data: any) => {
    setIsChecking(true);
    setDuplicateInfo(null);

    // Simulação de verificação de duplicatas
    // Em um ambiente real, você faria uma chamada à API ou ao banco de dados aqui
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay da rede

    const isDuplicate = false; // Altere para true para testar duplicatas
    const message = isDuplicate ? 'Já existe um registro com este email ou telefone.' : '';

    setDuplicateInfo({ isDuplicate, message });
    setIsChecking(false);
    return { isDuplicate, message };
  }, []);

  const reset = useCallback(() => {
    setDuplicateInfo(null);
  }, []);

  return {
    isChecking,
    duplicateInfo,
    checkForDuplicates,
    reset,
  };
};
