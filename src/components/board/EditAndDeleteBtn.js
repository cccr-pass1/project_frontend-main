// css
import "../../styles/board/EditAndDeleteBtn.scss";
import { Col, Button } from "react-bootstrap";

// react
import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// api
import { getTourBaordDetail, deleteBoard } from "../../api/BoardApi";

// 토큰
import { jwtDecode } from "jwt-decode";

// 수정 삭제 버튼 컴포넌트
function EditAndDeleteBtn() {
    const { bno } = useParams();
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    const decodedToken = typeof accessToken === "string" ? jwtDecode(accessToken) : null;
    const userId = decodedToken?.id;

    const [loadingData, setLoadingData] = useState(true);
    const [TourBaordDetailData, setTourBaordDetailData] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTourBaordDetailData = async () => {
            try {
                const response = await getTourBaordDetail(bno);
                const data = response.data;
                setTourBaordDetailData(Array.isArray(data) ? data : [data]); // 배열로 감싸기
                setLoadingData(false);
            } catch (error) { }
        };

        fetchTourBaordDetailData();
    }, [bno, userId]); // userId 의존성 배열에 추가

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteBoard(bno);
            alert("삭제되었습니다.");
            navigate("/board/touristSpot");
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return <div>로딩중...</div>;
    }

    // 배열의 첫 번째 요소
    const item = TourBaordDetailData[0];

    if (item && item.id && item.id.id) {
        if (userId === item.id.id) {
            // 토큰이 있고, 작성자의 ID와 토큰의 ID가 일치하는 경우
            return (
                <React.Fragment key={item.bno}>
                    <Col xs={4} md={1} className="boardView-btn">
                        <Link to={`/board/edit/${item.bno}`}>
                            <Button variant="link" className="btn">
                                수정
                            </Button>
                        </Link>
                    </Col>
                    <Col xs={4} md={1} className="boardView-btn">
                        <Button variant="link" disabled={loading} onClick={handleDelete}>
                            삭제
                        </Button>
                    </Col>
                </React.Fragment>
            );
        } else {
            return null;
        }
    }
    return null;
}
export default EditAndDeleteBtn;