import axiosInstance from "./axiosInstance";

const authServices = {
  login: async (credentials) => {
    const res = await axiosInstance.post("/auth/login", credentials, {
      headers: {
        skipAuth: true,
      },
    });
    return res.data;
  },
  logout: async (refreshToken) => {
    const response = await axiosInstance.post("/auth/logout", {
      refreshToken: refreshToken,
    });
    return response.data;
  },
};

export default authServices;
