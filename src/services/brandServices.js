import axiosInstance from "./axiosInstance";

const brandServices = {
  createBrand: async (payload) => {
    const res = await axiosInstance.post("/brands", payload);
    return res.data;
  },

  getBrands: async () => {
    const res = await axiosInstance.get("/brands");
    return res.data;
  },
};

export default brandServices;
