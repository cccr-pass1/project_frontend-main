// ChatWidget.js
import React, { useState } from "react";
import SocketChat from "../chat/SocketChat.js";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../styles/chat/ChatWidget.css";

const ChatWidget = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const navigate = useNavigate();

  const toggleChat = () => {
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    const isLoggedIn = accessToken;

    // 사용자가 로그인했는지 확인
    if (isLoggedIn) {
      setIsChatVisible((prev) => !prev);
    } else {
      Swal.fire({
        icon: "info",
        title: "로그인이 필요합니다.",
        text: "다양한 소통을 위하여 채팅방을 이용하고 싶으신가요?",
        showCancelButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "취소",
      }).then((result) => {
        // 확인 버튼을 눌렀을 때 실행되는 함수
        if (result.isConfirmed) {
          navigate("/login");
        }
        // 취소(No) 버튼을 눌렀을 때 아무 동작 안 함
      });
    }
  };

  const closeChat = () => {
    setIsChatVisible(false);
  };

  return (
    <div className={`chat-widget ${isChatVisible ? "visible" : ""}`}>
      {isChatVisible ? (
        <SocketChat onClose={closeChat} />
      ) : (
        <div className="chaticon" onClick={toggleChat}>
          <img src="/assets/etc/chat.png" alt="Chat Icon" />
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
