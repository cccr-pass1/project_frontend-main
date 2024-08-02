import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;
const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getListLocation = async () => {
  try {
    const response = await axiosInstance.get("/locations");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getLocation = async (localNo) => {
  try {
    const response = await axiosInstance.get(`/location/${localNo}`);
    return response;
  } catch (error) {
    throw error;
  }
};
