import axiosInstance from "./axiosInstance";

export const leadApi = {
  createLead: async (leadData) => {
    const response = await axiosInstance.post("/leads", leadData);

    return response.data.lead;
  },

  getAllLeads: async () => {
    const response = await axiosInstance.get("/leads");

    return response.data;
  },
};
