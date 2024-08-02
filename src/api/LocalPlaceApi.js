import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;
const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getLocalPlaces = async () => {
  try {
    const response = await axiosInstance.get("/localPlaces");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getLocalPlace = async (localNo) => {
  try {
    const response = await axiosInstance.get(`/localPlaces/${localNo}`);
    return response;
  } catch (error) {
    throw error;
  }
};
export const getLocalPlaceView = async (placeNo) => {
  try {
    const response = await axiosInstance.get(`/localPlace/${placeNo}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// 하트 클릭을 서버로 전송하는 함수
export const postHeart = async (data) => {
  try {
    const response = await axiosInstance.post("/heart", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// 하트리스트 가져오는거
export const getHeartList = async () => {
  try {
    const response = await axiosInstance.get("/hearts");
    return response.data;
  } catch (error) {
    throw error;
  }
};
// 클라이언트에서 좋아요 여부를 확인하는 예제
export const checkIfHearted = async (memberId, placeNo) => {
  try {
    const response = await axiosInstance.get(
      `/heart/check/${memberId}/${placeNo}`
    );
    const isHearted = response.data;
    // console.log(isHearted);

    // isHearted를 기반으로 사용자 인터페이스 업데이트
    // 예: 버튼을 숨기거나 비활성화
    if (isHearted) {
      // 좋아요를 이미 한 상태
      console.log("이미 좋아요를 했습니다.");
    } else {
      // 좋아요를 하지 않은 상태
      console.log("좋아요를 할 수 있습니다.");
    }

    return isHearted; // 이 부분 추가
  } catch (error) {
    console.error("좋아요 여부 확인 중 오류:", error);
    // TODO: 오류 처리 로직 추가
    throw error; // 오류 발생 시 예외 처리
  }
};

// 좋아요 있으면 이 메서드 실행!
export const deleteHeart = async (userId, placeNo) => {
  try {
    // DELETE 메서드 추가
    const response = await axiosInstance.delete(`/hearts/${userId}/${placeNo}`);
    return response.data;
  } catch (error) {
    console.error("하트 삭제 오류:", error);
    throw error;
  }
};
