import React, { useEffect, useState } from "react";
import { getMyNews, deleteNews } from "../../api/newsApi";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

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
    <div className="p-4">
      <h1>Minhas Notícias</h1>
      <Link to="/admin/news/create" className="btn btn-primary">
        + Criar Nova Notícia
      </Link>
      <ul>
        {news.map((n) => (
          <li key={n.id}>
            <strong>{n.title}</strong> — {n.categoryName}
            <br />
            <Link to={`/admin/news/edit/${n.id}`}>Editar</Link>
            {" | "}
            <button onClick={() => handleDelete(n.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyNewsPage;
