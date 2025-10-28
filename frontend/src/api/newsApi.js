import Api from "./Api";

// Buscar todas as notícias (com ou sem pesquisa)
export async function getAllNews(search = "") {
  // Se existir termo de pesquisa, adiciona ?search=texto à rota
  // Exemplo: /news?search=política
  const response = await Api.get(`/news${search ? `?search=${search}` : ""}`);

  // Retorna a lista de notícias (array JSON)
  return response.data;
}

// Buscar uma notícia específica pelo ID
export async function getNewsById(news_id) {
  // Envia GET para /news/<id>
  // Exemplo: /news/5 → retorna os dados da notícia com id=5
  const response = await Api.get(`/news/${news_id}`);

  // Retorna os dados completos dessa notícia
  return response.data;
}

// Buscar as notícias criadas pelo jornalista autenticado
export async function getMyNews(token) {
  // Envia GET para /news/my-news
  // JWT obrigatório para identificar o jornalista
  const response = await Api.get(`/news/my-news`, {
    headers: { Authorization: `Bearer ${token}` }, // Cabeçalho de autenticação
  });

  // Retorna lista de notícias do utilizador autenticado
  return response.data;
}

// Criar nova notícia
export async function createNews(token, { title, content, img_url, category_id }) {
  // Envia POST para /news/create com o corpo JSON da nova notícia
  // O token JWT é obrigatório (só jornalistas podem criar)
  const response = await Api.post(
    "/news/create",
    { title, content, img_url, category_id }, // Corpo JSON
    { headers: { Authorization: `Bearer ${token}` } } // Cabeçalho com token
  );

  // Retorna resposta do backend (mensagem + objeto criado)
  return response.data;
}

// Atualizar notícia existente
export async function updateNews(token, news_id, { title, content, img_url, category_id }) {
  // Envia PUT para /news/update/<id> com novos dados
  // O backend atualiza apenas os campos enviados
  const response = await Api.put(
    `/news/update/${news_id}`,                // Endpoint da notícia
    { title, content, img_url, category_id }, // Corpo JSON
    { headers: { Authorization: `Bearer ${token}` } } // Cabeçalho JWT
  );

  // Retorna confirmação e notícia atualizada
  return response.data;
}

// Apagar notícia existente
export async function deleteNews(token, news_id) {
  // Envia DELETE para /news/delete/<id>
  // JWT obrigatório (apenas jornalistas podem apagar)
  const response = await Api.delete(`/news/delete/${news_id}`, {
    headers: { Authorization: `Bearer ${token}` }, // Autenticação
  });

  // Retorna mensagem de sucesso ou erro
  return response.data;
}
