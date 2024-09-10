const db = require("../models");
const express = require("express");
const multer = require("multer");
const { Op, where } = require("sequelize");
const { htmlToText } = require('html-to-text');
const Task = db.task;
const router = express.Router();

const Activity_Timer = db.Activity_Timer

const date = new Date();
const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns month from 0-11, so we add 1
const day = String(date.getDate()).padStart(2, '0');
const year = date.getFullYear();

const newDate = `${month}/${day}/${year}`;

router.post("/addTimerData", async (req, res) => {
    try {
        const {
            Activity_ID,
            AddedBy_EmployeeID,
            Time_Spent,
            StartTime,
            EndTime,
            Date_Of_Entry
        } = req.body

        const data = await Activity_Timer.create({
            Activity_ID: Activity_ID,
            AddedBy_EmployeeID: AddedBy_EmployeeID,
            Time_Spent: Time_Spent,
            StartTime: StartTime,
            EndTime: EndTime,
            Date_Of_Entry: Date_Of_Entry
        })
        await data.save();
        res.json({
            data: data,
            message: "Data Entered Successfully"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error,
            message: "Something went wrong"
        })
    }
})
router.get("/getAllSum/:id", async (req, res) => {
    const { userID , Date_Of_Entry } = req.query;
    try {
        const data = await Activity_Timer.sum('Time_Spent', { where: { Activity_ID: req.params.id, AddedBy_EmployeeID: userID, Date_Of_Entry:Date_Of_Entry } })
        const finalAnswer = data.toFixed(2)
        res.json({
            data:finalAnswer
        })
    }
    catch(error)
    {
        console.error(error)
        res.status(500).json({
            error:error,
            message:"Something Went Wrong"
        })
    }
})


module.exports = router;
