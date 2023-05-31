import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://adm-api.valorareciclaveis.com.br/valora-api/backend/web/index.php/api",
  timeout: 7000,
  headers: { Authorization: "Bearer RmvGoCB7yQiJw1x_al_JqlKPfabjm-SY" },
});

export default axiosInstance;


 // baseURL: "https://valoraadm.devell.com.br/backend/web/index.php/api", // API de testes