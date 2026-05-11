import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL?.trim() ||
    "http://localhost:5000",

  withCredentials: true,
});

// REQUEST
axiosInstance.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE
axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {

    if (
      error.response?.status === 401
    ) {
      console.log("Unauthorized");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;