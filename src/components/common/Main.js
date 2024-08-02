// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useEffect, useState } from "react";
import { IoEyeSharp } from "react-icons/io5";

import SouthKoreaMap from "../common/SouthKoreaMap.js";
import Video from "./Video.js";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import "../../styles/Main.css";

//  스와이퍼 부분
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getCompanyBaordList, getTourBaordList } from "../../api/BoardApi.js";

const baseURL = process.env.REACT_APP_BASE_URL;
const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

function Section2Swiper({
  festivalData,
  localNo,
  handlePlaceUpdate,
  slidesPerView,
}) {
  return (
    <div className="swiper-container">
      <Swiper
        key="section2Swiper"
        className="swiper-wrapper"
        modules={[Autoplay, Pagination]}
        spaceBetween={50}
        slidesPerView={slidesPerView}
        autoplay={{ delay: 3000 }}
        loop={false}
        pagination={{ type: "bullets", clickable: true }}
      >
        {festivalData.slice(0, 5).map((festival, index) => (
          <SwiperSlide key={festival.festivalNo}>
            <Link to={`/festival/${localNo}/${festival.festivalNo}`}>
              <div
                className="section2-slider-item"
                onClick={() => handlePlaceUpdate(festival, localNo)}
              >
                <img
                  src={`/assets/festival/${localNo}/${festival.festivalNo}.jpg`}
                  alt=""
                />
                <div className="section2-slider-text">
                  <strong>{festival.name}</strong>
                  <p>{`날짜: ${festival.schedule}`}</p>
                  <p>{`위치: ${festival.location}`}</p>
                  <span>{`정보: ${festival.content}`}</span>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function Section3Swiper({ foods, localNo, slidesPerView }) {
  return (
    <Swiper
      key="section3Swiper"
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
        backgroundColor: "white",
        paddingTop: "50px",
      }}
      modules={[Autoplay]}
      spaceBetween={30}
      // 조절가능! 슬라이더 갯수
      slidesPerView={slidesPerView + 1}
      autoplay={{ delay: "3000" }}
      loop={true}
    >
      {foods && foods.length > 0 ? (
        foods.map((food, index) => (
          <SwiperSlide key={food.foodNo}>
            <div className="section3-slider-item">
              <img
                src={`/assets/regionfood/${localNo}/${index + 1}.jpg`}
                alt=""
              />
              <div className="section3-slider-text">
                <strong>{food.name}</strong>
                <p>{localNo.name}</p>
              </div>
            </div>
          </SwiperSlide>
        ))
      ) : (
        <p>No data available</p>
      )}
    </Swiper>
  );
}

function Section4Swiper() {
  const [tourBoardListData, setTourBoardListData] = useState([]);

  useEffect(() => {
    const fetchTourBoardListData = async () => {
      try {
        const response = await getTourBaordList();
        const data = response.data;

        // 이미지 URL을 가져오기 위해 각 아이템에 대해 fetchImage 호출
        const newData = await Promise.all(
          data.map(async (item) => {
            const imageUrl = await fetchImage(item.bno);
            return { ...item, imageUrl };
          })
        );

        setTourBoardListData(newData.slice(0, 8)); // 데이터 8개만 짤라버림 게시글 8개.
      } catch (error) {
        console.error("Error fetching local data:", error);
      }
    };

    fetchTourBoardListData();
  }, []);

  const fetchImage = async (bno) => {
    try {
      const response = await axiosInstance.get(`/api/images/${bno}`, {
        responseType: "arraybuffer",
      });
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const imageUrl = URL.createObjectURL(blob);

      return imageUrl;
    } catch (error) {
      // console.error(`에러 : ${bno}:`, error);
      return null;
    }
  };

  return (
    <Swiper
      key="section4Swiper"
      style={{
        width: "100%", // 변경된 부분
        position: "relative",
      }}
      modules={[Pagination]}
      pagination={{ clickable: true }}
      spaceBetween={20} // 필요에 따라 조절
      slidesPerView={1}
    >
      {tourBoardListData
        .reduce((acc, item, index) => {
          if (index % 2 === 0) {
            const pair = [item, tourBoardListData[index + 1]];
            acc.push(pair);
          }
          return acc;
        }, [])
        .map((pair, index) => (
          <SwiperSlide key={pair[0]?.bno}>
            <ul className="tourisspotList">
              {pair.map((item, subIndex) => (
                <li className="swiper-slide" key={subIndex}>
                  {item?.bno !== undefined ? (
                    <Link to={`/board/touristSpotView/${item?.bno}`}>
                      <div className="thumb-wrap">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={`Tourisspot ${index + subIndex + 1}`}
                          />
                        ) : (
                          <img
                            src={`${process.env.PUBLIC_URL}/assets/etc/noImg.png`}
                          />
                        )}
                      </div>
                      <div className="text-wrap">
                        <span> {item.location} </span>
                        <h3>{item.title}</h3>
                        <strong> {item.id.name} </strong>
                        <p style={{ marginTop: "45px" }}>{item.content}</p>
                        <span className="viewcnt">
                          <IoEyeSharp /> <p>{item.viewCnt || 0}</p>
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <p> 게시글 없음 </p>
                  )}
                </li>
              ))}
            </ul>
          </SwiperSlide>
        ))}
    </Swiper>
  );
}
function Main() {
  const location = useLocation();
  const [locationData, setLocationData] = useState([]);
  const [festivalData, setFestivalData] = useState([]);
  const [foodData, setFoodData] = useState([]);
  const [localNo, setLocalNo] = useState(1);
  // width값에 따라 슬라이더 몇개 보여줄지 정하는 코드
  const [slidesPerView, setSlidesPerView] = useState(calculateSlidesPerView);

  // 관광지 추천 게시판 글 가져오기
  const [TourBoardListData, setTourBoardListData] = useState([]);

  const [selectedCompanyLocationFilter, setSelectedCompanyLocationFilter] =
    useState("서울");

  const handlePlaceUpdate = (location, festivals, foods, localNo) => {
    setLocationData(location);
    setFestivalData(festivals);
    setFoodData(foods);
    setLocalNo(localNo);
  };

  useEffect(() => {
    const fetchSeoulData = async () => {
      try {
        // 기본 지역 데이터 가져오기
        const response = await axiosInstance.get(`/localPlaces/${localNo}`);

        // 축제 데이터 가져오기
        const festivalResponse = await axiosInstance.get(
          `/localFestivals/${localNo}`
        );

        // 특산물 데이터 가져오기
        const foodResponse = await axiosInstance.get(`/localFoods/${localNo}`);

        // 데이터와 localNo를 업데이트
        handlePlaceUpdate(
          response.data,
          festivalResponse.data,
          foodResponse.data,
          localNo
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSeoulData(); // 초기 서울 데이터 호출
  }, [localNo]);

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

  // 여행메이트 게시판 글 가져오기
  const [CompanyBoardListData, setCompanyBoardListData] = useState([]);

  useEffect(() => {
    const fetchCompanyBoardListData = async () => {
      try {
        const response = await getCompanyBaordList();
        const data = response.data;

        setCompanyBoardListData(data);
      } catch (error) {
        console.error("Error fetching local data:", error);
      }
    };

    fetchCompanyBoardListData();
  }, []);

  const handleLocationChange = (location) => {
    setSelectedCompanyLocationFilter(location);
  };

  const filteredCompanyBoardListData = CompanyBoardListData.filter(
    (boardItem) =>
      selectedCompanyLocationFilter === "전체 지역" ||
      boardItem.location === selectedCompanyLocationFilter
  );

  return (
    <div>
      <Video />
      <div className="mainpage container">
        <div className="section1-headname">
          <h3>
            <strong> 새로운 발견과 함께하는 여행 - 새하마노 방방곡곡 </strong>
          </h3>
        </div>

        {/* 여기 구분선 */}
        <hr style={{ marginBottom: "25px", marginTop: "0" }} />
        <div className="section1 section">
          <div className="section1-item1">
            <div className="section1-place">
              <strong>Tourist attraction</strong>
              <h3 className="place-locations">
                <p> {locationData.length > 0 && locationData[0].location}</p>{" "}
                <span>의 요즘 뜨는 관광지</span>
              </h3>
            </div>
            <ul className="section-place-info">
              {locationData.map((place, index) => {
                // 최대 3개의 요소만 렌더링
                if (index < 4) {
                  return (
                    <li key={index}>
                      <Link to={`/place/${localNo}/${place.placeNo}`}>
                        {/* Link를 사용하여 클릭 시 라우팅 경로 설정 */}
                        <div className="place-info">
                          <img
                            src={`/assets/place/${localNo}/${index + 1}.jpg`}
                            alt={place.name}
                          />
                          <div className="place-info-text">
                            <strong>{place.name}</strong>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                }
                return null; // index가 3 이상이면 렌더링하지 않음
              })}
            </ul>
            <Link to={`/place/${localNo}`}>
              <button className="section-place-more">
                <span> 더보기 </span>
              </button>
            </Link>
          </div>
          <div className="section1-item2">
            <strong className="section1-item2-title">
              조회할 지역을 선택하세요.
            </strong>
            <p className="section1-item2-name"> </p>
            {/* 빈배열로 festival 과 foods 데이터 그리고 마지막으로 localNo를 받아온답니다.. 초기화? 대박 */}
            <SouthKoreaMap
              onLocationClick={(data, localNo) =>
                handlePlaceUpdate(data, [], [], localNo)
              }
              className="koreamap"
            />
            {/* 서울 지도 불러오는부분 svg를 js로 변환해서 함 이유는 호환성문제? svg를 바로 import 할수가 없다고 했다..*/}
          </div>
        </div>
        <hr />
        <div className="section2 section">
          {/* 로케이션데이터에 지역정보가 있어서 [0]번 베열 이용해서 지역이름 설정 */}
          <strong>Festival</strong>
          <h3 className="place-locations">
            {" "}
            <p> {locationData.length > 0 && locationData[0].location}</p> 의
            축제/행사 정보모음{" "}
          </h3>

          <img src="/assets/etc/line.png" alt="line" id="pageline" />
          <div>
            <Section2Swiper
              festivalData={festivalData}
              localNo={localNo}
              handlePlaceUpdate={handlePlaceUpdate}
              slidesPerView={slidesPerView}
            />
            {/* 일단 주석 */}
            {/* <button className="w-btn-neon2 section2-item-button" type="button">
              더보기
            </button> */}
          </div>
        </div>
        <hr />
        <div className="section3 section">
          <strong> 지역특산물 </strong>
          <h3 className="place-locations">
            {" "}
            "방방곡곡!
            <p> {locationData.length > 0 && locationData[0].location}</p> 의
            특산물을 소개합니다."{" "}
          </h3>
          <img src="/assets/etc/line.png" alt="line" id="pageline" />
          <div>
            <Section3Swiper
              foods={foodData}
              localNo={localNo}
              handlePlaceUpdate={handlePlaceUpdate}
              slidesPerView={slidesPerView}
            />
          </div>
          <Link to={`/localfoods/${localNo}`}>
            <button className="section-localfood-more">
              <span> 더보기 </span>
            </button>
          </Link>
        </div>

        <div className="section4 section">
          <div className="section4-background"></div>
          <strong className="board-title"> Board </strong>
          <h3> 새하마노의 누리꾼 소식을 만나보세요! </h3>
          <img src="/assets/etc/line.png" alt="line" id="pageline" />
          <div className="board-section">
            <div className="board-Company">
              <div className="title">
                <p>여행 메이트</p>
              </div>
              <div className="tab-list">
                {[
                  "서울",
                  "인천",
                  "대전",
                  "부산",
                  "경기",
                  "충청",
                  "강원",
                  "전라",
                  "경상",
                ].map((locations, index) => (
                  <span
                    key={index}
                    className={`locations ${
                      selectedCompanyLocationFilter === locations
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleLocationChange(locations)}
                  >
                    {locations}
                  </span>
                ))}
              </div>

              <div className="CompanyList">
                <ul>
                  {filteredCompanyBoardListData.slice(0, 5).map((boardItem) => (
                    <li key={boardItem.bno}>
                      <Link to={`/board/CompanyView/${boardItem.bno}`}>
                        <p>{boardItem.title}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link to="/board/company" className="btn more">
                  <span> 더보기 </span>
                </Link>
              </div>
            </div>

            <div className="board-Tourisspot">
              <div className="title">
                <p>관광지 추천</p>
              </div>
              <Section4Swiper />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
