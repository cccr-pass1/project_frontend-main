import "../../styles/place/PlaceView.css";

import { IoEyeSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { FaLink } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getHeartList,
  getLocalPlaceView,
  postHeart,
  checkIfHearted,
  deleteHeart,
} from "../../api/LocalPlaceApi";
import Kakaomap from "../../api/Kakaomap";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import ClipboardJS from "clipboard";

function PlaceView() {
  const { localNo, placeNo } = useParams();
  const [placeData, setPlaceData] = useState(null);

  const [shareUrl, setShareUrl] = useState(""); // URL 상태 추가

  // 로그인 상태 확인 함수
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 하트 상태 함수
  const [isHearted, setIsHearted] = useState(); // 하트 상태 추가
  // 하트 리스트
  const [heartList, setHeartList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        const placeResponse = await getLocalPlaceView(placeNo);
        setPlaceData(placeResponse.data);

        // 하트 리스트를 가져옵니다.
        const heartList = await getHeartList();
        // console.log("하트 리스트:", heartList);

        setHeartList(heartList);

        const currentUrl = window.location.href;
        setShareUrl(currentUrl);

        const accessToken = localStorage.getItem("ACCESS_TOKEN");
        setIsLoggedIn(!!accessToken);

        // 토큰이 존재하는 경우에만 디코딩
        if (accessToken) {
          // accessToken이 존재할 때만 디코딩 수행
          try {
            const decodedToken = jwtDecode(accessToken);
            const userId = decodedToken.id; // userId 값 설정

            // 좋아요 여부 확인 함수 호출
            const isHeartedResult = await checkIfHearted(userId, placeNo); // userId 사용
            // console.log(isHeartedResult);
            setIsHearted(isHeartedResult); // 상태 업데이트

            // 나머지 부분 생략
          } catch (error) {
            console.error("토큰 디코딩 오류:", error);
          }
        }
      } catch (error) {
        console.error("데이터 못가져옴 :", error);
      }
    };

    fetchPlaceData();
  }, [placeNo]);

  const handleHeartClick = async () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: "info",
        title: "로그인이 필요합니다.",
        text: "관광지를 목록에 담고 싶으신가요? 로그인 부탁드립니다! ",
        showCancelButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "취소",
      }).then((result) => {
        // 확인 버튼을 눌렀을 때 실행되는 함수
        if (result.isConfirmed) {
          navigate("/login");
        }
        // 취소(No) 버튼을 눌렀을 때 아무 동작 안 함
      });
    }

    try {
      const accessToken = localStorage.getItem("ACCESS_TOKEN");
      const decodedToken = jwtDecode(accessToken);
      const userId = decodedToken.id;

      // let alertMessage = ""; // 알림 메시지 변수 추가

      if (isHearted) {
        // 좋아요 취소 - deleteHeart 함수 호출
        await deleteHeart(userId, placeNo);
        // alertMessage = "좋아요가 취소되었습니다.";
      } else {
        // 좋아요 - postHeart 함수 호출
        await postHeart({ id: userId, placeNo });
        // alertMessage = "좋아요가 등록되었습니다.";
      }

      // 조회수를 다시 가져오지 않고, 하트 수만 업데이트
      setPlaceData((prevPlaceData) => ({
        ...prevPlaceData,
        heartCnt: isHearted
          ? prevPlaceData.heartCnt - 1
          : prevPlaceData.heartCnt + 1,
      }));
      // 하트 상태 업데이트
      setIsHearted(!isHearted);

      // 하트 리스트를 비동기적으로 업데이트
      const updatedHeartList = await getHeartList();
      setHeartList(updatedHeartList);
      // 알림 메시지 출력
      // alert(alertMessage);
    } catch (error) {
      console.error("하트 클릭 오류:", error);
    }
  };

  function handleCopyUrlClick() {
    try {
      const clipboard = new ClipboardJS(".btns");

      clipboard.on("success", function (e) {
        console.log(e);
        Swal.fire({
          icon: "success",
          title: "URL이 복사되었습니다.",
          text: "원하는 곳에 붙여넣기(Ctrl+V)하여 공유하세요.",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      });

      clipboard.on("error", function (e) {
        console.log(e);
        Swal.fire({
          icon: "error",
          title: "URL 복사 실패",
          text: "URL을 복사하는 중에 오류가 발생했습니다.",
        });
      });
    } catch (error) {
      console.error("ClipboardJS 초기화 오류:", error);
    }
  }

  // placeNo에 해당하는 하트 갯수를 가져오는 함수
  function getHeartCountForPlaceNo(placeNo) {
    const filteredHeartList = heartList.filter(
      (heart) => heart.placeNo === parseInt(placeNo)
    );
    return filteredHeartList.length;
  }

  return (
    <div className="container" style={{ paddingTop: "200px" }}>
      {placeData && (
        <>
          <div className="placeview-title">
            <h2>{placeData.name}</h2>
            <span>{placeData.location}</span>
          </div>
          <div className="plcaeview-heartview">
            <span>
              <IoEyeSharp /> <p>{placeData.viewCnt || 0}</p>
            </span>
            <span onClick={handleHeartClick}>
              {isHearted ? <FaHeart /> : <CiHeart className="heart-icon " />}
              <p>{getHeartCountForPlaceNo(placeNo)}</p>
            </span>
            <span className="btns" onClick={handleCopyUrlClick}>
              <FaLink />
            </span>
          </div>
          <div className="placeview-image">
            <img
              src={`/assets/place/${localNo}/${placeNo}.jpg`}
              alt={placeData.name}
            />
          </div>
          <div className="placeview-content">
            <h2>상세정보</h2>
          </div>
          <div className="placeview-text">
            <p>{placeData.content}</p>
          </div>
          <div className="placeview-map">
            <Kakaomap
              latitude={parseFloat(placeData.latitude)}
              longitude={parseFloat(placeData.longitude)}
              name={placeData.name}
            />
          </div>
        </>
      )}
    </div>
  );
}
export default PlaceView;
