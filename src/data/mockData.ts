import { Cliente, Servico, Agendamento } from "@/types/barbershop";

export const servicosMock: Servico[] = [
  {
    id: "1",
    nome: "Corte Simples",
    preco: 25.00,
    duracaoMinutos: 30,
    descricao: "Corte de cabelo tradicional"
  },
  {
    id: "2", 
    nome: "Corte + Barba",
    preco: 40.00,
    duracaoMinutos: 45,
    descricao: "Corte de cabelo e barba completa"
  },
  {
    id: "3",
    nome: "Apenas Barba",
    preco: 20.00,
    duracaoMinutos: 20,
    descricao: "Apenas barba"
  },
  {
    id: "4",
    nome: "Corte Degradê",
    preco: 35.00,
    duracaoMinutos: 40,
    descricao: "Corte degradê moderno"
  },
  {
    id: "5",
    nome: "Corte Social",
    preco: 30.00,
    duracaoMinutos: 35,
    descricao: "Corte social executivo"
  }
];

export const clientesMock: Cliente[] = [
  {
    id: "1",
    nome: "João Silva",
    telefone: "(11) 99999-9999",
    email: "joao@email.com",
    dataCadastro: new Date("2024-01-15"),
    totalVisitas: 12,
    valorTotal: 480.00
  },
  {
    id: "2",
    nome: "Pedro Santos",
    telefone: "(11) 88888-8888",
    email: "pedro@email.com",
    dataCadastro: new Date("2024-02-20"),
    totalVisitas: 8,
    valorTotal: 320.00
  },
  {
    id: "3",
    nome: "Carlos Oliveira",
    telefone: "(11) 77777-7777",
    dataCadastro: new Date("2024-03-10"),
    totalVisitas: 5,
    valorTotal: 200.00
  }
];

export const agendamentosMock: Agendamento[] = [
  {
    id: "1",
    clienteId: "1",
    cliente: clientesMock[0],
    servicoId: "2",
    servico: servicosMock[1],
    dataHora: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 horas a partir de agora
    status: "agendado",
    observacoes: "Cliente prefere degradê baixo",
    valorFinal: 40.00
  },
  {
    id: "2", 
    clienteId: "2",
    cliente: clientesMock[1],
    servicoId: "1",
    servico: servicosMock[0],
    dataHora: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 horas a partir de agora
    status: "agendado",
    valorFinal: 25.00
  },
  {
    id: "3",
    clienteId: "3", 
    cliente: clientesMock[2],
    servicoId: "4",
    servico: servicosMock[3],
    dataHora: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    status: "concluido",
    valorFinal: 35.00
  }
];