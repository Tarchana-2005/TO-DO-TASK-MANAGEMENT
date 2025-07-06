const Task = require("../models/Task");

// GET all tasks with pagination
exports.getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const totalTasks = await Task.countDocuments({ createdBy: req.userId });

    const tasks = await Task.find({ createdBy: req.userId })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      tasks,
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// CREATE a new task
exports.createTask = async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  console.log("Incoming Task Data:", req.body); // 👈 ADD this

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      createdBy: req.userId,  // <- if this is undefined you'll get a 500 error
    });

    const io = req.app.get("io");
    io.emit("taskCreated", task);

    res.json(task);
  } catch (err) {
    console.error("Error creating task:", err);  // 👈 See this in terminal
    res.status(500).json({ error: "Failed to create task" });
  }
};


// UPDATE a task
exports.updateTask = async (req, res) => {
  const { title, description, status, priority, dueDate, sharedWith } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        $set: { title, description, status, priority, dueDate, sharedWith },
      },
      { new: true }
    );

    const io = req.app.get("io");
    io.emit("taskUpdated", task);

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
};

// DELETE a task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    const io = req.app.get("io");
    io.emit("taskDeleted", { id: req.params.id });

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};
