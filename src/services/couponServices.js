import axiosInstance from "./axiosInstance";

const couponServices = {
  createCoupon: async (payload) => {
    const res = await axiosInstance.post("/coupons", payload);
    return res.data;
  },

  updateCoupon: async (id, payload) => {
    const res = await axiosInstance.put(`/coupons/${id}`, payload);
    return res.data;
  },

  deleteCoupon: async (id) => {
    const res = await axiosInstance.delete(`/coupons/${id}`);
    return res.data;
  },

  getCoupons: async () => {
    const res = await axiosInstance.get("/coupons");
    return res.data;
  },
};

export default couponServices;
