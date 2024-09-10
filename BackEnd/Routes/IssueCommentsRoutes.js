const db = require("../models");
const e = require("express");
const express = require("express");
const { Op, where } = require("sequelize");

const ClientName = db.clientName;
const router = express.Router();

const IssueComments = db.IssueComments;

router.post("/addComments", async (req, res) => {
    try {
        const {
            Issue_Comments,
            Activity_Id,
            user_ID
        } = req.body

        const data = await IssueComments.create({
            Issue_Comments: Issue_Comments,
            Activity_Id: Activity_Id,
            user_ID: user_ID
        })
        await data.save();
        res.json({
            data: data,
            message: "Comment Added Successfully"
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: error,
            message: "Something went wrong"
        })
    }
})

router.get("/getAllCommentsById/:id", async (req, res) => {
    try {
        // Fetch comments by Activity_Id
        const comments = await IssueComments.findAll({
            where: {
                Activity_Id: req.params.id
            },
            order:[['createdAt','DESC']]
        });

        if (comments.length > 0) {
            // Iterate over comments to get employee names
            const enrichedComments = await Promise.all(
                comments.map(async (comment) => {
                    const employee = await db.employee.findOne({
                        where: {
                            id: comment.user_ID
                        }
                    });

                    return {
                        ...comment.dataValues, // Spread comment data
                        employeeName: employee ? employee.firstName +" "+ employee.lastName : "Unknown" // Add employee name or default
                    };
                })
            );

            // Send response with enriched comments
            res.json({
                data: enrichedComments,
                message: "Data fetched Successfully"
            });
        } else {
            res.status(400).json({
                message: "No data for this id"
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message,
            message: "Something went wrong"
        });
    }
});

module.exports = router;
