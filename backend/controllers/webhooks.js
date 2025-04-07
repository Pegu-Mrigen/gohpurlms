import { Webhook } from "svix";
import User from "../models/User.js";
export const clerkWebhooks = async (req, res) => {
  try {
    const webhookSecret = "whsec_ct2NJFEKDzIhl0a3Hq309wt9HcfGbLXh";
    // const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const whook = new Webhook(webhookSecret);
    console.log(process.env.CLERK_WEBHOOK_SECRET);
    console.log(req.headers);

    try {
      const payload = JSON.stringify(req.body);
      const headers = {
        "svix-id": req.headers["svix-id"] || "",
        "svix-timestamp": req.headers["svix-timestamp"] || "",
        "svix-signature": req.headers["svix-signature"] || "",
      };

      if (!headers) {
        res.json("NO HEADERS");
      }

      let evt;
      try {
        evt = whook.verify(payload, headers);
        console.log("Webhook verified successfully!");
      } catch (e) {
        console.log(e);
      }
    } catch (error) {
      console.error("Webhook verification failed:", error.message);
      return res
        .status(400)
        .json({ success: false, message: "Invalid webhook signature" });
    }

    const { data, type } = req.body;

    console.log(data, type);

    switch (evt.type) {
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
          email: data.email_address[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json();
        break;
      }
      default:
        console.log("first lorem..........");
        res.json();
        break;
    }
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};
