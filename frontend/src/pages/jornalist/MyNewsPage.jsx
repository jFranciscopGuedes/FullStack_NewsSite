import React, { useEffect, useState } from "react";
import { getMyNews, deleteNews } from "../../api/newsApi";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "../../css/MyNewsPage.css";

function MyNewsPage() {
  const { token } = useAuth();
  const [news, setNews] = useState([]);

  async function fetchNews() {
    try {
      const data = await getMyNews(token);
      setNews(data);
    } catch (err) {
      console.error("Erro ao buscar notícias:", err);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que quer eliminar esta notícia?")) return;
    try {
      await deleteNews(token, id);
      fetchNews();
    } catch (err) {
      console.error("Erro ao eliminar:", err);
    }
  }

  useEffect(() => {
    fetchNews();
  }, [token]);

  return (
    <div className="my-news-page-container">
      <h1>Minhas Notícias</h1>
      <Link to="/admin/news/create" className="create-news-link">
        + Criar Nova Notícia
      </Link>
      <ul className="my-news-list">
        {news.map((n) => (
          <li key={n.id}>
            <strong>{n.title}</strong> — <span>{n.categoryName}</span>{" "}
            {/* Envolve a categoria num span */}
            <div className="my-news-actions">
              {" "}
              {/* Agrupa os botões de ação */}
              <Link to={`/admin/news/edit/${n.id}`} className="edit-link">
                Editar
              </Link>
              <button
                onClick={() => handleDelete(n.id)}
                className="delete-button"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyNewsPage;
