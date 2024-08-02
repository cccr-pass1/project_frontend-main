import { Link, useLocation } from "react-router-dom";
import "../../styles/Footer.css";

import { FaGithub } from "react-icons/fa";
import { SiNotion } from "react-icons/si";
import { IoLogoYoutube } from "react-icons/io";

function Footer() {
  const location = useLocation();
  // 특정 페이지 일때에 헤더를 숨기는 조건을 확인하는 함수 ( 로그인,회원가입 사용)
  const isFooterHidden = () => {
    return location.pathname === "/login" || location.pathname === "/signup";
  };
  // 헤더가 보이는지 여부를 결정하는 함수
  const getFooterVisibility = () => {
    return isFooterHidden() ? "hidden" : "";
  };
  return (
    <div className={`footer ${getFooterVisibility()}`}>
      <div className="wrap-footer">
        <hr />
        <div className="container">
          <h2 className="screen-out"></h2>
          <ul className="inner-service">
            <li className="wrap-service">
              <div className="title">
                <strong className="tit_service_name">새하마노 방방곡곡</strong>
                <div className="contents_link" style={{ alignItems: "center" }}>
                  <Link as={Link} to="/local/1" className="">
                    <span> 지역 </span>
                  </Link>{" "}
                  |
                  <Link as={Link} to="/place/1" className="">
                    <span> 관광지 </span>
                  </Link>{" "}
                  |
                  <Link as={Link} to="/festival/1" className="">
                    <span> 축제 </span>
                  </Link>{" "}
                  |
                  <Link as={Link} to="/localFoods/1" className="">
                    <span> 특산물 </span>
                  </Link>{" "}
                  |
                  <Link as={Link} to="/board/company" className="">
                    <span> 게시판 </span>
                  </Link>
                </div>
              </div>
              <ul className="list_service">
                <li className="list_service_item">
                  <a href="https://github.com/nuitciel99"> 김종윤 </a>
                  <a href="https://github.com/ewbaek"> 백은우 </a>
                  <a href="https://github.com/gongd135"> 김남현 </a>
                </li>
                <li className="list_service_item">
                  주소 : 서울 구로구 디지털로 306 대륭포스트타워 2차 206호
                </li>
                <li className="list_service_item">
                  운영시간 : 09:30 ~ 18:20 (점심시간: 13:20 ~ 14:30)
                </li>
              </ul>
            </li>
            <div className="links">
              <a href="https://github.com/whyj2m/localkorea_new">
                <FaGithub />
              </a>
              <a href="https://psychedelic-periodical-6e5.notion.site/AWS-6-79ddbb50ddca4f1098207f306ccee341">
                <SiNotion />
              </a>
              <a href="https://youtube.com/@localkorea20s">
                <IoLogoYoutube />
              </a>
            </div>
          </ul>
          <div className="info">
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <a className="topup-button" href="#">
                <img
                  src="/assets/etc/ico_arrow_top.png"
                  className="arrow_icon"
                />
              </a>
            </div>
            <small className="txt_copyright">
              Copyright ⓒ localkorea Corp. All rights reserved.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
