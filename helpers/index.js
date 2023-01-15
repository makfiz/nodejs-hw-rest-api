function tryCatchWrapper(Fn) {
  return async (req, res, next) => {
    try {
      await Fn(req, res, next);
    } catch (error) {
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
