const winston = require("winston");

const { combine, timestamp, printf, colorize, align } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp: logTimestamp }) => {
  return `${logTimestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss.SSS",
    }),
    align(),
    logFormat,
  ),
  transports: [new winston.transports.Console()],
  // Do not exit on handled exceptions
  exitOnError: false,
});

// Create a stream object with a 'write' function that will be used by morgan
logger.stream = {
  write: (message) => {
    // Use the 'info' level so the output will be picked up by both transports (console and file)
    logger.info(message.trim());
  },
};

module.exports = logger;
