import User from "./../models/User.js";
import { Stripe } from "stripe";
import Purchase from "./../models/Purchase.js";
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
