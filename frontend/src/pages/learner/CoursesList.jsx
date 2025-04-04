import React from "react";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "./../../context/AppContext";
import SearchBar from "./../../components/learner/SearchBar";
import { useParams } from "react-router-dom";
import CourseCard from "./../../components/learner/CourseCard";
import { assets } from "./../../assets/assets";
import Footer from './../../components/learner/Footer';

const CoursesList = () => {
  const { navigate, allCourses } = useContext(AppContext);
  const { keywords } = useParams();

  console.log(keywords);

  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice();

      keywords
        ? setFilteredCourses(
            tempCourses.filter((course) =>
              course.courseTitle.toLowerCase().includes(keywords.toLowerCase())
            )
          )
        : setFilteredCourses(tempCourses);
      console.log(tempCourses);
    }
  }, [allCourses, keywords]);

  console.log(allCourses);
  console.log(filteredCourses);
  return (
    <>
      <div className="relative md:px-36 px-8 pt-20 text-left">
        <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
          <div className="">
            <h1 className="text-4xl font-semibold text-gray-800">
              Course List
            </h1>
            <p className="text-gray-500">
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => navigate("/")}
              >
                Home /
              </span>
              <span className="">Course List</span>
            </p>
          </div>
          <SearchBar key={keywords} />
        </div>

        {keywords && (
          <div className="inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-600">
            <p className="">{keywords}</p>
            <img
              src={assets.cross_icon}
              alt=""
              className="cursor-pointer"
              onClick={() => navigate("/course-list")}
            />
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:p-0">
          {filteredCourses.map((course, i) => (
            <CourseCard key={i} course={course} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CoursesList;
