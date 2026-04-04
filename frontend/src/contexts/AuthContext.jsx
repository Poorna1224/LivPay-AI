import { createContext, useContext, useState, useEffect } from "react";
import { accessAdmin, loginUser, loginAdmin, getMe, registerUser } from "../services/userService";

const AuthContext = createContext(null);
const demoWorker = {
  id: 1,
  name: "Demo Worker",
  role: "worker",
  city: "Hyderabad",
  zone: "Ameerpet",
  platform: "Swiggy",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const selectedWorker = localStorage.getItem("selected_worker");
    const token = localStorage.getItem("access_token");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (selectedWorker) {
      const parsedWorker = JSON.parse(selectedWorker);
      localStorage.setItem("user", JSON.stringify(parsedWorker));
      if (!token) {
        localStorage.removeItem("access_token");
      }
      setUser(parsedWorker);
    } else {
      setUser(demoWorker);
    }
    setLoading(false);
  }, []);

  const login = async (phone, password) => {
    const response = await loginUser(phone, password);
    localStorage.setItem("access_token", response.access_token);
    localStorage.setItem("user", JSON.stringify(response.user));
    setUser(response.user);
    return response;
  };

  const adminLogin = async (phone, admin_pin) => {
    const response = await loginAdmin(phone, admin_pin);
    localStorage.setItem("access_token", response.access_token);
    localStorage.setItem("user", JSON.stringify(response.user));
    setUser(response.user);
    return response;
  };

  const adminAccess = async (name, admin_pin) => {
    const response = await accessAdmin(name, admin_pin);
    localStorage.setItem("access_token", response.access_token);
    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.removeItem("selected_worker");
    setUser(response.user);
    return response;
  };

  const register = async (userData) => {
    const response = await registerUser(userData);
    localStorage.removeItem("access_token");
    localStorage.setItem("user", JSON.stringify(response));
    localStorage.setItem("selected_worker", JSON.stringify(response));
    setUser(response);
    return response;
  };

  const selectWorker = (worker) => {
    localStorage.setItem("selected_worker", JSON.stringify(worker));
    localStorage.setItem("user", JSON.stringify(worker));
    localStorage.removeItem("access_token");
    setUser(worker);
  };

  const clearSelectedWorker = () => {
    localStorage.removeItem("selected_worker");
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    setUser(demoWorker);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("selected_worker");
    setUser(demoWorker);
  };

  const refreshUser = async () => {
    try {
      const userData = await getMe();
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        adminLogin,
        adminAccess,
        register,
        selectWorker,
        clearSelectedWorker,
        logout,
        refreshUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isWorker: user?.role === "worker",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
