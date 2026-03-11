import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { isTokenValid } from "../utils/jwt";
import { jwtDecode } from "jwt-decode";

/** Shape of your backend's JWT payload */
interface JwtPayload {
  nameid: string;
  email: string;
  unique_name: string;
  role: string;
}

interface User {
  id: string;
  username?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber?: string;
  emergencyMobileNumber?: string;
  gender?: number; // UserGender enum int: 0=Male, 1=Female, 2=Other
  isActive?: boolean;
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
  /** True once the initial session-restore useEffect has finished */
  isInitialized: boolean;
  login: (data: AuthData, rememberMe: boolean) => void;
  logout: () => void;
  /** Update the stored user after a profile edit and re-persist to storage */
  updateUser: (updated: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  // Prevents route guards from redirecting before we've checked storage
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (storedToken && isTokenValid(storedToken)) {
      try {
        const decoded = jwtDecode<JwtPayload>(storedToken);
        console.log("Decoded JWT:", decoded);

        // Split "First Last" into separate fields
        const [firstName = "", ...rest] = decoded.unique_name.split(" ");
        const lastName = rest.join(" ");

        // Map JWT claims → User object
        const userFromToken: User = {
          id: decoded.nameid,
          firstName,
          lastName,
          email: decoded.email,
        };

        setUser(userFromToken);
        setRole(decoded.role ?? null);
        setToken(storedToken);
      } catch {
        localStorage.clear();
        sessionStorage.clear();
      }
    } else if (storedToken) {
      localStorage.clear();
      sessionStorage.clear();
    }

    // Mark as ready regardless of outcome so guards can render
    setIsInitialized(true);
  }, []);

  const login = (data: AuthData, rememberMe: boolean) => {
    const storage = rememberMe ? localStorage : sessionStorage;

    //storage.setItem("user", JSON.stringify(data.user));
    //storage.setItem("role", data.role);
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

  const updateUser = (updated: User) => {
    setUser(updated);
    // Persist to whichever storage was used at login so a page refresh stays fresh
    // const serialised = JSON.stringify(updated);
    // if (localStorage.getItem("user") !== null) {
    //   localStorage.setItem("user", serialised);
    // } else {
    //   sessionStorage.setItem("user", serialised);
    // }
  };

  return (
    <AuthContext.Provider value={{ user, role, token, isInitialized, login, logout, updateUser }}>
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