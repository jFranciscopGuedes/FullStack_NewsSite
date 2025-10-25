import Api from "./Api";

// Buscar todas as notícias
export async function getAllNews(search = "") {
  const response = await Api.get(`/news${search ? `?search=${search}` : ""}`);
  return response.data;
}

// Buscar notícia por ID
export async function getNewsById(news_id) {
  const response = await Api.get(`/news/${news_id}`);
  return response.data;
}

// Buscar notícias do jornalista autenticado
export async function getMyNews(token) {
  const response = await Api.get(`/news/my-news`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// Criar nova notícia
export async function createNews(token, { title, content, img_url, category_id }) {
  const response = await Api.post(
    "/news/create",
    { title, content, img_url, category_id },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

// Atualizar notícia existente
export async function updateNews(token, news_id, { title, content, img_url, category_id }) {
  const response = await Api.put(
    `/news/update/${news_id}`,
    { title, content, img_url, category_id },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

// Apagar notícia
export async function deleteNews(token, news_id) {
  const response = await Api.delete(`/news/delete/${news_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
