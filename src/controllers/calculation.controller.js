const Calculation = require("../models/Calculation");

const operations = {
  sum: (values) => values.reduce((acc, value) => acc + value, 0),
  average: (values) =>
    values.reduce((acc, value) => acc + value, 0) / values.length,
  max: (values) => Math.max(...values),
  min: (values) => Math.min(...values),
};

function normalizeValues(payloadValues) {
  if (!Array.isArray(payloadValues)) {
    return [];
  }

  return payloadValues
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));
}

async function listCalculations(_req, res, next) {
  try {
    const calculations = await Calculation.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      count: calculations.length,
      data: calculations,
    });
  } catch (error) {
    next(error);
  }
}

async function createCalculation(req, res, next) {
  try {
    const operation = req.body?.operation;
    const values = normalizeValues(req.body?.values);

    if (!operation || !operations[operation]) {
      return res.status(400).json({
        error: "Provide a valid operation: sum, average, max, or min.",
      });
    }

    if (values.length === 0) {
      return res.status(400).json({
        error: "Send at least one numeric value.",
      });
    }

    const result = Number(operations[operation](values).toFixed(4));
    const calculation = await Calculation.create({
      operation,
      values,
      result,
    });

    res.status(201).json({
      message: "Calculation stored successfully.",
      data: calculation,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listCalculations,
  createCalculation,
};


