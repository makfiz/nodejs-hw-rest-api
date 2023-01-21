const express = require("express");

const { signUp } = require("../../controllers/auth.controller");
const { tryCatchWrapper } = require("../../helpers");
const { validateBody } = require('../../middlewares');

const {newUserSchema} = require("../../schemas/user");

const router = express.Router();

router.post("/signup", validateBody(newUserSchema), tryCatchWrapper(signUp));
router.post("/login", tryCatchWrapper());
router.post("/logout", tryCatchWrapper());
router.get("/current", tryCatchWrapper());

module.exports = router