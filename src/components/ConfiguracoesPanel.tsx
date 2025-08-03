import { useState } from "react";
import { Save, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Servico } from "@/types/barbershop";
import { servicosMock } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export const ConfiguracoesPanel = () => {
  const { toast } = useToast();
  const [servicos, setServicos] = useState<Servico[]>(servicosMock);
  const [novoServico, setNovoServico] = useState({
    nome: "",
    preco: "",
    duracaoMinutos: "",
    descricao: ""
  });

  const [configGeral, setConfigGeral] = useState({
    nomeBarbearia: "Barbearia Premium",
    horarioAbertura: "08:00",
    horarioFechamento: "18:00",
    telefone: "(11) 99999-9999",
    endereco: "Rua das Flores, 123 - Centro"
  });

  const adicionarServico = () => {
    if (!novoServico.nome || !novoServico.preco || !novoServico.duracaoMinutos) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const servico: Servico = {
      id: Date.now().toString(),
      nome: novoServico.nome,
      preco: parseFloat(novoServico.preco),
      duracaoMinutos: parseInt(novoServico.duracaoMinutos),
      descricao: novoServico.descricao
    };

    setServicos([...servicos, servico]);
    setNovoServico({ nome: "", preco: "", duracaoMinutos: "", descricao: "" });
    
    toast({
      title: "Sucesso",
      description: "Serviço adicionado com sucesso!",
    });
  };

  const removerServico = (id: string) => {
    setServicos(servicos.filter(s => s.id !== id));
    toast({
      title: "Sucesso",
      description: "Serviço removido com sucesso!",
    });
  };

  const salvarConfigGeral = () => {
    toast({
      title: "Sucesso",
      description: "Configurações salvas com sucesso!",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Configurações</h2>
        <p className="text-muted-foreground">Gerencie as configurações da sua barbearia</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomeBarbearia">Nome da Barbearia</Label>
              <Input
                id="nomeBarbearia"
                value={configGeral.nomeBarbearia}
                onChange={(e) => setConfigGeral({...configGeral, nomeBarbearia: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="horarioAbertura">Horário de Abertura</Label>
                <Input
                  id="horarioAbertura"
                  type="time"
                  value={configGeral.horarioAbertura}
                  onChange={(e) => setConfigGeral({...configGeral, horarioAbertura: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horarioFechamento">Horário de Fechamento</Label>
                <Input
                  id="horarioFechamento"
                  type="time"
                  value={configGeral.horarioFechamento}
                  onChange={(e) => setConfigGeral({...configGeral, horarioFechamento: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={configGeral.telefone}
                onChange={(e) => setConfigGeral({...configGeral, telefone: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Textarea
                id="endereco"
                value={configGeral.endereco}
                onChange={(e) => setConfigGeral({...configGeral, endereco: e.target.value})}
                rows={2}
              />
            </div>

            <Button onClick={salvarConfigGeral} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>

        {/* Adicionar Novo Serviço */}
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Novo Serviço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomeServico">Nome do Serviço *</Label>
              <Input
                id="nomeServico"
                placeholder="Ex: Corte Masculino"
                value={novoServico.nome}
                onChange={(e) => setNovoServico({...novoServico, nome: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="precoServico">Preço (R$) *</Label>
                <Input
                  id="precoServico"
                  type="number"
                  step="0.01"
                  placeholder="25.00"
                  value={novoServico.preco}
                  onChange={(e) => setNovoServico({...novoServico, preco: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duracaoServico">Duração (min) *</Label>
                <Input
                  id="duracaoServico"
                  type="number"
                  placeholder="30"
                  value={novoServico.duracaoMinutos}
                  onChange={(e) => setNovoServico({...novoServico, duracaoMinutos: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricaoServico">Descrição</Label>
              <Textarea
                id="descricaoServico"
                placeholder="Descrição do serviço..."
                value={novoServico.descricao}
                onChange={(e) => setNovoServico({...novoServico, descricao: e.target.value})}
                rows={2}
              />
            </div>

            <Button onClick={adicionarServico} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Serviço
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Serviços */}
      <Card>
        <CardHeader>
          <CardTitle>Serviços Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {servicos.map((servico) => (
              <div key={servico.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <h4 className="font-medium">{servico.nome}</h4>
                  <p className="text-sm text-muted-foreground">
                    R$ {servico.preco.toFixed(2)} • {servico.duracaoMinutos} minutos
                  </p>
                  {servico.descricao && (
                    <p className="text-sm text-muted-foreground mt-1">{servico.descricao}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => removerServico(servico.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};