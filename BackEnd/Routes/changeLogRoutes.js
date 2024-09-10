const db = require("../models");
const express = require('express');
const project_planning = require("../models/project_planning");
const { where } = require("sequelize");
const router = express.Router();
const { htmlToText } = require('html-to-text');


const ChangeLog = db.activity_change_log;


router.get("/getChangeLog/:id", async (req, res) => {
    try {
        const data = await ChangeLog.findAll({
            where: { activity_ID: req.params.id }
        });
        if (data) {
            res.json({
                data: data,
                message: "Change log fetched successfully"
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
});
// 

module.exports = router;