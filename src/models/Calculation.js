const { Schema, model } = require("mongoose");

const operations = ["sum", "average", "max", "min"];

const calculationSchema = new Schema(
  {
    operation: {
      type: String,
      enum: operations,
      required: true,
    },
    values: {
      type: [Number],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "values must contain at least one number.",
      },
    },
    result: {
      type: Number,
      required: true,
    },
    computedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Calculation", calculationSchema);


