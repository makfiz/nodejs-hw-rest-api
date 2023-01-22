const express = require('express');

const {
  signUp,
  login,
  logout,
  current,
  updateUserSubscription,
} = require('../../controllers/auth.controller');
const { tryCatchWrapper } = require('../../helpers');
const { validateBody, auth } = require('../../middlewares');

const { userSchema } = require('../../schemas/user');

const router = express.Router();

router.post('/signup', validateBody(userSchema), tryCatchWrapper(signUp));
router.post('/login', validateBody(userSchema), tryCatchWrapper(login));
router.get('/logout', tryCatchWrapper(auth), tryCatchWrapper(logout));
router.get('/current', tryCatchWrapper(auth), tryCatchWrapper(current));
router.patch(
  '/',
  tryCatchWrapper(auth),
  tryCatchWrapper(updateUserSubscription)
);

module.exports = router;
