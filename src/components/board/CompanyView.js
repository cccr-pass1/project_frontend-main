// react
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';

// css
import '../../styles/board/CompanyView.scss';
import { MdOutlineLocationOn, MdDateRange } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import { BsSend } from "react-icons/bs";
import { LuDelete } from "react-icons/lu";
import { FaExclamationCircle } from "react-icons/fa";
import { BiConversation } from "react-icons/bi";

// API
import { getCompanyDetail, postReply, getReply, deleteReply } from "../../api/BoardApi";

// componet
import EditAndDeleteBtn from "./EditAndDeleteBtn";

// 토큰
import { jwtDecode } from "jwt-decode";

// 시간
import moment from 'moment';
import 'moment/locale/ko';

moment.locale('ko'); // 한국어로 로케일 설정

function CompanyView({ replyCnt }) {
  const { bno } = useParams();
  const [commentContent, setCommentContent] = useState('');

  // 댓글
  const [replyList, setReplyList] = useState([]);
  const [companyBoardListData, setCompanyBoardListData] = useState([]);

  // 토큰 가져오기
  const accessToken = localStorage.getItem('ACCESS_TOKEN');
  const decodedToken = accessToken ? jwtDecode(accessToken) : null; // jwt 디코딩하여 페이로드에 엑세스, 토큰이있는경우만 디코딩
  const userId = decodedToken?.id; // 사용자id에 엑세스
  const userName = decodedToken?.name;

  // 댓글 조회
  const fetchReplyData = async () => {
    try {
      const response = await getReply(bno);
      const data = response.data;

      data.sort((a, b) => new Date(b.regDate) - new Date(a.regDate)); // 최근 등록댓글이 상단으로

      setReplyList(data);
      replyCnt(data.length); // 댓글 수
    } catch (error) {
    }
  };

  // 게시글 조회
  useEffect(() => {
    const fetchCompanyBoardListData = async () => {
      try {
        const response = await getCompanyDetail(bno);
        const data = response.data;

        setCompanyBoardListData(Array.isArray(data) ? data : [data]);
        fetchReplyData();
      } catch (error) {
      }
    };

    fetchCompanyBoardListData();
  }, [bno]);

  const [isTextareaDisabled, setIsTextareaDisabled] = useState(true); // 댓글 작성 비활성화

  // userId있을 경우 댓글 작성
  useEffect(() => {
    setIsTextareaDisabled(userId == null);
  }, [userId]);

  const handleSubmit = async (e, bno) => {
    e.preventDefault();

    if (userId == null) {
      alert('로그인이 필요합니다. 로그인 후 다시 시도해주세요.');
    } else {
      // console.log('userId:', userId);
      setIsTextareaDisabled(false);
      try {
        // console.log('Textarea enabled');

        const commentData = {
          content: commentContent,
          bno: bno,
          id: userId
        };

        const response = await postReply(commentData);

        setCommentContent('');

        fetchReplyData();
      } catch (error) {
        alert('댓글은 최대 35자 입력 가능합니다!');
      }
    }
  };

  const handleChange = (e) => {
    setCommentContent(e.target.value);
  };

  // 댓글 삭제
  const deleteReplyApi = async (rno) => {
    try {
      const response = await deleteReply(rno);

      fetchReplyData();
    } catch (error) {
      throw error;
    }
  };

  // 삭제 버튼 클릭 시 호출되는 함수
  const handleDeleteReply = async (rno) => {
    try {
      const response = await deleteReplyApi(rno);

      if (response.status === 200) {
        window.location.reload();
      } else {
      }
    } catch (error) {
    }
  }

  // 로그인한 id와 댓글단 id가 같을 때 삭제
  const shouldShowDeleteButton = (reply) => {
    return userId === reply.id;
  };

  return (
    <>
      {/* 게시글확인 + 댓글입력창 */}
      {companyBoardListData.map(item => (
        <div key={item.bno} className='wrapper d-flex justify-content-center'>
          <div className='companyView row'>
            <div className="area-left col-md-6">
              <div className="info-left">
                <h2>#{item.bno}</h2>
                <h3 className="main-title">{item.title}</h3>
                <div className="nav">
                  <div className='nav-location'>
                    <MdOutlineLocationOn className='nav-location-icon' />
                    <p className='nav-location-name'>{item.location}</p>
                  </div>
                  <div className='nav-date'>
                    <MdDateRange className="nav-date-icon" />
                    <p className="nave-date-regDate">{moment(item.regDate).format('YYYY/MM/DD')}</p>
                  </div>
                  <div className='nav-writer'>
                    <IoPersonCircleOutline className="nav-person-icno" />
                    <p className='nav-writer-name'>{item.id.name}</p>
                  </div>
                </div>
                <div className="body-section1">
                  {item.content}
                </div>
                <div className="d-flex justify-content-end">
                  <EditAndDeleteBtn />
                </div>
                <div className='reply_div'>
                  <div className='reply_write'>
                    <textarea
                      rows='3'
                      type="text"
                      id="write_reply"
                      placeholder='댓글을 입력하세요.'
                      maxLength='35'
                      name='write_reply'
                      value={commentContent}
                      onChange={handleChange}
                      disabled={isTextareaDisabled}
                    />
                    <button
                      type='submit'
                      id='reply_submit_button'
                      onClick={(e) => handleSubmit(e, item.bno)}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <BsSend style={{ fontSize: '1.3em' }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* 댓글목록 */}
            <div className="area-right col-md-6">
              <div className="reply-list">
                {replyList.length > 0 ? (
                  <>
                    <div className="comment-count">
                      <BiConversation />
                      <p>{replyList.length}</p>
                    </div>
                    <div className="reply-container">
                      {replyList.map((reply) => (
                        <div className="reply-single" key={reply.rno}>
                          <div className="nick-name">{reply.name}</div>
                          <div className="reply-section">
                            <div className="reply-content">{reply.content}</div>
                            {shouldShowDeleteButton(reply) && (
                              <LuDelete className="delete-icon" onClick={() => handleDeleteReply(reply.rno)} />
                            )}
                          </div>
                          <div className="time">{moment(reply.regDate).fromNow()}</div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="no_data">
                    <div className="emptyIcon">
                      <FaExclamationCircle />
                    </div>
                    <h3>등록된 댓글이 없습니다.</h3>
                  </div>
                )}
              </div>
            </div>
            <div className="companyList">
              <Link to="/board/company">다른 여행 메이트 찾기</Link>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default CompanyView;
