import axios from "axios";
import { jwtDecode } from "jwt-decode";

const baseURL = process.env.REACT_APP_BASE_URL;
const ACCESS_TOKEN = localStorage.getItem('ACCESS_TOKEN');

// const decodedToken = jwtDecode(ACCESS_TOKEN);
// const userId = decodedToken.id;

const axiosInstance = axios.create({
    baseURL,
    headers:{
        'Content-Type':'application/json',
        'Authorization' : ACCESS_TOKEN ? `Bearer ${ACCESS_TOKEN}` : '',
    }
})

// login
export const postLogin = async (data)=> {
    try {
        const response = await axiosInstance.post("/login", data)
        const token = response.data.token;
        // 로그인 성공 시 메인 페이지로 이동
        window.location.href="/"
        if(token) {
            localStorage.setItem("ACCESS_TOKEN", token)
        }
    } catch (error) {
        // 비밀번호가 틀렸을 때의 에러 메시지 확인
        if (error.response && error.response.data.message === "Incorrect password.") {
            // console.error("비밀번호가 일치하지 않습니다. error : ", error);
            alert("비밀번호가 일치하지 않습니다.");
            return;
        } else {
            // console.error("로그인 에러 : ", error);
            alert("아이디와 비밀번호를 다시 확인해주세요.")
            return;
        }
    }
}

// Google Login
export const googleLogin = async () => {
    try {
        const response = await axiosInstance.get("/oauth/loginInfo");
        console.log(response.data);
        const token = new URL(window.location.href).searchParams.get("accessToken")
        if(token) {
            localStorage.setItem("ACCESS_TOKEN", token)
            window.location.href="/"
        }
    } catch (error) {
        // 에러 처리
        console.error("Google login error: ", error);
    }
};

// Kakao Login
export const kakaoLogin = async () => {
    try {
        const response = await axiosInstance.get("/oauth/loginInfo");
        // 로그인 정보를 콘솔에 출력하거나 필요한 처리 수행
        console.log(response.data);
        const token = new URL(window.location.href).searchParams.get("accessToken")
        if(token) {
            localStorage.setItem("ACCESS_TOKEN", token)
            window.location.href="/"
        }
    } catch (error) {
        // 에러 처리
        console.error("Google login error: ", error);
    }
};



// 회원정보
export const getMember = async ()=> {
    try {
        if(ACCESS_TOKEN) {
            const decodedToken = jwtDecode(ACCESS_TOKEN);
            const userId = decodedToken.id;
            const response = await axiosInstance.get(`/mypage/${userId}`)
            return response
        } 
        else {
            alert("유효하지 않은 요청입니다. 로그인 페이지로 이동합니다.");
            window.location.href = "/login"; // 로그인 페이지로 이동
        }
    } catch (error) {
        throw error
    }
}

// 회원정보 수정
export const chgInfo = async ()=> {
    try {
        const decodedToken = jwtDecode(ACCESS_TOKEN);
        const userId = decodedToken.id;
        const changedName = document.getElementById("chgName").value;
        const changedPhone = document.getElementById("chgPH").value;
        const changedEmail = document.getElementById("chgEmail").value;

        const response = await axiosInstance.put(`/mypage/${userId}/editInfo`, {
            name: changedName,
            phoneNum: changedPhone,
            email: changedEmail,
          })
        return response
    } catch (error) {
        throw error
    }
}

// 비밀번호 확인
export const checkPwMatch = async (currentPassword) => {
    try {
      const decodedToken = jwtDecode(ACCESS_TOKEN);
      const userId = decodedToken.id;
      
      const response = await axiosInstance.post(`/mypage/${userId}/checkPw`, {
        currentPassword,
      });
  
      return response.data;
    } catch (error) {
      console.error("Error checking password match:", error);
      return false;
    }
  };

// 비밀번호 변경
export const chgPw = async ()=> {
    try {
        const decodedToken = jwtDecode(ACCESS_TOKEN);
        const userId = decodedToken.id;
        const currentPassword = document.getElementById("prevPW").value;
        const password = document.getElementById("chgPW").value;
        const confirmPassword = document.getElementById("chkPW").value;
        const response = await axiosInstance.put(`/mypage/${userId}/editPw`, {
            currentPassword,
            password,
          })
        return response
    } catch (error) {
        throw error
    }
}


export const getMemberList = async ()=> {
    try {
        const response = await axiosInstance.get('/members')
        return response
    } catch (error) {
        throw error
    }
}

// mypage - boardlist - tourspot
export const getMyTourspotList = async () => {
    try {
        if(ACCESS_TOKEN) {
            const decodedToken = jwtDecode(ACCESS_TOKEN);
            const userId = decodedToken.id;
            const response = await axiosInstance.get(`/mypage/boardlist/tourspot/${userId}`)
            return response
        } 
    } catch (error) {
        throw error
    }
}

// mypage - boardlist - travelmate
export const getMyTravelmateList = async () => {
    try {
        if(ACCESS_TOKEN) {
            const decodedToken = jwtDecode(ACCESS_TOKEN);
            const userId = decodedToken.id;
            const response = await axiosInstance.get(`/mypage/boardlist/travelmate/${userId}`)
            return response
        } 
    } catch (error) {
        throw error
    }
}

// mypage - likelist
export const getMyLikeList = async () => {
    try {
        if(ACCESS_TOKEN) {
            const decodedToken = jwtDecode(ACCESS_TOKEN);
            const userId = decodedToken.id;
            const response = await axiosInstance.get(`hearts/details/${userId}`)
            return response
        } 
    } catch (error) {
        throw error
    }
}

// mypage - replylist
export const getMyReplyList = async () => {
    try {
        if(ACCESS_TOKEN) {
            const decodedToken = jwtDecode(ACCESS_TOKEN);
            const userId = decodedToken.id;
            const response = await axiosInstance.get(`mypage/replylist/${userId}`)
            return response
        } 
    } catch (error) {
        throw error
    }
}

// 회원탈퇴
export const deleteMember = async () => {
    try {
        if(ACCESS_TOKEN) {
            const decodedToken = jwtDecode(ACCESS_TOKEN);
            const userId = decodedToken.id;
            const response = await axiosInstance.delete(`member/${userId}`)
            if (response.status === 200) {
                alert("회원탈퇴가 성공적으로 이루어졌습니다.");
                // 탈퇴 성공 시 메인 페이지로 이동
                localStorage.removeItem("ACCESS_TOKEN");
                window.location.href="/"
            } else {
                alert("회원탈퇴 실패");
            }
        } 
    } catch (error) {
        alert("회원탈퇴 중 오류가 발생했습니다.");
        throw error;
    }
}