import { Calendar, Users, DollarSign, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { agendamentosMock, clientesMock } from "@/data/mockData";

export const DashboardPanel = () => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);

  // Estatísticas de hoje
  const agendamentosHoje = agendamentosMock.filter(a => {
    const dataAgendamento = new Date(a.dataHora);
    dataAgendamento.setHours(0, 0, 0, 0);
    return dataAgendamento.getTime() === hoje.getTime();
  });

  const agendamentosConcluidos = agendamentosMock.filter(a => a.status === 'concluido');
  const faturamentoHoje = agendamentosHoje
    .filter(a => a.status === 'concluido')
    .reduce((total, a) => total + a.valorFinal, 0);

  const proximosAgendamentos = agendamentosMock
    .filter(a => a.dataHora > new Date() && a.status === 'agendado')
    .sort((a, b) => a.dataHora.getTime() - b.dataHora.getTime())
    .slice(0, 5);

  const totalClientes = clientesMock.length;
  const clientesAtivos = clientesMock.filter(c => c.totalVisitas > 0).length;

  const formatarDataHora = (data: Date) => {
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Visão geral do seu negócio</p>
      </div>

      {/* Cards de estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agendamentosHoje.length}</div>
            <p className="text-xs text-muted-foreground">
              {agendamentosHoje.filter(a => a.status === 'concluido').length} concluídos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Hoje</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {faturamentoHoje.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Média: R$ {agendamentosHoje.length > 0 ? (faturamentoHoje / agendamentosHoje.length).toFixed(2) : '0,00'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClientes}</div>
            <p className="text-xs text-muted-foreground">
              {clientesAtivos} clientes ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Agendamento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {proximosAgendamentos.length > 0 
                ? formatarDataHora(proximosAgendamentos[0].dataHora)
                : 'Nenhum agendamento'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {proximosAgendamentos.length > 0 
                ? proximosAgendamentos[0].cliente.nome
                : 'Agenda livre'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Seção de próximos agendamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Próximos Agendamentos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {proximosAgendamentos.length > 0 ? (
                proximosAgendamentos.map((agendamento) => (
                  <div key={agendamento.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{agendamento.cliente.nome}</p>
                      <p className="text-sm text-muted-foreground">{agendamento.servico.nome}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatarDataHora(agendamento.dataHora)}</p>
                      <p className="text-sm text-muted-foreground">R$ {agendamento.valorFinal.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum agendamento próximo
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Clientes VIP</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clientesMock
                .sort((a, b) => b.valorTotal - a.valorTotal)
                .slice(0, 5)
                .map((cliente) => (
                  <div key={cliente.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{cliente.nome}</p>
                      <p className="text-sm text-muted-foreground">{cliente.totalVisitas} visitas</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">R$ {cliente.valorTotal.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Total gasto</p>
                    </div>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};