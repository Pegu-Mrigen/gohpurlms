import React, { useState } from "react";
import { assets } from "./../../assets/assets";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ key }) => {
  const navigate = useNavigate();

  const [keywords, setKeywords] = useState(key ? key : "");

  const onSearchHandler = (e) => {
    e.preventDefault();

    navigate("/course-list/" + keywords);
  };

  console.log(keywords);
  return (
    <form
      onSubmit={onSearchHandler}
      className="max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-500/30 rounded"
    >
      <img src={assets.search_icon} alt="" className="md:w-auto w-10 px-3" />
      <input
        onChange={(e) => setKeywords(e.target.value)}
        value={keywords}
        type="text"
        placeholder={`${keywords?keywords:"Search for courses"}`}
        className="w-full h-full outline-none text-gray-400/70"
      />
      <button
        type="submit"
        className="bg-blue-600 rounded text-white md:px-10 px-7 md:py-3 py-2 mx-1"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
