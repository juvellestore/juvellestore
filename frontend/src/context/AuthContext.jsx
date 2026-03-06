import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import api from "../api/axios.js";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    localStorage.getItem("juvelle_token"),
  );
  const [loading, setLoading] = useState(true);
  // Track whether we've already done the initial session restore
  const restoredRef = useRef(false);

  // Restore session only once on mount using the initial token value
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    const initialToken = localStorage.getItem("juvelle_token");
    const restore = async () => {
      if (initialToken) {
        try {
          const res = await api.get("/api/auth/me");
          setUser(res.data.user);
        } catch {
          localStorage.removeItem("juvelle_token");
          setToken(null);
        }
      }
      setLoading(false);
    };
    restore();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });
    const { token: t, user: u } = res.data;
    localStorage.setItem("juvelle_token", t);
    setToken(t);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (data) => {
    const res = await api.post("/api/auth/register", data);
    const { token: t, user: u } = res.data;
    localStorage.setItem("juvelle_token", t);
    setToken(t);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("juvelle_token");
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthContext;
