export const ApiResponse = {
  success: (res, message = 'Success', data = null, statusCode = 200, meta = null) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      ...(meta && { meta }),
    });
  },

  error: (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(errors && { errors }),
    });
  },
};

export default ApiResponse;
