export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  dataCadastro: Date;
  totalVisitas: number;
  valorTotal: number;
}

export interface Servico {
  id: string;
  nome: string;
  preco: number;
  duracaoMinutos: number;
  descricao?: string;
}

export interface Agendamento {
  id: string;
  clienteId: string;
  cliente: Cliente;
  servicoId: string;
  servico: Servico;
  dataHora: Date;
  status: 'agendado' | 'concluido' | 'cancelado' | 'andamento';
  observacoes?: string;
  valorFinal: number;
}

export interface EstatisticasDia {
  atendimentos: number;
  naFila: number;
  faturamento: number;
  agendamentosHoje: number;
}