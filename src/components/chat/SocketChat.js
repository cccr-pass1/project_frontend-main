import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import { IoMdClose } from "react-icons/io";

import "../../styles/chat/SocketChat.css";

const SocketChat = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [userName, setUserName] = useState("");
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      const userId = decodedToken.id;

      const apiUrl = `${process.env.REACT_APP_BASE_URL}members/${userId}`;

      axios
        .get(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          const retrievedUserName = response.data.name;
          // console.log(retrievedUserName); // 올바른 값

          setUserName(retrievedUserName);

          // WebSocket 연결 열고 사용자 이름 전송
          // const newSocket = new WebSocket("ws://3.35.217.163:8080/socket");
          const newSocket = new WebSocket("ws://localhost:8081/socket");
          newSocket.onopen = (event) => {
            console.log("WebSocket 연결이 열렸습니다.");
            newSocket.send(
              JSON.stringify({
                type: "login", // 로그인 이벤트를 나타내는 타입 추가
                name: retrievedUserName,
              })
            );
          };

          newSocket.onmessage = (event) => {
            const receivedMessage = JSON.parse(event.data); // JSON 형식으로 파싱

            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
          };

          newSocket.onclose = (event) => {
            console.log("WebSocket 연결이 닫혔습니다.");
          };

          setSocket(newSocket);

          // 정리 함수
          return () => {
            newSocket.close();
          };
        })
        .catch((error) => {
          console.error("API 호출 중 오류 발생:", error);
        });
    }
  }, []);

  const sendMessage = () => {
    if (
      inputMessage.trim() !== "" &&
      socket &&
      socket.readyState === WebSocket.OPEN
    ) {
      const message = {
        type: "message", // 메시지 이벤트를 나타내는 타입 추가
        content: inputMessage,
        name: userName,
      };

      socket.send(JSON.stringify(message));
      setInputMessage("");
    } else {
      console.error("WebSocket이 열려 있지 않거나 'socket'이 'null'입니다.");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const closeSocket = () => {
    if (socket) {
      socket.close();
    }
    onClose(); // 추가: 컴포넌트를 닫는 역할 수행
  };

  useEffect(() => {
    const messageContainer = document.querySelector(".message-container");
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages]);

  // 유저리스트 부분
  useEffect(() => {
    const updateUsers = (event) => {
      const receivedUserList = JSON.parse(event.data).userList;
      setUserList(receivedUserList);
    };

    if (socket) {
      socket.addEventListener("message", updateUsers);
    }

    return () => {
      if (socket) {
        socket.removeEventListener("message", updateUsers);
      }
    };
  }, [socket]);

  return (
    <div className="messageBox">
      <div className="message-top">
        <div className="userList"> 접속자 {userList.length} 명 </div>
        <button onClick={closeSocket} className="close-button">
          <IoMdClose />
        </button>
      </div>
      <div className="message-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`messageSmallBox ${(() => {
              // 나의 메세지 우측정렬, 다른사람 메세지  좌측정렬
              const result =
                message.userName === userName ? "ownMessage" : "otherMessage";
              // console.log(
              //   `Message: ${message.userName}, User: ${userName}, Result: ${result}`
              // );
              return result;
            })()}`}
          >
            <span className="userName">{message.userName}</span>
            <div className="message">
              <p>{message.content}</p>
            </div>
            <span className="timestamp">
              {new Date(parseInt(message.timestamp)).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>

      <div className="text-box">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
};

export default SocketChat;
