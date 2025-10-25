import Api from "./Api";


export async function registerUser(name, email, password) {
  const response = await Api.post("/auth/register", { name, email, password });
  return response.data;
}

export async function loginUser(email, password) {
  const response = await Api.post("/auth/login", { email, password }); //Aqui o Api.post() envia um pedido HTTP POST ao endpoint do backend (/auth/login) com o corpo JSON { email, password }
  return response.data;
  // exemplo do retorno do que esta definido no backend
  //"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", 
  //"role": "normal"
  //"id": "2"
} 