const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const calculationsRouter = require("./routes/calculation.route");
const systemRouter = require("./routes/system.route");
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");
const errorHandler = require("./middleware/errorHandler");
const { attachUser } = require("./middleware/auth.middleware");

const rawOrigins = process.env.CLIENT_ORIGINS || "http://localhost:3000";
const allowedOrigins = rawOrigins
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowAllOrigins = allowedOrigins.includes("*");

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        allowAllOrigins ||
        !origin ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, origin || true);
      }
      const error = new Error("Not allowed by CORS");
      error.statusCode = 403;
      return callback(error);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(attachUser);

app.use("/api/system", systemRouter);
app.use("/api/calculations", calculationsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.use("*", (_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

module.exports = app;


