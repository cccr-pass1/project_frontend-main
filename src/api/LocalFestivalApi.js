import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;
const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getLocalFestivals = async () => {
  try {
    const response = await axiosInstance.get("/localFestivals");
    return response;
  } catch (error) {
    throw error;
  }
};
// localNo 받아서 지역별 축제목록
export const getLocalFestival = async (localNo) => {
  try {
    const response = await axiosInstance.get(`/localFestivals/${localNo}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// 단일 축제 정보
export const getLocalFestivalView = async (festivalNo) => {
  try {
    const response = await axiosInstance.get(`/localFestival/${festivalNo}`);
    return response;
  } catch (error) {
    throw error;
  }
};
