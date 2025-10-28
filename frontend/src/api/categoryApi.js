import Api from "./Api";

// Função para obter todas as categorias existentes no sistema
export async function getAllCategories() {
  // Envia um pedido GET para o endpoint /categories
  // O backend responde com uma lista JSON de todas as categorias
  const response = await Api.get("/categories", {});
  
  // Retorna apenas os dados (sem o cabeçalho da resposta)
  return response.data;
}

// Função para criar uma nova categoria (só jornalistas podem)
export async function createCategory(token, name) {
  // Envia um pedido POST para o endpoint /categories
  // Corpo da requisição: { name } → nome da nova categoria
  // Cabeçalho: inclui o token JWT de autenticação
  const response = await Api.post(
    "/categories",                            // Rota no backend
    { name },                                 // Corpo JSON com o nome da categoria
    { headers: { Authorization: `Bearer ${token}` } } // Cabeçalho com token JWT
  );

  // Retorna a resposta do backend (mensagem de sucesso ou erro)
  return response.data;
}