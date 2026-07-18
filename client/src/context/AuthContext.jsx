import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("vv_user");
      return savedUser && savedUser !== "undefined"
        ? JSON.parse(savedUser)
        : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("vv_token") || ""
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const save = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);

    localStorage.setItem("vv_user", JSON.stringify(userData));
    localStorage.setItem("vv_token", jwtToken);

    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${jwtToken}`;
  };

  // ================= LOGIN =================
  const login = async (email, password) => {
    setLoading(true);

    try {
      const { data } = await api.post("/users/login", {
        email,
        password,
      });

      save(data.user, data.token);

      toast.success("Login Successful 🎉");

      return data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ================= REGISTER =================
  const register = async (name, email, password, role) => {
    setLoading(true);

    try {
      const { data } = await api.post("/users/register", {
        name,
        email,
        password,
        role,
      });

      save(data.user, data.token);

      toast.success("Registration Successful 🎉");

      return data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = register;

  // ================= LOGOUT =================
  const logout = () => {
    setUser(null);
    setToken("");

    localStorage.removeItem("vv_user");
    localStorage.removeItem("vv_token");

    delete api.defaults.headers.common["Authorization"];

    toast.success("Logged Out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);