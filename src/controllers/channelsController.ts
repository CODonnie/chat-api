import { Request, Response } from "express";
import { Workspace, Channel } from "../models/allModels";
import { logFormat } from "../utils/logFormat";

//@desc - create workspace channel
//@route - POST/api/channel/create/:workspaceId
export const createChannel = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const { workspaceId } = req.params;
    const userId = (req as any).user?.id;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      logFormat("warn", `workspace ${workspaceId} not found`);
      res.status(404).json({ message: "workspace not found" });
      return;
    }

    const channel = new Channel({
      name,
      workspace: workspaceId,
      createdBy: userId,
    });
    await channel.save();
    logFormat("inro", `channel ${name} created`);
    res.status(201).json({ message: "channel created successfully" });
  } catch (error) {
    logFormat("error", `channel creation error - ${error}`);
    res.status(500).json({ message: "an error occured" });
  }
};

//@desc - get all channela in a workspace
//@route - GET/api/channel/get/:workspaceId
export const getChannels = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      logFormat("warn", `workspace ${workspaceId} not found`);
      res.status(404).json({ message: "workspace not found" });
      return;
    }

    const channels = await Channel.find({ workspace: workspaceId });
    if (!channels) {
      logFormat("warn", `no channel found in workspace ${workspaceId}`);
      res.status(404).json({ message: "no channel in workspace" });
      return;
    }

    logFormat("info", `Channels retrieved successfully`);
    res.status(200).json({ channels: channels });
  } catch (error) {
    logFormat("error", `channel retrieval error - ${error}`);
    res.status(500).json({ message: "an error occured" });
  }
};

//@desc - delete channel
//@route - DELETE/api/channel/delete/:channelId
export const deleteChannel = async (req: Request, res: Response) => {
  try {
    const { channelId } = req.params;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      logFormat("warn", `channel ${channelId} not found`);
      res.status(404).json({ message: "channel not found" });
      return;
    }

    await Channel.findByIdAndDelete(channelId);
    logFormat("info", `channel ${channelId} deleted`);
    res.status(200).json({ message: "channel deleter" });
  } catch (error) {
    logFormat("error", `channel removal error - ${error}`);
    res.status(500).json({ message: "an error occured" });
  }
};
