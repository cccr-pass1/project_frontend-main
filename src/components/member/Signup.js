import axios from "axios";
import "../../styles/Member.scss";
import { Form, Button, InputGroup } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

// ID 유효성 검사 함수 (전역 선언)
const validateId = (id) => {
  const idRegex = /^(?=.*[a-zA-Z])(?=.*\d).{5,}$/;
  return id.length >= 5 && idRegex.test(id);
};

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id:'', password:'', confirmPassword: '', name:'', phoneNum:'', email:'', vc:''
  });
  const [errorMsg, setErrorMsg] = useState({
    id:'', password:'', confirmPassword: '', name:'', phoneNum:'', email:'', vc:''
  });

  const [duplicateValid, setDuplicateValid] = useState(false);
  const [vcSent, setVcSent] = useState(false);

  // 이메일로 발송된 코드
  const [codeFromEmail, setCodeFromEmail] = useState("");
  const [vcSuccess, setVcSuccess] = useState(false);

  // 휴대폰번호 입력 형식
  const formatPhoneNumber = (inputNumber) => {
    // 숫자만 추출하여 "-" 추가
    return inputNumber.replace(/\D/g, "").replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
  };

  // id 중복확인
  const handleCheckDuplicate = async () => {
    // 아이디 유효성 검사 추가
    if (!validateId(formData.id)) {
      setErrorMsg({ ...errorMsg, id: "ID는 5글자 이상이어야 하며, 영문과 숫자를 모두 포함해야 합니다." });
      setDuplicateValid(false);
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/signup/checkId`, { id: formData.id });
  
      if (response.data) {
        setErrorMsg({ ...errorMsg, id: "이미 존재하는 ID입니다." });
        setDuplicateValid(false);
      } else {
        setDuplicateValid(true);
        setErrorMsg({ ...errorMsg, id: "" });
      }
    } catch (error) {
      console.error("중복 확인 에러:", error);
      if (error.response && error.response.status === 409) {
        setErrorMsg({ ...errorMsg, id: "이미 존재하는 ID입니다." });
        setDuplicateValid(false);
      } else {
        setErrorMsg({ ...errorMsg, id: "중복 확인 중 오류가 발생했습니다." });
        setDuplicateValid(false);
      }
      throw error; // 에러 발생 시 함수 종료
    }
  };

  // 각 필드에 대한 유효성 검사 로직을 수행
  const validateField = (fieldName) => {
    switch (fieldName) {
      case "id":
        setErrorMsg({
          ...errorMsg,
          id: validateId(formData.id)
            ? ""
            : "ID는 5글자 이상이어야 하며, 영문과 숫자를 모두 포함해야 합니다."
        });
        break;

      case "password":
        setErrorMsg({
          ...errorMsg,
          password:
            formData.password.length >= 8
              ? ""
              : "비밀번호는 최소 8자 이상이어야 합니다."
        });
        break;

      case "confirmPassword":
        setErrorMsg({
          ...errorMsg,
          confirmPassword:
            formData.password === formData.confirmPassword
              ? ""
              : "비밀번호가 일치하지 않습니다."
        });
        break;

      case "vc":
        setErrorMsg({
          ...errorMsg,
          vc:
            formData.vc === String(codeFromEmail)
              ? ""
              : "인증번호가 일치하지 않습니다."
        });
        break;

      default:
        break;
    }
  };

  const handleBlur = (fieldName) => {
    validateField(fieldName);
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]:e.target.value})
    setErrorMsg({ ...errorMsg, [e.target.name]: "" });

    if (e.target.name === "vc") {
      // console.log("현재 입력된 인증번호:", e.target.value);
      setVcSuccess(false);
    }

    if(e.target.name === "id") {
      setDuplicateValid(false);
    }
  }

  const verifyCode = async () => {
    try {
      if (!formData.vc) {
        return;
      }

      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/signup/verifyCode`, {
        verificationCode: formData.vc,
      });

      // console.log("서버 응답 확인:", response.data);
  
      if (response.data.status === 200 && formData.vc === codeFromEmail) {
        setVcSuccess(true); 
      } else {
        // 서버 응답이 실패한 경우
        setErrorMsg({ ...errorMsg, vc: "인증 실패" });
        setVcSuccess(false);
      }
    } catch (error) {
      // 예외 처리
      console.error("인증번호 확인 에러:", error);
      setErrorMsg({ ...errorMsg, vc: "인증 실패" });
      setVcSuccess(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 중복 확인
    try {
      await handleCheckDuplicate();
  
      if (errorMsg.id) {
        return;
      }

      // 인증번호 검증
      await verifyCode();

      // 나머지 유효성 검사
      Object.keys(formData).forEach((fieldName) => {
        validateField(fieldName);
        if (errorMsg[fieldName] !== "") {
          // 유효성 검사에서 에러 발생 시 함수 종료
          return;
        }
      });

      // 회원가입 요청
      const signupResponse = await axios.post(`${process.env.REACT_APP_BASE_URL}/signup`, formData);

      if (signupResponse.status === 200) {
        alert("회원 가입 완료");
        navigate("/login");
      } else {
        alert("회원가입 실패");
      }
      // console.log("사용자 입력값:", formData.vc);
      // console.log("서버에서 받은 인증번호:", codeFromEmail);

    } catch (error) {
      console.error("회원가입 에러:", error);
      alert("회원가입 실패");
    }
   
  };

  // 이메일 발송 함수
  const sendEmail = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/signup/sendMail`, {
        email: formData.email,
      });
  
      // 확인: 서버 응답 로그
      // console.log(response);
      // 이메일로부터 받은 코드를 상태에 저장
      setCodeFromEmail(response.data);
    } catch (error) {
      // 오류 처리
      console.error("이메일 전송 에러 : ", error);
      throw error;
    }
  }
  
  // 인증번호 발송 버튼 
  const handleSendVC = async () => {
    try {
      if (!formData.email) {
        alert("이메일을 입력해주세요.");
        return;
      }

      await sendEmail();
      setVcSuccess(false); // 인증번호 재발송 시 초기화
      setVcSent(true); // 인증번호 발송 완료
      alert("인증번호가 발송되었습니다.");
    } catch (error) {
      console.error("인증번호 발송 에러:", error);
      return;
    }
  }

  useEffect(() => {
    // console.log("Code from Email:", codeFromEmail);
  }, [codeFromEmail]);

  useEffect(() => {
    if (vcSuccess === true) {
      console.log("vcSuccess:", vcSuccess);
    }
  }, [vcSuccess]);

  return (
    <div className="signup">
      <div className="loginform">
        <div className="inside">
        <div className="logo"><Link to={"/"}><img src="../../../assets/etc/logo.png"/></Link></div>
          <h3 className="title">Sign Up</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="grp">
              <Form.Label htmlFor="inputID">ID</Form.Label>
              <InputGroup>
                <Form.Control
                  id="inputID" required 
                  placeholder="아이디를 입력해주세요."
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                  name="id" onBlur={() => handleBlur("id")}
                  onChange={handleChange} value={formData.id}
                  isInvalid={!!errorMsg.id}
                />
                <Button type="button" onClick={handleCheckDuplicate}>중복확인</Button>
              </InputGroup>
              <Form.Control.Feedback type="invalid" className="d-block">
                {errorMsg.id}
              </Form.Control.Feedback>
              {duplicateValid && (
                <div className="success">
                  사용 가능한 아이디입니다.
                </div>
              )}
            </Form.Group>
            <Form.Group className="grp">
              <Form.Label htmlFor="inputPW">Password</Form.Label>
              <Form.Control
                type="password"
                id="inputPW" required 
                aria-describedby="passwordHelpBlock"
                placeholder="비밀번호를 입력해주세요."
                name="password" onBlur={() => handleBlur("password")}
                onChange={handleChange} value={formData.password}
                isInvalid={!!errorMsg.password}
              />
              <Form.Control.Feedback type="invalid">
                {errorMsg.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="grp">
              <Form.Label htmlFor="inputPW2">Password Confirm</Form.Label>
              <Form.Control
                type="password"
                id="inputPW2" required 
                aria-describedby="passwordHelpBlock"
                placeholder="비밀번호 재입력"
                name="confirmPassword" onBlur={() => handleBlur("confirmPassword")}
                onChange={handleChange} value={formData.confirmPassword}
                isInvalid={!!errorMsg.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">
                {errorMsg.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="grp">
              <Form.Label htmlFor="inputName">Name</Form.Label>
              <Form.Control
                type="text"
                id="inputName" required 
                placeholder="이름을 입력해주세요."
                name="name" onBlur={() => handleBlur("name")}
                onChange={handleChange} value={formData.name}
                isInvalid={!!errorMsg.name}
              />
              <Form.Control.Feedback type="invalid">
                {errorMsg.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="grp">
              <Form.Label htmlFor="inputPH">Phone Number</Form.Label>
              <Form.Control
                type="text"
                id="inputPH" required 
                placeholder="휴대폰 번호를 -없이 입력해주세요."
                name="phoneNum" onBlur={() => handleBlur("phoneNum")}
                onChange={(e) => {
                  const formattedNumber = formatPhoneNumber(e.target.value);
                  setFormData({ ...formData, phoneNum: formattedNumber });
                  setErrorMsg({ ...errorMsg, phoneNum: "" });
                }}
                value={formData.phoneNum}
                isInvalid={!!errorMsg.phoneNum}
              />
              <Form.Control.Feedback type="invalid">
                {errorMsg.phoneNum}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="grp">
              <Form.Label htmlFor="inputEmail">Email Address</Form.Label>
              <InputGroup>
                <Form.Control
                  id="inputEmail" required 
                  placeholder="email@example.com"
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                  name="email" onBlur={() => handleBlur("email")}
                  onChange={handleChange} value={formData.email}
                  isInvalid={!!errorMsg.email}
                />
                <Form.Control.Feedback type="invalid">
                {errorMsg.email}
              </Form.Control.Feedback>
                <Button onClick={handleSendVC}>인증번호 발송</Button>
              </InputGroup>
            </Form.Group>
            <Form.Group className="grp">
              <Form.Label htmlFor="inputVC">인증번호</Form.Label>
              <Form.Control
                type="text"
                id="inputVC" required 
                placeholder="메일로 발송된 인증번호를 입력해주세요."
                name="vc" onBlur={() => handleBlur("vc")}
                onChange={handleChange} value={formData.vc}
                isInvalid={!!errorMsg.vc}
                disabled={!vcSent} // 발송 전에는 비활성화
              />
              <Form.Control.Feedback type="invalid">
                {errorMsg.vc}
              </Form.Control.Feedback>
              {vcSuccess === true && (
                <div className="success">
                  인증에 성공했습니다.
                </div>
              )}
            </Form.Group>
            <Form.Check // prettier-ignore
              type="checkbox"
              id="keep-status" required 
              label="개인정보 수집 및 정보이용에 동의합니다."
              className="grp chk"
            />
            <div className="d-grid">
              <Button type="submit">회원가입</Button>
            </div>
          </Form>
          <hr />
          <div className="otherlogin">
            <div className="google">
              <div className="g-icon">
                <img src="../../assets/member/google.png" alt="" />
              </div>
              Sign with Google
            </div>
            <div className="kakao">
              <div className="k-icon">
                <img src="../../assets/member/kakao.png" alt="" />
              </div>
              Sign with Kakao
            </div>
          </div>
          <div className="help">
            <h4>
              이미 계정이 있으신가요? <a href="/login"><span>Login</span></a>
            </h4>
          </div>
        </div>
      </div>
      <div className="bgimage d-none d-lg-block"></div>
    </div>
  );
}

export default Signup;