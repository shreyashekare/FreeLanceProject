const db = require("../models");
const express = require('express');
const project_planning = require("../models/project_planning");
const { where } = require("sequelize");
const multer = require("multer");
const router = express.Router();


const Project_planning = db.project_planning;
const Project_planning_projectFile = db.project_planning_projectFile;
const Project_planning_modules = db.project_planning_modules;
const Project_planning_tasks = db.project_planning_task;
const Project_planning_subTasks = db.project_planning_subTask;
const Project_planning_activities = db.project_planning_activitie;
const Purchase_order = db.purchaseOrder;
const ClientName = db.clientName;
const Activity_Files = db.Activity_Files


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});




///////////// function to add projectPlanning Files //////////////
async function add_activity_files(activity_id, activity_files) {
    try {
        // Use Promise.all to create all files concurrently
        await Promise.all(activity_files.map(async (file) => {
            await Activity_Files.create({
                activity_id: activity_id,
                activity_file: file,
            });
        }));
    } catch (error) {
        console.error("Error adding activity files:", error);
        throw error;
    }
}




const csrf = require('csurf'); // If you're using CSRF protection middleware

// Multer storage configuration
const uploadStorage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Specify your uploads folder
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Unique file names
    },
  }),
});

// Middleware to protect routes with CSRF
const csrfProtection = csrf({ cookie: true });






module.exports = router;