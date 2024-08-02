import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import "../../styles/Header.css";

import { FaSearch } from "react-icons/fa";
import { IoPeople } from "react-icons/io5";

import Swal from "sweetalert2";
import { getWeatherData } from "../../api/Weather";
import { useEffect, useState } from "react";
// 라우터  uselocation으로  경로에 따른 색상변경, usenavigate로 경로를 설정 Navdropdown< 원래 페이지이동 불가
import {
  Link,
  NavLink,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import axios from "axios";

import { Modal, Button } from "react-bootstrap";

// 필요한 라이브러리를 가져옵니다
import { jwtDecode } from "jwt-decode";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [weatherInfo, setWeatherInfo] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [showBoardDropdown, setShowBoardDropdown] = useState(false);

  // 로그인 확인 함수
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 로그인 사용자 데이터
  const [userData, setUserData] = useState(null);
  // 로그아웃 모달
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleShowLogoutModal = () => setShowLogoutModal(true);
  const handleCloseLogoutModal = () => setShowLogoutModal(false);

  // 스크롤링 이벤트 처리
  const [logoImage, setLogoImage] = useState("logonew.png");

  const handleMouseOverBoardDropdown = () => {
    setShowBoardDropdown(true);
  };
  const handleMouseOutBoardDropdown = () => {
    setShowBoardDropdown(false);
  };

  // 특정 페이지 일때에 헤더를 숨기는 조건을 확인하는 함수 ( 로그인,회원가입 사용)
  const isHeaderHidden = () => {
    return location.pathname === "/login" || location.pathname === "/signup";
  };
  // 헤더가 보이는지 여부를 결정하는 함수
  const getHeaderVisibility = () => {
    return isHeaderHidden() ? "hidden" : "";
  };

  // Y축 스크롤 상태에 따라서 스타일 변하는 함수
  const [scrolling, setScrolling] = useState(false);
  const handleScroll = () => {
    if (window.scrollY > 550) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 스크롤에 따라 로고 이미지 변경
  useEffect(() => {
    setLogoImage(scrolling ? "logo.png" : "logonew.png");
  }, [scrolling]);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  // 경로에 따라 사용할 로고 이미지 설정
  const getLogoImage = () => {
    return location.pathname === "/" && !scrolling && !isHovering
      ? "logonew.png"
      : "logo.png";
  };
  // 현재 경로에 따라 스크롤링을 하면 색상이 변하는 함수 (메인페이지사용) 스크롤 이벤트도
  const getHeaderColor = () => {
    if (location.pathname === "/") {
      return scrolling ? "header-dark" : "";
    } else {
      return "header-dark";
    }
  };

  //  날씨 데이터 받아오는 함수
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await getWeatherData();
        setWeatherInfo(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    fetchWeatherData();
  }, []);

  useEffect(() => {
    // 로컬 스토리지에서 액세스 토큰이 있는지 확인
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    setIsLoggedIn(!!accessToken);

    if (accessToken && !userData) {
      // JWT를 디코딩하여 페이로드에 액세스합니다
      const decodedToken = jwtDecode(accessToken);

      // 디코딩된 페이로드에서 사용자 ID에 액세스합니다
      const userId = decodedToken.id; // "sub"는 사용자 ID에 대한 표준 클레임입니다

      // 사용자 ID를 로그에 기록하거나 필요한 대로 사용합니다
      // console.log("JWT에서 추출한 사용자 ID:", userId);

      // API 호출을 위한 주소
      const apiUrl = `${process.env.REACT_APP_BASE_URL}members/${userId}`;

      // API 호출
      axios
        .get(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          // API 응답 데이터를 상태에 설정
          // console.log(response.data);
          setUserData(response.data);
        })
        .catch((error) => {
          console.error("API 호출 중 오류 발생:", error);
        });
    }

    // 메인 페이지로 이동할 때 헤더를 업데이트
    if (location.pathname === "/") {
      // console.log("메인 페이지로 이동했습니다.");
    }
  }, [location.pathname, userData]);

  const handleMyPageClick = () => {
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    const atisLoggedIn = !!accessToken;

    if (atisLoggedIn) {
      navigate("/mypage");
    } else {
      Swal.fire({
        icon: "info",
        text: "마이페이지를 이용하고 싶으신가요?",
        title: "로그인이 필요합니다.",
        showCancelButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "취소",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
  };

  // 이 부분에 있던 중복된 handleLogout 함수를 밖으로 빼주었습니다.
  const handleLogout = () => {
    Swal.fire({
      icon: "question",
      text: "로그아웃 하시겠습니까?",
      title: "로그아웃",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("ACCESS_TOKEN");
        setIsLoggedIn(false);
        handleCloseLogoutModal();
        window.location.href = "/";
      }
    });
  };

  return (
    <div
      className={`header-main-all ${getHeaderColor()} ${
        isHovering ? "hovered" : ""
      } ${getHeaderVisibility()}`}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseOut}
    >
      <div className={`header-top ${getHeaderColor()} `}>
        {weatherInfo && (
          <div className={`weather-info ${isHovering ? "hovered" : ""}`}>
            <img
              src={weatherInfo.icon}
              alt="Weather Icon"
              style={{ height: "80px", zIndex: "1" }}
            />
            <p>{weatherInfo.temp}°C</p>
            <p>{weatherInfo.name}</p>
            <p>{weatherInfo.currentDate}</p>
          </div>
        )}
      </div>

      <Navbar
        collapseOnSelect
        expand="xl"
        className={`header-main ${getHeaderColor()} ${
          isHovering ? "hovered" : ""
        }`}
      >
        <Navbar.Brand as={Link} to="/" className="header-logo">
          <img
            src={`/assets/etc/${getLogoImage()}`}
            style={{ width: "150px", height: "100%" }}
          />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          id="mobile-toggle"
        />
        <Navbar.Collapse
          id="responsive-navbar-nav"
          className="navbar-expand-xl"
          style={{ justifyContent: "center" }}
        >
          <Nav className="header-category">
            <NavLink to="/local/1">지역</NavLink>
            <NavLink to="/place/1">관광지</NavLink>
            <NavLink to="/festival/1">축제</NavLink>
            <NavLink to="/localFoods/1">특산물</NavLink>
            <NavLink to="/board/touristSpot">게시판</NavLink>
          </Nav>
        </Navbar.Collapse>
        <div className="header-main-icon">
          {isLoggedIn ? (
            <Nav className="logout" onClick={handleLogout}>
              <span>로그아웃</span>
            </Nav>
          ) : (
            <Nav as={Link} to="/login">
              <span>로그인</span>
            </Nav>
          )}
          <Nav
            className="mypageIcon"
            style={{ cursor: "pointer" }}
            onClick={handleMyPageClick}
          >
            <IoPeople />
          </Nav>
          {/* <Nav
            as={Link}
            to={isLoggedIn ? "/mypage" : "/login"}
            onClick={() => handleMyPageClick("heart")}
          >
            <FaHeart style={{ fontSize: "26px" }} />
          </Nav> */}
          <Nav as={Link} to="/search/whole">
            <FaSearch style={{ fontSize: "26px" }} />
          </Nav>
        </div>
      </Navbar>
    </div>
  );
}

export default Header;
