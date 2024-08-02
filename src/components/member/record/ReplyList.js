import { useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { FaExclamationCircle } from "react-icons/fa";
import { getMyReplyList } from "../../../api/MemberApi";
import moment from 'moment';

function ReplyList() {
  const [replyList, setReplyList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 한 페이지당 보여질 아이템 수

  useEffect(() => {
    fetchReplyList();
  }, [currentPage]);

  const fetchReplyList = async () => {
    try {
      const response = await getMyReplyList();
      setTotalItems(response.data.length); // 총 댓글 수 반영
      setReplyList(response.data); // API에서 받아온 데이터로 상태 업데이트
    } catch (error) {
      console.error("댓글 목록을 불러오는 중 에러 발생:", error);
    }
  };

  // 페이지 번호를 계산하는 함수
  const calculatePageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // 표시할 최대 페이지 수

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentPageIndex = Math.floor((currentPage - 1) / maxPagesToShow); // 현재 페이지가 속한 그룹의 인덱스

    let startPage = currentPageIndex * maxPagesToShow + 1; // 시작 페이지
    let endPage = (currentPageIndex + 1) * maxPagesToShow; // 끝 페이지

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
  const currentItems = replyList.slice(startIndex, endIndex);

  return (
    <>
      <h3 className="title">나의 활동 - 댓글</h3>
      {totalItems > 0 ? (
      <>
      <table className="replylist">
        <thead>
          <tr>
            <th>지역</th>
            <th>글제목</th>
            <th>댓글내용</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((reply) => (
            <tr key={reply.rno}>
              <td><Link to={`/board/CompanyView/${reply.bno}`}>{reply.location}</Link></td>
              <td><Link to={`/board/CompanyView/${reply.bno}`}>{reply.title}</Link></td>
              <td><Link to={`/board/CompanyView/${reply.bno}`}>{reply.content}</Link></td>
              <td><Link to={`/board/CompanyView/${reply.bno}`}>{moment(reply.regDate).format('YYYY/MM/DD')}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination className="pagination justify-content-center">
        <Pagination.Prev onClick={handlePreviousPage}/>
        {pageNumbers.map((number) => (
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => handlePageClick(number)}
          >
            {number}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={handleNextPage}/>
      </Pagination>
      </>) : (
        <div className="no_data">
          <div className="emptyIcon">
            <FaExclamationCircle />
          </div>
          <h3>댓글에 대한 활동 내역이 없습니다.</h3>
          <p>지금 댓글을 작성해보세요!</p>
        </div>
      )}
    </>
  );
}

export default ReplyList;
