import { createContext, useContext, useState, useEffect } from "react";
import { updateUser, deleteUser } from "../api/userApi";
import { useAuth } from "./AuthContext";
import Api from "../api/Api";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const { token, userId, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carrega dados completos do usuário via /users/me
  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    async function fetchUser() {
      try {
        const res = await Api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar usuário");
        setUser({ id: userId }); // fallback
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [token, userId]);

  // Atualiza dados do usuário
  async function handleUpdate(updatedData) {
    if (!token) return;
    try {
      const data = await updateUser(token, updatedData);
      setUser(prev => ({ ...prev, ...updatedData })); // atualiza local
      return data;
    } catch (err) {
      console.error(err);
      setError("Erro ao atualizar perfil");
    }
  }

  // Deleta usuário e faz logout
  async function handleDelete() {
    if (!token) return;
    try {
      await deleteUser(token);
      logout();
    } catch (err) {
      console.error(err);
      setError("Erro ao deletar conta");
    }
  }

  const value = {
    user,
    loading,
    error,
    handleUpdate,
    handleDelete,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
