import "../../styles/festival/FestivalView.css";
import { FaRegEye } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { FaLocationArrow } from "react-icons/fa";
import { SiNamebase } from "react-icons/si";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getLocalFestival,
  getLocalFestivalView,
} from "../../api/LocalFestivalApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Kakaomap2 from "../../api/Kakaomap2";

function FestivalViewSwiper({ festivals, localNo, slidesPerView }) {
  return (
    <Swiper
      key="festivalviewswiper"
      style={{
        height: "300px",
        width: "100%",
        position: "relative",
        backgroundColor: "white",
        paddingTop: "50px",
      }}
      modules={[Autoplay]}
      spaceBetween={50}
      slidesPerView={slidesPerView}
      autoplay={{ delay: 4000 }}
      loop={true}
    >
      {festivals.map((festival, index) => (
        <SwiperSlide key={festival.festivalNo}>
          <Link to={`/festival/${localNo}/${festival.festivalNo}`}>
            <div className="festivalViewswiper">
              <img
                src={`/assets/festival/${localNo}/${index + 1}.jpg`}
                className="festivalViewswiper-image"
                alt=""
              />
              <div className="festivalViewswiper-text">
                <strong>{festival.name}</strong>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

function FestivalView() {
  const { localNo, festivalNo } = useParams();
  const [festivalData, setFestivalData] = useState(null);
  const [localFestivals, setLocalFestivals] = useState([]); // 축제 정보
  // width값에 따라 슬라이더 몇개 보여줄지 정하는 코드
  const [slidesPerView, setSlidesPerView] = useState(calculateSlidesPerView);

  useEffect(() => {
    const fetchFestivalData = async () => {
      try {
        const festivalResponse = await getLocalFestivalView(festivalNo);
        // console.log("축제 상세 정보:", festivalResponse);
        setFestivalData(festivalResponse.data);
      } catch (error) {
        console.error("데이터 못가져옴:", error);
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

    fetchLocalFestivals();
    fetchFestivalData();
  }, [festivalNo, localNo]);

  useEffect(() => {
    function handleResize() {
      setSlidesPerView(calculateSlidesPerView());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function calculateSlidesPerView() {
    const windowWidth = document.documentElement.clientWidth;

    if (windowWidth >= 1200) {
      return 3;
    } else if (windowWidth >= 768) {
      return 2;
    } else {
      return 1;
    }
  }
  return (
    <div
      className="festivalView-main container"
      style={{ paddingTop: "150px" }}
    >
      <div className="festivalView-head">
        <div className="festivalView-content">
          <div className="inner container">
            <div className="festivalView-title">
              {festivalData && (
                <>
                  <span>{festivalData.localNo.name}</span>
                  <h2>{festivalData.name}</h2>
                </>
              )}
            </div>
            <div className="festivalView-date">
              {festivalData && <span>{festivalData.schedule}</span>}
            </div>
          </div>
        </div>
      </div>
      <div className="festivalView-viewcnt ">
        <span>
          {festivalData && (
            <>
              <FaRegEye />
              <p>{festivalData.viewCnt || 0}</p>
            </>
          )}
        </span>
      </div>
      <div className="festivalView-text ">
        <div className="fesivalView-text-content">
          {festivalData && <p>{festivalData.content}</p>}
        </div>
      </div>
      {/* 분할선 */}
      <hr style={{ margin: "0" }} />
      <div className="festivalView-detail ">
        <div className="festivalView-detail-img">
          {/* 이미지 경로를 festivalNo에 따라서 설정해야할거 같아서 이렇게 했습니다. 음.. */}
          <img
            src={`/assets/festival/${localNo}/${festivalNo}.jpg`}
            // src={`/assets/festival/${localNo}/${localNo}.jpg`} // 임시로 넣ㅇ어둔거
            alt={festivalData?.name}
          />
        </div>
        <div className="festivalView-detail-info">
          <ul>
            <li>
              {festivalData && (
                <>
                  <div className="icon">
                    <MdDateRange className="icons date" />
                  </div>
                  <p>{festivalData.schedule}</p>
                </>
              )}
            </li>
            <li>
              {festivalData && (
                <>
                  <div className="icon">
                    <FaLocationArrow className="icons where" />
                  </div>
                  <p>{festivalData.location}</p>
                </>
              )}
            </li>
            <li>
              {festivalData && (
                <>
                  <div className="icon">
                    <SiNamebase className="icons name" />
                  </div>
                  <p>{festivalData.name}</p>
                </>
              )}
            </li>
          </ul>
        </div>
      </div>
      {/* 분할선 */}
      <hr style={{ marginTop: "0" }} />
      <div className="festivalView-map">
        {festivalData && (
          <Kakaomap2
            location={festivalData.location}
            name={festivalData.name}
          />
        )}
      </div>
      {/* 분할선 */}
      <hr />
      <div className="section2 section">
        <h3> 이런 축제는 어때? </h3>
        <img src="/assets/etc/line.png" alt="line" id="pageline" />
        <div>
          <FestivalViewSwiper
            festivals={localFestivals}
            localNo={localNo}
            slidesPerView={slidesPerView}
          />
        </div>
      </div>
    </div>
  );
}
export default FestivalView;
