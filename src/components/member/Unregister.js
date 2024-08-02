import "../../styles/Member.scss";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMember } from "../../api/MemberApi";
import Withdrawal from "./modal/Withdrawal";

function Unregister() {
    const [userInfo, setUserInfo] = useState({
        id: "",
        name: "",
    });
    const [withdrawalModal, setWithdrawalModal] = useState(false);
    const [agreeChecked, setAgreeChecked] = useState(false);
    
    const fetchUserInfo = async () => {
        try {
          const response = await getMember();
          setUserInfo(response.data);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
    };

    useEffect(() => {
      fetchUserInfo();
    }, []);

    const handleAgreeChange = (event) => {
        setAgreeChecked(event.target.checked);
    };

    return (
        <Container className="unregister">
        <h2 className="title">새하마노 방방곡곡 회원 탈퇴</h2>
        <div className="d-block">
            <div className="content">
            <div className="profile d-flex">
                <div className="inside">
                    <h3 className="title mb-5">회원 탈퇴를 하기 전에, 다음 내용을 꼭 확인해 주세요.</h3>
                    <div className="content mb-3">
                        <p className="bold">{userInfo.name}({userInfo.id})님 정말 탈퇴하시겠어요? 다음 활동 기록이 모두 삭제됩니다.</p>
                        <p>•탈퇴 후에는 새하마노 방방곡곡에 작성하신 게시글이 모두 삭제됩니다.</p>
                        <p>•탈퇴 후에는 새하마노 방방곡곡에서 함께하신 댓글 및 채팅 기록이 모두 삭제됩니다.</p>
                        <p>•탈퇴 후에는 새하마노 방방곡곡에 표시하신 좋아요 목록이 모두 삭제됩니다.</p>
                    </div>
                    <div className="check"><input id="agree" type="checkbox" checked={agreeChecked} onChange={handleAgreeChange} /> <label htmlFor="agree">안내 사항을 모두 확인하였으며, 이에 동의합니다.</label></div>
                </div>
            </div>
            </div>
            <div className="menu gap-3">
                <Button className="confirm" onClick={() => {
                    if (agreeChecked) {
                        setWithdrawalModal(true);
                    } else {
                        alert("회원 탈퇴를 원하시면 약관에 동의하셔야 합니다.");
                    }
                  }}>회원 탈퇴</Button>
                <Link to="/mypage"><Button className="cancel">취소</Button></Link>
            </div>
        </div>
        <Withdrawal show={withdrawalModal} onHide={() => setWithdrawalModal(false)} />
        </Container>
    );
}

export default Unregister;