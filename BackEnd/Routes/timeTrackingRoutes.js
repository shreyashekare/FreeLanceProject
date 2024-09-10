const db = require("../models");
const express = require('express');
const project_planning = require("../models/project_planning");
const { where } = require("sequelize");
const router = express.Router();

const timeTracking = db.activity_time_tracking;
const Project_planning = db.project_planning;
const Project_planning_activities = db.project_planning_activitie;
const Tester_issues = db.tester_issues;
const Employee = db.employee
const Designation = db.designation;
const { convert } = require('html-to-text');
const { htmlToText } = require('html-to-text');

const date = new Date();
const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns month from 0-11, so we add 1
const day = String(date.getDate()).padStart(2, '0');
const year = date.getFullYear();

const newDate = `${month}/${day}/${year}`;


function calculateTimeLogged(allottedTime, timeRemaining) {
  // Ensure the inputs are numbers
  allottedTime = parseFloat(allottedTime);
  timeRemaining = parseFloat(timeRemaining);

  // Calculate time logged
  let timeLogged = allottedTime - timeRemaining;

  // Ensure the result is in decimal form
  timeLogged = timeLogged.toFixed(2); // Using 2 decimal places for precision

  // Convert back to float for further calculations if needed
  return parseFloat(timeLogged);
}


router.post("/addTimeTracking", async (req, res) => {
  try {
    const {
      Allotted_time,
      Time_spent,
      Time_remaining,
      Start_Date,
      Work_Description,
      Status,
      Activity_Type,
      activity_ID,
      AddedBy_EmployeeID,
      Priority
    } = req.body;

    const newTimeTracking = await timeTracking.create({
      Allotted_time: Allotted_time,
      Time_spent: Time_spent,
      Time_remaining: Time_remaining,
      time_Logged: calculateTimeLogged(Allotted_time, Time_remaining),
      Start_Date: Start_Date,
      Work_Description: Work_Description,
      Status,
      Activity_Type: Activity_Type,
      activity_ID: activity_ID,
      AddedBy_EmployeeID: AddedBy_EmployeeID,
      Priority:Priority
    })

    await newTimeTracking.save();
    const activity = await Project_planning_activities.findByPk(activity_ID);
    activity.Activity_Status = Status;
    await activity.save();

    const time = newTimeTracking.time_Logged;
    return res.json({
      status: "Success",
      message: "Time Tracking Added Successfully",
      data: newTimeTracking,
      time: time,

    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});

router.get("/getTimeTracking", async (req, res) => {
  const data = await timeTracking.findAll();
  res.send(data);
})


router.get("/getTimeTracking/:id", async (req, res) => {
  try {
    const data = await timeTracking.findAll({
      where: { activity_ID: req.params.id },
      order: [['createdAt', 'DESC']]
    });

    if (data) {
      const transformedData = data.map(item => {
        return {
          ...item.dataValues,
          Work_Description: htmlToText(item.dataValues.Work_Description)
        };
      });
      // const designation = await db.employee.findByPk(data.AddedBy_EmployeeID)
      res.status(200).json({
        data: transformedData,
      });
    } else {
      res.status(404).json({
        status: "Not Found",
        message: "No data found for the provided activity ID"
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Internal Server Error"
    });
  }
});
const Activity_Timer = db.Activity_Timer;

router.get("/getTimeTracking3/:id", async (req, res) => {
  try {
    const activityId = req.params.id;

    // Fetch and sum Time_Spent from Activity_Timer
    const currentDate = new Date().toLocaleDateString();

    const totalTimeSpent = await Activity_Timer.sum('Time_Spent', {
      where: { activity_ID: activityId, Date_Of_Entry: currentDate }
    });

    // Fetch the latest timeTracking record for the specified activity ID
    const data = await timeTracking.findOne({
      where: { activity_ID: activityId },
      order: [['createdAt', 'DESC']]  // Sorting by createdAt field in descending order
    });

    // Fetch the related Tester_issues record
    const id = await Tester_issues.findOne({ where: { Activity_ID: activityId } });

    // Check if data or id is null or empty and return 404
    if (!id) {
      res.json({
        data: data,
        id: null
      });
    }
    else if (!data) {
      return res.status(404).json({
        status: "Not Found",
        message: "No data found for the provided activity ID"
      });
    }

    else {
      data.Time_spent = totalTimeSpent || 0;
      await data.save();

      // Return response based on conditions
      res.status(200).json({
        data: data,
        id: id
      });
    }
    // Always update the Time_spent in data with totalTimeSpent, even if it's 0 or null

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Internal Server Error"
    });
  }
});


const { Op } = require('sequelize');
const moment = require('moment');  // Using moment.js to format the date



router.get("/getTimeTracking2/:id", async (req, res) => {
  const { userID } = req.query;
  const activityId = req.params.id;
  const currentDate = moment().format('M/D/YYYY');

  try {
    // Fetch and sum Time_Spent from Activity_Timer for the current date
    const totalTimeSpent = await Activity_Timer.sum('Time_Spent', {
      where: {
        activity_ID: activityId,
        AddedBy_EmployeeID: userID,
        Date_Of_Entry: {
          [Op.eq]: currentDate
        }
      }
    });

    // Fetch and sum total Time_Spent from Activity_Timer
    const totalTimeSpent2 = await Activity_Timer.sum('Time_Spent', {
      where: {
        activity_ID: activityId,
        AddedBy_EmployeeID: userID,
      }
    });

    // Fetch the most recent timeTracking record
    const data = await timeTracking.findOne({
      where: { activity_ID: activityId, AddedBy_EmployeeID: userID },
      order: [['createdAt', 'DESC']]
    });

    // Fetch related Tester_issues records
    const id = await Tester_issues.findAll({ where: { Activity_ID: activityId } });

    if (data) {
      // Only update data if time records are found
      if (totalTimeSpent !== null || totalTimeSpent2 !== null) {
        data.Time_spent = totalTimeSpent ? totalTimeSpent.toFixed(2) : '0.00';
        data.time_Logged = totalTimeSpent2 ? totalTimeSpent2.toFixed(2) : '0.00';
        var calculatedTime = data.Allotted_time - (totalTimeSpent2 ? totalTimeSpent2.toFixed(2) : 0);
        data.Time_remaining = calculatedTime.toFixed(2)
      }

    
    }

    // Determine response based on conditions
    if (data || (id.length > 0 && totalTimeSpent !== null)) {
      res.status(200).json({
        data: data || null,
        id: id || null,
        Time_spent: totalTimeSpent !== null ? totalTimeSpent.toFixed(2) : null
      });
    } else if (totalTimeSpent === null) {
      res.status(200).json({
        data: data,
        id: id || null
      });
    } else {
      res.status(404).json({
        status: "Not Found",
        message: `No data found for the provided activity ID and userID: ${userID}`
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Internal Server Error"
    });
  }
});

router.get("/getTimerData", async (req, res) => {
  const { AddedBy_EmployeeID, Activity_ID } = req.query; // Extract from query parameters

  try {
    if (!AddedBy_EmployeeID) {
      return res.status(400).json({
        message: "AddedBy_EmployeeID query parameter is required"
      });
    }
    const data = await Activity_Timer.findAll({
      where: {
        AddedBy_EmployeeID: AddedBy_EmployeeID,
        Activity_ID: Activity_ID
        // Only add Activity_ID filter if it is provided
      },
      order: [['createdAt', 'DESC']]

    });
    res.json({
      data: data,
      message: "Data retrieved successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error,
      message: "Something went wrong"
    });
  }
});


router.get("/getTimeTracking", async (req, res) => {
  try {
    const data = await timeTracking.findAll();
    if (data) {
      res.json({
        data: data,
        message: "Data fetched successfully"
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
      error: "Something went wrong"
    })
  }

})

//Reports

router.get('/getEmployeeReports', async (req, res) => {
  try {
    const data = await timeTracking.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Employee,
          as: 'employeeName',
          attributes: ['id', 'firstName', 'midName', 'lastName', 'designation_id'],
          include: [
            {
              model: Designation, // Make sure this is the correct model name
              as: 'employeeDesignation',
              attributes: ['id', 'designation'] // Adjust attributes as necessary
            }
          ]
        },
        {
          model: Project_planning_activities,
          as: 'projectActivity',
          include: {
            model: Project_planning,
            as: 'projectPlanning',
            attributes: ['id', 'project_name', 'createdAt']
          },
          attributes: ['project_modules_activities']
        },
      ],
      attributes: ['AddedBy_EmployeeID', 'activity_ID', 'Status', 'Allotted_Time', 'Time_spent', 'Activity_Type'],
    });

    res.json({
      status: "Success",
      data: data,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/getIssues', async (req, res) => {
  try {
    // Fetch the main data without the assigned employee details
    const data = await timeTracking.findAll({
      where: { Status: 'Issue/Bug Found' },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Employee,
          as: 'employeeName',
          attributes: ['id', 'firstName', 'midName', 'lastName', 'designation_id'],
          include: [
            {
              model: Designation,
              as: 'employeeDesignation',
              attributes: ['id', 'designation']
            }
          ]
        },
        {
          model: Project_planning_activities,
          as: 'projectActivity',
          include: [
            {
              model: Project_planning,
              as: 'projectPlanning',
              attributes: ['id', 'project_name', 'createdAt']
            }
          ],
          attributes: ['project_modules_activities', 'assignedTo_employeeID']
        }
      ],
      attributes: ['AddedBy_EmployeeID', 'activity_ID', 'Status','Work_Description', 'Allotted_Time', 'Time_spent', 'Activity_Type', 'Priority'],
    });

    // Fetch the full name of the assigned employee for each activity
    const updatedData = await Promise.all(data.map(async (item) => {
      const assignedEmployeeID = item.projectActivity.assignedTo_employeeID;
      if (assignedEmployeeID) {
        const assignedEmployee = await Employee.findOne({
          where: { id: assignedEmployeeID },
          attributes: ['firstName', 'midName', 'lastName']
        });

        if (assignedEmployee) {
          item.dataValues.assignedEmployeeFullName = `${assignedEmployee.firstName} ${assignedEmployee.midName ? assignedEmployee.midName + ' ' : ''}${assignedEmployee.lastName}`;
        }
      }

      // Strip HTML tags from Work_Description
      if (item.Work_Description) {
        item.dataValues.Work_Description = item.Work_Description.replace(/<\/?[^>]+(>|$)/g, "");
      }

      return item;
    }));

    res.json({
      status: "Success",
      data: updatedData,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/getIssues/:id', async (req, res) => {
  try {
    // Fetch the main data without the assigned employee details
    const data = await timeTracking.findAll({
      where: { Status: 'Issue/Bug Found' , activity_ID: req.params.id },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Employee,
          as: 'employeeName',
          attributes: ['id', 'firstName', 'midName', 'lastName', 'designation_id'],
          include: [
            {
              model: Designation,
              as: 'employeeDesignation',
              attributes: ['id', 'designation']
            }
          ]
        },
        {
          model: Project_planning_activities,
          as: 'projectActivity',
          include: [
            {
              model: Project_planning,
              as: 'projectPlanning',
              attributes: ['id', 'project_name', 'createdAt']
            }
          ],
          attributes: ['project_modules_activities', 'assignedTo_employeeID']
        }
      ],
      attributes: ['AddedBy_EmployeeID', 'activity_ID', 'Status','Work_Description', 'Allotted_Time', 'Time_spent', 'Activity_Type', 'Priority'],
    });

    // Fetch the full name of the assigned employee for each activity
    const updatedData = await Promise.all(data.map(async (item) => {
      const assignedEmployeeID = item.projectActivity.assignedTo_employeeID;
      if (assignedEmployeeID) {
        const assignedEmployee = await Employee.findOne({
          where: { id: assignedEmployeeID },
          attributes: ['firstName', 'midName', 'lastName']
        });

        if (assignedEmployee) {
          item.dataValues.assignedEmployeeFullName = `${assignedEmployee.firstName} ${assignedEmployee.midName ? assignedEmployee.midName + ' ' : ''}${assignedEmployee.lastName}`;
        }
      }

      // Strip HTML tags from Work_Description
      if (item.Work_Description) {
        item.dataValues.Work_Description = item.Work_Description.replace(/<\/?[^>]+(>|$)/g, "");
      }

      return item;
    }));

    res.json({
      status: "Success",
      data: updatedData,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/getEmployeeReports/:id', async (req, res) => {
  try {
    const data = await timeTracking.findAll({
      where: { AddedBy_EmployeeID: req.params.id },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Employee,
          as: 'employeeName',
          attributes: ['id', 'firstName', 'midName', 'lastName', 'designation_id'],
          include: [
            {
              model: Designation, // Make sure this is the correct model name
              as: 'employeeDesignation',
              attributes: ['id', 'designation'] // Adjust attributes as necessary
            }
          ]
        },
        {
          model: Project_planning_activities,
          as: 'projectActivity',
          include: {
            model: Project_planning,
            as: 'projectPlanning',
            attributes: ['id', 'project_name', 'createdAt']
          },
          attributes: ['project_modules_activities']
        },
      ],
      attributes: ['AddedBy_EmployeeID', 'activity_ID', 'Status', 'Allotted_Time', 'Time_spent', 'Activity_Type'],
    });

    res.json({
      status: "Success",
      data: data,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get("/getTesterTimeLog/:id", async (req, res) => {
  try {
    const data = await timeTracking.findAll({ where: { activity_ID: req.params.id }, order: [['createdAt', 'DESC']] })
    if (data.length > 0) {
      res.status(200).json({
        data: data,
        message: "Data fetched successfully"
      })
    }
    else {
      res.status(400).json({
        message: "No record for this id"
      })
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error
    })
  }
})


router.get("/getTesterTime/:id/:AddedBy_EmployeeID", async (req, res) => {
  const { id, AddedBy_EmployeeID } = req.params;
  const currentDate = moment().format('M/D/YYYY');

  try {
    const data = await Activity_Timer.findOne({
      where: {
        Activity_ID: id,
        AddedBy_EmployeeID: AddedBy_EmployeeID,
        Date_Of_Entry: {
          [Op.eq]: currentDate
        }
      },
   
      order: [['createdAt', 'DESC']]
    });

    if (data) {
      const spentTime = data.Time_Spent;
      res.json({
        data: spentTime
      });
    } else {
      res.status(400).json({
        message: "No data found"
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;