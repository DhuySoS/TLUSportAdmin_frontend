import axiosInstance from "./axiosInstance";

const shippingServices = {
  createShippingMethod: async (payload) => {
    const res = await axiosInstance.post("/shipping-methods", payload);
    return res.data;
  },

  updateShippingMethod: async (id, payload) => {
    const res = await axiosInstance.put(`/shipping-methods/${id}`, payload);
    return res.data;
  },

  deleteShippingMethod: async (id) => {
    const res = await axiosInstance.delete(`/shipping-methods/${id}`);
    return res.data;
  },

  getShippingMethods: async () => {
    const res = await axiosInstance.get("/shipping-methods");
    return res.data;
  },
};

export default shippingServices;
