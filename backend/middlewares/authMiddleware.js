import { clerkClient } from "@clerk/express";

export const protectTrainer= async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const res = await clerkClient.users.getUser(userId);

    if (res.publicMetadata.role !== "trainer") {
      return res.json({ success: false, msg: "Only Trainer can Access" });
    }

    next();
  } catch (e) {
    console.log(e);
    res.json({ success: false, msg: e.message });
  }
};
