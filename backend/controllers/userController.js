import User from "./../models/User.js";
import { Stripe } from "stripe";
import Purchase from "./../models/Purchase.js";
import { CourseProgress } from "../models/CourseProgress.js";
import Course from "./../models/Course.js";

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, msg: "User not found " });
    }

    res.json({ success: true, user });
  } catch (e) {
    console.log(e);
    res.json({ success: false, msg: e.message });
  }
};

export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const userDetails = await User.findById(userId).populate("enrolledCourses");
    res.json({ success: true, enrolledCourses: userDetails?.enrolledCourses });
  } catch (e) {
    console.log(e);
    res.json({ success: false, msg: e.message });
  }
};

export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const userId = req.auth.userId;
    const userDetails = await User.findById(userId);
    const courseDetails = await Course.findById(courseId);
    if (!userDetails || !courseDetails) {
      return res.json({ success: false, msg: "No data Found!" });
    }

    const purchaseDetails = {
      courseId: courseDetails._id,
      userId,
      amount: (
        courseDetails.coursePrice -
        (courseDetails.discount * courseDetails.coursePrice) / 100
      ).toFixed(2),
    };

    const newPurchase = await Purchase.create(purchaseDetails);

    //STRIPE GATEWAY INITIALIZE

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const currency = process.env.CURRENCY.toLowerCase();

    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseDetails.courseTitle,
          },
          unit_amount: Math.floor(newPurchase.amount) * 100,
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items: line_items,
      mode: "payment",
      metadata: {
        purchased: newPurchase._id.toString(),
      },
    });
    res.json({ success: true, session_url: session.url });
  } catch (e) {
    res.json({ success: false, msg: e.message });
  }
};

export const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId, lectureId } = req.body;
    const progressDetails = await CourseProgress.findOne({ userId, courseId });

    if (progressDetails) {
      if (progressDetails.lectureCompleted.includes(lectureId)) {
        return res.json({ success: true, msg: "Lecture already completed" });
      }
      progressDetails.lectureCompleted.push(lectureId);

      await progressDetails.save();
    } else {
      await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    }
    res.json({ success: true, msg: "Progress updated" });
  } catch (e) {
    res.json({ success: false, msg: e.message });
  }
};

export const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId } = req.body;
    const progressDetails = await CourseProgress.findOne({ userId, courseId });

    res.json({ success: true, progressDetails });
  } catch (e) {
    res.json({ success: false, msg: e.message });
  }
};

export const addUserRating = async (req, res) => {
  const userId = req.auth.userId;
  const { courseId, rating } = req.body;
  if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
    res.json({ success: false, msg: "Invalied Details" });
  }
  try {
    const course = await Course.findById(courseId);
    if (!courseId) {
      return res.json({ success: false, msg: "Course not found" });
    }
    const user = await User.findById(userId);
    if (!user || !user.enrolledCourses.includes(courseId)) {
      return res.json({
        success: false,
        msg: "User has not purchased the course",
      });
    }

    const existingRatingIndex = course.courseRatings.findIndex(
      (r) => r.userId === userId
    );
    if (existingRatingIndex > -1) {
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      course.courseRatings.push({ userId, rating });
    }

    await course.save();
  } catch (e) {
    res.json({ success: false, msg: e.message });
  }
};
