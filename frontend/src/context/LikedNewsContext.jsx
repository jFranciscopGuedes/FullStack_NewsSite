import { createContext, useContext, useState, useEffect } from "react";
import { getUserLikes, likeNews, unlikeNews } from "../api/likesApi";
import { useAuth } from "./AuthContext";

const LikedNewsContext = createContext();

export function useLikedNews() {
  return useContext(LikedNewsContext);
}

export function LikedNewsProvider({ children }) {
  const { token, userId } = useAuth();
  const [likedNews, setLikedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchLikedNews() {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getUserLikes(token);
      // se data for mensagem, retorna array vazio
      setLikedNews(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar notícias com like.");
      setLikedNews([]); // garante array vazio
    } finally {
      setLoading(false);
    }
  }

  async function handleLike(newsId) {
    if (!token) return;
    try {
      await likeNews(newsId, token);
      await fetchLikedNews(); // atualiza lista de likedNews
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUnlike(newsId) {
    if (!token) return;
    try {
      await unlikeNews(newsId, token);
      await fetchLikedNews();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchLikedNews();
  }, [token]);

  const value = {
    likedNews,
    loading,
    error,
    handleLike,
    handleUnlike,
  };

  return (
    <LikedNewsContext.Provider value={value}>
      {children}
    </LikedNewsContext.Provider>
  );
}
