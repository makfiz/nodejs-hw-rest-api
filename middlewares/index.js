const { newError } = require('../helpers/index');

function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(newError(400, error.message));
    }

    return next();
  };
}

module.exports = {
  validateBody,
};
