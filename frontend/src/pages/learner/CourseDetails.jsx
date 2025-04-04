import React from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useContext, useEffect } from "react";
import { AppContext } from "./../../context/AppContext";
import Loading from "./../../components/learner/Loading";
import { assets } from "./../../assets/assets";
import humanizeDuration from "humanize-duration";
import Footer from "./../../components/learner/Footer";
import YouTube from "react-youtube";

const CourseDetails = () => {
  const { id } = useParams();

  const [courseDetails, setCourseDetails] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  const {
    allCourses,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateTotalLectures,
    currency,
  } = useContext(AppContext);

  const fetchCourseDetails = async () => {
    const courseDetailsFetched = allCourses?.find(
      (course) => course._id === id
    );
    setCourseDetails(courseDetailsFetched);
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [allCourses]);

  // console.log(courseDetails);
  // console.log(allCourses);

  const toggleSection = (i) => {
    setOpenSections((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  return courseDetails ? (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-32 pt-20 text-left">
        <div className="absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70"></div>
        <div className="max-w-xl z-10 to-gray-500">
          <h className="md:text-course-details-heading-large  text-course-details-heading-small font-semibold text-gray-800">
            {courseDetails.courseTitle}
          </h>
          <p
            className="pt-4 md:text-base text-sm"
            dangerouslySetInnerHTML={{
              __html: courseDetails?.courseDescription?.slice(0, 200),
            }}
          ></p>

          {/* RIVIEW & RATING */}
          <div className="flex items-center space-x-2 pt-3 pb-1 text-sm ">
            <p className="">{calculateRating(courseDetails)}</p>

            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.ceil(calculateRating(courseDetails))
                      ? assets.star
                      : assets.star_blank
                  }
                  alt=""
                  className="w-3.5 h-3.5"
                />
              ))}
            </div>

            <p className="text-blue-500">
              {courseDetails.courseRatings.length} (
              {courseDetails.length > 1 ? "ratings" : "rating"})
            </p>
            <p className="">
              {courseDetails.enrolledStudents.length}
              {courseDetails.length > 1 ? " learners" : " learner"}
            </p>
          </div>
          <p className="text-sm">
            Course by{" "}
            <span className="text-blue-800 underline">Appun Pegu</span>
          </p>
          <div className="pt-8">
            <h2 className="text-xl font-semibold">Course Stucture</h2>
            <div className="pt-5">
              {courseDetails.courseContent.map((chapter, i) => (
                <div
                  className="border border-gray-300 bg-white mb-2 rounded"
                  key={i}
                >
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-one"
                    onClick={() => toggleSection(i)}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={assets.down_arrow_icon}
                        alt=""
                        className={`transform transition-transform ${
                          openSections[i] ? "rotate-180" : ""
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
                      openSections[i] ? "max-h-96" : "max-h-0"
                    } `}
                  >
                    <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-start gap-2 py-1">
                          <img
                            src={assets.play_icon}
                            alt=""
                            className="w-4 h-4 mt-1"
                          />
                          <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                            <p className="">{lecture.lectureTitle}</p>
                            <div className="flex gap-2">
                              {lecture.isPreviewFree && (
                                <p
                                  onClick={() =>
                                    setPlayerData({
                                      videoId: lecture.lectureUrl
                                        .split("/")
                                        .pop(),
                                    })
                                  }
                                  className="text-blue-800 cursor-pointer"
                                >
                                  Preview
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
          </div>
          <div className=" py-20 text-sm md:text-default">
            <h3 className="text-xl font-semibold to-gray-600">
              Course Description
            </h3>
            <p
              className="pt-3 rich-text"
              dangerouslySetInnerHTML={{
                __html: courseDetails.courseDescription,
              }}
            ></p>
          </div>
        </div>
        <div className="max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]">
          {playerData ? (
            <YouTube
              videoId={playerData.videoId}
              options={{ playerVars: { autoplay: 1 } }}
              iframeClassName="w-full aspect-video"
            />
          ) : (
            <img src={courseDetails.courseThumbnail} alt="" className="" />
          )}{" "}
          <div className="p-5">
            <div className=" flex items-center gap-2">
              <img src={assets.time_left_clock_icon} alt="" className="w-3.5" />
              <p className="text-red-500">
                <span className="font-medium">5 days </span>left at this price!
              </p>
            </div>
            <div className="  flex gap-3 items-center pt-2">
              <p className="to-gray-800 md:text-4xl text-2xl font-semibold">
                {currency}{" "}
                {(
                  courseDetails.coursePrice -
                  (courseDetails.discount * courseDetails.coursePrice) / 100
                ).toFixed(2)}
              </p>
              <p className="md:text-lg text-gray-500 line-through">
                {currency} {courseDetails.coursePrice}
              </p>
              <p className="md:text-lg text-gray-500">
                {courseDetails.discount} % off
              </p>
            </div>
            <div className="flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500">
              <div className="flex items-center gap-1">
                <img src={assets.star} alt="" className="" />
                <p className="">{calculateRating(courseDetails)}</p>
              </div>
              <div className="h-4 w-px bg-gray-400/30"></div>
              <div className="flex items-center gap-1">
                <img src={assets.time_clock_icon} alt="" className="" />
                <p className="">{calculateCourseDuration(courseDetails)} </p>
              </div>
              <div className="h-4 w-px bg-gray-400/30"></div>
              <div className="flex items-center gap-1">
                <img src={assets.lesson_icon} alt="" className="" />
                <p className="">{calculateRating(courseDetails)} lessons</p>
              </div>
            </div>
            <button className="md:mt-6 mt-4 w-full py-3 rounded bg-blue-500 text-white font-medium">
              {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
            </button>
            <div className="pt-6">
              <p className="md:text-xl text-lg font-medium text-gray-500">
                What's in the course?
              </p>
              <ul className="ml-4 pt-2 text-sm md:text-default list-disc text-gray-500">
                <li className="">Lifetime access with free updates.</li>
                <li className="">Step-by-step, hands on project guidance.</li>
                <li className="">Downloadable resources and source code.</li>
                <li className="">Quizzes to test your knowledge.</li>
                <li className="">Certificate of completion.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;
