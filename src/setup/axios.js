import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 11000,
  headers: { Authorization: "Bearer RmvGoCB7yQiJw1x_al_JqlKPfabjm-SY" },
});

export default axiosInstance;

