import "../../styles/place/PlaceMain.css";
import { Link, useParams } from "react-router-dom";
import Location2 from "../common/Location2";

import { IoEyeSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getLocation } from "../../api/locationApi";
import { getHeartList, getLocalPlace } from "../../api/LocalPlaceApi";

function PlaceMain() {
  // FestivalMain에서 필요한 페이지 이동 로직을 추가
  const handleCategoryClick = () => {};

  // localNo 이름으로 params 값 가져옴 로그확인 완료
  const { localNo } = useParams();
  const [localName, setLocalName] = useState("");
  const [localData, setLocalData] = useState([]);
  const [visibleItems, setVisibleItems] = useState(4);
  const [heartList, setHeartList] = useState([]); // 하트 리스트 추가

  useEffect(() => {
    const fetchLocalData = async () => {
      try {
        // 여기서 관광지랑 지역이름 설정
        const [placesResponse, locationNameResponse, fetchedHeartList] =
          await Promise.all([
            getLocalPlace(localNo),
            getLocation(localNo),
            getHeartList(), // 하트 리스트 가져오기
          ]);

        // console.log("관광지 지역번호 별:", placesResponse);

        // 여기서 set
        setLocalData(placesResponse.data);
        setLocalName(locationNameResponse.data);
        setHeartList(fetchedHeartList); // 하트 리스트 설정
      } catch (error) {
        console.error("데이터 못가져옴 :", error);
      }
    };

    fetchLocalData();
  }, [localNo]);
  //  스크롤 이벤트 구현
  const handleScroll = () => {
    //  여기가 컨테이너 닿는 위치 지정 근데 footer쪽에서 로드해야하니 footer 안에 클래스지정
    const footer = document.querySelector(".footer .info");

    if (footer) {
      const scrolledToFooter =
        window.innerHeight + window.scrollY >= footer.offsetTop;

      if (scrolledToFooter) {
        // 스크롤이 footer에 닿았을 때 추가 데이터 로드 VisibleItems에 4개더 추가해서 넣는다.
        setVisibleItems((prevItems) => prevItems + 4);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // 각 관광지에 대한 하트 갯수를 가져오는 함수
  const getHeartCountForPlaceNo = (placeNo) => {
    const filteredHeartList = heartList.filter(
      (heart) => heart.placeNo === parseInt(placeNo)
    );
    return filteredHeartList.length;
  };

  return (
    <div>
      <div className="place-title" style={{ paddingTop: "185px" }}>
        <h2> 관광지 </h2>
        <p>Tourist attraction</p>
        <hr className="container" />
      </div>
      <div className="container" style={{ marginBottom: "60px" }}>
        <Location2 onCategoryClick={handleCategoryClick} basePath="/place" />
      </div>
      <div className="place-content container">
        <div className="place-total-set">
          <strong>
            {/* 총건수 확인 */}총<span> {localData.length} </span>건
          </strong>
          <div className="place-btn">
            {/* <button id="1"> 조회수 </button>
            <button id="2"> 좋아요 </button> */}
          </div>
        </div>
        <ul className="place-content-list">
          {localData.slice(0, visibleItems).map((place, index) => (
            <li key={index} className="place-content-item">
              <Link
                to={`/place/${localNo}/${place.placeNo}`}
                className="place-link"
              >
                <div className="photo">
                  <img
                    src={`/assets/place/${localNo}/${index + 1}.jpg`}
                    alt={place.name}
                  />
                </div>
                <div className="place-content-info">
                  <p className="info-location"> {place.location} </p>
                  <strong>{place.name}</strong>
                  <p className="text">{place.content}</p>
                </div>
                <div className="place-heartview">
                  <span>
                    <IoEyeSharp /> <p>{place.viewCnt || 0}</p>
                  </span>
                  <span>
                    <FaHeart /> <p>{getHeartCountForPlaceNo(place.placeNo)}</p>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PlaceMain;
