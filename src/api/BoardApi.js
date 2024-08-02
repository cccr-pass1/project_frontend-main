import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;
const ACCESS_TOKEN = localStorage.getItem('ACCESS_TOKEN');

const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization' : ACCESS_TOKEN ? `Bearer ${ACCESS_TOKEN}` : ''
    }
})

// touristSpot API 시작
// get touristSpot 게시글 목록조회 
export const getTourBaordList = async () => {
    try {
        const response = await axiosInstance.get("/board/touristSpot");
        const reversedData = response.data.reverse(); // 데이터를 역순으로 정렬
        return response;
    } catch (error) {
        throw error;
    }
}

// get touristSpot 게시글 bno별 상세조회 
export const getTourBaordDetail = async (bno) => {
    try {
        const response = await axiosInstance.get(`/board/touristSpot/${bno}`);
        return response;
    } catch (error) {
        throw error;
    }
}
// touristSpot API 끝

// company API 시작
// get company 게시글 목록조회 
export const getCompanyBaordList = async () => {
    try {
        const response = await axiosInstance.get("/board/company")
        return response;
    } catch (error) {
        throw error;
    }
}

// get company 게시글 bno별 상세조회
export const getCompanyDetail = async (bno) => {
    try {
      const response = await axiosInstance.get(`/board/companyView/${bno}`);
      return response;
    } catch (error) {
      throw error;
    }
  };
 // company API 끝 

// 이미지 (단일)조회
// export const getImg = async (bno) => {
//     try {
//         const response = await axiosInstance.get(`/api/image/${bno}`);
//         return [response.data]; // 이미지 데이터를 배열로 감싸서 반환
        
//     } catch (error) {
//         if (error.response && error.response.status === 404) {
           
//             // 이미지가 없는 경우, 빈 배열로 처리
//             return []; // 빈 배열 반환
//         }
//         throw error; // 다른 오류는 그대로 throw
//     }
// }

// export const getImg = async (bno) => {
//     try {
//         const response = await axiosInstance.get(`/api/images/${bno}`, { responseType: 'arraybuffer' });
//         const blob = new Blob([response.data], { type: response.headers['content-type'] });

//         return blob; // Blob 반환
//     } catch (error) {
//         if (error.response && error.response.status === 404) {
//             return null; 
//         }
//         throw error; 
//     }
// }
export const getImg = async (bno) => {
    try {
        const response = await axiosInstance.get(`/api/images/${bno}`, { responseType: 'arraybuffer' });

        // Blob으로 받아온 이미지 데이터를 바로 S3 URL로 표시
        const s3ImageUrl = `https://your-s3-bucket-url/images/${bno}.jpg`; // 실제 S3 버킷 URL로 변경
        const img = document.createElement('img');
        img.src = s3ImageUrl;
        document.body.appendChild(img);

        return s3ImageUrl; // S3 URL 반환
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null; 
        }
        throw error; 
    }
}


// 게시글 작성
export const postBoardWrite = async (formData) => {
    try {
        const response = await axiosInstance.post("/board/boardWrite", formData, {
            headers: {
                'Content-Type': 'multipart/form-data' 
            }
        });
        
        console.log(response);
        return response;
    } catch (error) {
        console.log("프론트 게시글 작성 에러 api");
        throw error;
    }
};

// put 게시글 수정
export const putBoard = async (bno, updateDate, location) => {
    try {
        // if(!ACCESS_TOKEN){
        //     alert("로그인 후 게시글 수정이 가능합니다.");
        //     window.location.href = "/login"; 
        //     return;
        // }

        const response = await axiosInstance.put(`/board/edit/${bno}`, {...updateDate, location})
        return response;
    } catch (error) {
        throw error;
    }
}

// delete 게시글 삭제
export const deleteBoard = async (bno) => {
    try {
        const response = await axiosInstance.delete(`/board/delete/${bno}`)
        return response;
    } catch (error) {
        throw error;
    }
}

// company 댓글 API 시작
// 댓글 작성
export const postReply = async (replyData) => {
    try {
        const response = await axiosInstance.post(`/board/companyView/reply`, replyData)
        return response;
    } catch (error) {
        throw error;
    }
}

// 댓글 조회
export const getReply = async (bno) => {
    try {
        // console.log("bno 테스트: ", bno)
        const response = await axiosInstance.get(`/board/companyView/reply/${bno}`)
        return response;
    } catch (error) {
        throw error;
    }
}

// 댓글 삭제
export const deleteReply = async (rno) => {
    try {
        const response = await axiosInstance.delete(`board/companyView/reply/delete/${rno}`)
        return response;
    } catch (error) {
        throw error;
    }
}
// company 댓글 API 끝