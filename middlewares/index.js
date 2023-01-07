function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(() => {
        const err = new Error(error.message);
        err.status = 400;
        return err;
      });
    }

    return next();
  };
}

module.exports = {
  validateBody,
};
