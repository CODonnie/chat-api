import logger from "./logger"

export const logFormat = (condition: string, message: string) => {
	if (condition === "warn") process.env.NODE_ENV === "test" ? null : logger.warn(message);
	if (condition === "info") process.env.NODE_ENV === "test" ? null : logger.info(message);
	if (condition === "error") process.env.NODE_ENV === "test" ? null : logger.error(message);
}
