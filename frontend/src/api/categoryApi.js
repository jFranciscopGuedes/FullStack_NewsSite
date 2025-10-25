import Api from "./Api";

export async function getAllCategories() {
  const response = await Api.get("/categories",{
  });
  return response.data;
}

export async function createCategory(token,name) {
  const response = await Api.post(
    "/categories",
    {name},
    {headers: {Authorization: `Bearer ${token}`},}
  );
  return response.data;
}