// Load environment variables from .env file
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const rateLimit = require("express-rate-limit");  // ✅ added this
const { createServer } = require("http");
const { Server } = require("socket.io");

// Load Passport config
require("./config/passport");

const app = express();
const httpServer = createServer(app); // ✅ Create HTTP server for socket.io

// ✅ Rate limiting middleware: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter); // ✅ apply globally

// Middleware
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Todo Backend is running 🚀");
});

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

io.on("connection", (socket) => {
  console.log("✅ New WebSocket client connected");
});

// Make io available globally (for controllers)
app.set("io", io);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
