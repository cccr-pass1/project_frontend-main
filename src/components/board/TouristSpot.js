// react
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from 'react-router-dom';

// css
import { Form, Button, Card, Col, Row, Pagination } from 'react-bootstrap';
import '../../styles/board/Board.scss';
import '../../styles/board/TouristSpot.scss';

// API
import { getTourBaordList } from '../../api/BoardApi';
import { getImg } from "../../api/BoardApi";

// component
import BoardCate from './BoardCate';

// 시간
import moment from 'moment';

// 토큰
import { jwtDecode } from "jwt-decode";

function TouristSpot() {
    const navigate = useNavigate();
    const { bno } = useParams();
    const [imageSrc, setImageSrc] = useState(''); // 이미지
    const [imageSrcMap, setImageSrcMap] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // 한 페이지당 보여질 아이템 수

    // 로그인 상태 확인(로그인시 더보기버튼)
    const isLoggedIn = !!localStorage.getItem('ACCESS_TOKEN');
    const accessToken = localStorage.getItem('ACCESS_TOKEN');
    const decodedToken = typeof accessToken === 'string' ? jwtDecode(accessToken) : null;
    const customerId = decodedToken?.id;

    // 글작성 버튼 입력시 boardWrite 페이지로 이동
    const handleButtonClick = () => {
        navigate('/board/boardWrite');
    };

    // 관광지 추천 게시판 글 가져오기
    const [TourBoardListData, setTourBoardListData] = useState([]);

    useEffect(() => {
        const fetchTourBoardListData = async () => {
            try {
                const response = await getTourBaordList();
                const data = response.data
                setImageSrc('../../assets/test/noImg.png');
                setTourBoardListData(data);
            } catch (error) {
                setImageSrc('../../assets/test/noImg.png');
            }
        };

        fetchTourBoardListData();
    }, []);

    // 카테고리 필터링
    const [selectedLocation, setSelectedLocation] = useState(null); // 선택한 지역 값을 state로 관리

    const handleLocationChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedLocation(selectedValue); // 선택한 지역 값 업데이트
    };

    const filterItemsByLocation = () => {
        if (!selectedLocation || selectedLocation === 'all') {
            // 선택하지 않으면 전체
            return TourBoardListData;
        } else {
            return TourBoardListData.filter(item => item.location === selectedLocation);
        }
    };
    // 필터링 끝

    // 선택된 지역에 따라 필터링된 아이템을 계산
    const filteredItems = filterItemsByLocation();


    // 페이지 번호를 계산하는 함수
    const calculatePageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5; // 표시할 최대 페이지 수

        const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
        const currentPageIndex = Math.floor((currentPage - 1) / maxPagesToShow); // 현재 페이지가 속한 그룹의 인덱스

        let startPage = currentPageIndex * maxPagesToShow + 1; // 시작 페이지
        let endPage = (currentPageIndex + 1) * maxPagesToShow; // 끝 페이지

        if (startPage < 1) {
            startPage = 1;
        }

        if (endPage > totalPages) {
            endPage = totalPages;
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    // 페이지 번호를 클릭할 때 호출되는 핸들러
    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 이전 페이지로 이동하는 핸들러
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // 다음 페이지로 이동하는 핸들러
    const handleNextPage = () => {
        const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // 페이지 이동 버튼 클릭 시 계산된 페이지 목록
    const pageNumbers = calculatePageNumbers();

    // 현재 페이지에 해당하는 아이템 추출
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, endIndex);

    // 이미지 보여주기
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const promises = currentItems.map(async (item) => {
                    if (!imageSrcMap[item.bno]) {
                        try {
                            const response = await getImg(item.bno);
                            if (response) {
                                const blob = new Blob([response], { type: 'image/png' });
                                const imageUrl = URL.createObjectURL(blob);
                                setImageSrcMap((prevImageSrcMap) => ({
                                    ...prevImageSrcMap,
                                    [item.bno]: imageUrl,
                                }));
                            } else {
                                setImageSrcMap((prevImageSrcMap) => ({
                                    ...prevImageSrcMap,
                                    [item.bno]: '../../assets/test/noImg.png', // 대체이미지
                                }));
                            }
                        } catch (error) {
                            console.error('이미지를 불러오는 중 오류 발생:', error);
                        }
                    }
                });
    
                await Promise.all(promises);
            } catch (error) {
                console.error('fetchImages에서 오류 발생:', error);
            }
        };
    
        if (currentItems.length > 0) {
            fetchImages();
        }
    }, [currentItems, imageSrcMap]);
    
    return (
        <>
            <BoardCate />

            {/* 관광지 카드 */}
            <div className="container">
                <div className="touriSpot-cotent">
                    <Row className='common-nav'>
                        <Col xs={12} md={6} xl={8} className="common-nav-placeTotal">
                            <div className="total">
                                총<span>{filteredItems.length}</span>건
                            </div>
                        </Col>
                        <Col md={3} xl={2} className="common-nav-writeBtn">
                            {isLoggedIn && (
                                <Button className='write-btn' as="input" type="submit" variant="outline-primary" value="글작성" onClick={handleButtonClick} />
                            )}
                        </Col>
                        <Col md={3} xl={2} className="common-nav-locationBtn">
                            <Form.Select aria-label="지역을 선택하세요" onChange={handleLocationChange}>
                                <option value="all">전체 지역</option>
                                <option value="서울">서울</option>
                                <option value="인천">인천</option>
                                <option value="대전">대전</option>
                                <option value="부산">부산</option>
                                <option value="경기">경기</option>
                                <option value="충청">충청</option>
                                <option value="강원">강원</option>
                                <option value="전라">전라</option>
                                <option value="경상">경상</option>
                            </Form.Select>
                        </Col>
                    </Row>

                
                    {/* 필터링된 결과를 출력 */}
                    {currentItems.map((item) => (
                        <Link to={`/board/touristSpotView/${item.bno}`} key={item.bno} className="tour-board-link">
                            <Card className='TourisSpot-Card'>
                                <Row>
                                    <Col md={3} xl={3} className="TourisSpot-Imgs">
                                        {imageSrcMap[item.bno] ? (
                                            <img
                                                className="TourisSpot-Img"
                                                variant="top"
                                                src={imageSrcMap[item.bno]}
                                                alt={`Image ${item.bno}`}
                                            />
                                        ) : (
                                            <img
                                                src="../../assets/test/noImg.png"
                                                alt="이미지가 없습니다."
                                                style={{ width: '100%' }}
                                            />
                                        )}
                                    </Col>
                                    <Col xs={12} md={9} className="each mx-auto">
                                        <Row className="justify-content-between align-items-center">
                                            <Col xs={9} md={9} xl={10} className="content-location">[{item.location}]</Col>
                                            <Col xs={3} md={3} xl={2} className="content-viewCnt"><p>조회 {item.viewCnt || 0}</p></Col>
                                        </Row>
                                        <Col className="content-title" xs={12}>{item.title}</Col>
                                        <Row className="nickAndDate justify-content-end">
                                            <Col xs={4} md={3} xl={2} className="content-name"><p>작성자: {item.id?.name}</p></Col>
                                            <Col xs={4} md={3} xl={2}><div className="time">{moment(item.regDate).format('YYYY/MM/DD')}</div></Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <div className="underline" />
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* 페이징 */}
                <Pagination style={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
                    <Pagination.Prev onClick={() => handlePageClick(currentPage - 1)} />
                    {pageNumbers.map((number) => (
                        <Pagination.Item
                            key={number}
                            active={number === currentPage}
                            onClick={() => handlePageClick(number)}
                        >
                            {number}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageClick(currentPage + 1)} />
                </Pagination>
            </div>
        </>
    );
}

export default TouristSpot;