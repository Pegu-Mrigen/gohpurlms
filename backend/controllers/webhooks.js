import { Webhook } from "svix";
import User from "../models/User.js";
export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    console.log(process.env.CLERK_WEBHOOK_SECRET);

    
      await whook.verify(JSON.stringify(req.body), {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
      });
      console.log("Webhook verified successfully!");
    

    console.log(req.headers);

    const { data, type } = req.body;

    console.log(data, type);

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.create(userData);

        res.json({});
      }
      case "user.updated": {
        const userData = {
          email: data.email_address[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json();
      }
      default:
        res.json();
        break;
    }

    console.log("first lorem..........");
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};
