import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Agendamento, Cliente, Servico } from "@/types/barbershop";
import { clientesMock, servicosMock } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface NovoAgendamentoDialogProps {
  aberto: boolean;
  onClose: () => void;
  onSalvar: (agendamento: Agendamento) => void;
}

export const NovoAgendamentoDialog = ({ aberto, onClose, onSalvar }: NovoAgendamentoDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    clienteId: "",
    servicoId: "",
    data: "",
    hora: "",
    observacoes: ""
  });

  const resetForm = () => {
    setFormData({
      clienteId: "",
      servicoId: "",
      data: "",
      hora: "",
      observacoes: ""
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clienteId || !formData.servicoId || !formData.data || !formData.hora) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const cliente = clientesMock.find(c => c.id === formData.clienteId);
    const servico = servicosMock.find(s => s.id === formData.servicoId);

    if (!cliente || !servico) {
      toast({
        title: "Erro",
        description: "Cliente ou serviço não encontrado.",
        variant: "destructive"
      });
      return;
    }

    const dataHora = new Date(`${formData.data}T${formData.hora}`);
    
    const novoAgendamento: Agendamento = {
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

    onSalvar(novoAgendamento);
    resetForm();
    onClose();
    
    toast({
      title: "Sucesso",
      description: "Agendamento criado com sucesso!",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={aberto} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cliente">Cliente *</Label>
            <Select value={formData.clienteId} onValueChange={(value) => setFormData({...formData, clienteId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientesMock.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.nome} - {cliente.telefone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="servico">Serviço *</Label>
            <Select value={formData.servicoId} onValueChange={(value) => setFormData({...formData, servicoId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o serviço" />
              </SelectTrigger>
              <SelectContent>
                {servicosMock.map((servico) => (
                  <SelectItem key={servico.id} value={servico.id}>
                    {servico.nome} - R$ {servico.preco.toFixed(2)} ({servico.duracaoMinutos}min)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data">Data *</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({...formData, data: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hora">Hora *</Label>
              <Input
                id="hora"
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({...formData, hora: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              placeholder="Observações sobre o agendamento..."
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Agendamento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};