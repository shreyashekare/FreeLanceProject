const db = require("../models");
const express = require("express");
const { Op } = require("sequelize");

const Project = db.project;
const router = express.Router();

////////// Create project API ///////////
router.post("/addProject", async (req, res) => {
  try {
    const { project, description, status } = req.body;

    console.log("Received request with project:", project);

    const existingProject = await Project.findOne({
      where: {
        project: project,
      },
    });

    console.log("Existing Project:", existingProject);
    if (existingProject) {
      // If project already exists, return an error response
      return res.status(400).json({
        status: "Error",
        message: "Project already exists",
      });
    }

    const newProject = await Project.create({
      project: project,
      description: description,
      status: status,
    });

    console.log("Project added successfully. Sending success response.");

    return res.json({
      status: "Success",
      message: "Project added successfully",
      project: newProject,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});

///////// Get project Data API //////////////

router.get("/getProject", async (req, res) => {
  try {
    const project = await Project.findAll({});

    // Send the retrieved project as a JSON response
    res.json({
      status: "Success",
      data: project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});

///////// Get project Data API for Active status //////////////

router.get("/getActiveProject", async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { status: true },
    });

    // Send the retrieved projects as a JSON response
    res.json({
      status: "Success",
      data: projects,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});

/////////// get projects data by id /////

router.get("/getProject/:id", async (req, res) => {
  try {
    const projectId = req.params.id;

    // Find a designation by ID
    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({
        status: "Error",
        message: "project not found",
      });
    }

    // Send the retrieved project as a JSON response
    res.json({
      status: "Success",
      data: project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});


router.put("/updateProject/:id", async (req, res) => {
  try {
    const projectId = req.params.id;
    const { project, description, status } = req.body;

    // Find the designation by ID
    const existingProject = await Project.findByPk(projectId);

    if (!existingProject) {
      return res.status(404).json({
        status: "Error",
        message: "project not found",
      });
    }

    // Check if another project with the updated name already exists
    const otherProjectWithSameName = await Project.findOne({
      where: {
        project: project,
        id: {
          [Op.not]: projectId, // Exclude the current project from the check
        },
      },
    });

    if (otherProjectWithSameName) {
      return res.status(400).json({
        status: "Error",
        message: "project with the updated name already exists",
      });
    }

    // Update the designation
    existingProject.project = project;
    existingProject.description = description;
    existingProject.status = status;
    await existingProject.save();

    return res.json({
      status: "Success",
      message: "project updated successfully",
      project: existingProject,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});

/////////////////// Updating Status Api  ////////////

router.put("/toggleProjectStatus/:id", async (req, res) => {
  try {
    const projectId = req.params.id;

    // Find the project by ID
    const existingProject = await Project.findByPk(projectId);

    if (!existingProject) {
      return res.status(404).json({
        status: "Error",
        message: "project not found",
      });
    }

    // Toggle the status
    existingProject.status = !existingProject.status;

    await existingProject.save();

    return res.json({
      status: "Success",
      message: "project status toggled successfully",
      project: existingProject,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});

module.exports = router;

