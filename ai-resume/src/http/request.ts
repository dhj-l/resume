import axios from "axios";

export const http = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  timeout: 10000,
});

http.interceptors.request.use(
  (config) => {
    //先写死，后面再改TODO
    config.headers.Authorization =
      "Bearer " +
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTc4NjYxYjc5YTM3NTUxY2Q1N2M1OTUiLCJ1c2VybmFtZSI6InRlczJ0MSIsImVtYWlsIjoiMzEzNDUwNDI1OEBxcS5jb20iLCJpYXQiOjE3Njk0OTg0MDAsImV4cCI6MTc2OTY3MTIwMH0.50krFCMlaOj3ix_eBb0Zgz1vR3f2osSg3FqmyMxqS3Y";
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
