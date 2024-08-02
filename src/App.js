import React, { Suspense, lazy } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../src/styles/index.css";
import "../src/styles/reset.scss";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer.js";
import Main from "./components/common/Main";
import ScrollToTop from "./components/common/ScrolltoTop.js";
import ChatWidget from "./components/chat/ChatWidget.js";

// Main
const LocalMain = lazy(() => import("./components/local/LocalMain"));
const RegionfoodMain = lazy(() =>
  import("./components/regionfood/RegionfoodMain")
);
const PlaceMain = lazy(() => import("./components/place/PlaceMain"));
const PlcaeView = lazy(() => import("./components/place/PlaceView"));
const FestivalMain = lazy(() => import("./components/festival/FestivalMain"));
const FestivalView = lazy(() => import("./components/festival/FestivalView"));

// Board
const BoardWrite = lazy(() => import("./components/board/BoardWrite"));
const BoardEdit = lazy(() => import("./components/board/BoardEdit"));
const TouristSpot = lazy(() => import("./components/board/TouristSpot"));
const TouristSpotView = lazy(() =>
  import("./components/board/TouristSpotView")
);
const Company = lazy(() => import("./components/board/Company"));
const CompanyView = lazy(() => import("./components/board/CompanyView.js"));
const Notice = lazy(() => import("./components/board/Notice"));

// Search
const SearchDetail = lazy(() => import("./components/search/SearchDetail"));
const SearchLocal = lazy(() => import("./components/search/SearchLocal"));
const SearchFestival = lazy(() => import("./components/search/SearchFestival"));
const SearchRegionalItem = lazy(() =>
  import("./components/search/SearchRegionalItem")
);

// Member
const Login = lazy(() => import("./components/member/Login"));
const Signup = lazy(() => import("./components/member/Signup.js"));
const Mypage = lazy(() => import("./components/member/Mypage"));
const Unregister = lazy(() => import("./components/member/Unregister.js"));

function App() {
  return (
    <div className="App" id="App">
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Main */}
          <Route path="/" element={<Main />} />
          <Route path="/local/:localNo" element={<LocalMain />} />
          <Route path="/localFoods/:localNo" element={<RegionfoodMain />} />
          <Route path="/place/:localNo" element={<PlaceMain />} />
          <Route path="/place/:localNo/:placeNo" element={<PlcaeView />} />
          <Route path="/festival/:localNo" element={<FestivalMain />} />
          <Route
            path="/festival/:localNo/:festivalNo"
            element={<FestivalView />}
          />

          {/* Board */}
          <Route path="/board/touristSpot" element={<TouristSpot />} />
          <Route
            path="/board/touristSpotView/:bno"
            element={<TouristSpotView />}
          />
          <Route path="/board/company" element={<Company />} />
          <Route path="/board/companyView/:bno" element={<CompanyView />} />
          <Route path="/board/notice" element={<Notice />} />
          <Route path="/board/boardWrite" element={<BoardWrite />} />
          <Route path="/board/edit/:bno" element={<BoardEdit />} />

          {/* Search */}
          <Route path="/search/whole" element={<SearchDetail />} />
          <Route path="/search/local" element={<SearchLocal />} />
          <Route path="/search/festival" element={<SearchFestival />} />
          <Route path="/search/specialties" element={<SearchRegionalItem />} />

          {/* Member */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/unregister" element={<Unregister />} />
          <Route path="/oauth2/authorization/google" />
        </Routes>
      </Suspense>
      {/* 채팅위젯 */}
      <ChatWidget />
      {/* 스크롤 탑 이동 */}
      <ScrollToTop />
      <Footer />
    </div>
  );
}

export default App;
