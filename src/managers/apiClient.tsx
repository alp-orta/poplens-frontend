import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5002/api", // WebUI Gateway base URL
});

apiClient.interceptors.request.use((config) => {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const makeRequest = (service: string, endpoint: string, method: "GET" | "POST" | "PUT" | "DELETE", data?: any) => {
  const url = `${service}/${endpoint}`;
  return apiClient.request({
    url,
    method,
    data,
  });
};

export default apiClient;
