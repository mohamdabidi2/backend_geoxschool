const { Router } = require("express");
const {
  listCalculations,
  createCalculation,
} = require("../controllers/calculation.controller");

const router = Router();

router.get("/", listCalculations);
router.post("/", createCalculation);

module.exports = router;


