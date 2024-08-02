import { Form, Button, Modal, InputGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import { checkPwMatch, deleteMember } from "../../../api/MemberApi";
import { jwtDecode } from "jwt-decode";

const ACCESS_TOKEN = localStorage.getItem('ACCESS_TOKEN');

function Withdrawal(props) {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [idError, setIdError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        const validateId = async () => {
            if(id) {
                const decodedToken = jwtDecode(ACCESS_TOKEN);
                const userId = decodedToken.id;

                if (id !== userId) {
                    setIdError("* 아이디가 올바르지 않습니다.");
                } else {
                    setIdError("");
                }
            }
        }
        validateId();
    }, [id]);
    
    useEffect(() => {
        const validatePassword = async () => {
            if (password) {
                const isPasswordMatch = await checkPwMatch(password);
                if(!isPasswordMatch) {
                    setPasswordError("* 비밀번호가 일치하지 않습니다.")
                } else {
                    setPasswordError("");
                }
            }
        }
        validatePassword();
    }, [password])

    const handleModalClose = () => {
        // 모달이 닫힐 때 상태값 초기화
        setId("");
        setPassword("");
        setIdError("");
        setPasswordError("");
        props.onHide();
    };

    const handleUnregister = async () => {
        try {
            // 빈칸 비허용
            if (!id || !password) {
                alert("아이디와 비밀번호를 입력해주세요.");
                return;
            }
            // 에러가 있는 경우 탈퇴 불가능
            if (idError || passwordError) {
                alert("아이디 또는 비밀번호를 다시 확인해주세요.");
                return;
            }

            await deleteMember();
        } catch (error) {
            // 회원 탈퇴 중 오류 발생 시 처리
            console.error("Error during withdrawal:", error);
        }
    }

    const handleIdChange = (e) => {
        setId(e.target.value);
        setIdError(""); // 아이디가 변경되면 에러 메시지 초기화
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordError(""); // 비밀번호가 변경되면 에러 메시지 초기화
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered className="findId withdrawalModal"
            backdrop="static"
        >
        <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
            회원 탈퇴
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            회원 탈퇴를 위해 사용자 정보를 확인합니다.
            <hr className="modalHr"/>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="chgPW">아이디</Form.Label>
                    <Form.Control
                        type="text"
                        id="id"
                        placeholder="아이디를 입력해주세요."
                        value={id}
                        onChange={handleIdChange}
                    />
                    <div className="error">{idError}</div>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="prevPW">비밀번호</Form.Label>
                    <InputGroup>
                        <Form.Control
                        type="password"
                        id="password"
                        placeholder="비밀번호를 입력해주세요."
                        value={password}
                        onChange={handlePasswordChange}
                        />
                    </InputGroup>
                    <div className="error">{passwordError}</div>
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>취소</Button>
            <Button className="modify_btn" onClick={handleUnregister}>탈퇴하기</Button>
        </Modal.Footer>
        </Modal>
    );
}

export default Withdrawal;