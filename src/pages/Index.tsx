import { Link } from "react-router-dom";
import { Users, Settings, Scissors, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-6">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-primary text-primary-foreground p-3 rounded-lg">
              <Scissors className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Barbearia Premium</h1>
          </div>
          <p className="text-muted-foreground text-lg">Sistema de Gestão Completo</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {/* Área do Cliente */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Área do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Acompanhe a fila em tempo real, veja os serviços disponíveis e entre na fila de atendimento.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>Entrar na fila de atendimento</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <Scissors className="h-4 w-4 text-primary" />
                  <span>Ver serviços e preços</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Acompanhar posição na fila</span>
                </div>
              </div>
              <Link to="/cliente">
                <Button className="w-full">
                  Acessar Área do Cliente
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Área do Administrador */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto bg-secondary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Settings className="h-8 w-8 text-secondary-foreground" />
              </div>
              <CardTitle className="text-2xl">Área Administrativa</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Gerencie agendamentos, clientes, serviços e tenha acesso ao dashboard completo da barbearia.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-secondary-foreground" />
                  <span>Gerenciar agendamentos</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <Users className="h-4 w-4 text-secondary-foreground" />
                  <span>Cadastro de clientes</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <Settings className="h-4 w-4 text-secondary-foreground" />
                  <span>Dashboard e relatórios</span>
                </div>
              </div>
              <Link to="/admin">
                <Button variant="secondary" className="w-full">
                  Acessar Painel Administrativo
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Informações da Barbearia */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Horário de Funcionamento</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium">Segunda - Sexta</p>
                  <p className="text-muted-foreground">8h às 18h</p>
                </div>
                <div>
                  <p className="font-medium">Sábado</p>
                  <p className="text-muted-foreground">8h às 16h</p>
                </div>
                <div>
                  <p className="font-medium">Domingo</p>
                  <p className="text-muted-foreground">Fechado</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
