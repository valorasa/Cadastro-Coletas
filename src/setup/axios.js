import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://adm-api.valorareciclaveis.com.br/valora-api/backend/web/index.php/api",
  timeout: 5000,
  headers: { Authorization: "Bearer RmvGoCB7yQiJw1x_al_JqlKPfabjm-SY" },
});

export default axiosInstance;
