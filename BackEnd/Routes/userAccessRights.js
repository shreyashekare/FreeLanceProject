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
const User_access_rights = db.user_access_rights;
const User_access_designations = db.user_access_designations;



router.get("/getUserRights", async (req, res) => {
    try {
        const data = await User_access_rights.findAll({});
        if (data.length > 0) {
            res.json({
                data: data,
                message: "Data fetched successfully"
            })
        }
        else {
            res.status(400).json({
                message: "No records to display"
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal Server Error"
        })
    }
})


// router.get("/getUserRights/:id", async (req, res) => {
//     try {
//         const designation_id = req.params.id;

//         // Fetch all User_access_rights records
//         const userAccessRights = await User_access_rights.findAll({
//             include: {
//                 model: User_access_designations,
//                 as: 'userAccess',
//                 where: { Assigned_DesignationID: designation_id },
//                 required: true  // Ensures only records with matching designation are included
//             }
//         });

//         if (userAccessRights.length === 0) {
//             return res.status(400).json({
//                 message: "No records to display"
//             });
//         }

//         // Fetch User_access_designations where Assigined_DesignationID matches designation_id
//         const userAccessDesignations = await User_access_designations.findAll({
//             where: { Assigned_DesignationID: designation_id }
//         });

//         const designationRowIDs = userAccessDesignations.map(designation => designation.user_access_rights_id);

//         // Construct the response data
//         const responseData = userAccessRights.map(right => {
//             const relatedDesignation = right.userAccess.find(designation => designationRowIDs.includes(designation.user_access_rights_id));
//             return {
//                 ...right.dataValues,
//                 Status: relatedDesignation ? relatedDesignation.status : 0
//             };
//         });

//         res.json({
//             data: responseData,
//             message: "Data fetched and updated successfully"
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             error: "Internal Server Error"
//         });
//     }
// });

router.get("/getUserRights/:id", async (req, res) => {
    try {
        const designation_id = req.params.id;

        // Fetch all User_access_rights records with included User_access_designations
        const userAccessRights = await User_access_rights.findAll({
            include: {
                model: User_access_designations,
                as: 'userAccess',
                where: { Assigned_DesignationID: designation_id },
                required: false // Allow User_access_rights without matching designations
            }
        });

        if (userAccessRights.length === 0) {
            return res.status(400).json({
                message: "No records to display"
            });
        }

        // Construct the response data
        const responseData = userAccessRights.map(right => {
            const relatedDesignations = right.userAccess.filter(designation => designation.Assigned_DesignationID === designation_id);

            return {
                ...right.dataValues,
                userAccess: relatedDesignations.length > 0 ? relatedDesignations : undefined, // Include userAccess only if relatedDesignations exist
                Status: relatedDesignations.length > 0 ? relatedDesignations[0].Status : 0
            };
        });

        res.json({
            data: responseData,
            message: "Data fetched and updated successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});



router.post("/changeUserAccess", async (req, res) => {
    try {
        const { Name, Assigined_DesignationID, Status, rowID } = req.body;

        if (Status === "0") {
            // If Status is '0', remove the entry from the table
            const result = await User_access_designations.destroy({
                where: {
                    user_access_rights_id: rowID,
                    Assigned_DesignationID: Assigined_DesignationID
                }
            });

            if (result) {
                return res.json({
                    message: "De-Activated"
                });
            } else {
                return res.status(404).json({
                    message: "Data not found"
                });
            }
        } else {
            // If Status is not '0', first check if the record already exists
            const existingRecord = await User_access_designations.findOne({
                where: {
                    user_access_rights_id: rowID,
                    Assigned_DesignationID: Assigined_DesignationID
                }
            });

            if (existingRecord) {
                // If record exists, update its status
                await existingRecord.update({ Status });
                return res.json({
                    data: existingRecord,
                    message: "Data updated successfully"
                });
            }

            // If record does not exist, create a new entry
            const userAccess = await User_access_designations.create({
                Assigned_DesignationID: Assigined_DesignationID,
                Status: Status,
                user_access_rights_id: rowID
            });

            res.json({
                data: userAccess,
                message: "Activated"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
});

router.post("/changeUserAccess2", async (req, res) => {
    try {
        const requestData = req.body; // Array of request objects

        // Array to hold the response messages
        const responseMessages = [];

        // Process each item in the requestData array
        for (const data of requestData) {
            const { Name, Assigined_DesignationID, Status, rowID } = data;

            if (Status === "0") {
                // If Status is '0', remove the entry from the table
                const result = await User_access_designations.destroy({
                    where: {
                        user_access_rights_id: rowID,
                        Assigned_DesignationID: Assigined_DesignationID
                    }
                });

                if (result) {
                    responseMessages.push({ rowID, message: "De-Activated" });
                } else {
                    responseMessages.push({ rowID, message: "Data not found" });
                }
            } else {
                // If Status is not '0', first check if the record already exists
                const existingRecord = await User_access_designations.findOne({
                    where: {
                        user_access_rights_id: rowID,
                        Assigned_DesignationID: Assigined_DesignationID
                    }
                });

                if (existingRecord) {
                    // If record exists, update its status
                    await existingRecord.update({ Status });
                    responseMessages.push({ rowID, data: existingRecord, message: "Data updated successfully" });
                } else {
                    // If record does not exist, create a new entry
                    const userAccess = await User_access_designations.create({
                        Assigned_DesignationID: Assigined_DesignationID,
                        Status: Status,
                        user_access_rights_id: rowID
                    });

                    responseMessages.push({ rowID, data: userAccess, message: "Activated" });
                }
            }
        }

        res.json({
            responses: responseMessages,
            message: "Processed all records"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
});


router.get('/getUserRightsByDesignation/:id', async (req, res) => {
    try {
        const data = await User_access_designations.findAll({
            where: { Assigned_DesignationID: req.params.id }
        })
        if (data.length > 0) {
            res.json({
                data: data,
                message: "Data fetched successfully"
            })
        }
        else {
            res.status(400).json({
                error: "No records for the given ID"
            })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({
            error: "Something went wrong"
        })
    }
})
router.post("/addModules", async (req, res) => {
    try {
        const { Module_Name } = req.body
        if (Module_Name.length > 0) {
            const prevData = await User_access_rights.findOne({ where: { Module_Name: Module_Name } })
            if (prevData) {
                res.status(500).json({
                    message: "Module Already exists"
                })
            }
            else {
                const data = await User_access_rights.create({
                    Module_Name: Module_Name
                })
                await data.save();
                res.json({
                    data: data,
                    message: "Module Added Successfully"
                })
            }

        }
        else {
            res.status(500).json({ message: "Please enter a module name" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error,
            message: "Internal Server Error"
        })
    }

})

router.get("/getUserAccessByID/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const data = await User_access_designations.findAll({
            where: { Assigned_DesignationID: id },
            include: {
                model: User_access_rights,
                as: 'userAccessRights',
                required: false
            }
        });

        if (data.length > 0) {
            res.json({
                data: data,
                message: "Data fetched successfully"
            });
        } else {
            res.status(400).json({
                message: "No record for this id"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error,
            message: "Internal Server Error"
        });
    }
});



module.exports = router;