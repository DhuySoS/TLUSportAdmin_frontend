import axiosInstance from "./axiosInstance";

const dashboardServices = {
  getOverview: async () => {
    const res = await axiosInstance.get("/admin/dashboard/overview");
    return res.data;
  },

  getRevenueChart: async (days = 30) => {
    const res = await axiosInstance.get("/admin/dashboard/revenue-chart", {
      params: { days },
    });
    return res.data;
  },

  getTopProducts: async (limit = 10) => {
    const res = await axiosInstance.get("/admin/dashboard/top-products", {
      params: { limit },
    });
    return res.data;
  },

  getCategoryRevenue: async () => {
    const res = await axiosInstance.get("/admin/dashboard/category-revenue");
    return res.data;
  },
};

export default dashboardServices;
