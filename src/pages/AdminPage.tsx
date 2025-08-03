import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { AgendamentosPanel } from "@/components/AgendamentosPanel";
import { ClientesPanel } from "@/components/ClientesPanel";
import { DashboardPanel } from "@/components/DashboardPanel";
import { ConfiguracoesPanel } from "@/components/ConfiguracoesPanel";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("agendamentos");
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "agendamentos":
        return <AgendamentosPanel />;
      case "clientes":
        return <ClientesPanel />;
      case "dashboard":
        return <DashboardPanel />;
      case "configuracoes":
        return <ConfiguracoesPanel />;
      default:
        return <AgendamentosPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-600" />
            <span className="text-sm text-gray-700">
              Bem-vindo, <strong>{admin?.name}</strong>
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </Button>
        </div>
      </div>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto px-6 py-8">
        {renderContent()}
      </main>
    </div>
  );
}