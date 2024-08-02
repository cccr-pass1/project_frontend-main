import { useEffect, useState } from "react";
import { Card, Pagination } from "react-bootstrap";
import { FaHeart } from "react-icons/fa";
import { FaExclamationCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getMyLikeList } from "../../../api/MemberApi";

function LikeList() {
  const [likeList, setLikeList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 페이지당 아이템 수

  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await getMyLikeList();
        setTotalItems(response.data.length); // 좋아요한 아이템 총 수
        setLikeList(response.data);
      } catch (error) {
        console.error("좋아요 목록을 가져오는 중 에러 발생:", error);
      }
    }
    fetchData();
  }, [currentPage]);

  // 페이지 번호를 계산하는 함수
  const calculatePageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // 표시할 최대 페이지 수

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentPageIndex = Math.floor((currentPage - 1) / maxPagesToShow);

    let startPage = currentPageIndex * maxPagesToShow + 1;
    let endPage = (currentPageIndex + 1) * maxPagesToShow;

    if (startPage < 1) {
      startPage = 1;
    }

    if (endPage > totalPages) {
      endPage = totalPages;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  // 페이지 번호를 클릭할 때 호출되는 핸들러
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 이전 페이지로 이동하는 핸들러
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 다음 페이지로 이동하는 핸들러
  const handleNextPage = () => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 페이지 이동 버튼 클릭 시 계산된 페이지 목록
  const pageNumbers = calculatePageNumbers();

  // 현재 페이지에 해당하는 아이템 추출
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = likeList.slice(startIndex, endIndex);

  return (
    <>
      <h3 className="title">나의 활동 - 좋아요</h3>
      {totalItems > 0 ? (
      <>
      {currentItems.map((item)=>(
        <Link key={item.heartNo}
          to={`/place/${item.localPlacesDetail.localNo.localNo}/${item.placeNo}`}
        >
          <Card className="likecard">
            <Card.Body>
              <Card.Img src={`../../assets/place/${item.localPlacesDetail.localNo.localNo}/${item.placeNo}.jpg`} />
              <div class="content">
                <Card.Title className="mb-3">{item.localPlacesDetail.name}</Card.Title>
                <Card.Text>
                  {item.localPlacesDetail.content}
                </Card.Text>
              </div>
              <FaHeart className="h-icon" />
            </Card.Body>
          </Card>
        </Link>
      ))}
      {/* 페이지네이션 컴포넌트 */}
      <Pagination className="pagination justify-content-center">
        <Pagination.Prev onClick={handlePreviousPage} />
        {pageNumbers.map((number) => (
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => handlePageClick(number)}
          >
            {number}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={handleNextPage} />
      </Pagination>
      </>) : (
        <div className="no_data">
          <div className="emptyIcon">
            <FaExclamationCircle />
          </div>
          <h3>좋아요 표시한 목록이 없습니다.</h3>
          <p>지금 마음에 드는 관광지에 좋아요를 표시해보세요!</p>
        </div>
      )}
    </>
  );
}

export default LikeList;
