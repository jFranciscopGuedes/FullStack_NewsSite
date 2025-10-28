// Importa o axios (biblioteca para pedidos HTTP)
import axios from "axios";

// Cria uma instância configurada do axios
// Assim não é preciso repetir o endereço base em cada pedido
const Api = axios.create({
  baseURL: "http://127.0.0.1:5000", // URL do backend Flask
});

// Exporta a instância para ser usada nas outras funções
export default Api;
