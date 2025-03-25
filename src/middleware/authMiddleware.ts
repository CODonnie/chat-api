import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";
import permittedActions from "../config/rbacConfig";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token =
    req.cookies.chatApiToken || req.headers?.authorization?.split(" ")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        role: string;
      };
      req.user = { id: decoded.id, role: decoded.role };
      next();
    } catch (error) {
      logger.error(`auth error - ${error}`);
      res.status(500).json({ message: "an error occured" });
    }
  } else {
    logger.warn("Unauthorised user - no token provided");
    res.status(403).json({ message: "access denied" });
		return;
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
		if (!req.user || !roles.includes(req.user?.role)){
			logger.warn(`Unauthorised access attempt by ${req.user?.id} ${req.user?.role}`);
			res.status(403).json({ message: "access denied" });
			return;
		}

		next();
	};
};

export const permitted = (action: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role;
    if (permittedActions[userRole].includes(action)) next();

    logger.warn(`Unauthorised action attempt from ${req.user?.id}`);
    res.status(403).json({ message: "access denied" });
		return;
  };
};
