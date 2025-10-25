import { useState, useEffect } from "react";
import { createNews } from "../../api/newsApi";
import { getAllCategories } from "../../api/categoryApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function CreateNewsPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
      }
    }
    fetchCategories();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await createNews(token, {
        title,
        content,
        img_url: imgUrl,
        category_id: categoryId,
      });
      navigate("/admin/news");
    } catch (err) {
      console.error("Erro ao criar notícia:", err);
    }
  }

  return (
    <div className="form-container">
      <h2>Criar Notícia</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Conteúdo"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="URL da Imagem"
          value={imgUrl}
          onChange={(e) => setImgUrl(e.target.value)}
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

        <button type="submit">Criar</button>
      </form>
    </div>
  );
}

export default CreateNewsPage;
