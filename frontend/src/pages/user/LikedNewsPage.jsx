import { useLikedNews } from "../../context/LikedNewsContext";
import NewsCard from "../../components/NewsCard";
import "../../css/Home.css";

function LikedNewsPage() {
  const { likedNews, loading, error } = useLikedNews();

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!likedNews.length) return <div>Nenhuma notícia com like foi encontrada.</div>;

  return (
    <div className="liked-news-page">
      <h2>Notícias com Like</h2>
      
    {!loading && likedNews && likedNews.length > 0 && (
      <div className="news-grid">
        {likedNews.map(n => (
          <NewsCard key={n.id} news={n} />
        ))}
      </div>
    )}

    </div>
  );
}

export default LikedNewsPage;
