import axios from "axios";
import { Form, Button, Modal, InputGroup } from "react-bootstrap";
import { useState } from "react";

function FindPw(props) {
    const [id, setId] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleSendMail = () => {
        axios.post(`${process.env.REACT_APP_BASE_URL}/sendFindPwMail`, { id, email })
            .then(response => {
                alert("입력한 이메일 주소로 임시 비밀번호를 발송했습니다.");
            })
            .catch(error => {
                if (error.response.status === 404 && error.response.data === "존재하지 않는 id입니다.") {
                    alert("해당 ID로 가입된 회원을 찾을 수 없습니다.");
                } else if (error.response.status === 400 && error.response.data === "이메일이 일치하지 않습니다.") {
                    setError("* 이메일이 일치하지 않습니다.");
                } else {
                    alert("메일 발송에 실패하였습니다. 다시 시도해주세요.");
                    console.error(error);
                }
            });
    };

    const handleEmailChange = (e) => {
        // 이메일 입력창에 수정사항이 있을 때 에러메시지 초기화
        setError("");
        setEmail(e.target.value);
    };

    const handleModalClose = () => {
        // 모달이 닫힐 때 상태값 초기화
        setId("");
        setEmail("");
        setError("");
        props.onHide();
    };

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered className="findId"
            backdrop="static"
        >
        <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
            Password 찾기
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3">
                <Form.Label htmlFor="chgPW">ID</Form.Label>
                <Form.Control
                    type="text"
                    id="ID"
                    placeholder="아이디를 입력해주세요."
                    value={id}
                    onChange={(e)=>setId(e.target.value)}
                />
                </Form.Group>
                <Form.Group className="mb-3">
                <Form.Label htmlFor="prevPW">이메일 주소</Form.Label>
                <InputGroup>
                    <Form.Control
                    type="email"
                    id="email"
                    placeholder="회원가입에 사용한 이메일을 입력해주세요."
                    value={email}
                    onChange={handleEmailChange}
                    />
                    <Button onClick={handleSendMail}>메일 발송</Button>
                </InputGroup>
                {error && <p className="findPwError">{error}</p>}
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            {/* <Button variant="secondary" onClick={props.onHide}>취소</Button> */}
            <Button className="modify_btn" onClick={handleModalClose} >확인</Button>
        </Modal.Footer>
        </Modal>
    );
}

export default FindPw;