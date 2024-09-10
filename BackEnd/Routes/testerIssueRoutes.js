const db = require("../models");
const express = require("express");
const multer = require("multer");
const { Op, where } = require("sequelize");
const { htmlToText } = require('html-to-text');
const Task = db.task;
const router = express.Router();



const Tester_issues = db.tester_issues;
const Project_planning_activities = db.project_planning_activitie;

router.get("/getAllIssues", async (req, res) => {
    try {
        const data = await Tester_issues.findAll({});
        if (data) {
            res.status(200).json({
                data: data,
                message: "Data fetched successfully",
            })
        }
        else {
            res.status(400).json({
                message: "No data found"
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error,
            message: "Something went wrong"
        })
    }
})
router.get("/getTesterIssues/:id", async (req, res) => {
    try {
        const data = await Tester_issues.findAll({ where: { Activity_ID: req.params.id } })
        if (data) {

            const plainTextData = data.map(item => {
                return {
                    ...item.dataValues, 
                    Issue_details: htmlToText(item.dataValues.Issue_details, {
                        wordwrap: 500
                    })
                };
            });
            res.json({
                data: plainTextData,
                message: "Data fetched successfully"
            })
        }
        else {
            res.status(400).json({
                status: "Error",
                message: "No data for this activity"
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "Error",
            message: "Something went wrong"
        });
    }

})

router.post("/addIssues", async (req, res) => {
    try {
        const {
            Tester_Name,
            Issue_details,
            Assigned_Employee,
            Activity_ID,
            Assigned_Tester,
            Issue_Time,
            Issue_Status
        } = req.body

        const newIssues = await Tester_issues.create({
            Tester_Name: Tester_Name,
            Issue_details: Issue_details,
            Assigned_Employee: Assigned_Employee,
            Activity_ID: Activity_ID,
            Assigned_Tester: Assigned_Tester,
            Issue_Time: Issue_Time,
            Issue_Status: Issue_Status
        });
        await newIssues.save();
        const data = await Project_planning_activities.findByPk(Activity_ID);
        data.Activity_Status = Issue_Status;
        await data.save();
        return res.status(200).json({
            data: newIssues,
            message: "Issue added successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message,
            message: "Something went wrong"
        });
    }
});

module.exports = router;
