import { Request, Response } from "express";
import { CreateWorkspaceDTO, inviteStatusDTO } from "../dto/workspace.dto";
import { Workspace, User } from "../models/allModels";
import logger from "../utils/logger";
import { ObjectId } from "mongoose";
import { sendEmail } from "../utils/emailService";

//@desc - Workspace creation
//@route - POST/api/workspace/create
export const createWorkspace = async (req: Request, res: Response) => {
  try {
    const { name }: CreateWorkspaceDTO = req.body;
    const userId = (req as any).user?.id;
    if (!userId) {
      process.env.NODE_ENV === "test"
        ? null
        : logger.warn(`user doesn't exist`);
      res.status(404).json({ message: "user doesn't exist" });
      return;
    }

    const workspace = await new Workspace({
      name,
      owner: userId,
      members: [{ user: userId, role: "admin" }],
    });
    await workspace.save();

    process.env.NODE_ENV === "test"
      ? null
      : logger.info(`new workspace created - ${workspace}`);
    res.status(200).json({ message: "workspace created successfully" });
  } catch (error) {
    process.env.NODE_ENV === "test"
      ? null
      : logger.error(`workspace creation error - ${error}`);
    res.status(500).json({ message: "an error occured" });
  }
};

//@desc - Retrieve workspace
//@route - GET/api/workspace/:workspaceId
export const getWorkspace = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    let workspace;

    if (!workspaceId) {
      workspace = await Workspace.find({});
    } else {
      workspace = await Workspace.findById(workspaceId);
    }

    if (!workspace) {
      process.env.NODE_ENV === "test"
        ? null
        : logger.warn(`workspace ${workspaceId} not found`);
      res.status(404).json({ message: "workspace doesn't exist" });
      return;
    }

    process.env.NODE_ENV === "test"
      ? null
      : logger.info(`workspace ${workspaceId} retrieved successfully`);
    res.status(200).json({ workspace });
  } catch (error) {
    process.env.NODE_ENV === "test"
      ? null
      : logger.error(`error retrieving workspace - ${error}`);
    res.status(500).json({ message: "an error occured" });
  }
};

//@desc - Retrieve all user workspace
//@route - GET/api/workspaces
export const getAllWorkspace = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const workspaces = await Workspace.find({});

    const userWorkspaces = workspaces.filter(
      (workspace: {
        name: string;
        owner: string;
        members: { user: ObjectId; role: string }[];
      }) => workspace.owner.toString() === userId
    );

    res.status(200).json({ data: userWorkspaces });
  } catch (error) {
    process.env.NODE_ENV === "test"
      ? null
      : logger.error(`error retrieving all workspace - ${error}`);
    res.status(500).json({ message: "an error occured" });
  }
};

//@desc - Delete workspace
//@route - DELETE/api/workspace/:workspaceId
export const deleteWorkspace = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const userId = (req as any).user?.id;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      process.env.NODE_ENV === "test"
        ? null
        : logger.warn(`workspace ${workspaceId} not found`);
      res.status(404).json({ message: "workspace doesn't exist" });
      return;
    }

    const isAdmin = workspace.members?.some(
      (member: { user: ObjectId; role: string }) =>
        member?.user?.toString() === userId && member?.role === "admin"
    );

    if (!isAdmin) {
      process.env.NODE_ENV === "test"
        ? null
        : logger.warn(`Unauthorise user - ${userId} not admin`);
      res.status(403).json({ message: "access denied" });
      return;
    }

    await Workspace.findByIdAndDelete(workspaceId);
    process.env.NODE_ENV === "test"
      ? null
      : logger.info(`workspace ${workspaceId} removed`);
    res.status(200).json({ message: "workspace deleted zuccessfully" });
  } catch (error) {
    process.env.NODE_ENV === "test"
      ? null
      : logger.error(`error retrieving workspace - ${error}`);
    res.status(500).json({ message: "an error occured" });
  }
};

//@desc - invite colleagues
//@rout - POST/api/workspace/:workspaceId/invite
export const inviteColleague = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const { email } = req.body;
    const userId = (req as any).user?.id;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      process.env.NODE_ENV === "test"
        ? null
        : logger.warn(`workspace ${workspaceId} not found`);
      res.status(404).json({ message: "workspace not found" });
      return;
    }

    const isAdmin = workspace.members.some(
      (member: { user: ObjectId; role: string }) =>
        member.user.toString() === userId.toString() && member.role === "admin"
    );
    if (!isAdmin) {
      process.env.NODE_ENV === "test"
        ? null
        : logger.warn(`Unauthorise attempt: user ${userId} is not admin`);
      res.status(403).json({ message: "access denied" });
      return;
    }

    const invitee = await User.findOne({ email });
    if (!invitee) {
      process.env.NODE_ENV === "test"
        ? null
        : logger.warn(`User not found, can't invite`);
      res.status(404).json({ message: "user not found" });
      return;
    }

    const isMember = workspace.members.some(
      (member: { user: ObjectId; role: string }) =>
        member.user.toString() === invitee._id.toString()
    );

    if (isMember || workspace.pendingInvites.includes(email)) {
      process.env.NODE_ENV === "test"
        ? null
        : logger.warn(`user ${invitee._id} is already a member or invited`);
      res.status(400).json({ message: "user is a member or invited" });
      return;
    }

    workspace.pendingInvites.push(email);
    await workspace.save();

    const inviteLink: string = `http://localhost:5430/api/workspace/workspaceId/join?email=${email}`;
    const subject: string = `You are invited to join ${workspace.name} workspace`;

    await sendEmail(email, subject, inviteLink);
    process.env.NODE_ENV === "test"
      ? null
      : logger.info(`user ${invitee._id} invited successfully`);
    res.status(200).json({ message: "user invited successfully", workspace });
  } catch (error) {
    process.env.NODE_ENV === "test"
      ? null
      : logger.error(`error inviting user ${error}`);
    res.status(500).json({ message: "an error occured" });
  }
};

//@desc - pt invitation
//@route - POST/api/workspace/:workspaceId/accept
export const inviteResponse = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const userId = (req as any).user?.id;
    const user = await User.findById(userId);
    const { inviteStatus }: inviteStatusDTO = req.body;
		const userEmail = user.email;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      process.env.NODE_ENV === "test"
        ? null
        : logger.warn(`workspace ${workspaceId} not found`);
      res.status(404).json({ message: "workspace not found" });
      return;
    }

    if (!workspace.pendingInvites.includes(userEmail)) {
      process.env.NODE_ENV === "test"
        ? null
        : logger.warn(`${userEmail} not invited to workspace ${workspaceId}`);
      res.status(400).json({ message: "user not invited" });
      return;
		}
		console.log(`${inviteStatus}`);
			
    if (inviteStatus === "accept") {
      workspace.members.push({ user: userId, role: "member" });
      workspace.pendingInvites = workspace.pendingInvites.filter(
        (email: string) => email !== userEmail
      );
			console.log('e don enter accept block');
			await workspace.save();
      process.env.NODE_ENV === "test"
        ? null
        : logger.info(`${userEmail} added to workspace ${workspaceId}`);
      res.status(200).json({ message: "user added successfully", workspace });
			return;
    } else if (inviteStatus === "reject") {
      workspace.pendingInvites = workspace.pendingInvites.filter(
        (email: string) => email !== userEmail
      );
			console.log("e enter reject o");
			await workspace.save();
      process.env.NODE_ENV === "test"
        ? null
        : logger.info(`${userEmail} rejected workspace ${workspaceId} invite`);
      res.status(200).json({ message: "invite rejected" });
			return;
    }

		res.status(400).json({ message: "invalid invite status" });
		return;
  } catch (error) {
    process.env.NODE_ENV === "test"
      ? null
      : logger.error(`error adding user - ${error}`);
    res.status(500).json({ message: "an error occured" });
  }
};
