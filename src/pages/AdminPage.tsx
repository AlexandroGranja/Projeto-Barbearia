import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { AgendamentosPanel } from "@/components/AgendamentosPanel";
import { ClientesPanel } from "@/components/ClientesPanel";
import { DashboardPanel } from "@/components/DashboardPanel";
import { ConfiguracoesPanel } from "@/components/ConfiguracoesPanel";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("agendamentos");

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
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto px-6 py-8">
        {renderContent()}
      </main>
    </div>
  );
}