function tryCatchWrapper(Fn) {
  return async (req, res, next) => {
    try {
      await Fn(req, res, next);
    } catch (error) {
      if (error.message.includes("Cast to ObjectId failed for value")) {
        return res.status(404).json({
          message: "Not found",
        });
      }
      return next(error);
    }
  };
}

function newError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

module.exports = {
  tryCatchWrapper,
  newError,
};
