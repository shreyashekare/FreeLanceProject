const db = require("../models");
const express = require("express");
const { Op } = require("sequelize");

const ClientName = db.clientName;
const router = express.Router();

router.post("/addClient", async (req, res) => {
  try {
    const { clientName } = req.body;

    console.log("Received request with clientName:", clientName);

    const existingClientName = await ClientName.findOne({
      where: {
        clientName: clientName,
      },
    });

    console.log("Existing clientName:", existingClientName);
    if (existingClientName) {
      // If designation already exists, return an error response
      return res.status(400).json({
        status: "Error",
        message: "clientName already exists",
      });
    }

    const newClientName = await ClientName.create({
      clientName: clientName,
    });

    console.log("clientName added successfully. Sending success response.");

    return res.json({
      status: "Success",
      message: "clientName added successfully",
      clientName: newClientName,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});

///////// Get clientname Data API //////////////

router.get("/getclientName", async (req, res) => {
  try {
    const clientName = await ClientName.findAll({});

    res.json({
      status: "Success",
      data: clientName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});

module.exports = router;
