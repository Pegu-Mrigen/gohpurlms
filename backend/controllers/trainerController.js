import { clerkClient } from "@clerk/express";

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
