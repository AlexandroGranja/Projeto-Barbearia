import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, Phone, Mail } from 'lucide-react';

interface DuplicateWarningProps {
  lastEntry: {
    client_name: string;
    client_email: string;
    client_phone?: string;
    added_at: string;
    position: number;
    status: string;
    haircut_type?: {
      name: string;
      price: number;
    };
  };
  cooldownMinutes: number;
  onViewQueue?: () => void;
  onContactSupport?: () => void;
}

export const DuplicateWarning: React.FC<DuplicateWarningProps> = ({
  lastEntry,
  cooldownMinutes,
  onViewQueue,
  onContactSupport
}) => {
  const timeDiff = Math.floor(
    (new Date().getTime() - new Date(lastEntry.added_at).getTime()) / (1000 * 60)
  );
  
  const remainingTime = Math.max(0, cooldownMinutes - timeDiff);
  
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutos`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting': return 'Aguardando';
      case 'in_progress': return 'Em andamento';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  return (
    <Alert className="border-yellow-200 bg-yellow-50">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800">
        Você já está na fila!
      </AlertTitle>
      <AlertDescription className="space-y-4">
        <p className="text-yellow-700">
          Encontramos um agendamento recente em seu nome. Para evitar duplicatas, 
          você só pode fazer um novo agendamento após {formatTime(cooldownMinutes)}.
        </p>
        
        {/* Informações do agendamento existente */}
        <div className="bg-white rounded-lg p-3 border border-yellow-200">
          <h4 className="font-medium text-sm text-gray-700 mb-2">
            Seu agendamento atual:
          </h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <Badge className={getStatusColor(lastEntry.status)}>
                {getStatusText(lastEntry.status)}
              </Badge>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Posição:</span>
              <span className="font-medium">#{lastEntry.position}</span>
            </div>
            
            {lastEntry.haircut_type && (
              <div className="flex justify-between">
                <span className="text-gray-600">Serviço:</span>
                <span className="font-medium">{lastEntry.haircut_type.name}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-600">Agendado há:</span>
              <span className="font-medium">{formatTime(timeDiff)}</span>
            </div>
          </div>
        </div>

        {/* Tempo restante */}
        {remainingTime > 0 && (
          <div className="bg-yellow-100 rounded-lg p-3 border border-yellow-300">
            <div className="flex items-center gap-2 text-yellow-800">
              <Clock className="h-4 w-4" />
              <span className="font-medium">
                Novo agendamento disponível em: {formatTime(remainingTime)}
              </span>
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-2">
          {onViewQueue && (
            <Button variant="outline" size="sm" onClick={onViewQueue}>
              Ver Fila Atual
            </Button>
          )}
          
          {onContactSupport && (
            <Button variant="outline" size="sm" onClick={onContactSupport}>
              <Phone className="h-4 w-4 mr-2" />
              Contatar Suporte
            </Button>
          )}
        </div>

        {/* Informações de contato */}
        <div className="text-xs text-yellow-700 space-y-1">
          <p>
            <Mail className="h-3 w-3 inline mr-1" />
            Você receberá atualizações no email: {lastEntry.client_email}
          </p>
          {lastEntry.client_phone && (
            <p>
              <Phone className="h-3 w-3 inline mr-1" />
              Telefone cadastrado: {lastEntry.client_phone}
            </p>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};