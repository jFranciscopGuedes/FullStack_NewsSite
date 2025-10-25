import { useState, useEffect } from "react";
import { useLikedNews } from "../context/LikedNewsContext";
import { Link } from "react-router-dom";

function NewsCard({ news }) {
  const { likedNews, handleLike, handleUnlike } = useLikedNews();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(likedNews.some(n => n.id === news.id));
  }, [likedNews, news.id]);

  async function toggleLike() {
    if (!liked) await handleLike(news.id);
    else await handleUnlike(news.id);
  }

  return (
    <div className="news-card">
      {/* Imagem da notícia */}
      <Link to={`/news/${news.id}`}>
        <img 
          src={news.img_url} 
          alt={news.title} 
          className="news-card-image" 
          style={{ width: "100%", height: "200px", objectFit: "cover", marginBottom: "10px" }}
        />
      </Link>

      <div className="news-top">
        <Link to={`/news/${news.id}`}>
          <h2>{news.title}</h2>
        </Link>
        <button onClick={toggleLike}>{liked ? "💖" : "🤍"}</button>
      </div>

      <p>{news.content.substring(0, 150)}...</p>
    </div>
  );
}

export default NewsCard;
