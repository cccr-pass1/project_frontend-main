import "../styles/Kakaomap.css";
import { useEffect } from "react";

const { kakao } = window;

function Kakaomap({ latitude, longitude, name }) {
  useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(latitude, longitude),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);

    // 마커가 표시될 위치
    const markerPosition = new kakao.maps.LatLng(latitude, longitude);

    // 마커를 생성
    const marker = new kakao.maps.Marker({
      position: markerPosition,
    });

    // 마커를 지도 위에 표시
    marker.setMap(map);

    // 길찾기 버튼 추가
    const findRoadButton = document.getElementById("findRoadButton");
    findRoadButton.addEventListener("click", handleClick);
  }, [latitude, longitude, name]);

  const handleClick = (e) => {
    e.preventDefault(); // 기본 동작 막기

    // 길찾기를 수행할 카카오 지도 페이지 URL 생성
    const roadURL = `https://map.kakao.com/link/to/${name},${latitude},${longitude}`;

    // 비동기로 처리하여 리렌더링 후에 실행되도록 함 일단 여긴 뭐 페이지 로드를 한번만 시켜주려고 한다는데 너무 어렵다 모르겠다
    setTimeout(() => {
      window.open(roadURL);
    }, 0);
  };

  return (
    <>
      <div className="kakaomap-title">
        <h3> 길찾기 </h3>
      </div>
      <div
        id="map"
        style={{ width: "100%", height: "400px", position: "relative" }}
      >
        <button id="findRoadButton">길찾기</button>
      </div>
    </>
  );
}

export default Kakaomap;
