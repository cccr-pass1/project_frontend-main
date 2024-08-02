import "../styles/Kakaomap.css";
import { useEffect, useRef, useState } from "react";

const { kakao } = window;

function Kakaomap2({ location }) {
  const mapContainer = useRef(null);
  const [latitude, setLatitude] = useState("");
  const [longlatitude, setLongLatitude] = useState("");

  useEffect(() => {
    const getLocationFromAddress = async (address) => {
      try {
        const geocoder = new kakao.maps.services.Geocoder();
        return new Promise((resolve, reject) => {
          geocoder.addressSearch(address, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
              resolve({
                latitude: result[0].y,
                longitude: result[0].x,
              });
            } else {
              reject(new Error("주소로부터 좌표를 가져오지 못했습니다."));
            }
          });
        });
      } catch (error) {
        console.error("주소로부터 좌표를 가져오는 중 오류 발생:", error);
        throw error;
      }
    };

    const initializeMap = async () => {
      try {
        const { latitude, longitude } = await getLocationFromAddress(location);

        setLatitude(latitude);
        setLongLatitude(longitude);
        const container = mapContainer.current;
        if (!container) {
          console.error("지도 컨테이너를 찾을 수 없습니다.");
          return;
        }

        const options = {
          center: new kakao.maps.LatLng(latitude, longitude),
          level: 3,
        };

        const map = new kakao.maps.Map(container, options);

        const markerPosition = new kakao.maps.LatLng(latitude, longitude);
        const marker = new kakao.maps.Marker({ position: markerPosition });
        marker.setMap(map);
      } catch (error) {
        console.error("지도 초기화 중 오류 발생:", error);
      }
    };

    // 컴포넌트 마운트 시 한 번만 호출
    initializeMap();

    // 클릭 이벤트 리스너에서 사용할 때 location을 의존성 배열에 추가
  }, [location]);

  return (
    <>
      <div className="kakaomap-title">
        <h3> 길찾기 </h3>
      </div>
      <div
        ref={mapContainer}
        id="map"
        style={{ width: "100%", height: "400px", position: "relative" }}
      >
        <a
          href={`https://map.kakao.com/link/to/${location},${latitude},${longlatitude}`}
          id="findRoadButton2"
          target="_blank"
        >
          길찾기
        </a>
      </div>
    </>
  );
}

export default Kakaomap2;
