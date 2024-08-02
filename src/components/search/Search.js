import "../../styles/Search.scss";
import { IoSearch } from "react-icons/io5";
import { Container } from "react-bootstrap";
import { useState } from "react";

function Search({ onSearch, onSearchSubmit, displayedTotalLength }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const results = await onSearch(searchTerm);

    if (results !== undefined) {
      setSearchResults(results);
      onSearchSubmit(searchTerm);
    }

    // Remove the setDisplayedTotalLength line
    console.log(displayedTotalLength);
  };

  return (
    <div className="search">
      <div className="headline"></div>
      <Container>
        <div className="seach_top">
          <h1 className="title">통합검색</h1>
          <div className="wrap">
            <form onSubmit={handleSearchSubmit} className="form">
              <input
                type="text"
                name="search"
                placeholder="검색어를 입력하세요."
                className="inp"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
              />
              <div className="sIcon" onClick={handleSearchSubmit}>
                <IoSearch />
              </div>
            </form>
          </div>
          <div className="result_comment">
            <h3>
              "{searchTerm}"에 관한 <span>{displayedTotalLength}</span>건의
              검색결과가 있습니다.
            </h3>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Search;
