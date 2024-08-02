import { useState } from "react";
import { googleLogin, kakaoLogin, postLogin } from "../../api/MemberApi";
import "../../styles/Member.scss";
import { Form, Button } from "react-bootstrap";
import FindId from "./modal/FindId";
import FindPw from "./modal/FindPw";
import { Link } from "react-router-dom";

function Login() {
  const [showFindIdModal, setShowFindIdModal] = useState(false);
  const [showFindPwModal, setShowFindPwModal] = useState(false);

  const openFindIdModal = () => {
    setShowFindIdModal(true);
  };
  const openFindPwModal = () => {
    setShowFindPwModal(true);
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
    } catch (error) {
      console.error("Google login error:", error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const userId = data.get("id");
    const password = data.get("password");

    try {
      await postLogin({id:userId, password:password})
      
    } catch (error) {
      if (error.response && error.response.data.message === "Incorrect password.") {
      
      } else {
      
      }
    }
  }

  return (
    <div className="login">
      <div className="loginform">
        <div className="inside">
          <div className="logo"><Link to={"/"}><img src="../../../assets/etc/logo.png"/></Link></div>
          <h3 className="title">Login</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="grp">
              <Form.Label htmlFor="inputID">ID</Form.Label>
              <Form.Control
                type="text" required
                id="inputID" name="id"
                aria-describedby="idHelpBlock"
                placeholder="Enter your ID"
              />
            </Form.Group>
            <Form.Group className="grp">
              <Form.Label htmlFor="inputPW">Password</Form.Label>
              <Form.Control
                type="password" required
                id="inputPW" name="password"
                aria-describedby="passwordHelpBlock"
                placeholder="Enter your Password"
              />
            </Form.Group>
            {/* <Form.Check
              type="checkbox"
              label="30일 동안 로그인 상태 유지"
              className="grp chk"
            /> */}
            <div className="d-grid">
              <Button type="submit" className="loginBtn">로그인</Button>
            </div>
          </Form>
          <hr />
          <div className="otherlogin">
            <a href={`${process.env.REACT_APP_BASE_URL}/oauth2/authorization/google`} onClick={handleGoogleLogin}>
              <div className="google">
                <div className="g-icon">
                  <img src="../../assets/member/google.png" alt="" />
                </div>
                Sign with Google
              </div>
            </a>
            <a href={`${process.env.REACT_APP_BASE_URL}/oauth2/authorization/kakao`} onClick={kakaoLogin}>
              <div className="kakao">
                <div className="k-icon">
                  <img src="../../assets/member/kakao.png" alt="" />
                </div>
                Sign with Kakao
              </div>
            </a>
          </div>
          <div className="help">
            <h4>
              새하마노의 회원이 아닌가요?{" "}
              <a href="/signup">
                <span>회원가입</span>
              </a>
            </h4>
            <h4>
              <span onClick={openFindIdModal}>ID</span>
              {" "}/{" "}
              <span onClick={openFindPwModal}>Password</span>
              {" "}찾기
            </h4>
          </div>
        </div>
      </div>
      <div className="bgimage d-none d-lg-block"></div>
      <FindId show={showFindIdModal} onHide={() => setShowFindIdModal(false)} />
      <FindPw show={showFindPwModal} onHide={() => setShowFindPwModal(false)} />
    </div>
  );
}

export default Login;