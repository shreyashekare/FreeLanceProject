const db = require("../models");
const express = require("express");

const employee = db.employee;
const designation = db.designation;
const router = express.Router();

/////////////////////// Employee Login  ///////////////////////////

const bcrypt = require('bcrypt');

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await employee.findOne({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      return res.status(400).json({
        status: "Error",
        message: "User not registered",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        status: "Error",
        message: "Invalid email or password",
      });
    }

    return res.json({
      status: "Success",
      message: "Login successful",
      employee: existingUser,
      employeeID: existingUser.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "Error",
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
