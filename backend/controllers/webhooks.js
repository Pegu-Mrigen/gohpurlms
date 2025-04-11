import { Webhook } from "svix";
import User from "../models/User.js";
import { Stripe } from "stripe";
import Purchase from "./../models/Purchase.js";
import Course from "./../models/Course.js";
export const clerkWebhooks = async (req, res) => {
  const payload = JSON.stringify(req.body);
  const headers = {
    "svix-id": req.headers["svix-id"],
    "svix-timestamp": req.headers["svix-timestamp"],
    "svix-signature": req.headers["svix-signature"],
  };

  const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

  let evt;
  try {
    evt = await whook?.verify(payload, headers);
    console.log("Webhook verified successfully!");

    const { data, type } = req.body;
    //const { data } = req.body;

    switch (evt?.type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.create(userData);

        res.json({});
        break;
      }
      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }
      default:
        console.log("first lorem..........");

        res.json();
        break;
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ success: false, message: "verified failldfdfll!" });
  }
};

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = Stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log("PaymentIntent was successful!");

      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { purchaseId } = session.data[0].metadata;

      const purchaseDetails = await Purchase.findById(purchaseId);

      const userDetails = await User.findById(purchaseDetails.userId);

      const courseDetails = await Course.findById(
        purchaseDetails.courseId.toString()
      );

      courseDetails.enrolledStudents.push(userDetails);

      await courseDetails.save();

      userDetails.enrolledCourses.push(courseDetails._id);

      await userDetails.save();

      purchaseDetails.status = "completed";

      await purchaseDetails.save();
      break;
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      console.log("PaymentIntent was successful!");

      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { purchaseId } = session.data[0].metadata;

      const purchaseDetails = await Purchase.findById(purchaseId);

      purchaseDetails.status = "failed";

      await purchaseDetails.save();

      break;
    }
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({ received: true });
};
