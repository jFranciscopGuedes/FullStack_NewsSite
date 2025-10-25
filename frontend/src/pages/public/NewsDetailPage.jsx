import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Api from "../../api/Api";

function NewsDetailPage() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await Api.get(`/news/${id}`);
        setNews(res.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Notícia não encontrada");
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [id]);

  if (loading) return <p>Carregando notícia...</p>;
  if (error) return <p>{error}</p>;
  if (!news) return null;

  return (
    <div className="news-detail">
      <h1>{news.title}</h1>
      <img src={news.img_url} alt={news.title} className="news-detail-image" />
      <p className="news-content">{news.content}</p>

      <div className="news-meta">
        <p><strong>Autor:</strong> {news.authorName}</p>
        <p><strong>Categoria:</strong> {news.categoryName}</p>
        <p><strong>Publicado em:</strong> {new Date(news.publishedAt).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default NewsDetailPage;
