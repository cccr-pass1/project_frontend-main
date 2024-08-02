// react
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios";

// css
import { Button, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/board/BoardEdit.scss';

// API
import { getTourBaordDetail, putBoard } from '../../api/BoardApi';

// component
import BoardCate from './BoardCate';

// 토큰
import { jwtDecode } from 'jwt-decode';

const BoardEdit = () => {
   const { bno } = useParams(); // URL에서 bno 가져오기
   const navigate = useNavigate(); // 페이지이동
   const [TourBaordDetailData, setTourBaordDetailData] = useState([]);
   const [isFileUploadDisabled, setIsFileUploadDisabled] = useState(true); // 파일업로드
   const [content, setContent] = useState(''); // 글 자수 제한
   const [updateDate, setUpdateDate] = useState({
      title: '',
      content: '',
      boardCno: '1',
      locationCno: '1',
      location: '서울'
   });

   const accessToken = localStorage.getItem("ACCESS_TOKEN");

   // 토큰이 있는 경우에만 디코딩
   let decodedToken = null;
   if (accessToken) {
     try {
       decodedToken = jwtDecode(accessToken);
     } catch (error) {
       console.error("Invalid token:", error);
      }
   }

   const handleSubmit = async (e) => {

      e.preventDefault();
      try {
          const response = await putBoard(bno, updateDate);
         if (response.status === 200) {
            alert("게시글 수정 완료");
            navigate("/board/touristSpot")
         } else {
            alert("게시글 수정 실패");
         }
      } catch (error) {
         alert("게시글 수정 오류");
      }
   };

   // useEffect(() => {
   //    const fetchTourBaordDetailData = async () => {
   //       try {
   //          const response = await getTourBaordDetail(bno);
   //          const data = response.data;
   //          setTourBaordDetailData(Array.isArray(data) ? data : [data]);
   //       } catch (error) {
   //       }
   //    };
   //    fetchTourBaordDetailData();
   // }, [bno]);
   useEffect(() => {
      const fetchTourBaordDetailData = async () => {
        try {
          // 토큰이 없을 경우에 alert를 실행하고 함수 종료
          if (!accessToken) {
            alert("토큰이 없습니다. 로그인이 필요합니다.");
            return;
          }
    
          const response = await getTourBaordDetail(bno);
          const data = response.data;
          setTourBaordDetailData(Array.isArray(data) ? data : [data]);
    
          // 데이터가 유효한 경우에만 상태 업데이트
          if (data) {
            const { title, content, boardCno, locationCno, location } = data;
    
            setUpdateDate({
              title,
              content,
              boardCno,
              locationCno,
              location
            });
    
            // 여행 메이트 카테고리 선택 여부에 따라 파일 업로드 활성화/비활성화
            setIsFileUploadDisabled(boardCno === "2");
          }
    
          if (decodedToken) {
            console.log("User ID:", decodedToken.id);
          }
        } catch (error) {
          // 에러 처리 로직 추가
        }
      };
    
      fetchTourBaordDetailData();
    }, [bno, accessToken, decodedToken]);
    
    

   // 초기값
   useEffect(() => {
      if (TourBaordDetailData.length > 0) {
         const initialData = TourBaordDetailData[0];

         setUpdateDate({
            title: initialData.title || '',
            content: initialData.content || '',
            boardCno: initialData.boardCno || '1',
            locationCno: initialData.locationCno || '1',
            location: initialData.location || '서울'
         });
      }
   }, [TourBaordDetailData]);

   // 업데이트
   const handleChange = (e) => {
      const { name, value } = e.target; // 카테고리 선택시 변경되도록
      // let newLocation = 'updateDate.location'; 
      let newLocation = '';

      
      // 문자열 시작에 공백 여러개면 제거
      const trimmedInput = (name === 'title' || name === 'content') ? value.replace(/^\s+/g, '') : value;

      switch (value) {
         case '1':
            newLocation = '서울';
            break;
         case '2':
            newLocation = '인천';
            break;
         case '3':
            newLocation = '대전';
            break;
         case '4':
            newLocation = '부산';
            break;
         case '5':
            newLocation = '경기';
            break;
         case '6':
            newLocation = '충청';
            break;
         case '7':
            newLocation = '강원';
            break;
         case '8':
            newLocation = '전라';
            break;
         case '9':
            newLocation = '경상';
            break;
         default:
            newLocation = '';
            break;
      }

      setUpdateDate((prevData) => ({
         ...prevData,
         [name]: trimmedInput,
         location: newLocation
      }));

      const userInput = e.target.value;

      // 'title'이 빈 문자열이 아닌 경우에만 업데이트
      if ((name === 'title' || name === 'content') && value !== '') {
         // 줄바꿈으로 대체
         const formattedValue = value.replace(/\n/g, '\n');
       
         setUpdateDate((prevData) => ({
           ...prevData,
           [name]: formattedValue,
           location: newLocation,
         }));
       } else {
         setUpdateDate((prevData) => ({
           ...prevData,
           location: newLocation,
         }));
       }
   };


   // 파일업로드
   useEffect(() => {
      setIsFileUploadDisabled(false); // 처음 로드할 때 파일 업로드 활성화
   }, []);

   return (
      <div>
         <BoardCate />

         <div className="container">
            <div className='instructions'>
               <img src='../../assets/etc/pointbar.png' alt='pointbar' />
               <div className='instructions-explanation'>수정하기</div>
            </div>
            {TourBaordDetailData.map(item => (
               <div className='write' key={item.bno}>
                  <Form onSubmit={handleSubmit}  >
                     <Row className="align-items-center" >
                        <Col xs={4} md={1}>
                           <Form.Group controlId="title" className="mb-0" >
                              <Form.Label className="mr-2">제목 *</Form.Label>
                           </Form.Group>
                        </Col>
                        <Col xs={8} md={8}>
                           <Form.Control
                              type="text"
                              name="title"
                              value={updateDate.title}
                              onChange={handleChange}
                           />
                        </Col>
                     </Row>
                     <div className='underline' />
                     <Row>
                        <Col xs={4} md={1}>
                           <Form.Group controlId="cate" className="mb-0">
                              <Form.Label className="mr-2">구분 *</Form.Label>
                           </Form.Group>
                        </Col>
                        <Col xs={8} md={2}>
                           <div>
                              <select
                                 className="form-select"
                                 name="boardCno"
                                 value={updateDate.boardCno || item.boardCno}
                                 onChange={handleChange}
                              >
                                 <option value="1">관광지 추천</option>
                                 <option value="2">여행 메이트</option>
                              </select>
                           </div>
                        </Col>

                        <Col xs={4} md={1}>
                           <Form.Group controlId="cate" className="mb-0">
                              <Form.Label className="mr-2">지역 *</Form.Label>
                           </Form.Group>
                        </Col>
                        <Col xs={8} md={2}>
                           <select className="form-select"
                              id="localCate"
                              name="locationCno"
                              value={updateDate.locationCno || item.locationCno}
                              onChange={handleChange}
                           >
                              <option value="1">서울</option>
                              <option value="2">인천</option>
                              <option value="3">대전</option>
                              <option value="4">부산</option>
                              <option value="5">경기</option>
                              <option value="6">충천</option>
                              <option value="7">강원</option>
                              <option value="8">전라</option>
                              <option value="9">경상</option>
                           </select>
                        </Col>
                     </Row>
                     <div className='underline' />

                     <div className='underline' />
                     <Form.Group controlId="content">
                        <Form.Label>내용 *</Form.Label>
                        <Form.Control
                           rows={10}
                           as="textarea"
                           name="content"
                           placeholder="내용을 입력하세요"
                           maxLength={800}
                           value={updateDate.content}
                           onChange={handleChange}
                        />
                     </Form.Group>
                     <Col className="d-flex justify-content-end">
                        <Button variant="primary" type="button" id="btn-save" onClick={handleSubmit}>
                           수정
                        </Button>
                     </Col>
                  </Form>
               </div>
            ))}
         </div>
      </div>
   );
};

export default BoardEdit;
