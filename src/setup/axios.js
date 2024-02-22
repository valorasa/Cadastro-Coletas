// import axios from "axios";

// const token = localStorage.getItem("accessToken");

// const axiosInstance = axios.create({
//   baseURL: process.env.REACT_APP_BASE_URL,
//   timeout: 11000,
//   headers: { Authorization: `Bearer ${token}` },
// });

// export default axiosInstance;

import axios from 'axios';

// Cria uma instância do Axios sem o token no cabeçalho
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 11000,
});

const refreshAccessToken = async (refreshToken) => {
  const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/user/refresh`, {
    refreshToken: refreshToken,
  });
  return response.data.AccessToken;
};

// Interceptor de requisição para adicionar o token de acesso dinamicamente
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// Interceptor de resposta para lidar com tokens expirados
axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    // Verifique se já tentamos atualizar o token para evitar o loop de atualização
    if (error.response.status === 401 && error.response.data.name === "Unauthorized" && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          originalRequest._retry = true;
          const newAccessToken = await refreshAccessToken(refreshToken);
          localStorage.setItem('accessToken', newAccessToken);
          // Atualiza o token de acesso no cabeçalho para a requisição que falhou
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          // Retorna a chamada axios com a requisição original que agora tem o novo token
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Se algo der errado durante o refresh
          console.error('Não foi possível atualizar o token de acesso:', refreshError);
          localStorage.removeItem('accessToken'); // Considerar limpar o accessToken
          localStorage.removeItem('refreshToken'); // Considerar limpar o refreshToken
          // Redirecionar o usuário para o login ou outra ação necessária
          // window.location = '/login'; // Exemplo de redirecionamento
          return Promise.reject(refreshError);
        }
      }
    }
    // Retornar qualquer erro que não seja de autenticação para ser tratado em outro lugar
    return Promise.reject(error);
  }
);

export default axiosInstance;