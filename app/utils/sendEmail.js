const logger = require("../config/logger");

/**
 * A mock email sending function.
 * In a real application, this would integrate with an email service provider.
 * @param {object} options - The email options.
 * @param {string} options.to - The recipient's email address.
 * @param {string} options.subject - The subject of the email.
 * @param {string} [options.text] - The plain text body of the email.
 * @param {string} [options.html] - The HTML body of the email.
 */
const sendEmail = async (options) => {
  // This is a mock. It logs the email to the console instead of sending it.
  logger.info("---- Sending Email ----");
  logger.info(`To: ${options.to}`);
  logger.info(`Subject: ${options.subject}`);
  if (options.text) {
    logger.info("Body (text):");
    logger.info(options.text);
  }
  if (options.html) {
    logger.info("Body (html):");
    logger.info(options.html);
  }
  logger.info("-----------------------");

  // In a real implementation, you would return information from the email provider.
  // For this mock, we'll just resolve to indicate success.
  return Promise.resolve();
};

module.exports = sendEmail;
