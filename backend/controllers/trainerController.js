import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import Purchase from "../models/Purchase.js";
import User from "./../models/User.js";

export const updateRoleToTrainer = async (req, res) => {
  try {
    const userId = req.auth.userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "trainer",
      },
    });

    res.json({ success: true, msg: "You can publish course now" });
  } catch (e) {
    console.log(e);
    res.json({ success: false, msg: e.message });
  }
};

export const addCourse = async (req, res) => {
  try {
    const { courseDetails } = req.body;
    const imgFile = req.file;
    const trainerId = req.auth.userId;

    if (!imgFile) {
      return res.json({ success: false, msg: "Thumbnail Not Attached" });
    }

    const parsedCourseData = await JSON.parse(courseDetails);

    parsedCourseData.trainer = trainerId;
    const newCourse = await Course.create(parsedCourseData);

    const imgUpload = await cloudinary.uploader.upload(imgFile.path);

    newCourse.courseThumbnail = imgUpload.secure_url;

    await newCourse.save();

    res.json({
      success: true,
      msg: "Course Added",
    });
  } catch (e) {
    console.log(e);
    res.json({
      success: false,
      msg: e.message,
    });
  }
};

export const getTrainerCourses = async (req, res) => {
  try {
    const trainer = req.auth.userId;
    const courses = await Course.find({ trainer });

    res.json({ success: true, courses });
  } catch (e) {
    console.log(e);

    res.json({
      success: false,
      msg: e.message,
    });
  }
};

export const trainerDashboardData = async (req, res) => {
  try {
    const trainer = req.auth.userId;
    const courses = await Course.find({ trainer });

    const totalCourses = curses.length;

    const courseIds = courses.map((course) => course._id);

    const r = await Purchase.find({
      courseId: { $in: courseIds },
      success: "completed",
    });

    const totalEarnings = r.reduce((sum, purchase) => sum + purchase.amount, 0);

    //FOR COLLECTING STUDNETS ID'S FOR A SPECIFIC COURSE
    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find(
        {
          _id: { $in: course.enrolledStudents },
        },
        "name imgUrl"
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
      },
    });
  } catch (e) {
    console.log(e);

    res.json({
      success: false,
      msg: e.message,
    });
  }
};

export const getEnrolledStudentsData = async (req, res) => {
  try {
    const trainer = req.auth.userId;
    const courses = await Course.find({ trainer });
    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      success: "completed",
    })
      .populate("userId", "name imgUrl")
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    res.json({ success: true, enrolledStudents });
  } catch (e) {
    console.log(e);
    res.json({ success: false, msg: e.message });
  }
};
