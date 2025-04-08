import { Webhook } from "svix";
import User from "../models/User.js";
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
