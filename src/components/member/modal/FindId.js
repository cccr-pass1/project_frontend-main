import axios from "axios";
import { Form, Button, Modal, InputGroup } from "react-bootstrap";
import { useState } from "react";

function FindId(props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const handleSendMail = () => {
        axios.post(`${process.env.REACT_APP_BASE_URL}/sendFindIdMail`, { name, email })
            .then(response => {
                alert("입력한 이메일 주소로 회원님의 ID를 발송했습니다.");
            })
            .catch(error => {
                alert(error.response.data || "ID 발송에 실패하였습니다. 다시 시도해주세요.");
                console.error(error);
            });
    };

    const handleModalClose = () => {
        // 모달이 닫힐 때 상태값 초기화
        setName("");
        setEmail("");
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
            ID 찾기
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3">
                <Form.Label htmlFor="chgPW">이름</Form.Label>
                <Form.Control
                    type="text"
                    id="name"
                    placeholder="회원가입에 사용한 이름을 입력해주세요."
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
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
                    onChange={(e)=>setEmail(e.target.value)}
                    />
                    <Button onClick={handleSendMail}>메일 발송</Button>
                </InputGroup>
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

export default FindId;