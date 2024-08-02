import { Form, Button, Modal, InputGroup } from "react-bootstrap";
import { checkPwMatch, chgPw } from "../../../api/MemberApi";
import { useState } from "react";

function ChangePw(props) {
  const [pwMatch, setPwMatch] = useState(true);
  const [pwLengthValid, setPwLengthValid] = useState(true);
  const [showErrorMessage, setShowErrorMessage] = useState(true);

  const checkPasswordMatch = async () => {
    try {
      const currentPassword = document.getElementById("prevPW").value;
      // 기존 비밀번호와 일치하는지 확인
      const isPasswordMatch = await checkPwMatch(currentPassword);

      if (!isPasswordMatch) {
        setPwMatch(false);
        setShowErrorMessage(true);
        return;
      }

      setPwMatch(true);
      setShowErrorMessage(false);
      alert("기존 비밀번호와 일치합니다.");
    } catch (error) {
      console.error("Error checking password match:", error);
      // 에러 처리 로직 추가
    }
  };

  const handlePasswordChange = async () => {
    try {
      const currentPassword = document.getElementById("prevPW").value;
      const password = document.getElementById("chgPW").value;
      const confirmPassword = document.getElementById("chkPW").value;

      // 값이 비어있는지 확인하고 빈 값이라면 오류 처리
      if (!currentPassword || !password || !confirmPassword) {
        alert("비밀번호를 모두 입력하세요.");
        return;
      }
      
      // 기존 비밀번호와 일치하는지 확인
      const isPasswordMatch = await checkPwMatch(currentPassword);

      if (!isPasswordMatch) {
        setPwMatch(false);
        setShowErrorMessage(true);
        return;
      }

      // 새로운 비밀번호와 확인 비밀번호가 일치하는지 확인
      if (password !== confirmPassword) {
        alert("새로운 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
        return;
      }

      const response = await chgPw();

      // 응답 처리
      alert(response.data)
      props.onHide();
    } catch (error) {
      console.error("Error changing password:", error);
      // 에러 처리 로직 추가
    }
  }

  const handlePasswordInputChange = (e) => {
    const password = e.target.value;

    // 새로운 비밀번호 길이 검사
    if (password.length < 8) {
      setPwLengthValid(false);
    } else {
      setPwLengthValid(true);
    }
  };

  const handleModalClose = () => {
    // 모달이 닫힐 때 상태값 초기화
    setPwMatch(true);
    setPwLengthValid(true);
    setShowErrorMessage(false);
    props.onHide();
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered className="changePwModal"
      backdrop="static"
      onHide={handleModalClose}
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          비밀번호 변경
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="prevPW">기존 비밀번호</Form.Label>
              <InputGroup>
                <Form.Control
                  type="password"
                  id="prevPW"
                  aria-describedby="passwordHelpBlock"
                  placeholder="Enter your Password"
                />
                <Button onClick={checkPasswordMatch}>비밀번호 확인</Button>
              </InputGroup>
              {showErrorMessage && !pwMatch && (
              <div className="error">* 기존 비밀번호와 일치하지 않습니다.</div>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="chgPW">변경할 비밀번호</Form.Label>
              <Form.Control
                type="password"
                id="chgPW"
                aria-describedby="passwordHelpBlock"
                placeholder="Enter your Password"
                onChange={handlePasswordInputChange}
              />
              {!pwLengthValid && (
                <div className="error">* 비밀번호는 8자리 이상이어야 합니다.</div>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="chkPW">비밀번호 재입력</Form.Label>
              <Form.Control
                type="password"
                id="chkPW"
                aria-describedby="passwordHelpBlock"
                placeholder="Enter your Password"
              />
            </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>취소</Button>
        <Button className="modify_btn" onClick={handlePasswordChange}>변경</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ChangePw;