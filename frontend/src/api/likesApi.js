import Api from "./Api";

// Função para buscar todas as notícias que o utilizador autenticado deu "like"
export async function getUserLikes(token) {
  // Envia um pedido GET para /likes/mylikes
  // O token JWT no header identifica o utilizador autenticado
  const response = await Api.get("/likes/mylikes", {
    headers: { Authorization: `Bearer ${token}` }, // Cabeçalho de autenticação
  });

  // Retorna a lista de notícias (em formato JSON) que o user gostou
  return response.data;
}

// Função para dar "like" a uma notícia
export async function likeNews(newsId, token) {
  // Envia um pedido POST para /likes/like/<id da notícia>
  // Corpo vazio, pois o ID da notícia já vai na rota
  // Token JWT obrigatório para identificar o utilizador
  const response = await Api.post(
    `/likes/like/${newsId}`,                  // Endpoint com o ID da notícia
    {},                                       // Corpo vazio
    { headers: { Authorization: `Bearer ${token}` } } // Cabeçalho com token JWT
  );

  // Retorna a confirmação do backend (ex: {"message": "Like adicionado"})
  return response.data;
}

// Função para remover um "like" de uma notícia
export async function unlikeNews(newsId, token) {
  // Envia um pedido DELETE para /likes/unlike/<id da notícia>
  // Token JWT obrigatório no header
  const response = await Api.delete(
    `/likes/unlike/${newsId}`,                // Endpoint com o ID da notícia
    { headers: { Authorization: `Bearer ${token}` } } // Cabeçalho de autenticação
  );

  // Retorna a resposta do backend (ex: {"message": "Like removido"})
  return response.data;
}