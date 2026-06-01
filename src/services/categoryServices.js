import axiosInstance from "./axiosInstance";

const categoryServices = {
  createCategory: async (payload) => {
    const res = await axiosInstance.post("/categories", payload);
    return res.data;
  },

  updateCategory: async (id, payload) => {
    const res = await axiosInstance.put(`/categories/${id}`, payload);
    return res.data;
  },

  deleteCategory: async (id) => {
    const res = await axiosInstance.delete(`/categories/${id}`);
    return res.data;
  },

  getCategoryTree: async () => {
    const res = await axiosInstance.get("/categories/tree");
    return res.data;
  },

  assignAttributeToCategory: async (categoryId, payload) => {
    const res = await axiosInstance.post(`/categories/${categoryId}/attributes`, payload);
    return res.data;
  },

  getCategoryAttributes: async (categoryId) => {
    const res = await axiosInstance.get(`/categories/${categoryId}/attributes`);
    return res.data;
  },

  updateCategoryAttribute: async (id, payload) => {
    const res = await axiosInstance.put(`/categories/attributes/${id}`, payload);
    return res.data;
  },

  deleteCategoryAttribute: async (id) => {
    const res = await axiosInstance.delete(`/categories/attributes/${id}`);
    return res.data;
  },
};

export default categoryServices;
