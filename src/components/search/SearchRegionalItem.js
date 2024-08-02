import { Container, Row, Col } from 'react-bootstrap';
import '../../styles/Search.scss';
import Search from './Search';

function SearchRegionalItem() {
  return (
    <>
    <Search/>
    <Container>
        <div className="search_specialties">
            <div className="sub_title">
                <h3 className='title'>특산물 (<span>100</span>건)</h3>
            </div>
            <hr className='contour'/>
            <div className='specialties'>
                <Row>
                    <Col sm={6} lg={3}>
                        <div className="img"><img src="../../assets/regionfood/apple.png" alt="" /></div>
                        <h3 className="title">사과</h3>
                        <p>Lorem ipsum dolor sit amet consectetur</p>
                    </Col>
                    <Col sm={6} lg={3}>
                        <div className="img"><img src="../../assets/regionfood/apple.png" alt="" /></div>
                        <h3 className="title">사과</h3>
                        <p>Lorem ipsum dolor sit amet consectetur</p>
                    </Col>
                    <Col sm={6} lg={3}>
                        <div className="img"><img src="../../assets/regionfood/apple.png" alt="" /></div>
                        <h3 className="title">사과</h3>
                        <p>Lorem ipsum dolor sit amet consectetur</p>
                    </Col>
                    <Col sm={6} lg={3}>
                        <div className="img"><img src="../../assets/regionfood/apple.png" alt="" /></div>
                        <h3 className="title">사과</h3>
                        <p>Lorem ipsum dolor sit amet consectetur</p>
                    </Col>
                    <Col sm={6} lg={3}>
                        <div className="img"><img src="../../assets/regionfood/apple.png" alt="" /></div>
                        <h3 className="title">사과</h3>
                        <p>Lorem ipsum dolor sit amet consectetur</p>
                    </Col>
                </Row>
            </div>
        </div>
    </Container>
    </>
  );
}

export default SearchRegionalItem;