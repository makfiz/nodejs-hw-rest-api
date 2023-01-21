const express = require('express');

const { signUp, login } = require('../../controllers/auth.controller');
const { tryCatchWrapper } = require('../../helpers');
const { validateBody } = require('../../middlewares');

const { userSchema } = require('../../schemas/user');

const router = express.Router();

router.post('/signup', validateBody(userSchema), tryCatchWrapper(signUp));
router.post('/login', validateBody(userSchema), tryCatchWrapper(login));
router.post('/logout', tryCatchWrapper());
router.get('/current', tryCatchWrapper());

module.exports = router;
