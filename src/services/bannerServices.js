import axiosInstance from "./axiosInstance";

const bannerServices = {
  getAllBanners: async (params) => {
    const res = await axiosInstance.get("/banners", { params });
    return res.data;
  },
  createBanner: async (bannerData) => {
    const res = await axiosInstance.post("/banners", bannerData);
    return res.data;
  },
  updateBanner: async (id, bannerData) => {
    const res = await axiosInstance.put(`/banners/${id}`, bannerData);
    return res.data;
  },
  deleteBanner: async (id) => {
    const res = await axiosInstance.delete(`/banners/${id}`);
    return res.data;
  },
};

export default bannerServices;
