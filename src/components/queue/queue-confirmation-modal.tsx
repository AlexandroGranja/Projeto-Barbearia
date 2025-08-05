import React from 'react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { QueueFormData } from '@/lib/validation';

interface QueueConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: QueueFormData;
  haircutType: {
    name: string;
    price: number;
    description?: string;
  } | null;
  estimatedPosition: number;
  estimatedWaitTime: number;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export const QueueConfirmationModal: React.FC<QueueConfirmationModalProps> = ({
  open,
  onOpenChange,
  formData,
  haircutType,
  estimatedPosition,
  estimatedWaitTime,
  onConfirm,
  onCancel,
  loading = false
}) => {
  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutos`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Confirmar Entrada na Fila"
      description="Revise suas informações antes de confirmar:"
      type="info"
      confirmText="Confirmar e Entrar na Fila"
      cancelText="Voltar e Editar"
      onConfirm={onConfirm}
      onCancel={onCancel}
      loading={loading}
    >
      <div className="space-y-4">
        {/* Informações do cliente */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700">Suas Informações</h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Nome:</span>
              <span className="text-sm font-medium">{formData.client_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Email:</span>
              <span className="text-sm font-medium">{formData.client_email}</span>
            </div>
            {formData.client_phone && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Telefone:</span>
                <span className="text-sm font-medium">{formData.client_phone}</span>
              </div>
            )}
            {formData.observations && (
              <div className="space-y-1">
                <span className="text-sm text-gray-600">Observações:</span>
                <p className="text-sm bg-white p-2 rounded border">
                  {formData.observations}
                </p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Informações do serviço */}
        {haircutType && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Serviço Selecionado</h4>
            <div className="bg-blue-50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{haircutType.name}</span>
                <Badge variant="secondary">
                  R$ {haircutType.price.toFixed(2)}
                </Badge>
              </div>
              {haircutType.description && (
                <p className="text-sm text-gray-600">{haircutType.description}</p>
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Estimativas */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700">Estimativas</h4>
          <div className="bg-green-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Posição na fila:</span>
              <Badge variant="outline">#{estimatedPosition}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tempo estimado:</span>
              <span className="text-sm font-medium text-green-700">
                {formatWaitTime(estimatedWaitTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Aviso importante */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            <strong>Importante:</strong> Você receberá uma confirmação por email. 
            Chegue com 10 minutos de antecedência quando for sua vez.
          </p>
        </div>
      </div>
    </ConfirmationDialog>
  );
};