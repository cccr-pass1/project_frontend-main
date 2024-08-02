// react
import { useEffect, useState } from "react";
import React from "react";

// css
import { Card, Col, Row, Container, Button, Form } from 'react-bootstrap';
import '../../styles/board/Company.scss';
import { useNavigate } from 'react-router-dom';
import { IoEyeSharp } from "react-icons/io5"; // 조회수

// API
import { getCompanyBaordList } from '../../api/BoardApi';
import BoardNav from './BoardCate';

// 시간
import moment from 'moment';

// 토큰
import { jwtDecode } from "jwt-decode";

function Company() {
    const [visibleItems, setVisibleItems] = useState(9); // 처음 페이지에 9개만 보이도록

    // 로그인 상태 확인(로그인시 더보기버튼)
    const isLoggedIn = !!localStorage.getItem('ACCESS_TOKEN');
    const accessToken = localStorage.getItem('ACCESS_TOKEN');
    const decodedToken = typeof accessToken === 'string' ? jwtDecode(accessToken) : null;
    const customerId = decodedToken?.id;

    // 글 작성 페이지로 이동
    const navigate = useNavigate();
    const handleButtonClick = () => {
        navigate('/board/boardWrite');
    };

    // 상세 페이지로 이동
    const handleButtonView = (bno) => {
        navigate(`/board/CompanyView/${bno}`);
    };

    // 여행메이트 게시판 글 가져오기
    const [CompanyBoardListData, setCompanyBoardListData] = useState([]);

    useEffect(() => {
        const fetchCompanyBoardListData = async () => {
            try {
                const response = await getCompanyBaordList();
                const data = response.data
                data.sort((a, b) => new Date(b.regDate) - new Date(a.regDate)); // 최근 등록댓글이 상단으로

                setCompanyBoardListData(data);
                filterItemsByLocation(selectedLocation);
            } catch (error) {
            }
        };

        fetchCompanyBoardListData();
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
            return CompanyBoardListData;
        } else {
            return CompanyBoardListData.filter(item => item.location === selectedLocation);
        }
    };
    // 필터링 끝

    // 선택된 지역에 따라 카테고리 색 변경 
    const filteredItems = filterItemsByLocation();

    const locationColors = {
        서울: "#D2E0FB",
        인천: "#f9f3cc",
        대전: "#d7e5ca",
        부산: "#dba3db70",
        경기: "#a6d0ea",
        충청: "#daa0a0",
        강원: "#e2cab1",
        전라: "#b56a9957",
        경상: "#20b2aa",
    };

    //  인피니티 스크롤 
    const handleScroll = () => {
        const footer = document.querySelector(".footer .info");

        if (footer) {
            const scrolledToFooter =
                window.innerHeight + window.scrollY >= footer.offsetTop;

            if (scrolledToFooter) {
                setVisibleItems((prevItems) => prevItems + 6); // 6개 추가
            }
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll]);

    return (
        <>
            <BoardNav />

            <Container>
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

                {/* 여행메이트 카드 */}
                <Row className="company-list">
                        {filteredItems.slice(0, visibleItems).map(item => (
                            <Col key={item.bno} xs={10} md={6} lg={4} >
                                <Card className='company-card'>
                                    <Row className="align-items-center">
                                        <Col xs={12} md={12}>
                                            <div className="body-section1">
                                                <div className="body-location" style={{ background: locationColors[item.location] || "#D2E0FB" }}>
                                                    <p className="body-location-name">{item.location}</p>
                                                </div>
                                                <div className="body-viewCnt">
                                                    <IoEyeSharp className="view-icon" />
                                                    <span className="view-count">{item.viewCnt}</span>
                                                </div>
                                            </div>
                                            <div className="body-section2">
                                                <div className="body-title ">{item.title}</div>
                                                <div className="body-name">{item.id.name}</div>
                                                <Card.Text>{moment(item.regDate).format('YYYY/MM/DD')}</Card.Text>
                                            </div>
                                            <div className="body-section3">
                                                <p>{item.content}</p>
                                            </div>

                                            <Button className='more-btn' as="input" type="submit" value="자세히 보기" onClick={() => handleButtonView(item.bno)} />
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        ))}
                </Row>
            </Container>
        </>
    )
}

export default Company;