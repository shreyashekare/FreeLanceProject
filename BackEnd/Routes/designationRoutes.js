const db = require("../models");
const express = require("express");
const { Op } = require("sequelize");

const design = db.designation;
const router = express.Router();

////////// Create Designation API ///////////
router.post("/addDesignation", async (req, res) => {
  try {
    const { designation, status } = req.body;
    
    console.log("Received request with designation:", designation);

    const existingDesignation = await design.findOne({
      where: {
        designation: designation,
      },
    });

    console.log("Existing Designation:", existingDesignation);
    if (existingDesignation) {
      // If designation already exists, return an error response
      return res.status(400).json({
        status: "Error",
        message: "Designation already exists",
      });
    }

    const newDesignation = await design.create({
      designation: designation,
      status: status,
    });

    console.log("Designation added successfully. Sending success response.");

    return res.json({
      status: "Success",
      message: "Designation added successfully",
      designation: newDesignation,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});

///////// Get Data API //////////////

router.get("/getDesignation", async (req, res) => {
  try {
    const designations = await design.findAll({});

    // Send the retrieved designations as a JSON response
    res.json({
      status: "Success",
      data: designations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});

///////// Get Data API for Active status //////////////

router.get("/getActiveDesignation", async (req, res) => {
  try {
    const designations = await design.findAll({
      where: { status: true },
    });

    // Send the retrieved designations as a JSON response
    res.json({
      status: "Success",
      data: designations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});

/////////// get data by id /////

router.get("/getDesignation/:id", async (req, res) => {
  try {
    const designationId = req.params.id;

    // Find a designation by ID
    const designation = await design.findByPk(designationId);

    if (!designation) {
      return res.status(404).json({
        status: "Error",
        message: "Designation not found",
      });
    }

    // Send the retrieved designation as a JSON response
    res.json({
      status: "Success",
      data: designation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});

//////////////////// Update Api ////////////////////
// Update Designation API
// router.put("/updateDesignation/:id", async (req, res) => {
//   try {
//     const designationId = req.params.id;
//     const { designation, status } = req.body;

//     // Find the designation by ID
//     const existingDesignation = await design.findByPk(designationId);

//     if (!existingDesignation) {
//       return res.status(404).json({
//         status: "Error",
//         message: "Designation not found",
//       });
//     }

//     // Update the designation
//     existingDesignation.designation = designation;
//     existingDesignation.status = status;
//     await existingDesignation.save();

//     return res.json({
//       status: "Success",
//       message: "Designation updated successfully",
//       designation: existingDesignation,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       status: "Error",
//       message: "Internal server error",
//     });
//   }
// });

router.put("/updateDesignation/:id", async (req, res) => {
  try {
    const designationId = req.params.id;
    const { designation, status } = req.body;
    
    // Find the designation by ID
    const existingDesignation = await design.findByPk(designationId);

    if (!existingDesignation) {
      return res.status(404).json({
        status: "Error",
        message: "Designation not found",
      });
    }

    // Check if another designation with the updated name already exists
    const otherDesignationWithSameName = await design.findOne({
      where: {
        designation: designation,
        id: {
          [Op.not]: designationId, // Exclude the current designation from the check
        },
      },
    });

    if (otherDesignationWithSameName) {
      return res.status(400).json({
        status: "Error",
        message: "Designation with the updated name already exists",
      });
    }

    // Update the designation
    existingDesignation.designation = designation;
    existingDesignation.status = status;
    await existingDesignation.save();

    return res.json({
      status: "Success",
      message: "Designation updated successfully",
      designation: existingDesignation,
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

router.put("/toggleStatus/:id", async (req, res) => {
  try {
    const designationId = req.params.id;

    // Find the designation by ID
    const existingDesignation = await design.findByPk(designationId);

    if (!existingDesignation) {
      return res.status(404).json({
        status: "Error",
        message: "Designation not found",
      });
    }

    // Toggle the status
    existingDesignation.status = !existingDesignation.status;

    await existingDesignation.save();

    return res.json({
      status: "Success",
      message: "Designation status toggled successfully",
      designation: existingDesignation,
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
