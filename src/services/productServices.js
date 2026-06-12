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

  getProductIsActive: async (
    pageNumber = 1,
    pageSize = 10,
    isActive = true,
  ) => {
    const res = await axiosInstance.get(
      `/products/isActive?pageNumber=${pageNumber}&pageSize=${pageSize}&isActive=${isActive}`
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

  filterProducts: async (filters = {}) => {
    const params = {
      categoryId: filters.categoryId || undefined,
      brandId: filters.brandId || undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      stockFilter: filters.stockFilter || undefined,
      sortBy: filters.sortBy || undefined,
      pageNumber: filters.pageNumber || 1,
      pageSize: filters.pageSize || 10,
    };

    const queryString = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryString.append(key, value);
      }
    });

    if (filters.attributeValueIds && filters.attributeValueIds.length > 0) {
      filters.attributeValueIds.forEach((id) => {
        queryString.append("attributeValueIds", id);
      });
    }

    const res = await axiosInstance.get(
      `/products/filter?${queryString.toString()}`,
      {
        headers: { skipAuth: true },
      },
    );
    return res.data;
  },
};

export default productServices;
