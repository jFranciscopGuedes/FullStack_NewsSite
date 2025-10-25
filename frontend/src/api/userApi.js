import Api from "./Api";

export async function getCurrentUser(token) {
  const response = await Api.get("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function updateUser(token, { name, email, password }) {
  const response = await Api.put(
    "/users/update",
    { name, email, password }, // corpo da requisição
    {headers: { Authorization: `Bearer ${token}` }}
  );
  return response.data;
}
 
export async function deleteUser(token) {
  const response = await Api.delete("/users/delete", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}