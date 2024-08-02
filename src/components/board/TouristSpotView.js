// css
import "../../styles/board/TouristSpotView.scss";
import { Row, Col, Button } from "react-bootstrap";
import { BiConversation } from "react-icons/bi";
import { FaExclamationCircle } from "react-icons/fa";
import { BsSend } from "react-icons/bs";
import { LuDelete } from "react-icons/lu";

// react
import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

// api
import { getTourBaordDetail, getReply, postReply, deleteReply, getImg  } from "../../api/BoardApi";
import EditAndDeleteBtn from "./EditAndDeleteBtn";

// 시간
import moment from "moment";
import "moment/locale/ko"; // 시간 한글로

// 토큰
import { jwtDecode } from "jwt-decode";

// 관광지 추천 게시판 상세 내용 조회
function TouristSpotView() {
    const [TourBaordDetailData, setTourBaordDetailData] = useState([]);
    const { bno } = useParams();
    const [imageSrc, setImageSrc] = useState(""); // 이미지
    const [commentContent, setCommentContent] = useState(''); // 댓글작성

    const [replyList, setReplyList] = useState([]); // 댓글조회
    const [reply, setReply] = useState(5); // 댓글 더보기

    // bno를 사용하여 관광지 게시글 상세정보 조회
    useEffect(() => {
        const fetchTourBaordDetailData = async () => {
            try {
                const response = await getTourBaordDetail(bno);
                const data = response.data;
                setTourBaordDetailData(Array.isArray(data) ? data : [data]);
                fetchReplyData(); // 댓글 조회
            } catch (error) { }
        };
        fetchTourBaordDetailData();
    }, [bno]);

const currentItems = [];

// 이미지 조회
useEffect(() => {
    const fetchImage = async () => {
        try {
            const blobImage = await getImg(bno);

            if (blobImage && blobImage.size > 0) {
                const imageUrl = URL.createObjectURL(blobImage);
                setImageSrc(imageUrl);
            } else {
                // 이미지가 없을 때 처리
            }
        } catch (error) {
            // 에러 처리
        }
    };

    fetchImage();
}, [bno]);

    // 댓글 조회
    const fetchReplyData = async () => {
        try {
            const response = await getReply(bno);
            const data = response.data;

            console.log(response);
            data.sort((a, b) => new Date(b.regDate) - new Date(a.regDate)); // 최근 등록댓글이 상단으로

            setReplyList(data);
        } catch (error) {
            console.log("댓글없음");
        }
    };

    // 더보기 클릭시 5개 추가
    const handleLoadMore = () => {
        setReply((prevReply) => prevReply + 5);
    };

    useEffect(() => {
        fetchReplyData();
    }, [bno]);

    const handleChange = (e) => {
        setCommentContent(e.target.value);
    };

    // 토큰 가져오기
    const accessToken = localStorage.getItem('ACCESS_TOKEN');
    const decodedToken = accessToken ? jwtDecode(accessToken) : null; // jwt 디코딩하여 페이로드에 엑세스, 토큰이있는경우만 디코딩
    const userId = decodedToken?.id; // 사용자id에 엑세스
    const userName = decodedToken?.name;

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
            console.log('userId:', userId);
            setIsTextareaDisabled(false);
            try {
                console.log('Textarea enabled');

                const commentData = {
                    content: commentContent,
                    bno: bno,
                    id: userId
                };

                const response = await postReply(commentData);

                setCommentContent('');

                fetchReplyData();
            } catch (error) {
                alert('댓글은 최대 80자 입력 가능합니다!');
            }
        }
    };

    // 로그인한 id와 댓글단 id가 같을 때 삭제
    const deleteButton = (reply) => {
        return userId === reply.id;
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

    return (
        <>
            <div className="touristSpotView">
                <div className="header">- 관광지 추천 -</div>
                <div className="container all">
                    {TourBaordDetailData.length > 0 &&
                        TourBaordDetailData.map((item) => (
                            <div key={item.bno}>
                                <Row>
                                    <div className="bno">NO. {item.bno}</div>
                                    {/* 제목 */}
                                    <div className="line-bold" />
                                    <Col xs={12} md={8}>
                                        <div className="title">{item.title}</div>
                                    </Col>
                                    <div className="line" />
                                    <div className="detail">
                                        <div className="date">
                                            {moment(item.regDate).format("L")}
                                        </div>
                                        <div className="writer">{item.id.name}</div>
                                        <div className="view">{item.viewCnt}</div>
                                    </div>
                                    <div className="line" />
                                    {/* 내용 */}
                                    <Row className="m-0">
                                        <div className="attachment ms-auto">
                                            {imageSrc ? (
                                                <img
                                                    className="imgs"
                                                    src={imageSrc}
                                                    alt={`Image ${bno}`}
                                                    width={500}
                                                    height={450}
                                                    style={{ objectFit: "cover" }}
                                                />
                                            ) : (
                                                <img
                                                    src="../../assets/test/noImg.png"
                                                    alt="이미지가 없습니다"
                                                />
                                            )}
                                        </div>
                                        <Col xs={12} md={12}>
                                            <div className="content">{item.content}</div>
                                        </Col>
                                    </Row>
                                    <div className="line" />
                                    {/* 사진 */}
                                    <Row className="file">
                                        <Col xs={12} md={2} className="title">
                                            <p>첨부파일</p>
                                        </Col>
                                        <Col xs={12} md={10} className="imgFile">
                                            <div className="uuid">
                                                {item.imageInfo?.[0]?.uuid || "UUID를 찾을 수 없습니다"}
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="line-bold" />
                                    {/* 버튼 */}
                                    <Row className="justify-content-end">
                                        <EditAndDeleteBtn />
                                        <Col xs={4} md={1} className="boardView-btn">
                                            <Link to="/board/touristSpot">
                                                <Button variant="link">목록</Button>
                                            </Link>
                                        </Col>
                                    </Row>
                                </Row>
                                <div className="reply">
                                    <div className='reply_div'>
                                        <div className='reply_write'>
                                            <textarea
                                                rows='3'
                                                type="text"
                                                id="write_reply"
                                                placeholder='댓글을 입력하세요.'
                                                maxLength='80'
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
                        ))}


                    {/* 댓글조회 */}
                    <div className="reply-list">
                        {replyList.length > 0 ? (
                            <>
                                <div className="comment-count">
                                    <BiConversation />
                                    <p>{replyList.length}</p>
                                </div>
                                <div className="reply-container">
                                    {replyList.slice(0, reply).map((reply) => (
                                        <div className="reply-single" key={reply.rno}>
                                            <div className="nick-name">{reply.name}</div>
                                            <div className="reply-section">
                                                <div className="reply-content">{reply.content}</div>
                                                {deleteButton(reply) && (
                                                    <LuDelete className="delete-icon" onClick={() => handleDeleteReply(reply.rno)} />
                                                )}
                                            </div>
                                            <div className="time">{moment(reply.regDate).fromNow()}</div>
                                        </div>
                                    ))}
                                </div>
                                {reply < replyList.length && (
                                    <button className="moreBtn" onClick={handleLoadMore}>댓글 더보기</button>
                                )}
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
            </div>
        </>
    );
}

export default TouristSpotView;
