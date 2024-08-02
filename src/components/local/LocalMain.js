import "../../styles/local/LocalMain.css";
import { Link } from "react-router-dom";

import Location from "../common/Location";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { GiFlowerEmblem } from "react-icons/gi";

//  스와이퍼 부분
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLocation } from "../../api/locationApi";
import { getLocalFestivals, getLocalPlace } from "../../api/LocalPlaceApi";
import { getLocalFestival } from "../../api/LocalFestivalApi";

function LocalmainSwiper({ places, localNo, slidesPerView }) {
  return (
    <Swiper
      key="localmainswiper"
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
        backgroundColor: "white",
        paddingTop: "20px",
      }}
      modules={[Autoplay]}
      spaceBetween={30}
      slidesPerView={slidesPerView + 1}
      autoplay={{ delay: "3000" }}
      loop={true}
    >
      {places.map((place, index) => (
        <SwiperSlide key={index}>
          {/* Link 추가 */}
          <Link to={`/place/${localNo}/${place.placeNo}`}>
            <div className="localmain-slider-main">
              <img src={`/assets/place/${localNo}/${index + 1}.jpg`} alt="" />
              <div className="localmain-slider-text">
                <strong>{place.name}</strong>
                <p>{place.location}</p>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

function LocalmainSwiper2({ festivals, localNo, slidesPerView }) {
  return (
    <Swiper
      key="localmainswiper2"
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
        backgroundColor: "white",
        paddingTop: "20px",
      }}
      modules={[Autoplay]}
      spaceBetween={30}
      slidesPerView={slidesPerView}
      autoplay={{ delay: "2500" }}
      loop={true}
    >
      {festivals.map((festival, index) => (
        <SwiperSlide key={index}>
          {/* Link 추가 */}
          <Link to={`/festival/${localNo}/${festival.festivalNo}`}>
            <div className="localmain-slider-main localmain-slider-main2">
              <img
                src={`/assets/festival/${localNo}/${index + 1}.jpg`}
                alt=""
              />
              <div className="localmain-slider-text">
                <strong>{festival.name}</strong>
                <span>{`${festival.schedule}`}</span>
                <p>{festival.location}</p>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
function LocalMain() {
  // URL에서 localNo 파라미터를 가져옵니다.
  const { localNo } = useParams();

  // 지역 정보, 관광지 정보, 축제 정보를 저장할 상태 변수들을 정의합니다.
  const [localData, setLocalData] = useState(""); // 지역 정보
  const [localPlaces, setLocalPlaces] = useState([]); // 관광지 정보
  const [localFestivals, setLocalFestivals] = useState([]); // 축제 정보

  // width값에 따라 슬라이더 몇개 보여줄지 정하는 코드
  const [slidesPerView, setSlidesPerView] = useState(calculateSlidesPerView);
  useEffect(() => {
    // localNo에 해당하는 지역 정보를 가져오는 함수
    const fetchLocalData = async () => {
      try {
        // API를 통해 데이터를 가져옵니다.
        const response = await getLocation(localNo);
        const data = response.data;

        // 콘솔에 지역 정보를 출력하고 상태를 업데이트합니다.
        // console.log("localData: ", data);
        setLocalData(data);
      } catch (error) {
        console.error("Error fetching local data:", error);
      }
    };

    // localNo에 해당하는 관광지 정보를 가져오는 함수
    const fetchLocalPlaces = async () => {
      try {
        // API를 통해 데이터를 가져옵니다.
        const response = await getLocalPlace(localNo);
        const data = response.data;

        // 콘솔에 관광지 정보를 출력하고 상태를 업데이트합니다.
        // console.log("localPlaces: ", data);
        setLocalPlaces(data);
      } catch (error) {
        console.error("Error fetching local places:", error);
      }
    };

    // localNo에 해당하는 축제 정보를 가져오는 함수
    const fetchLocalFestivals = async () => {
      try {
        // API를 통해 데이터를 가져옵니다.
        const response = await getLocalFestival(localNo);
        const data = response.data;

        // 콘솔에 축제 정보를 출력하고 상태를 업데이트합니다.
        // console.log("localFestivals: ", data);
        setLocalFestivals(data);
      } catch (error) {
        console.error("Error fetching local festivals:", error);
      }
    };

    // 각각의 데이터를 가져오는 함수들을 호출합니다.
    fetchLocalData();
    fetchLocalPlaces();
    fetchLocalFestivals();
  }, [localNo]); // localNo가 변경될 때마다 실행되도록 설정합니다.

  //  슬라이더 갯수 지정하는 함수
  useEffect(() => {
    function handleResize() {
      setSlidesPerView(calculateSlidesPerView());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // 빈 의존성 배열은 이 효과가 초기 렌더링 이후 한 번 실행됨을 의미합니다.

  function calculateSlidesPerView() {
    const windowWidth = window.innerWidth;

    if (windowWidth >= 1200) {
      return 3; // 창 폭이 1200 이상이면 3개의 슬라이드를 표시
    } else if (windowWidth >= 768) {
      return 2; // 창 폭이 768 이상이면서 1200 이하이면 2개의 슬라이드를 표시
    } else {
      return 1; // 더 작은 창 폭에는 1개의 슬라이드만 표시
    }
  }

  return (
    <div className="container">
      {/*지역 이미지 클릭  여기는 Local 하나라서 Location컴포넌트에 아무것도 추가 안해도 ok */}
      <Location />
      <div className="location container">
        <img
          src="/assets/etc/line.png"
          alt="line"
          id="location-pageline container"
          style={{ width: "100%" }}
        />
        <h3 className="location-title"> {localData.name} </h3>
        <p className="location-text"> location </p>
        <hr className="container" />
      </div>

      <div className="localmain-image">
        <img src={`/assets/local/${localNo}/1.jpg`} />
      </div>

      <div className="localmain-info">
        <span>
          <FaPeopleGroup className="icon" />
          <h3>인구</h3>
          <p>{localData.poplation}</p>
        </span>
        <span>
          <FaLocationDot />
          <h3>면적</h3>
          <p>{localData.area}km2</p>
        </span>
        <span>
          <GiFlowerEmblem />
          <h3>시화</h3>
          <p>{localData.flower}</p>
        </span>
      </div>
      <div className="localmain-content">
        <h2> 상세정보 </h2>
      </div>
      <div className="localmain-text">
        <p>{localData.content}</p>
      </div>
      {/* 스와이퍼 */}
      <div className="localmain-swiper-title">
        <h2> 추천 관광지 </h2>
      </div>
      <LocalmainSwiper
        places={localPlaces}
        localNo={localNo}
        slidesPerView={slidesPerView}
      />

      <hr style={{ marginBottom: "0" }} />
      {/* 스와이퍼 */}
      <div className="localmain-swiper-title">
        <h2> 추천 축제 </h2>
      </div>
      <LocalmainSwiper2
        festivals={localFestivals}
        localNo={localNo}
        slidesPerView={slidesPerView}
      />
    </div>
  );
}

export default LocalMain;
