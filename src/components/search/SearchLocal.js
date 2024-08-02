// SearchLocal 컴포넌트에서
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Pagination } from "react-bootstrap";
import { BsEye } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import Search from "./Search";

function SearchLocal() {
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  // 검색어 변경 시 필터링된 목록 업데이트
  useEffect(() => {
    const filtered = places.filter((place) =>
      place.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlaces(filtered);
    console.log("검색어 관광지 (filteredPlaces): ", filtered);
  }, [searchTerm, places]);

  return (
    <>
      <Search onSearch={(term) => setSearchTerm(term)} />
      <Container>
        <div className="search_local">
          <div className="sub_title">
            <h3 className="title">
              관광지 (<span>{filteredPlaces.length}</span>건)
            </h3>
          </div>
          <hr className="contour" />
          {filteredPlaces.map((place, index) => (
            <Row key={index} className="search_result">
              <Col sm={12} md={4} className="img">
                <img
                  src={`/assets/place/${place.localNo.localNo}/${place.placeNo}.jpg`}
                  alt={place.name}
                />
              </Col>
              <Col sm={12} md={8}>
                <Row>
                  <Col xs={10} className="text">
                    <h3 className="title">{place.name}</h3>
                    <p className="address">{place.location}</p>
                    <p className="explanation">{place.content}</p>
                  </Col>
                  <Col xs={2}>
                    <div className="views">
                      <BsEye className="icon" /> {place.viewCnt || 0}
                    </div>
                    <div className="likes">
                      <FaHeart className="icon" /> {place.heartCnt || 0}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          ))}
        </div>
      </Container>
      <Pagination className="pagination justify-content-center">
        <Pagination.First />
        <Pagination.Prev />
        <Pagination.Item active>{1}</Pagination.Item>
        <Pagination.Item>{2}</Pagination.Item>
        <Pagination.Item>{3}</Pagination.Item>
        <Pagination.Item>{4}</Pagination.Item>
        <Pagination.Item>{5}</Pagination.Item>
        <Pagination.Next />
        <Pagination.Last />
      </Pagination>
    </>
  );
}

export default SearchLocal;
