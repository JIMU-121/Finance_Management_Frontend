import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthData {
  user: User;
  role: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  role: string | null;
  token: string | null;
  login: (data: AuthData, rememberMe: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    const storedRole =
      localStorage.getItem("role") || sessionStorage.getItem("role");

    const storedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (storedUser && storedRole && storedToken) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
      setToken(storedToken);
    }
  }, []);

  const login = (data: AuthData, rememberMe: boolean) => {
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem("user", JSON.stringify(data.user));
    storage.setItem("role", data.role);
    storage.setItem("token", data.token);

    setUser(data.user);
    setRole(data.role);
    setToken(data.token);
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    setRole(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};