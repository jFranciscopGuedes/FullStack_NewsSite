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
      <div className="news-Top">
        <Link to={`/news/${news.id}`}>
          <h1>{news.title}</h1>
        </Link>
        <button onClick={toggleLike}>{liked ? "💖" : "🤍"}</button>
      </div>
      <p>{news.content.substring(0, 150)}...</p>
    </div>
  );
}

export default NewsCard;
