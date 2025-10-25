import Api from "./Api";

export async function getUserLikes(token) {
  const response = await Api.get("/likes/mylikes", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function likeNews(newsId, token) {
  const response = await Api.post(`/likes/like/${newsId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function unlikeNews(newsId, token) {
  const response = await Api.delete(`/likes/unlike/${newsId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
} 