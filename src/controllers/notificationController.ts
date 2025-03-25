import { Request, Response } from "express";
import { User, Workspace } from "../models/allModels";
import logger from "../utils/logger";
import { ObjectId } from "mongoose";

//@desc - notify user of workspace invite
//@route - GET/api/notification/workspace-invites
export const inviteNotification = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const user = await User.findById(userId);
    if (!user) {
      process.env.NODE_ENV === "test" ? null : logger.warn(`no user found`);
      res.status(404).json({ message: "no user found" });
      return;
    }
    const userEmail = user?.email;

    const workspaces = await Workspace.find({});
    if (!workspaces) {
      process.env.NODE_ENV === "test"
        ? null
        : logger.warn("no workspace found");
      res.status(404).json({ message: "no workspace found" });
      return;
    }

    const inviteFrom = workspaces.filter(
      (workspace: {
        name: string;
        owner: ObjectId;
        members: { user: ObjectId; role: "admin" | "member" }[];
        pendingInvites: string[];
      }) => workspace.pendingInvites.includes(userEmail)
    );
    if (inviteFrom.length === 0) {
      process.env.NODE_ENV === "test" ? null : logger.warn(`no invites`);
      res.status(404).json({ message: "You have no invitation" });
			return;
    }

    process.env.NODE_ENV === "test"
      ? null
      : logger.info(
          `User ${user.name} has ${inviteFrom.length} workspace invites`
        );
    res.status(200).json({ message: `you have invites from`, workspace: inviteFrom });
  } catch (error) {
    process.env.NODE_ENV === "test"
      ? null
      : logger.error(`invite notification error - ${error}`);
    res.status(500).json({ message: "an error occured" });
  }
};
