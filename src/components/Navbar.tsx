import { Calendar, Users, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
  return (
    <nav className="bg-card border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            ✂️
          </div>
          <h1 className="text-xl font-bold text-foreground">Barbearia Premium</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={activeTab === "agendamentos" ? "default" : "ghost"}
            onClick={() => onTabChange("agendamentos")}
            className="flex items-center space-x-2"
          >
            <Calendar className="h-4 w-4" />
            <span>Agendamentos</span>
          </Button>
          
          <Button
            variant={activeTab === "clientes" ? "default" : "ghost"}
            onClick={() => onTabChange("clientes")}
            className="flex items-center space-x-2"
          >
            <Users className="h-4 w-4" />
            <span>Clientes</span>
          </Button>
          
          <Button
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            onClick={() => onTabChange("dashboard")}
            className="flex items-center space-x-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Dashboard</span>
          </Button>
          
          <Button
            variant={activeTab === "configuracoes" ? "default" : "ghost"}
            onClick={() => onTabChange("configuracoes")}
            className="flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};