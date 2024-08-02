// react
import { NavLink } from 'react-router-dom';

// css
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../../styles/board/BoardCate.scss';


function BoardCate() {
  return (
    <>
      <Navbar style={{ paddingTop: '200px' }}>
        <Container className="justify-content-center text-center">
          <Nav>
            <NavLink to="/board/touristSpot" className='category'>관광지 추천</NavLink>
            <NavLink to="/board/company" className='category'>여행 메이트</NavLink>
            <NavLink to="/board/notice" className='category'>FAQ</NavLink>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default BoardCate;
