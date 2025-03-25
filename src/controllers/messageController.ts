import { Request, Response } from "express";
import { Channel, Message } from "../models/allModels";
import { logFormat } from "../utils/logFormat";
import { io } from "../app";

//@desc - send message
//@route - POST/api/message
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { content, channelId } = req.body;
    const sender = (req as any).user?.id;

    if (!sender) {
      logFormat("warn", `Unauthorised user`);
      res.status(403).json({ message: "access denied" });
      return;
    }

    const channel = await Channel.findById(channelId);
    if (!channel) {
      logFormat("warn", `channel ${channelId} not found`);
      res.status(404).json({ message: "channel not found" });
      return;
    }
    const workspace = channel.workspace;

    const message = new Message({
      content,
      sender,
      channel: channelId,
      workspace,
    });
    await message.save();

    io.to(channelId).emit("receiveMessage", {
      sender,
      content: message.content,
      createdAt: message.createdAt,
    });

    logFormat("info", `message ${content} sent`);
    res.status(200).json({ message: "message created and sent" });
  } catch (error) {
    logFormat("error", `message send error - ${error}`);
    res.status(500).json({ message: "an error occured" });
  }
};

//@desc - get all messages in channel
//@route - GET/api/message/:channelId
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { channelId } = req.params;

    const messages = await Message.find({ channel: channelId })
		.populate("sender", "name email").sort({ createdAt: "asc" });
    if (!messages) {
      logFormat("warn", `no message in channel`);
      res.status(404).json({ message: "no message in channel" });
      return;
    }

    logFormat("info", `messages retrieved successfully`);
    res.status(200).json({ messages });
  } catch (error) {
    logFormat("error", `error retrieving messages - ${error}`);
    res.status(500).json({ message: "an erroe occured" });
  }
};
