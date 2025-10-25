import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../api/authApi";

const AuthContext = createContext(); //Cria um contexto global

export function useAuth() {
  return useContext(AuthContext); //lê os dados do contexto atual
  //Assim, em qualquer componente basta usar const { token, logout } = useAuth() para aceder ao utilizador logado, token, etc.
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

  // Mantém sincronizado com o localStorage
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");

    if (role) localStorage.setItem("role", role);
    else localStorage.removeItem("role");

    if (userId) localStorage.setItem("userId", userId);
    else localStorage.removeItem("userId");
  }, [token, role, userId]);

  // ---- Funções principais ----
  const login = async (email,password) => {
    const data = await loginUser(email,password);
    setToken(data.token);
    setRole(data.role);
    setUserId(data.user_id); // user_id,role,token definidas no backend->return jsonify({"token": token,"role": user.role,"user_id": user.id}), 200
    return data;
  }

  const register = async(name,email,password) =>{
    const data = await registerUser(name,email,password);
    return data;
  }

  const logout = () => {
    setToken(null);
    setRole(null);
    setUserId(null);
    localStorage.clear();
  };

  const value = {
    token,
    userId,
    role,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}> {/*É o componente fornecedor do contexto.*/}
      {children}
    </AuthContext.Provider>
  );
}