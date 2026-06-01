import axiosInstance from "./axiosInstance";

const productServices = {
  createProduct: async (payload) => {
    const res = await axiosInstance.post("/products", payload);
    return res.data;
  },

  getProducts: async (pageNumber = 1, pageSize = 8) => {
    const res = await axiosInstance.get(
      `/products?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        headers: { skipAuth: true },
      },
    );
    return res.data;
  },

  searchProducts: async (keyword = "", pageNumber = 1, pageSize = 10) => {
    try {
      const res = await axiosInstance.get("/products/search", {
        params: {
          pageNumber,
          pageSize,
          keyword: keyword.trim(),
        },
        headers: { skipAuth: true },
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  getProductById: async (id) => {
    const res = await axiosInstance.get(`/products/${id}`);
    return res.data;
  },

  updateProduct: async (id, payload) => {
    const res = await axiosInstance.put(`/products/${id}`, payload);
    return res.data;
  },

  deleteProduct: async (id) => {
    const res = await axiosInstance.delete(`/products/${id}`);
    return res.data;
  },
};

export default productServices;
