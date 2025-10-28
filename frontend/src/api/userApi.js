// Importa o módulo que contém a configuração base do Axios (com o baseURL do backend)
import Api from "./Api";

// Busca os dados do utilizador autenticado
export async function getCurrentUser(token) {
  // Faz um pedido GET ao endpoint /users/me
  // Inclui o token JWT no cabeçalho Authorization
  const response = await Api.get("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  // Retorna os dados (objeto JSON vindo do backend)
  return response.data;
}

// Atualiza os dados do utilizador autenticado
export async function updateUser(token, { name, email, password }) {
  // Envia um pedido PUT para /users/update com o corpo JSON
  const response = await Api.put(
    "/users/update",
    { name, email, password },
    { headers: { Authorization: `Bearer ${token}` } } // Cabeçalho com token JWT
  );
  // Retorna a resposta (mensagem ou objeto atualizado)
  return response.data;
}

// Apaga o utilizador autenticado
export async function deleteUser(token) {
  // Envia um pedido DELETE para /users/delete com o token JWT
  const response = await Api.delete("/users/delete", {
    headers: { Authorization: `Bearer ${token}` },
  });
  // Retorna a resposta do backend
  return response.data;
}
