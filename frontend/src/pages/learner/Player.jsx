import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "./../../context/AppContext";
import { useParams } from "react-router-dom";
import { assets } from "./../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Footer from "./../../components/learner/Footer";
import Rating from "../../components/learner/Rating";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "./../../components/learner/Loading";

const Player = () => {
  const {
    enrolledCourses,
    calculateChapterTime,
    backendUrl,
    getToken,
    userDetails,
    fetchUserEnrolledCourses,
  } = useContext(AppContext);

  const { courseId } = useParams();

  const [courseDetails, setCourseDetails] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerDetails, setPlayerDetails] = useState(null);
  const [progressDetails, setProgressDetails] = useState(null);
  const [initialRating, setInitialRating] = useState(0);

  // const getCourseDetails = () => {
  //   enrolledCourses.map((course) => {
  //     if (course._id === courseId) {
  //       setCourseDetails(course);
  //     }
  //   });
  // };
  const getCourseDetails = () => {
    enrolledCourses.map((course) => {
      if (course._id === courseId) {
        setCourseDetails(course);

        course.courseRatings.map((item) => {
          if (item.userId === userDetails._id) {
            setIntialRating(item.rating);
          }
        });
      }
    });
  };

  const toggleSection = (i) => {
    setOpenSections((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseDetails();
    }
  }, [enrolledCourses]);

  const markCompleted = async (lectureId) => {
    try {
      const token = getToken();

      const { data } = await axios.post(
        backendUrl + "/api/user/update-course-progress",
        { courseId, lectureId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.msg);
        getCourseProgress();
      } else {
        toast.error(data.msg);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getCourseProgress = async () => {
    try {
      const token = getToken();

      const { data } = await axios.post(
        backendUrl + "/api/user/get-course-progress",
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.msg);

        setProgressDetails(data.progressDetails);
      } else {
        toast.error(data.msg);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };

  const handleRate = async (rating) => {
    try {
      const token = getToken();

      const { data } = await axios.post(
        backendUrl + "/api/user/add-rating",
        { courseId, rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.msg);

        fetchUserEnrolledCourses();
      } else {
        toast.error(data.msg);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getCourseProgress();
  }, []);
  return courseDetails ? (
    <>
      <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
        <div className="text-gray-800">
          <h2 className="text-xl  font-semibold">Course Structure</h2>
          <div className="pt-5">
            {courseDetails &&
              courseDetails.courseContent.map((chapter, index) => (
                <div
                  className="border border-gray-300 bg-white mb-2 rounded"
                  key={index}
                >
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-one"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={assets.down_arrow_icon}
                        alt=""
                        className={`transform transition-transform ${
                          openSections[index] ? "rotate-180" : ""
                        }`}
                      />
                      <p className="font-medium md:text-base text-sm">
                        {chapter.chapterTitle}
                      </p>
                    </div>

                    <p className="text-sm md:text-default">
                      {chapter.chapterContent.length} lectures -{" "}
                      {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openSections[index] ? "max-h-96" : "max-h-0"
                    } `}
                  >
                    <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                      {chapter?.chapterContent?.map((lecture, i) => (
                        <li key={i} className="flex items-start gap-2 py-1">
                          <img
                            src={
                              // false ? assets.blue_tick_icon : assets.play_icon
                              progressDetails &&
                              progressDetails.lectureComleted.includes(
                                lecture.lectureId
                              )
                                ? assets.blue_tick_icon
                                : assets.play_icon
                            }
                            alt=""
                            className="w-4 h-4 mt-1"
                          />
                          <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                            <p className="">{lecture?.lectureTitle}</p>
                            <div className="flex gap-2">
                              {lecture?.lectureUrl && (
                                <p
                                  onClick={() =>
                                    setPlayerDetails({
                                      ...lecture,
                                      chapter: index + 1,
                                      lecture: i + 1,
                                    })
                                  }
                                  className="text-blue-800 cursor-pointer"
                                >
                                  Watch
                                </p>
                              )}
                              <p>
                                {humanizeDuration(
                                  lecture.lectureDuration * 60 * 1000,
                                  { units: ["h", "m"] }
                                )}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>
          <div className="flex items-center gap-2 py-3 mt-10">
            <h1 className="text-xl">Rate this Course:</h1>
            {/* <Rating initialRating={0} /> */}
            <Rating onRate={handleRate} initialRating={initialRating} />
          </div>
        </div>

        <div className="md:mt-10">
          {playerDetails ? (
            <div>
              <YouTube
                videoId={playerDetails.lectureUrl.split("/").pop()}
                iframeClassName="w-full aspect-video"
              />
              <div className="flex justify-between items-center mt-1">
                <p className="">
                  {playerDetails.chapter}.{playerDetails.lecture}{" "}
                  {playerDetails.lectureTitle}
                </p>
                <button
                  onClick={() => markCompleted(playerDetails.lectureId)}
                  className="text-blue-600"
                >
                  {/* {false ? "Complted" : "Mark Complete"} */}
                  {progressDetails &&
                  progressDetails.lectureComleted.includes(
                    playerDetails.lectureId
                  )
                    ? "Completed"
                    : "Mark Complete"}
                </button>
              </div>
            </div>
          ) : (
            <img
              src={courseDetails ? courseDetails.courseThumbnail : ""}
              alt=""
              className=""
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default Player;
