import '../../styles/board/Notice.scss'

import React, { useState } from 'react';
import { Accordion, Card } from 'react-bootstrap';

import BoardCate from './BoardCate';


function Notice() {
    const [activeKey, setActiveKey] = useState(null);

    const handleAccordionClick = (eventKey) => {
        setActiveKey(activeKey === eventKey ? null : eventKey);
    };

    return (
        <>
            <BoardCate />

            <div className="container">
                <Accordion activeKey={activeKey} onSelect={handleAccordionClick}>
                    <Card>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header >
                                <div className='headerName'>서비스 |      새하마노 방방곡곡은 어떤 사이트인가요?</div>
                            </Accordion.Header>
                            <Accordion.Body>
                                "새하마노 방방곡곡"은 대한민국의 동, 서, 남, 북을 아우르는 우리말로,
                                전국의 지역, 관광지, 축제, 특산물 등 다양한 관광 정보를 종합적으로 제공하는
                                대한민국 방방곡곡 소개 웹사이트입니다.
                                방방곡곡은 기상청 API와 카카오 지도를 기반으로 실시간 날씨와 위치 정보를 제공하며,
                                대한민국에 대한 다양한 정보를 제공합니다.

                              (※회원가입 및 로그인 필수)
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="2">
                            <Accordion.Header id="headerName">
                                회원 |      계정을 잃어버렸어요
                            </Accordion.Header>
                            <Accordion.Body>
                                ① 로그인 버튼을 클릭 합니다 → ② 아이디 찾기 버튼을 클릭합니다. → ③ 회원가입에 사용한 이름과 이메일을 입력하고 이메일 인증 버튼을 클릭 합니다. → ④ 메일에서 ID를 확인할 수 있습니다. 
                                ※지속적인 오류가 발생 할 경우 새하마노 방방곡곡으로 연락주시면 빠른 시일 내 답변 드리겠습니다.
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="3">
                            <Accordion.Header id="headerName">
                                 회원 |      비밀번호를 잃어버렸어요
                            </Accordion.Header>
                            <Accordion.Body>
                                ① 로그인 버튼을 클릭 합니다 → ② 비밀번호 찾기 버튼을 클릭합니다. → ③ 회원가입에 사용한 ID와 이메일을 입력하고 이메일 인증 버튼을 클릭 합니다. → ④ 메일에서 임시 비밀번호를 확인할 수 있습니다. → ⑤재로그인
                                ※지속적인 오류가 발생 할 경우 새하마노 방방곡곡으로 연락주시면 빠른 시일 내 답변 드리겠습니다.
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="4">
                            <Accordion.Header id="headerName">
                               게시판 |      관광지 추천 게시판은 어떻게 이용하나요?
                            </Accordion.Header>
                            <Accordion.Body>
                                ① 게시판 카테고리를 클릭합니다. → ② 관광지 추천 카테고리를 클릭합니다. → ③ 글작성 버튼을 클릭합니다. → ④ 제목, 구분, 지역, 파일, 내용을 작성합니다. → ⑤ 등록버튼을 클릭합니다.
                                ※게시판은 회원만 작성가능합니다.
                                ※관광지 추천 게시판은 이미지 첨부파일이 필수입니다.
                                ※지속적인 오류가 발생 할 경우 새하마노 방방곡곡으로 연락주시면 빠른 시일 내 답변 드리겠습니다.
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="5">
                            <Accordion.Header id="headerName">
                               게시판 |      여행 메이트 구하기는 어떻게 이용하나요?
                            </Accordion.Header>
                            <Accordion.Body>
                                ① 게시판 카테고리를 클릭합니다. → ② 여행 메이트 카테고리를 클릭합니다. → ③ 글작성 버튼을 클릭합니다. → ④ 제목, 구분, 지역, 내용을 작성합니다. → ⑤ 등록버튼을 클릭합니다.
                                ※지속적인 오류가 발생 할 경우 새하마노 방방곡곡으로 연락주시면 빠른 시일 내 답변 드리겠습니다.
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="6">
                            <Accordion.Header id="headerName">
                               서비스 |      문의사항이나 건의사항이 있어요
                            </Accordion.Header>
                            <Accordion.Body>
                                새하마노 방방곡곡 공식전화번호인 02-0000-0000으로 연락주시면 빠른 시일 내 답변 드리겠습니다.
                            </Accordion.Body>
                        </Accordion.Item>
                    </Card>
                </Accordion>
            </div>
        </>
    );
}

export default Notice;
