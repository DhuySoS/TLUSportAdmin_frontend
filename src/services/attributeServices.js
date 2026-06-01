import axiosInstance from "./axiosInstance";

const attributeServices = {
  createAttribute: async (payload) => {
    const res = await axiosInstance.post("/attributes", payload);
    return res.data;
  },

  updateAttribute: async (id, payload) => {
    const res = await axiosInstance.put(`/attributes/${id}`, payload);
    return res.data;
  },

  deleteAttribute: async (id) => {
    const res = await axiosInstance.delete(`/attributes/${id}`);
    return res.data;
  },

  getAttributes: async () => {
    const res = await axiosInstance.get("/attributes");
    return res.data;
  },

  addAttributeValue: async (attributeId, value, description = "") => {
    const params = new URLSearchParams({ value });
    if (description) params.append("description", description);
    const res = await axiosInstance.post(`/attributes/${attributeId}/values?${params.toString()}`);
    return res.data;
  },

  updateAttributeValue: async (id, payload) => {
    // payload: { value, description? }
    const res = await axiosInstance.put(`/attributes/values/${id}`, payload);
    return res.data;
  },

  deleteAttributeValue: async (id) => {
    const res = await axiosInstance.delete(`/attributes/values/${id}`);
    return res.data;
  },
};

export default attributeServices;
