const db = require("../models");
const express = require("express");
const { Op } = require("sequelize");

const AssignTask = db.assignTask;
const router = express.Router();

router.post("/assignTask", async (req, res) => {
  try {
    const { taskId, employeeId } = req.body;
    // Create a new task assignment
    const taskAssignment = await AssignTask.create({
      task_id: taskId,
      employee_id: employeeId,
    });
    res.json(taskAssignment);
  } catch (error) {
    console.error("Error assigning task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

////////////////////////// Api to get all AssignTask  //////////////////////////

router.get("/getAssignTask", async (req, res) => {
  try {
    const task = await AssignTask.findAll({
      include: [
        {
          model: db.employee,
          as: "employeeDetails",
        },
        {
          model: db.task,
          as: "taskDetails",
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

///////////////////////////////////////////////////////////////
router.get("/fetchAssignTask", async (req, res) => {
  try {
    const employeeId = req.params.employeeId;

    // Fetch tasks assigned to the specific employee
    const tasks = await AssignTask.findAll({
      include: [
        {
          model: db.employee,
          as: "employeeDetails",
        },
        {
          model: db.task,
          as: "taskDetails",
        },
      ],
    });

    res.json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
