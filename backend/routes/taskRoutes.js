const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const verifyToken = require("../middlewares/verifyToken");
const { body, validationResult } = require("express-validator");

// Validation middleware for Create Task
const validateCreateTask = [
  body("title").notEmpty().withMessage("Title is required"),
  body("status")
    .isIn(["pending", "in progress", "completed"])
    .withMessage("Invalid status value"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validation middleware for Update Task
const validateUpdateTask = [
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("status")
    .optional()
    .isIn(["pending", "in progress", "completed"])
    .withMessage("Invalid status value"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Routes
router.get("/", verifyToken, taskController.getTasks);
router.post("/create", verifyToken, validateCreateTask, taskController.createTask);
router.put("/update/:id", verifyToken, validateUpdateTask, taskController.updateTask);
router.delete("/:id", verifyToken, taskController.deleteTask);

module.exports = router;
