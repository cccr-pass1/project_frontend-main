// Video.js

import React from "react";
import "../../styles/Video.css";

function Video() {
  let imageSource;
  let videoText;
  let videoText2;

  // 기본값으로 main 경로 설정
  imageSource = "/assets/video/mainimage.jpg";
  videoText = "새하마노는 동서남북을 뜻하는 순 우리말로";
  videoText2 =
    "  우리나라의  동서남북을 누비는 새로운 여정에 새하마노가 함께합니다! ";

  return (
    <div className="video">
      <div className="video-container">
        {/* 이미지 태그로 변경 */}
        <img src={imageSource} alt="main background" className="videoSrc" />
        <div className="video-text">
          <h1>{videoText}</h1>
          <h1>{videoText2}</h1>
        </div>
      </div>
    </div>
  );
}

export default Video;
