import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

http.interceptors.request.use(
  (config) => {
    //先写死，后面再改TODO
    config.headers.Authorization =
      "Bearer " +
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTc4NjYxYjc5YTM3NTUxY2Q1N2M1OTUiLCJ1c2VybmFtZSI6InRlczJ0MSIsImVtYWlsIjoiMzEzNDUwNDI1OEBxcS5jb20iLCJpYXQiOjE3Njk5NTI0OTgsImV4cCI6MTc3MDEyNTI5OH0.aNntVKgvVChpp21kuVWs2uDvUSCYFRxfEJikzmyfZnU";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  },
);
