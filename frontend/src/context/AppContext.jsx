import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { createContext } from "react";

import { dummyCourses } from "../assets/assets";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();
  const { getToken } = useAuth();

  const { user } = useUser();

  const [allCourses, setAllCourses] = useState([]);
  const [isTrainer, setIsTrainer] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userDetails, setUserDetails] = useState(null);

  console.log(allCourses);

  console.log(userDetails);

  const fetchAllCourses = async () => {
    //setAllCourses(dummyCourses);
    try {
      const { data } = await axios.get(backendUrl + "/api/course/all");

      console.log(data);

      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };

  const fetchUserDetails = async () => {
    if (user.publicMetadata.role === "trainer") {
      setIsTrainer(true);
    }
    try {
      const token = await getToken();

      const { data } = await axios.get(backendUrl + "/api/user/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUserDetails(data.user);
      } else {
        toast.error(data.msg);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };

  const calculateRating = (course) => {
    if (course?.courseRatings?.length === 0) {
      return 0;
    }

    let totalRating = 0;
    course?.courseRatings?.forEach((item) => {
      totalRating += item.rating;
    });

    // return totalRating / course?.courseRatings?.length;
    return Math.ceil(totalRating / course?.courseRatings?.length);
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
    //setEnrolledCourses(dummyCourses);

    try {
      const token = await getToken();

      const { data } = await axios.get(
        backendUrl + "/api/user/enrolled-courses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setEnrolledCourses(data?.enrolledCourses?.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  // const logToken = async () => {
  //   console.log(await getToken());
  // };

  useEffect(() => {
    if (user) {
      fetchUserDetails();
      fetchUserEnrolledCourses();
    }
  }, [user]);
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
    backendUrl,
    userDetails,
    setUserDetails,
    getToken,
    fetchAllCourses,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
