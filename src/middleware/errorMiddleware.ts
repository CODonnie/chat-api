import { Request, Response, NextFunction } from "express";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
	res.status(404).json({message: `Resources not found - ${req.originalUrl}`});
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	let message = err.message;

	if(err.name === "CastError" && err.kind === "ObjectId"){
		statusCode = 404;
		message = "no resources found";
	} else if (err.name === "ValidationError"){
		statusCode = 500;
		message = err.message
	}

	res.status(statusCode).json({
		message,
		stack: process.env.NODE_ENV === "production" ? null : err.stack
	});
}
