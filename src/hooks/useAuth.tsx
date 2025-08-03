import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface Admin {
  id: string;
  email: string;
  name: string;
  role: string | null;
}

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  login: (adminData: Admin) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há dados de admin salvos no localStorage
    const savedAdmin = localStorage.getItem('admin');
    if (savedAdmin) {
      try {
        const adminData = JSON.parse(savedAdmin);
        setAdmin(adminData);
      } catch (error) {
        console.error('Erro ao carregar dados do admin:', error);
        localStorage.removeItem('admin');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (adminData: Admin) => {
    setAdmin(adminData);
    localStorage.setItem('admin', JSON.stringify(adminData));
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
  };

  const value = {
    admin,
    isAuthenticated: !!admin,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

