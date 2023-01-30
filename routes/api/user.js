const express = require('express');

const {
  signUp,
  login,
  logout,
  current,
  updateUserSubscription,
  updateUserAvatar,
} = require('../../controllers/user.controller');
const { tryCatchWrapper } = require('../../helpers');
const { validateBody, auth, upload } = require('../../middlewares');

const { userSchema, userSubscriptionSchema } = require('../../schemas/user');

const router = express.Router();

router.post('/signup', validateBody(userSchema), tryCatchWrapper(signUp));
router.post('/login', validateBody(userSchema), tryCatchWrapper(login));
router.get('/logout', tryCatchWrapper(auth), tryCatchWrapper(logout));
router.get('/current', tryCatchWrapper(auth), tryCatchWrapper(current));
router.patch(
  '/', validateBody(userSubscriptionSchema),
  tryCatchWrapper(auth),
  tryCatchWrapper(updateUserSubscription)
);
router.patch(
  '/avatars', tryCatchWrapper(auth), 
  tryCatchWrapper(upload.single("avatar")),
  tryCatchWrapper(updateUserAvatar)
);

module.exports = router;
