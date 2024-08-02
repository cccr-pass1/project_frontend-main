import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getListLocation } from "../../api/locationApi";
import "../../styles/Location.css";

function Location() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await getListLocation();
        const locationsData = response.data;

        setLocations(locationsData);
      } catch (error) {
        console.error("지역 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchLocations();
  }, []);

  //  카테고리 이동할 때의 클릭 이벤트
  const handleLocationClick = (location) => {
    // console.log(`선택한 지역은 ${location.name}`);
  };

  return (
    <>
      <div className="container" style={{ paddingTop: "150px" }}>
        <nav className="local justify-content-center text-center">
          <ul className="local-area">
            {locations.map((location) => (
              <li key={location.localNo}>
                <NavLink
                  to={`/local/${location.localNo}`}
                  className={`localcategory ${location.name.toLowerCase()}`}
                  // 현재 링크에 "active" 클래스 적용
                  // 여기서 확인
                  onClick={() => handleLocationClick(location)}
                >
                  <span className="local-area-text">{location.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Location;
