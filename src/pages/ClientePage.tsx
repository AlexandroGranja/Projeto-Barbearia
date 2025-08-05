import { useState, useEffect } from "react";
import { Clock, Users, Scissors, Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoadingButton } from "@/components/ui/loading-button";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useQueueForm } from "@/hooks/use-queue-form";

// Interfaces de tipos de dados
interface QueueItem {
  id: string;
  client_name: string;
  haircut_type_id: string | null;
  price: number;
  position: number;
  status: string;
  added_at: string;
  haircut_type?: {
    name: string;
    price: number;
  };
}

interface HaircutType {
  id: string;
  name: string;
  price: number;
  description: string | null;
  active: boolean;
}

export default function ClientePage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [haircutTypes, setHaircutTypes] = useState<HaircutType[]>([]);
  const [loading, setLoading] = useState(true);

  // Hook principal do formulário, que gerencia todos os estados e lógica
  const queueForm = useQueueForm({
    enableDuplicateCheck: true,
    cooldownMinutes: 30,
    onSuccess: () => {
      setDialogOpen(false); // Fecha o modal ao adicionar à fila
      fetchQueue(); // Atualiza a lista da fila
    },
  });

  useEffect(() => {
    fetchQueue();
    fetchHaircutTypes();
    setLoading(false);
  }, []);

  const fetchQueue = async () => {
    try {
      const { data, error } = await supabase
        .from("queue_items")
        .select(`
          *,
          haircut_types (
            name,
            price
          )
        `)
        .eq("status", "waiting")
        .order("position", { ascending: true });

      if (error) throw error;
      setQueue(data || []);
    } catch (error) {
      console.error("Erro ao buscar fila:", error);
    }
  };

  const fetchHaircutTypes = async () => {
    try {
      const { data, error } = await supabase
        .from("haircut_types")
        .select("*")
        .eq("active", true)
        .order("name");

      if (error) throw error;
      setHaircutTypes(data || []);
    } catch (error) {
      console.error("Erro ao buscar tipos de corte:", error);
    }
  };

  const handleSubmit = async () => {
    await queueForm.submitForm(haircutTypes);
  };

  const getEstimatedWaitTime = (position: number) => {
    // Estima 30 minutos por pessoa
    const minutes = position * 30;
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border p-6">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary text-primary-foreground p-3 rounded-lg">
                <Scissors className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Barbearia Premium</h1>
                <p className="text-muted-foreground">Acompanhe a fila em tempo real</p>
              </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Entrar na Fila</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Entrar na Fila</DialogTitle>
                </DialogHeader>
                
                {/* Mostrar erros de validação */}
                {queueForm.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                    <h4 className="text-red-800 font-medium mb-2">Corrija os seguintes erros:</h4>
                    <ul className="text-red-700 text-sm space-y-1">
                      {queueForm.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Aviso de duplicata */}
                {queueForm.duplicateInfo.isDuplicate && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                    <p className="text-yellow-800 text-sm">{queueForm.duplicateInfo.message}</p>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo *</Label>
                    <Input
                      id="name"
                      value={queueForm.formData.client_name}
                      onChange={(e) => queueForm.updateField('client_name', e.target.value)}
                      placeholder="Digite seu nome completo"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={queueForm.formData.client_email}
                      onChange={(e) => queueForm.updateField('client_email', e.target.value)}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone (opcional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={queueForm.formData.client_phone}
                      onChange={(e) => queueForm.updateField('client_phone', e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="service">Tipo de Corte *</Label>
                    <Select 
                      value={queueForm.formData.haircut_type_id} 
                      onValueChange={(value) => queueForm.updateField('haircut_type_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de corte" />
                      </SelectTrigger>
                      <SelectContent>
                        {haircutTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name} - R$ {type.price.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="observations">Observações (opcional)</Label>
                    <Textarea
                      id="observations"
                      value={queueForm.formData.observations}
                      onChange={(e) => queueForm.updateField('observations', e.target.value)}
                      placeholder="Alguma observação especial?"
                      maxLength={500}
                      rows={3}
                    />
                    <p className="text-xs text-gray-500">
                      {queueForm.formData.observations.length}/500 caracteres
                    </p>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <LoadingButton 
                    onClick={handleSubmit}
                    loading={queueForm.isLoading}
                    loadingText="Adicionando à fila..."
                    disabled={queueForm.duplicateInfo.isDuplicate}
                  >
                    Entrar na Fila
                  </LoadingButton>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Fila Atual */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Fila de Atendimento</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {queue.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Fila vazia</h3>
                      <p className="text-muted-foreground">Seja o primeiro a entrar na fila!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {queue.map((item, index) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold">{item.client_name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {item.haircut_type?.name || "Serviço não especificado"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={index === 0 ? "default" : "secondary"}>
                              {index === 0 ? "Sendo atendido" : `${index + 1}º na fila`}
                            </Badge>
                            {index > 0 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Tempo estimado: {getEstimatedWaitTime(index)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Serviços Disponíveis */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Scissors className="h-5 w-5" />
                    <span>Nossos Serviços</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {haircutTypes.map((type) => (
                      <div key={type.id} className="p-4 border border-border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{type.name}</h4>
                          <span className="font-bold text-primary">R$ {type.price.toFixed(2)}</span>
                        </div>
                        {type.description && (
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Info */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Horário de Funcionamento</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Segunda - Sexta:</span>
                      <span>8h às 18h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sábado:</span>
                      <span>8h às 16h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Domingo:</span>
                      <span>Fechado</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4" />
                      <span>(11) 99999-9999</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}