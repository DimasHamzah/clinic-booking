const sendSuccess = (res, message, data, statusCode = 200) => {
  const response = {
    success: true,
    status: "success",
    message,
    data,
  };

  res.status(statusCode).json(response);
};

module.exports = { sendSuccess };
