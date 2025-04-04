import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createContext } from "react";

import { dummyCourses } from "../assets/assets";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState([]);
  const [isTrainer, setIsTrainer] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const fetchAllCourses = async () => {
    setAllCourses(dummyCourses);
  };

  const calculateRating = (course) => {
    if (course?.courseRatings?.length === 0) {
      return 0;
    }

    let totalRating = 0;
    course?.courseRatings?.forEach((item) => {
      totalRating += item.rating;
    });

    return totalRating / course?.courseRatings?.length;
  };

  const calculateChapterTime = (chapter) => {
    let time = 0;

    chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { units: ["h", ["m"]] });
  };

  const calculateCourseDuration = (course) => {
    let time = 0;

    course.courseContent.map((chapter) =>
      chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration))
    );

    return humanizeDuration(time * 60 * 1000, { units: ["h", ["m"]] });
  };

  const calculateTotalLectures = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };

  const fetchUserEnrolledCourses = async () => {
    setEnrolledCourses(dummyCourses);
  };

  useEffect(() => {
    fetchAllCourses();
    fetchUserEnrolledCourses();
  }, []);
  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isTrainer,
    setIsTrainer,
    calculateChapterTime,
    calculateCourseDuration,
    calculateTotalLectures,
    fetchUserEnrolledCourses,
    enrolledCourses,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
