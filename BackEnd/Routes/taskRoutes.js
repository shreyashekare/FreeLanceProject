const db = require("../models");
const express = require("express");
const multer = require("multer");
const { Op } = require("sequelize");

const Task = db.task;
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadStorage = multer({ storage: storage });

// Single file
router.post("/upload", uploadStorage.single("file"), async (req, res) => {
  try {
    const {
      project_id,
      parentTask,
      task,
      taskDetail,
      startDate,
      endDate,
      estimatedHour,
      status,
      employee_id,
      approver,
    } = req.body;
    const attachment = req.file ? req.file.filename : null;
    // if (!selectedFile) {
    //   throw new Error("File not uploaded.");
    // }
    const assigntask = Task.create({
      project_id,
      parentTask,
      task,
      taskDetail,
      startDate,
      endDate,
      estimatedHour,
      status,
      employee_id,
      approver,
      attachment,
    });

    return res.status(201).json(assigntask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

////////////////////////// Api to get all AssignTask  //////////////////////////

router.get("/getTask", async (req, res) => {
  try {
    const task = await Task.findAll({
      include: [
        {
          model: db.project,
          as: "projectDetails",
        },
      ],
    });

    // Send the retrieved designations as a JSON response
    res.json({
      status: "Success",
      data: task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});

///////////////// update task status ///////////////////
router.patch("/updatetaskStatus/:taskId", async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { status } = req.body;

    if (!taskId || !status) {
      return res.status(400).json({ error: "Task ID or status not provided" });
    }
    // Update the task status
    const updatedTask = await Task.update(
      { status: status },
      { where: { id: taskId } }
    );

    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

////////////////// fetch task  according employee //////////////////////
// router.get("/fetchTask/:id", async (req, res) => {
//   try {
//     // Fetch tasks assigned to the specific employee
//     const tasks = await Task.findAll({ where: { employee_id: employeeId } });

//     res.json({ tasks });
//   } catch (error) {
//     console.error("Error fetching tasks:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.get("/fetchTask/:id", async (req, res) => {
  try {
    const taskId = req.params.id;

    // Find a designation by ID
    const task = await Task.findByPk(taskId, {
      include: [
        {
          model: db.project,
          as: "projectDetails",
        },
        {
          model: db.employee,
          as: "employeeDetails",
        },
      ],
    });

    if (!task) {
      return res.status(404).json({
        status: "Error",
        message: "task not found",
      });
    }

    // Send the retrieved designation as a JSON response
    res.json({
      status: "Success",
      data: task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});

/////////////////////// Updating Task data Api /////////////////////

router.put(
  "/updateTask/:id",
  uploadStorage.single("file"),
  async (req, res) => {
    const taskId = req.params.id;

    try {
      // Check if the expense with the given ID exists
      const existingTask = await Task.findByPk(taskId);

      if (!existingTask) {
        return res.status(404).json({ error: "Task not found" });
      }

      // Update the expense with the provided data
      const {
        project_id,
        parentTask,
        task,
        taskDetail,
        startDate,
        endDate,
        estimatedHour,
        employee_id,
        approver,
      } = req.body;
      const attachment = req.file ? req.file.filename : existingTask.attachment;

      // Update expense attributes
      existingTask.project_id = project_id;
      existingTask.parentTask = parentTask;
      existingTask.task = task;
      existingTask.taskDetail = taskDetail;
      existingTask.startDate = startDate;
      existingTask.endDate = endDate;
      existingTask.estimatedHour = estimatedHour;
      existingTask.employee_id = employee_id;
      existingTask.approver = approver;
      existingTask.attachment = attachment;

      // Save the updated expense to the database
      await existingTask.save();

      res.status(200).json(existingTask);
    } catch (error) {
      console.error("Error updating expense:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
