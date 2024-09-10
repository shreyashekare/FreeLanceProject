const hash = require('object-hash');
const db = require("../models");
const express = require("express");

const employee = db.employee;
const designation = db.designation;
const router = express.Router();

/////////////////////// add employ  ///////////////////////////

const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post("/addEmployee", async (req, res) => {
  try {
    const {
      firstName,
      midName,
      lastName,
      email,
      password,
      contact,
      address,
      panCard,
      adhar,
      designation_id,
      dob,
      joiningDate,
      relievingDate,
      gender,
      status,
    } = req.body;

    const existingEmail = await employee.findOne({
      where: {
        email: email,
      },
    });

    if (existingEmail) {
      return res.status(400).json({
        status: "Error",
        message: "Email already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newEmployee = await employee.create({
      firstName: firstName,
      midName: midName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      contact: contact,
      address: address,
      panCard: panCard,
      adhar: adhar,
      dob: dob,
      joiningDate: joiningDate,
      relievingDate: relievingDate,
      gender: gender,
      status: status,
      designation_id: designation_id,
    });

    return res.json({
      status: "Success",
      message: "Employee added successfully",
      employee: newEmployee,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});

////////////////////////// Api to get all employee  //////////////////////////

router.get("/getEmployee", async (req, res) => {
  try {
    const employees = await employee.findAll({});

    // Send the retrieved designations as a JSON response
    res.json({
      status: "Success",
      data: employees,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});

/////////// get Employee data by id /////

router.get("/getEmployee/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;

    // Find a designation by ID
    const employees = await employee.findByPk(employeeId);

    if (!employees) {
      return res.status(404).json({
        status: "Error",
        message: "Employee not found",
      });
    }

    // Send the retrieved designation as a JSON response
    res.json({
      status: "Success",
      data: employees,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});



router.put("/updateEmployee/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const {
      firstName,
      midName,
      lastName,
      email,
      contact,
      address,
      password,
      panCard,
      adhar,
      dob,
      joiningDate,
      relievingDate,
      gender,
      designation_id,
    } = req.body;

    // Find the designation by ID
    const existingEmployee = await employee.findByPk(employeeId);

    if (!existingEmployee) {
      return res.status(404).json({
        status: "Error",
        message: "Employee not found",
      });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Update the designation
    existingEmployee.firstName = firstName;
    existingEmployee.midName = midName;
    existingEmployee.lastName = lastName;
    existingEmployee.email = email;
    existingEmployee.password = hashedPassword;
    existingEmployee.contact = contact;
    existingEmployee.address = address;
    existingEmployee.panCard = panCard;
    existingEmployee.adhar = adhar;

    existingEmployee.dob = dob;
    existingEmployee.joiningDate = joiningDate;
    existingEmployee.relievingDate = relievingDate;
    existingEmployee.gender = gender;
    existingEmployee.designation_id = designation_id;

    await existingEmployee.save();

    return res.json({
      status: "Success",
      message: "Employee updated successfully",
      employee: existingEmployee,
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

router.put("/toggleEmployeeStatus/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;

    // Find the designation by ID
    const existingEmployee = await employee.findByPk(employeeId);

    if (!existingEmployee) {
      return res.status(404).json({
        status: "Error",
        message: "Employee not found",
      });
    }

    // Toggle the status
    existingEmployee.status = !existingEmployee.status;

    await existingEmployee.save();

    return res.json({
      status: "Success",
      message: "Employee status toggled successfully",
      employee: existingEmployee,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});

///////// Get Data API for Active status //////////////

router.get("/getActiveEmployee", async (req, res) => {
  try {
    const employees = await employee.findAll({
      where: { status: true },
    });

    // Send the retrieved designations as a JSON response
    res.json({
      status: "Success",
      data: employees,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});

router.get("/getActiveEmployee/:id", async (req, res) => {
  try {
    const employees = await employee.findOne({
      where: { status: true, id: req.params.id },
    });

    // Send the retrieved designations as a JSON response
    res.json({
      status: "Success",
      data: employees,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});

router.get("/getemployeeDesignation/:id", async (req, res) => {
  const employeeId = req.params.id;
  try {
    const employeeWithDesignation = await employee.findByPk(employeeId, {
      include: [
        {
          model: db.designation,
          as: "employeeDesignation",
        },
      ],
    });
    if (!employeeWithDesignation) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({
      status: "Success",
      data: employeeWithDesignation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});

router.put("/changeEmployeeStatus/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const Employee = await employee.findByPk(employeeId);
    if (!Employee) {
      res.status(400).json({
        status: "Error",
        message: "No Employee for this id"
      })
    }
    Employee.status = !Employee.status;
    await Employee.save();
    return res.json({
      status: "Success",
      message: "Status Changed Successfully",
      employee: Employee
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "Error",
      message: "Internal Server Error"
    })
  }
})

router.get("/getEmployeeNames", async (req, res) => {
  try {
    const data = await employee.findAll({
      include: {
        model: designation,
        as: "employeeDesignation",
        attributes: ["designation"], // Assuming the designation name field is 'name'
      }
    });

    if (data) {
      const filteredData = data.filter(employee => employee.designation_id != 1);
      const modifiedData = filteredData.map(employee => ({
        name: `${employee.firstName} ${employee.midName} ${employee.lastName} (${employee.employeeDesignation.designation})`
      }));
      res.json({
        data: modifiedData
      });
    } else {
      res.status(400).json({
        message: "No data found"
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong"
    });
  }
});



router.get("/getemployeeDesignation", async (req, res) => {
  try {
    const employeeWithDesignation = await employee.findAll({
      include: [
        {
          model: db.designation,
          as: "employeeDesignation",
        },
      ],
    });

    res.json({
      status: "Success",
      data: employeeWithDesignation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});
// router.post("/login", async (req, res) => {
//   try {
//       const {
//           email,
//           password
//       } = req.body

//       const existingUser = await employee.findOne({
//           where: {
//               email: email,
//               password: password,
//           },
//       });
//       if (existingUser) {
//           return res.json({
//               status: "Success",
//               message: "Login Successful",
//               employee: existingUser,
//           })
//       }
//       else {
//           return res.status(400).json({
//               status: "Error",
//               message: "User Not registered",
//           })
//       }
//   } catch (error) {
//       console.error(error);
//       return res.status(500).json({
//           status: "Error",
//           message: "Internal Server Error"
//       })
//   }

// })
module.exports = router;
