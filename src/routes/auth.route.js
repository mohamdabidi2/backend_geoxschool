const { Router } = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { attachUser } = require("../middleware/auth.middleware");
const {
  bootstrapAdmin,
  login,
  me,
  logout,
} = require("../controllers/auth.controller");

const router = Router();

router.post(
  "/bootstrap",
  [
    body("secretKey").isString().notEmpty(),
    body("username").isString().trim().isLength({ min: 3 }),
    body("password").isString().isLength({ min: 6 }),
    body("name").optional().isString(),
  ],
  validate,
  bootstrapAdmin
);

router.post(
  "/login",
  [
    body("username").isString().notEmpty(),
    body("password").isString().notEmpty(),
  ],
  validate,
  login
);

router.post("/logout", logout);
router.get("/me", attachUser, me);

module.exports = router;


