import Course from "../models/Course.js";

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents"])
      .populate({ path: "trainer" });
    res.json({ status: true, courses });
  } catch (e) {
    console.log(e);
    res.json({ status: false, msg: e.message });
  }
};

export const getCoursesById = async (req, res) => {
  const { id } = req.params;
  try {
    const courseDetails = await Course.findById(id).populate({
      path: "trainer",
    });

    //IF PREVIEW IS NOT AVAILABLE

    courseDetails.courseContent.forEach((lecture) => {
      if (!lecture.isPreviewFree) {
        lecture.lectureUrl = "";
      }
    });

    res.json({ status: true, courseDetails });
  } catch (e) {
    console.log(e);
    res.json({ status: false, msg: e.message });
  }
};

