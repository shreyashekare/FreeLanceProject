const db = require("../models");
const express = require('express');
const project_planning = require("../models/project_planning");
const { where } = require("sequelize");
const router = express.Router();


const Project_planning = db.project_planning;
const Project_planning_projectFile = db.project_planning_projectFile;
const Project_planning_modules = db.project_planning_modules;
const Project_planning_tasks = db.project_planning_task;
const Project_planning_subTasks = db.project_planning_subTask;
const Project_planning_activities = db.project_planning_activitie;
const Purchase_order = db.purchaseOrder;
const ClientName = db.clientName;


router.get("/project_assigned/:id", async (req, res) => {
    try {
     
      const projectPlanningData = await Project_planning.findOne({
        where: {employee_ID:req.params.id}
      })
      if(projectPlanningData)
        {
            res.json({
                status:"Success",
                message:"Project Found",
                project:projectPlanningData
            })
        }
        else
        {
            res.status(400).json({
                status:"Error",
                message:"No project found",
            })
        }
    }catch(error)
    {
        console.error(error);
        res.status(500).json({
            status:"Error",
            message:"Internal Server Error"
        })
    }
   
  });

module.exports = router;