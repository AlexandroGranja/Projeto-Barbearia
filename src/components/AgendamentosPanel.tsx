import { useState } from "react";
import { Calendar, Clock, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Agendamento } from "@/types/barbershop";
import { agendamentosMock } from "@/data/mockData";
import { NovoAgendamentoDialog } from "./NovoAgendamentoDialog";

export const AgendamentosPanel = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(agendamentosMock);
  const [filtro, setFiltro] = useState("");
  const [dialogAberto, setDialogAberto] = useState(false);

  const getStatusColor = (status: Agendamento['status']) => {
    switch (status) {
      case "agendado":
        return "bg-primary text-primary-foreground";
      case "concluido":
        return "bg-success text-success-foreground";
      case "cancelado":
        return "bg-destructive text-destructive-foreground";
      case "andamento":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status: Agendamento['status']) => {
    switch (status) {
      case "agendado":
        return "Agendado";
      case "concluido":
        return "Concluído";
      case "cancelado":
        return "Cancelado";
      case "andamento":
        return "Em Andamento";
      default:
        return status;
    }
  };

  const formatarDataHora = (data: Date) => {
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const agendamentosFiltrados = agendamentos.filter(agendamento =>
    agendamento.cliente.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    agendamento.servico.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  const adicionarAgendamento = (novoAgendamento: Agendamento) => {
    setAgendamentos([...agendamentos, novoAgendamento]);
  };

  const atualizarStatus = (id: string, novoStatus: Agendamento['status']) => {
    setAgendamentos(agendamentos.map(agendamento =>
      agendamento.id === id ? { ...agendamento, status: novoStatus } : agendamento
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Agendamentos</h2>
          <p className="text-muted-foreground">Gerencie todos os agendamentos da barbearia</p>
        </div>
        <Button onClick={() => setDialogAberto(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Novo Agendamento</span>
        </Button>
      </div>

      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por cliente ou serviço..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>Filtros</span>
        </Button>
      </div>

      <div className="grid gap-4">
        {agendamentosFiltrados.map((agendamento) => (
          <Card key={agendamento.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{agendamento.cliente.nome}</CardTitle>
                  <p className="text-muted-foreground">{agendamento.cliente.telefone}</p>
                </div>
                <Badge className={getStatusColor(agendamento.status)}>
                  {getStatusText(agendamento.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formatarDataHora(agendamento.dataHora)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{agendamento.servico.nome} • {agendamento.servico.duracaoMinutos}min</span>
                </div>
                <div className="text-sm font-semibold text-right">
                  R$ {agendamento.valorFinal.toFixed(2)}
                </div>
              </div>
              
              {agendamento.observacoes && (
                <div className="mt-3 p-2 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">{agendamento.observacoes}</p>
                </div>
              )}

              <div className="flex justify-end space-x-2 mt-4">
                {agendamento.status === "agendado" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => atualizarStatus(agendamento.id, "andamento")}
                    >
                      Iniciar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => atualizarStatus(agendamento.id, "cancelado")}
                    >
                      Cancelar
                    </Button>
                  </>
                )}
                {agendamento.status === "andamento" && (
                  <Button
                    size="sm"
                    onClick={() => atualizarStatus(agendamento.id, "concluido")}
                  >
                    Finalizar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <NovoAgendamentoDialog
        aberto={dialogAberto}
        onClose={() => setDialogAberto(false)}
        onSalvar={adicionarAgendamento}
      />
    </div>
  );
};