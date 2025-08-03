import { useState } from "react";
import { Plus, Search, Phone, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cliente } from "@/types/barbershop";
import { clientesMock } from "@/data/mockData";

export const ClientesPanel = () => {
  const [clientes, setClientes] = useState<Cliente[]>(clientesMock);
  const [filtro, setFiltro] = useState("");

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    cliente.telefone.includes(filtro) ||
    (cliente.email && cliente.email.toLowerCase().includes(filtro.toLowerCase()))
  );

  const formatarData = (data: Date) => {
    return data.toLocaleDateString('pt-BR');
  };

  const getStatusCliente = (totalVisitas: number) => {
    if (totalVisitas >= 10) return { label: "VIP", color: "bg-yellow-500 text-white" };
    if (totalVisitas >= 5) return { label: "Frequente", color: "bg-primary text-primary-foreground" };
    return { label: "Novo", color: "bg-muted text-muted-foreground" };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Clientes</h2>
          <p className="text-muted-foreground">Gerencie os dados dos seus clientes</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Novo Cliente</span>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar cliente por nome, telefone ou email..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clientesFiltrados.map((cliente) => {
          const status = getStatusCliente(cliente.totalVisitas);
          return (
            <Card key={cliente.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{cliente.nome}</CardTitle>
                  <Badge className={status.color}>
                    {status.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{cliente.telefone}</span>
                  </div>
                  
                  {cliente.email && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{cliente.email}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Cliente desde {formatarData(cliente.dataCadastro)}</span>
                  </div>
                  
                  <div className="pt-2 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Visitas:</span>
                      <span className="font-semibold">{cliente.totalVisitas}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total gasto:</span>
                      <span className="font-semibold">R$ {cliente.valorTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Editar
                    </Button>
                    <Button size="sm" className="flex-1">
                      Agendar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {clientesFiltrados.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum cliente encontrado.</p>
        </div>
      )}
    </div>
  );
};