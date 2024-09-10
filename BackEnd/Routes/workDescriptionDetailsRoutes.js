const db = require("../models");
const express = require('express');
const project_planning = require("../models/project_planning");
const { where } = require("sequelize");
const router = express.Router();
const { htmlToText } = require('html-to-text');


const Work_description_details = db.Work_description_details;
const Activity_Files = db.Activity_Files;

router.post("/addWorkDetails", async (req, res) => {
    try {
        const {
            Name,
            Task_Date,
            Task_Time,
            Work_Description,
            activity_ID,
            userDesignation,
            AddedBy_EmployeeID,
            Activity_Status,
        } = req.body

        const data = await Work_description_details.create({
            Name: Name,
            Task_Date: Task_Date,
            Task_Time: Task_Time,
            Work_Description: Work_Description,
            activity_ID: activity_ID,
            userDesignation: userDesignation,
            AddedBy_EmployeeID: AddedBy_EmployeeID,
            Activity_Status: Activity_Status,
        });
        res.json({
            status: "Success",
            data: data,
            message: "Work Description added successfully"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error"
        })
    }
})


router.get("/getWorkDescription/:id", async (req, res) => {
    try {
        const data = await Work_description_details.findAll({
            where: { activity_ID: req.params.id }
        });

        if (data) {
            // Convert HTML to plain text
            const plainTextData = data.map(item => {
                return {
                    ...item.dataValues,
                    Work_Description: htmlToText(item.dataValues.Work_Description, {
                        wordwrap: 500
                    })
                };
            });

            res.status(200).json({
                data: plainTextData
            });
        } else {
            res.status(400).json({
                status: "Error",
                message: "Data not found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "Error",
            message: "Something went wrong"
        });
    }
});
const { decode } = require('html-entities');
const multer = require("multer");


router.get("/getIssueDescription/:id", async (req, res) => {
    const ISSUE_BUG_FOUND = 'Issue/Bug Found';
    try {
        const data = await Work_description_details.findAll({
            where: {
                activity_ID: req.params.id,
                userDesignation: 2,
                Activity_Status: ISSUE_BUG_FOUND
            },
            attributes: ['Work_Description', 'Task_Time', 'Task_Date'] // Ensure Task_Date and Task_Time are included
        });

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: "No data found for this ID"
            });
        }

        // Decode HTML entities
        const decode = (html) => {
            // Implement your decoding logic here if needed
            return html; // Placeholder
        };

        // Clean and convert description
        const cleanDescription = (html) => {
            // First, remove the [/uploads/upload-...] patterns
            const cleanedHtml = html.replace(/\[\s*\/uploads\/[^]]+\s*\]/g, '');
            return cleanedHtml;
        };

        // Map over all records
        const response = data.map(record => {
            const cleanedHtml = cleanDescription(decode(record.Work_Description));

            // Extract the image path if it exists
            const imagePathRegex = /\/uploads\/[^\s]+\.png/;
            const imagePathMatch = cleanedHtml.match(imagePathRegex);
            const imagePath = imagePathMatch ? imagePathMatch[0] : null;

            // Remove the image path from the cleaned HTML before converting to plain text
            const finalCleanedHtml = cleanedHtml.replace(imagePathRegex, '');

            // Convert HTML to plain text, removing any other tags
            const plainTextData = htmlToText(finalCleanedHtml, {
                wordwrap: 130 // Adjust wordwrap as needed
            });

            return {
                data: plainTextData.trim(), // Trim to remove any excess spaces or newlines
                Task_Date: record.Task_Date,
                Task_Time: record.Task_Time,
                imagePath: imagePath
            };
        });

        res.json({
            data: response,
            message: "Data Fetched Successfully"
        });
    } catch (error) {
        console.error('Error fetching issue description:', error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});


const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.use('/uploads', express.static('uploads'));

router.post('/addActivityFile', upload.single('file'), async (req, res) => {
    try {
        const csrfToken = req.body.csrfToken;
        const activity_id = req.body.activity_id;

        // CSRF token validation
        if (!csrfToken || csrfToken !== '15WpFN7P-zHqqfcSQjjD32pURFUuzG7pdXjA') {
            return res.status(403).json({ error: 'CSRF token missing or invalid' });
        }

        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // File data
        const file = req.file;
        res.json({
            url: `/uploads/${file.filename}`, 
        });

    } catch (err) {
        console.error('Error uploading file:', err);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});




module.exports = router;
