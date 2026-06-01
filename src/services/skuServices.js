import axiosInstance from "./axiosInstance";

const skuServices = {
  createSku: async (productId, payload) => {
    const res = await axiosInstance.post(`/products/${productId}/skus`, payload);
    return res.data;
  },

  updateSku: async (productId, skuId, payload) => {
    const res = await axiosInstance.put(`/products/${productId}/skus/${skuId}`, payload);
    return res.data;
  },

  updateStock: async (productId, skuId, payload) => {
    const res = await axiosInstance.patch(`/products/${productId}/skus/${skuId}/stock`, payload);
    return res.data;
  },

  getSkusByProduct: async (productId) => {
    const res = await axiosInstance.get(`/products/${productId}/skus`);
    return res.data;
  },

  getSkuById: async (productId, skuId) => {
    const res = await axiosInstance.get(`/products/${productId}/skus/${skuId}`);
    return res.data;
  },

  deleteSku: async (productId, skuId) => {
    const res = await axiosInstance.delete(`/products/${productId}/skus/${skuId}`);
    return res.data;
  },
};

export default skuServices;
