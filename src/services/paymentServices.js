import axiosInstance from "./axiosInstance";

const paymentServices = {
  createPaymentMethod: async (payload) => {
    const res = await axiosInstance.post("/payment-methods", payload);
    return res.data;
  },

  updatePaymentMethod: async (id, payload) => {
    const res = await axiosInstance.put(`/payment-methods/${id}`, payload);
    return res.data;
  },

  deletePaymentMethod: async (id) => {
    const res = await axiosInstance.delete(`/payment-methods/${id}`);
    return res.data;
  },

  getActivePaymentMethods: async () => {
    const res = await axiosInstance.get("/payment-methods");
    return res.data;
  },
};

export default paymentServices;
