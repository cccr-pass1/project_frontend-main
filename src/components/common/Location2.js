import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom"; // Link 대신 NavLink를 import
import { getListLocation } from "../../api/locationApi";
import "../../styles/Location2.css";

function Location2({ onCategoryClick, basePath }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await getListLocation();
        const locations = response.data || [];

        const filteredCategories = locations.filter(
          (category) => category.localNo !== "all"
        );

        setCategories(filteredCategories);
      } catch (error) {
        console.error("데이터 에러:", error);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div className="location2">
      {categories.map((category) => (
        <NavLink
          key={category.localNo}
          to={`${basePath}/${category.localNo}`}
          onClick={() => onCategoryClick(category.localNo)}
        >
          {category.name}
        </NavLink>
      ))}
    </div>
  );
}

export default Location2;
