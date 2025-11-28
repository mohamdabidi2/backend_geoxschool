const { Schema, model } = require("mongoose");

const sessionSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    userAgent: String,
    ipAddress: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Session", sessionSchema);


