// Importa a instância configurada do Axios
import Api from "./Api";

// Regista um novo utilizador no backend
export async function registerUser(name, email, password) {
  // Envia pedido POST para /auth/register com o corpo JSON
  const response = await Api.post("/auth/register", { name, email, password });
  return response.data;
}

// Faz login do utilizador
export async function loginUser(email, password) {
  // Envia pedido POST para /auth/login com o corpo JSON
  const response = await Api.post("/auth/login", { email, password });
  // Retorna os dados enviados pelo backend (token, role, id)
  return response.data;
  /*
    Exemplo de resposta JSON:
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "role": "normal",
      "id": 2
    }
  */
}
