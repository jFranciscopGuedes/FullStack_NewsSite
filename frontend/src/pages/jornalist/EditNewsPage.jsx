import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNewsById, updateNews, deleteNews } from "../../api/newsApi";
import { getAllCategories } from "../../api/categoryApi";
import { useAuth } from "../../context/AuthContext";

function EditNewsPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [news, setNews] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        // Busca notícia
        const data = await getNewsById(id);
        setNews(data);
        setCategoryId(data.categoryId);

        // Busca categorias
        const cats = await getAllCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    }
    fetchData();
  }, [id]);

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      await updateNews(token, id, {
        title: news.title,
        content: news.content,
        img_url: news.img_url,
        category_id: categoryId,
      });
      navigate("/admin/news");
    } catch (err) {
      console.error("Erro ao atualizar:", err);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Eliminar esta notícia?")) return;
    try {
      await deleteNews(token, id);
      navigate("/admin/news");
    } catch (err) {
      console.error("Erro ao eliminar:", err);
    }
  }

  if (!news) return <p>A carregar...</p>;

  return (
    <div className="p-4">
      <h1>Editar Notícia</h1>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={news.title}
          onChange={(e) => setNews({ ...news, title: e.target.value })}
          required
        />
        <textarea
          value={news.content}
          onChange={(e) => setNews({ ...news, content: e.target.value })}
          required
        />
        <input
          type="text"
          value={news.img_url}
          onChange={(e) => setNews({ ...news, img_url: e.target.value })}
          required
        />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Selecione uma categoria</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <div style={{ marginTop: "10px" }}>
          <button type="submit">Guardar</button>
          <button type="button" onClick={handleDelete} style={{ marginLeft: "10px" }}>
            Eliminar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditNewsPage;
