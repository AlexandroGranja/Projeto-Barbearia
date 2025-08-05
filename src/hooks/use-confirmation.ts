import { useState, useCallback } from 'react';

interface ConfirmationState {
  isOpen: boolean;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  confirmText: string;
  cancelText: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export const useConfirmation = () => {
  const [state, setState] = useState<ConfirmationState | null>(null);
  const [loading, setLoading] = useState(false);

  const showConfirmation = useCallback((config: Partial<ConfirmationState> & {
    title: string;
    description: string;
    onConfirm: () => void | Promise<void>;
  }) => {
    setState({
      isOpen: true,
      type: 'info',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      ...config
    });
  }, []);

  const hideConfirmation = useCallback(() => {
    setState(null);
    setLoading(false);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!state) return;

    setLoading(true);
    try {
      await state.onConfirm();
      hideConfirmation();
    } catch (error) {
      console.error('Erro na confirmação:', error);
      setLoading(false);
    }
  }, [state, hideConfirmation]);

  const handleCancel = useCallback(() => {
    if (state?.onCancel) {
      state.onCancel();
    }
    hideConfirmation();
  }, [state, hideConfirmation]);

  return {
    state,
    loading,
    showConfirmation,
    hideConfirmation,
    handleConfirm,
    handleCancel
  };
};