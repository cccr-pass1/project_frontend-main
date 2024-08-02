import { Link, useParams } from "react-router-dom";
import "../../styles/festival/FestivalMain.css";
import Location2 from "../common/Location2";
import { getLocalFestival } from "../../api/LocalFestivalApi";
import { useEffect, useState } from "react";
import { getLocation } from "../../api/locationApi";

function FestivalMain() {
  // FestivalMain에서 필요한 페이지 이동 로직을 추가
  const handleCategoryClick = (localNo) => {};

  // localNo 이름으로 params 값 가져옴 로그확인 완료
  const { localNo } = useParams();
  const [localName, setLocalName] = useState("");
  const [localData, setLocalData] = useState([]);

  useEffect(() => {
    const fetchLocalData = async () => {
      try {
        // 여기서 localNo별 페스티벌이랑 locationName 을 가져오는 함수
        const [festivalResponse, locationNameResponse] = await Promise.all([
          getLocalFestival(localNo),
          getLocation(localNo),
        ]);
        // console.log("축제 목록 지역별 : ", festivalResponse);
        // 여기서 set
        setLocalData(festivalResponse.data);
        setLocalName(locationNameResponse.data);
      } catch (error) {
        console.error("데이터 못가져옴 :", error);
      }
    };

    fetchLocalData();
  }, [localNo]);

  return (
    <div>
      <div className="festival-title" style={{ paddingTop: "180px" }}>
        <h2> 축제 </h2>
        <p> Festival </p>
        <hr className="container" />
      </div>
      {/*  여기서 베이스가 되는 url 지정 */}
      <div className="container" style={{ marginBottom: "60px" }}>
        <Location2 onCategoryClick={handleCategoryClick} basePath="/festival" />
      </div>
      <div className="festival-content container">
        <div className="festival-content-wrap">
          <ul className="content-list">
            {localData.slice(0, 3).map((festival, index) => (
              <li key={index} className={`content`}>
                <Link to={`/festival/${localNo}/${festival.festivalNo}`}>
                  <img
                    src={`/assets/festival/${localNo}/${index + 1}.jpg`}
                    alt={festival.name}
                    className="festival-list-image"
                  />
                  <div className="festival-text-area">
                    <div className="festival-text-title">
                      <strong>{festival.name}</strong>
                    </div>
                    <div className="festival-text-desc">
                      <span>{`${festival.schedule}`}</span>
                      <span>{festival.location}</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 줄바꿈 */}
      <hr className="container" />
      <div className="festival-list container">
        <div className="festival-location-name">
          <h2>{localName.name}</h2>
          <p>대한민국 방방곡곡</p>
        </div>
        <div className="festival-list-item">
          <ul>
            {localData.map((festival, index) => (
              <li key={index}>
                <Link to={`/festival/${localNo}/${festival.festivalNo}`}>
                  <div className="festival-list-image">
                    <img
                      src={`/assets/festival/${localNo}/${index + 1}.jpg`}
                      alt={festival.name}
                    />
                  </div>
                  <div className="festival-text-desc">
                    <strong>{festival.name}</strong>
                    <span className="addr">{festival.location}</span>
                    <span className="date">{festival.schedule}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default FestivalMain;
