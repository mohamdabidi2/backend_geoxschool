const { Router } = require("express");
const { body } = require("express-validator");
const { requireAuth, requireRole, attachUser } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate");
const { listUsers, createUser } = require("../controllers/user.controller");

const router = Router();

router.use(attachUser, requireAuth, requireRole(["ADMIN"]));

router.get("/", listUsers);

router.post(
  "/",
  [
    body("username").isString().trim().isLength({ min: 3 }),
    body("password").isString().isLength({ min: 6 }),
    body("role").isIn(["ADMIN", "TEACHER", "STUDENT", "PARENT", "STAFF"]),
    body("name").optional().isString(),
    body("surname").optional().isString(),
    body("email").optional().isEmail(),
    body("phone").optional().isString(),
  ],
  validate,
  createUser
);

module.exports = router;


