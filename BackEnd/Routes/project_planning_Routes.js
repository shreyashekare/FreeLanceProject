const db = require("../models");
const express = require("express");
const multer = require("multer");
const { Op, where, Sequelize } = require("sequelize");
const project_planning_activities = require("../models/project_planning_activities");

const Project_planning = db.project_planning;
const Project_planning_projectFile = db.project_planning_projectFile;
const Project_planning_modules = db.project_planning_modules;
const Project_planning_tasks = db.project_planning_task;
const Project_planning_subTasks = db.project_planning_subTask;
const Project_planning_activities = db.project_planning_activitie;
const Purchase_order = db.purchaseOrder;
const ClientName = db.clientName;
const Employee = db.employee;
const Time_tracking = db.activity_time_tracking
const ChangesMade = db.activity_change_log;
const Project_planning_employees = db.Project_planning_employees;
const Designations = db.designation;
const Terster_Issues = db.tester_issues;
const router = express.Router();



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadStorage = multer({ storage: storage });

///////////// function to add projectPlanning Files //////////////
async function add_project_planning_files(project_planning_id, project_files) {
  try {
    // Save each milestone detail to the database
    for (const files of project_files) {
      await Project_planning_projectFile.create({
        project_planning_id: project_planning_id,
        project_file: files, // Accessing milestoneValue property correctly
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

///////////////////////  function for adding Modules /////////////////////
async function add_project_planning_modules(project_planningId, modules) {
  try {
    await Project_planning_modules.destroy({
      where: { project_planning_id: project_planningId },
    });
    for (const module of modules) {
      await Project_planning_modules.create({
        project_planning_id: project_planningId,
        project_modules: module.modules,
        module_planned_startDate: module.planned_startDate,
        module_planned_endDate: module.planned_endDate,
        module_planned_Hrs: module.planned_Hrs,
        module_actual_startDate: module.actual_startDate,
        module_actual_endDate: module.actual_endDate,
        module_actual_hrs: module.actual_hrs,
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

///////////////////////  function for adding Tasks /////////////////////
async function add_project_planning_Tasks(module_Id, modules) {
  try {
    await Project_planning_tasks.destroy({
      where: { project_planning_module_id: module_Id },
    });
    for (const module of modules) {
      await Project_planning_tasks.create({
        project_planning_module_id: module_Id,
        project_modules_tasks: module.task,
        tasks_planned_startDate: module.task_planned_startDate,
        tasks_planned_endDate: module.task_planned_endDate,
        tasks_planned_Hrs: module.task_planned_Hrs,
        tasks_actual_startDate: module.task_actual_startDate,
        tasks_actual_endDate: module.task_actual_endDate,
        tasks_actual_hrs: module.task_actual_hrs,
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}


router.post(
  "/add_project_planning",
  uploadStorage.array("project_file"),
  async (req, res) => {
    try {
      console.log("Received files:", req.files);
      console.log("Received data:", req.body);
      // Extracting data from request body
      const { project_name, purchaseOrder_id, employee_ID, client_ID, Status } = req.body;

      const project_files = req.files.map((file) => file.filename);

      // Creating a new project planning entry
      const newProjectPlanning = await Project_planning.create({
        project_name,
        purchaseOrder_id,
        employee_ID,
        client_ID,
        Status
      });



      const project_planning_Id = newProjectPlanning.id;


      const moduleDetails = JSON.parse(req.body.modules);

      await add_project_planning_files(project_planning_Id, project_files);

      await Project_planning_modules.destroy({
        where: { project_planning_id: project_planning_Id },
      });

      // Loop through moduleDetails to add modules and tasks
      for (const moduleDetail of moduleDetails) {
        // Add module
        const newModule = await Project_planning_modules.create({
          project_planning_id: project_planning_Id,
          project_modules: moduleDetail.modules,
          module_planned_startDate: moduleDetail.planned_startDate,
          module_planned_endDate: moduleDetail.planned_endDate,
          module_planned_Hrs: moduleDetail.planned_Hrs,
          module_actual_startDate: moduleDetail.actual_startDate,
          module_actual_endDate: moduleDetail.actual_endDate,
          module_actual_hrs: moduleDetail.actual_hrs,
        });

        // Get the module ID
        const module_Id = newModule.id;

        // Add tasks for the module
        await Project_planning_tasks.destroy({
          where: { project_planning_module_id: module_Id },
        });
        for (const taskDetail of moduleDetail.tasks) {
          const newTasks = await Project_planning_tasks.create({
            project_planning_module_id: module_Id,
            project_modules_tasks: taskDetail.task,
            tasks_planned_startDate: taskDetail.task_planned_startDate,
            tasks_planned_endDate: taskDetail.task_planned_endDate,
            tasks_planned_Hrs: taskDetail.task_planned_Hrs,
            tasks_actual_startDate: taskDetail.task_actual_startDate,
            tasks_actual_endDate: taskDetail.task_actual_endDate,
            tasks_actual_hrs: taskDetail.task_actual_hrs,
          });

          const tasks_Id = newTasks.id;

          // Add subtasks for the task
          await Project_planning_subTasks.destroy({
            where: { project_planning_tasks_id: tasks_Id },
          });
          for (const subTaskDetail of taskDetail.subTasks) {
            const newsubTasks = await Project_planning_subTasks.create({
              project_planning_tasks_id: tasks_Id,
              project_modules_subTasks: subTaskDetail.subTask,
              subTasks_planned_startDate: subTaskDetail.subTask_planned_startDate,
              subTasks_planned_endDate: subTaskDetail.subTask_planned_endDate,
              subTasks_planned_Hrs: subTaskDetail.subTask_planned_Hrs,
              subTasks_actual_startDate: subTaskDetail.subTask_actual_startDate,
              subTasks_actual_endDate: subTaskDetail.subTask_actual_endDate,
              subTasks_actual_hrs: subTaskDetail.subTask_actual_hrs,
            });

            const subTasks_Id = newsubTasks.id;

            // Add activities for the subtask
            await Project_planning_activities.destroy({
              where: { project_planning_subTasks_id: subTasks_Id },
            });
            for (const activitiesDetail of subTaskDetail.activities) {
              await Project_planning_activities.create({
                project_planning_subTasks_id: subTasks_Id,
                project_modules_activities: activitiesDetail.activities,
                activities_planned_startDate: activitiesDetail.activities_planned_startDate,
                activities_planned_endDate: activitiesDetail.activities_planned_endDate,
                activities_planned_Hrs: activitiesDetail.activities_planned_Hrs,
                activities_actual_startDate: activitiesDetail.activities_actual_startDate,
                activities_actual_endDate: activitiesDetail.activities_actual_endDate,
                activities_actual_hrs: activitiesDetail.activities_actual_hrs,
                assignedTo_employeeID: employee_ID,
                Project_ID: project_planning_Id,
                Status: null
              });
            }
          }
        }
      }

      // If the entry is created successfully, send a success response
      return res.status(201).json({
        message: "Project planning details added successfully",
        projectPlanning: newProjectPlanning,


      });
    } catch (error) {
      console.error("Error adding project planning details:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);



////////////////////////////////////////////////////////////////////// get all data /////////////////////////////////////////////////////////////////

router.get("/project_planning_data", async (req, res) => {
  try {
    const projectPlanningData = await Project_planning.findAll({
      include: [
        {
          model: Purchase_order,
          as: "purchaseOrder",
          include: [{ model: ClientName, as: "clientNameDetails" }],
        },

        {
          model: Project_planning_projectFile,
          as: "project_planning_files",
        },
        {
          model: Project_planning_modules,
          as: "project_planning_moduleDetails",
          include: [
            {
              model: Project_planning_tasks,
              as: "projectPlanning_module_tasks_details",
              include: [
                {
                  model: Project_planning_subTasks,
                  as: "projectPlanning_task_subtasks_details",
                  include: [
                    {
                      model: Project_planning_activities,
                      as: "projectPlanning_subTasks_Activities_details",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      where: { Status: "Final Approval" }
    });
    res.status(200).json(projectPlanningData);
  } catch (error) {
    console.error("Error fetching project planning data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/project_planning_data2", async (req, res) => {
  try {
    const projectPlanningData = await Project_planning.findAll({
      attributes: ['id', 'project_name', 'purchaseOrder_id', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Purchase_order,
          as: "purchaseOrder",
          include: [{ model: ClientName, as: "clientNameDetails" }],
        },
        {
          model: Project_planning_projectFile,
          as: "project_planning_files",
        },
        {
          model: Project_planning_modules,
          as: "project_planning_moduleDetails",
          include: [
            {
              model: Project_planning_tasks,
              as: "projectPlanning_module_tasks_details",
              include: [
                {
                  model: Project_planning_subTasks,
                  as: "projectPlanning_task_subtasks_details",
                  include: [
                    {
                      model: Project_planning_activities,
                      as: "projectPlanning_subTasks_Activities_details",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      where: { Status: "Final Approval" }
    });

    // Transforming the data to include startDate and endDate from purchaseOrder
    const formattedData = projectPlanningData.map(item => ({
      id: item.id,
      project_name: item.project_name,
      purchaseOrder_id: item.purchaseOrder_id,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      startDate: item.purchaseOrder.startDate, // Access startDate from purchaseOrder
      endDate: item.purchaseOrder.endDate,     // Access endDate from purchaseOrder
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching project planning data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/project_planning_data2/:id", async (req, res) => {
  try {
    const employeeID = req.params.id; // Employee ID passed in the URL parameter


    // Find projects where employee_ID field contains the specified employeeID
    const projectPlanningData = await Project_planning.findAll({
      where: {
        employee_ID: {
          [Op.like]: `%${employeeID}%`, // Use Sequelize Op.like to find matches within the comma-separated list
        },
      },
      attributes: ['id', 'project_name', 'employee_ID', 'purchaseOrder_id', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Purchase_order,
          as: "purchaseOrder",
          include: [{ model: ClientName, as: "clientNameDetails" }],
        },
        {
          model: Project_planning_modules,
          as: "project_planning_moduleDetails",
          include: [
            {
              model: Project_planning_tasks,
              as: "projectPlanning_module_tasks_details",
              include: [
                {
                  model: Project_planning_subTasks,
                  as: "projectPlanning_task_subtasks_details",
                  include: [
                    {
                      model: Project_planning_activities,
                      as: "projectPlanning_subTasks_Activities_details",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    const formattedData = projectPlanningData.map(item => ({
      id: item.id,
      project_name: item.project_name,
      employee_ID: item.employee_ID,
      purchaseOrder_id: item.purchaseOrder_id,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      startDate: item.purchaseOrder.startDate, // Access startDate from purchaseOrder
      endDate: item.purchaseOrder.endDate,     // Access endDate from purchaseOrder
    }));


    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching project planning data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// const { Project_planning_employees, Project_planning, Purchase_order, ClientName, Project_planning_modules, Project_planning_tasks, Project_planning_subTasks, Project_planning_activities } = require('../models'); // Adjust the import paths based on your project structure and models

router.get("/project_planning_data4/:id", async (req, res) => {
  try {
    const employeeID = req.params.id;


    // Step 1: Find all projects IDs for the employee from Project_Planning_employees
    const employeesProjects = await Project_planning_employees.findAll({
      where: {
        employee_ID: employeeID
      }
    });

    if (!employeesProjects || employeesProjects.length === 0) {
      return res.status(404).json({ error: "Employee not associated with any projects" });
    }

    // Step 2: Extract project IDs from the result
    const projectIDs = employeesProjects.map(employeeProject => employeeProject.Project_ID);

    // Step 3: Fetch project planning data based on project IDs
    const projectPlanningData = await Project_planning.findAll({
      where: {
        id: {
          [Op.in]: projectIDs // Fetch projects where id is in projectIDs array
        },
        Status: 'Final Approval'
      },
      attributes: ['id', 'project_name', 'purchaseOrder_id', 'Status', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Purchase_order,
          as: "purchaseOrder",
          include: [{ model: ClientName, as: "clientNameDetails" }],
        },
        {
          model: Project_planning_modules,
          as: "project_planning_moduleDetails",
          include: [
            {
              model: Project_planning_tasks,
              as: "projectPlanning_module_tasks_details",
              include: [
                {
                  model: Project_planning_subTasks,
                  as: "projectPlanning_task_subtasks_details",
                  include: [
                    {
                      model: Project_planning_activities,
                      as: "projectPlanning_subTasks_Activities_details",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    const formattedData = projectPlanningData.map(item => ({
      id: item.id,
      project_name: item.project_name,
      purchaseOrder_id: item.purchaseOrder_id,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      startDate: item.purchaseOrder.startDate, // Access startDate from purchaseOrder
      endDate: item.purchaseOrder.endDate,     // Access endDate from purchaseOrder
    }));

    res.status(200).json(projectPlanningData);
  } catch (error) {
    console.error("Error fetching project planning data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




////////////////////////////////////////////////////////////////////// get  data  by id /////////////////////////////////////////////////////////////////

router.get("/project_planning_data/:id", async (req, res) => {
  try {
    const purchaseOrderId = req.params.id;
    const projectPlanningData = await Project_planning.findByPk(
      purchaseOrderId,
      {
        include: [
          {
            model: Purchase_order,
            as: "purchaseOrder",
            include: [{ model: ClientName, as: "clientNameDetails" }],
          },
          {
            model: Project_planning_projectFile,
            as: "project_planning_files",
          },
          {
            model: Project_planning_modules,
            as: "project_planning_moduleDetails",
            include: [
              {
                model: Project_planning_tasks,
                as: "projectPlanning_module_tasks_details",
                include: [
                  {
                    model: Project_planning_subTasks,
                    as: "projectPlanning_task_subtasks_details",
                    include: [
                      {
                        model: Project_planning_activities,
                        as: "projectPlanning_subTasks_Activities_details",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }
    );
    res.status(200).json(projectPlanningData);
  } catch (error) {
    console.error("Error fetching project planning data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/findProjectByPurchaseOrder/:id", async (req, res) => {
  const data = await Project_planning.findAll({
    where: { purchaseOrder_id: req.params.id }
  })
  if (data.length > 0) {
    res.json({
      Status: "true"
    })
  }
  else {
    res.json({
      Status: "false"
    })
  }
})

router.get("/project_planning_data_by_purchaseOrder/:id", async (req, res) => {
  try {
    const purchaseOrderId = req.params.id;
    const projectPlanningData = await Project_planning.findOne({
      where: { purchaseOrder_id: purchaseOrderId },

      include: [
        {
          model: Purchase_order,
          as: "purchaseOrder",
          include: [{ model: ClientName, as: "clientNameDetails" }],
        },
        {
          model: Project_planning_projectFile,
          as: "project_planning_files",
        },
        {
          model: Project_planning_modules,
          as: "project_planning_moduleDetails",
          include: [
            {
              model: Project_planning_tasks,
              as: "projectPlanning_module_tasks_details",
              include: [
                {
                  model: Project_planning_subTasks,
                  as: "projectPlanning_task_subtasks_details",
                  include: [
                    {
                      model: Project_planning_activities,
                      as: "projectPlanning_subTasks_Activities_details",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }
    );
    res.status(200).json(projectPlanningData);
  } catch (error) {
    console.error("Error fetching project planning data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//////////////////////////////////////////////////////////////// data for project planning assign task ///////////////////////////////////////////

router.get("/project_planning_data_for_AssignTask/:id", async (req, res) => {
  try {
    const purchaseOrderId = req.params.id;
    const projectPlanningData = await Project_planning.findByPk(
      purchaseOrderId,
      {
        include: [
          {
            model: Purchase_order,
            as: "purchaseOrder",
            include: [{ model: ClientName, as: "clientNameDetails" }],
          },
          {
            model: Project_planning_projectFile,
            as: "project_planning_files",
          },
          {
            model: Project_planning_modules,
            as: "project_planning_moduleDetails",
            include: [
              {
                model: Project_planning_tasks,
                as: "projectPlanning_module_tasks_details",
                include: [
                  {
                    model: Project_planning_subTasks,
                    as: "projectPlanning_task_subtasks_details",
                    include: [
                      {
                        model: Project_planning_activities,
                        as: "projectPlanning_subTasks_Activities_details",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }
    );
    res.status(200).json(projectPlanningData);
  } catch (error) {
    console.error("Error fetching project planning data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/project_planning_data_for_AssignTask2/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;

    // Fetch the project planning data based on employee_ID
    const projectPlanningData = await Project_planning.findAll({
      include: [
        {
          model: Purchase_order,
          as: "purchaseOrder",
          include: [{ model: ClientName, as: "clientNameDetails" }],
        },
        {
          model: Project_planning_projectFile,
          as: "project_planning_files",
        },
        {
          model: Project_planning_modules,
          as: "project_planning_moduleDetails",
          include: [
            {
              model: Project_planning_tasks,
              as: "projectPlanning_module_tasks_details",
              include: [
                {
                  model: Project_planning_subTasks,
                  as: "projectPlanning_task_subtasks_details",
                  include: [
                    {
                      model: Project_planning_activities,
                      as: "projectPlanning_subTasks_Activities_details",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      where: {
        employee_ID: employeeId // Add condition to filter by employeeId
      }
    });

    res.status(200).json(projectPlanningData);
  } catch (error) {
    console.error("Error fetching project planning data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//////////////////////////////////////////////////////////////// data for project planning assign task ///////////////////////////////////////////

//////////////////////////////////////////////////////////////// update api ///////////////////////////////////////////////

router.put(
  "/update_projectPlanning/:id",
  uploadStorage.array("project_file"),
  async (req, res) => {
    try {
      // Extract data from request body
      console.log("received files", req.files);
      const { project_name, removedAttachments } = req.body;

      // Handle project file(s)

      const project_files = req.files.map((file) => file.filename);

      const moduleDetails = JSON.parse(req.body.modules);

      const purchaseOrderId = req.params.id;
      // Update project in the database
      const updateProject_planning = await Project_planning.update(
        { project_name, project_files },
        {
          where: { id: purchaseOrderId },
        }
      );
      console.log("updateProject_planning:", updateProject_planning);
      const updatedProject = await Project_planning.findByPk(purchaseOrderId);

      // Extract projectPlanning_id from the updated record
      const projectPlanning_id = updatedProject?.id;
      console.log("pid:", projectPlanning_id); // Log projectPlanning_id

      const removedAttachmentsArray = removedAttachments
        ? JSON.parse(removedAttachments)
        : [];

      for (const removedAttachment of removedAttachmentsArray) {
        try {
          await Project_planning_projectFile.destroy({
            where: { id: removedAttachment.id },
          });

          console.log(
            `Attachment with ID ${removedAttachment.id} deleted successfully`
          );
        } catch (error) {
          console.error(
            `Error deleting attachment with ID ${removedAttachment.id}:`,
            error
          );
          // Handle the error as needed
        }
      }

      for (const file of project_files) {
        try {
          await Project_planning_projectFile.create({
            project_planning_id: projectPlanning_id,
            project_file: file,
          });
          console.log(`Attachment ${file} added successfully`);
        } catch (error) {
          console.error(`Error adding attachment ${file}:`, error);
          // Handle the error as needed
        }
      }

      await Project_planning_modules.destroy({
        where: { project_planning_id: projectPlanning_id },
      });

      // Add updated milestones for the purchase order
      for (const module of moduleDetails) {
        const updateModules = await Project_planning_modules.create({
          project_planning_id: projectPlanning_id,
          project_modules: module.project_modules,
          module_planned_startDate: module.module_planned_startDate,
          module_planned_endDate: module.module_planned_endDate,
          module_planned_Hrs: module.module_planned_Hrs,
          module_actual_startDate: module.module_actual_startDate,
          module_actual_endDate: module.module_actual_endDate,
          module_actual_hrs: module.module_actual_hrs,
        });

        const module_id = updateModules.id;

        await Project_planning_tasks.destroy({
          where: { project_planning_module_id: module_id },
        });
        for (const taskDetail of module.projectPlanning_module_tasks_details) {
          const updateTasks = await Project_planning_tasks.create({
            project_planning_module_id: module_id,
            project_modules_tasks: taskDetail.project_modules_tasks,
            tasks_planned_startDate: taskDetail.tasks_planned_startDate,
            tasks_planned_endDate: taskDetail.tasks_planned_endDate,
            tasks_planned_Hrs: taskDetail.tasks_planned_Hrs,
            tasks_actual_startDate: taskDetail.tasks_actual_startDate,
            tasks_actual_endDate: taskDetail.tasks_actual_endDate,
            tasks_actual_hrs: taskDetail.tasks_actual_hrs,
          });
          const task_id = updateTasks.id;
          console.log("task ID", task_id);

          await Project_planning_subTasks.destroy({
            where: { project_planning_tasks_id: task_id },
          });
          for (const subTaskDetail of taskDetail.projectPlanning_task_subtasks_details) {
            const updateSubTasks = await Project_planning_subTasks.create({
              project_planning_tasks_id: task_id,
              project_modules_subTasks: subTaskDetail.project_modules_subTasks,
              subTasks_planned_startDate:
                subTaskDetail.subTasks_planned_startDate,
              subTasks_planned_endDate: subTaskDetail.subTasks_planned_endDate,
              subTasks_planned_Hrs: subTaskDetail.subTasks_planned_Hrs,
              subTasks_actual_startDate:
                subTaskDetail.subTasks_actual_startDate,
              subTasks_actual_endDate: subTaskDetail.subTasks_actual_endDate,
              subTasks_actual_hrs: subTaskDetail.subTasks_actual_hrs,
            });

            const subTask_id = updateSubTasks.id;
            console.log("subTask id", subTask_id);
            await Project_planning_activities.destroy({
              where: { project_planning_subTasks_id: subTask_id },
            });

            for (const activitiesDetail of subTaskDetail.projectPlanning_subTasks_Activities_details) {
              await Project_planning_activities.create({
                project_planning_subTasks_id: subTask_id,
                project_modules_activities:
                  activitiesDetail.project_modules_activities,
                activities_planned_startDate:
                  activitiesDetail.activities_planned_startDate,
                activities_planned_endDate:
                  activitiesDetail.activities_planned_endDate,
                activities_planned_Hrs: activitiesDetail.activities_planned_Hrs,
                activities_actual_startDate:
                  activitiesDetail.activities_actual_startDate,
                activities_actual_endDate:
                  activitiesDetail.activities_actual_endDate,
                activities_actual_hrs: activitiesDetail.activities_actual_hrs,
              });
            }
          }
        }
      }

      // If the project is updated successfully, send a success response
      return res
        .status(200)
        .json({ message: "Purchase order updated successfully" });
    } catch (error) {
      console.error("Error updating project:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

// router.put(
//   "/update_projectPlanning_withoutdeleting/:id",
//   uploadStorage.array("project_file"),
//   async (req, res) => {
//     try {
//       // Extract data from request body
//       console.log("received files", req.files);
//       const { project_name, Status, removedAttachments } = req.body;

//       // Handle project file(s)
//       const project_files = req.files.map((file) => file.filename);
//       const moduleDetails = JSON.parse(req.body.modules);
//       const purchaseOrderId = req.params.id;

//       const updateProject_planning = await Project_planning.update(
//         { project_name, Status, project_files },
//         {
//           where: { id: purchaseOrderId },
//         }
//       );
//       console.log("updateProject_planning:", updateProject_planning);
//       const updatedProject = await Project_planning.findByPk(purchaseOrderId);

//       // Extract projectPlanning_id from the updated record
//       const projectPlanning_id = updatedProject?.id;
//       console.log("pid:", projectPlanning_id); // Log projectPlanning_id

//       const removedAttachmentsArray = removedAttachments
//         ? JSON.parse(removedAttachments)
//         : [];

//       for (const removedAttachment of removedAttachmentsArray) {
//         try {
//           await Project_planning_projectFile.destroy({
//             where: { id: removedAttachment.id },
//           });

//           console.log(
//             `Attachment with ID ${removedAttachment.id} deleted successfully`
//           );
//         } catch (error) {
//           console.error(
//             `Error deleting attachment with ID ${removedAttachment.id}:`,
//             error
//           );
//           // Handle the error as needed
//         }
//       }

//       for (const file of project_files) {
//         try {
//           await Project_planning_projectFile.create({
//             project_planning_id: projectPlanning_id,
//             project_file: file,
//           });
//           console.log(`Attachment ${file} added successfully`);
//         } catch (error) {
//           console.error(`Error adding attachment ${file}:`, error);
//           // Handle the error as needed
//         }
//       }

//       // Update or create module details
//       for (const module of moduleDetails) {
//         // Check if module exists, if not, create new one
//         let existingModule = await Project_planning_modules.findByPk(module.id);

//         if (!existingModule) {
//           existingModule = await Project_planning_modules.create({
//             project_planning_id: projectPlanning_id,
//             project_modules: module.project_modules,
//             module_planned_startDate: module.module_planned_startDate,
//             module_planned_endDate: module.module_planned_endDate,
//             module_planned_Hrs: module.module_planned_Hrs,
//             module_actual_startDate: module.module_actual_startDate,
//             module_actual_endDate: module.module_actual_endDate,
//             module_actual_hrs: module.module_actual_hrs,
//           });
//         } else {
//           // Update existing module
//           existingModule.project_planning_id = projectPlanning_id;
//           existingModule.project_modules = module.project_modules;
//           existingModule.module_planned_startDate =
//             module.module_planned_startDate;
//           existingModule.module_planned_endDate = module.module_planned_endDate;
//           existingModule.module_planned_Hrs = module.module_planned_Hrs;
//           existingModule.module_actual_startDate =
//             module.module_actual_startDate;
//           existingModule.module_actual_endDate = module.module_actual_endDate;
//           existingModule.module_actual_hrs = module.module_actual_hrs;
//           await existingModule.save();
//         }

//         // Sort tasks by timestamp to keep the most recent
//         module.projectPlanning_module_tasks_details.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
//         const recentTask = module.projectPlanning_module_tasks_details[0];

//         // Handle tasks
//         let existingTask = await Project_planning_tasks.findByPk(recentTask.id);

//         if (!existingTask) {
//           existingTask = await Project_planning_tasks.create({
//             project_planning_module_id: existingModule.id,
//             project_modules_tasks: recentTask.project_modules_tasks,
//             tasks_planned_startDate: recentTask.tasks_planned_startDate,
//             tasks_planned_endDate: recentTask.tasks_planned_endDate,
//             tasks_planned_Hrs: recentTask.tasks_planned_Hrs,
//             tasks_actual_startDate: recentTask.tasks_actual_startDate,
//             tasks_actual_endDate: recentTask.tasks_actual_endDate,
//             tasks_actual_hrs: recentTask.tasks_actual_hrs,
//           });
//         } else {
//           // Update existing task
//           existingTask.project_planning_module_id = existingModule.id;
//           existingTask.project_modules_tasks = recentTask.project_modules_tasks;
//           existingTask.tasks_planned_startDate = recentTask.tasks_planned_startDate;
//           existingTask.tasks_planned_endDate = recentTask.tasks_planned_endDate;
//           existingTask.tasks_planned_Hrs = recentTask.tasks_planned_Hrs;
//           existingTask.tasks_actual_startDate = recentTask.tasks_actual_startDate;
//           existingTask.tasks_actual_endDate = recentTask.tasks_actual_endDate;
//           existingTask.tasks_actual_hrs = recentTask.tasks_actual_hrs;
//           await existingTask.save();
//         }

//         // Sort subtasks by timestamp to keep the most recent
//         recentTask.projectPlanning_task_subtasks_details.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
//         const recentSubTask = recentTask.projectPlanning_task_subtasks_details[0];

//         // Handle subtasks
//         let existingSubTask = await Project_planning_subTasks.findByPk(recentSubTask.id);

//         if (!existingSubTask) {
//           existingSubTask = await Project_planning_subTasks.create({
//             project_planning_tasks_id: existingTask.id,
//             project_modules_subTasks: recentSubTask.project_modules_subTasks,
//             subTasks_planned_startDate: recentSubTask.subTasks_planned_startDate,
//             subTasks_planned_endDate: recentSubTask.subTasks_planned_endDate,
//             subTasks_planned_Hrs: recentSubTask.subTasks_planned_Hrs,
//             subTasks_actual_startDate: recentSubTask.subTasks_actual_startDate,
//             subTasks_actual_endDate: recentSubTask.subTasks_actual_endDate,
//             subTasks_actual_hrs: recentSubTask.subTasks_actual_hrs,
//           });
//         } else {
//           // Update existing subtask
//           existingSubTask.project_planning_tasks_id = existingTask.id;
//           existingSubTask.project_modules_subTasks = recentSubTask.project_modules_subTasks;
//           existingSubTask.subTasks_planned_startDate = recentSubTask.subTasks_planned_startDate;
//           existingSubTask.subTasks_planned_endDate = recentSubTask.subTasks_planned_endDate;
//           existingSubTask.subTasks_planned_Hrs = recentSubTask.subTasks_planned_Hrs;
//           existingSubTask.subTasks_actual_startDate = recentSubTask.subTasks_actual_startDate;
//           existingSubTask.subTasks_actual_endDate = recentSubTask.subTasks_actual_endDate;
//           existingSubTask.subTasks_actual_hrs = recentSubTask.subTasks_actual_hrs;
//           await existingSubTask.save();
//         }

//         // Sort activities by timestamp to keep the most recent
//         recentSubTask.projectPlanning_subTasks_Activities_details.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
//         const recentActivity = recentSubTask.projectPlanning_subTasks_Activities_details[0];

//         // Handle activities
//         let existingActivity = await Project_planning_activities.findByPk(recentActivity.id);

//         if (!existingActivity) {
//           await Project_planning_activities.create({
//             project_planning_subTasks_id: existingSubTask.id,
//             project_modules_activities: recentActivity.project_modules_activities,
//             activities_planned_startDate: recentActivity.activities_planned_startDate,
//             activities_planned_endDate: recentActivity.activities_planned_endDate,
//             activities_planned_Hrs: recentActivity.activities_planned_Hrs,
//             activities_actual_startDate: recentActivity.activities_actual_startDate,
//             activities_actual_endDate: recentActivity.activities_actual_endDate,
//             activities_actual_hrs: recentActivity.activities_actual_hrs,
//             assignedTo_employeeID: recentActivity.assignedTo_employeeID,
//             Project_ID: projectPlanning_id,
//             Activity_Status: recentActivity.Activity_Status
//           });
//           console.log(`Activity ${recentActivity.project_modules_activities} added successfully`);
//         } else {
//           // Update existing activity
//           existingActivity.project_planning_subTasks_id = existingSubTask.id;
//           existingActivity.project_modules_activities = recentActivity.project_modules_activities;
//           existingActivity.activities_planned_startDate = recentActivity.activities_planned_startDate;
//           existingActivity.activities_planned_endDate = recentActivity.activities_planned_endDate;
//           existingActivity.activities_planned_Hrs = recentActivity.activities_planned_Hrs;
//           existingActivity.activities_actual_startDate = recentActivity.activities_actual_startDate;
//           existingActivity.activities_actual_endDate = recentActivity.activities_actual_endDate;
//           existingActivity.activities_actual_hrs = recentActivity.activities_actual_hrs;
//           existingActivity.assignedTo_employeeID = recentActivity.assignedTo_employeeID;
//           existingActivity.Project_ID = projectPlanning_id;
//           existingActivity.Activity_Status = recentActivity.Activity_Status;
//           await existingActivity.save();
//           console.log(`Activity ${recentActivity.project_modules_activities} updated successfully`);
//         }
//       }

//       // If the project planning record was updated successfully, send a success response
//       if (updateProject_planning) {
//         res.status(200).json({
//           message: "Project planning record updated successfully",
//           project: updatedProject,
//         });
//       } else {
//         res.status(404).json({
//           message: "Project planning record not found",
//         });
//       }
//     } catch (error) {
//       console.error("Error updating project planning record:", error);
//       res.status(500).json({
//         message: "Error updating project planning record",
//         error: error.message,
//       });
//     }
//   }
// );

router.put(
  "/update_projectPlanning_withoutdeleting/:id",
  uploadStorage.array("project_file"),
  async (req, res) => {
    try {
      // Extract data from request body
      console.log("received files", req.files);
      const { project_name, Status, removedAttachments } = req.body;

      // Handle project file(s)
      const project_files = req.files.map((file) => file.filename);
      const moduleDetails = JSON.parse(req.body.modules);
      const purchaseOrderId = req.params.id;

      const updateProject_planning = await Project_planning.update(
        { project_name, project_files, Status },
        {
          where: { id: purchaseOrderId },
        }
      );
      console.log("updateProject_planning:", updateProject_planning);
      const updatedProject = await Project_planning.findByPk(purchaseOrderId);

      // Extract projectPlanning_id from the updated record
      const projectPlanning_id = updatedProject?.id;
      console.log("pid:", projectPlanning_id); // Log projectPlanning_id

      const removedAttachmentsArray = removedAttachments
        ? JSON.parse(removedAttachments)
        : [];

      for (const removedAttachment of removedAttachmentsArray) {
        try {
          await Project_planning_projectFile.destroy({
            where: { id: removedAttachment.id },
          });

          console.log(
            `Attachment with ID ${removedAttachment.id} deleted successfully`
          );
        } catch (error) {
          console.error(
            `Error deleting attachment with ID ${removedAttachment.id}:`,
            error
          );
          // Handle the error as needed
        }
      }

      for (const file of project_files) {
        try {
          await Project_planning_projectFile.create({
            project_planning_id: projectPlanning_id,
            project_file: file,
          });
          console.log(`Attachment ${file} added successfully`);
        } catch (error) {
          console.error(`Error adding attachment ${file}:`, error);
          // Handle the error as needed
        }
      }
      // Update or create module details
      for (const module of moduleDetails) {
        // Check if module exists, if not, create new one
        let existingModule = await Project_planning_modules.findByPk(module.id);

        if (!existingModule) {
          existingModule = await Project_planning_modules.create({
            project_planning_id: projectPlanning_id,
            project_modules: module.project_modules,
            module_planned_startDate: module.module_planned_startDate,
            module_planned_endDate: module.module_planned_endDate,
            module_planned_Hrs: module.module_planned_Hrs,
            module_actual_startDate: module.module_actual_startDate,
            module_actual_endDate: module.module_actual_endDate,
            module_actual_hrs: module.module_actual_hrs,
          });
        } else {
          // Update existing module
          existingModule.project_planning_id = projectPlanning_id;
          existingModule.project_modules = module.project_modules;
          existingModule.module_planned_startDate =
            module.module_planned_startDate;
          existingModule.module_planned_endDate = module.module_planned_endDate;
          existingModule.module_planned_Hrs = module.module_planned_Hrs;
          existingModule.module_actual_startDate =
            module.module_actual_startDate;
          existingModule.module_actual_endDate = module.module_actual_endDate;
          existingModule.module_actual_hrs = module.module_actual_hrs;
          // Update other module details here
          await existingModule.save();
        }

        // Handle tasks
        for (const taskDetail of module.projectPlanning_module_tasks_details) {
          let existingTask = await Project_planning_tasks.findByPk(
            taskDetail.id
          );

          if (!existingTask) {
            existingTask = await Project_planning_tasks.create({
              project_planning_module_id: existingModule.id,
              project_modules_tasks: taskDetail.project_modules_tasks,
              tasks_planned_startDate: taskDetail.tasks_planned_startDate,
              tasks_planned_endDate: taskDetail.tasks_planned_endDate,
              tasks_planned_Hrs: taskDetail.tasks_planned_Hrs,
              tasks_actual_startDate: taskDetail.tasks_actual_startDate,
              tasks_actual_endDate: taskDetail.tasks_actual_endDate,
              tasks_actual_hrs: taskDetail.tasks_actual_hrs,
            });
          } else {
            // Update existing task
            existingTask.project_planning_module_id = existingModule.id;
            existingTask.project_modules_tasks =
              taskDetail.project_modules_tasks;
            existingTask.tasks_planned_startDate =
              taskDetail.tasks_planned_startDate;
            existingTask.tasks_planned_endDate =
              taskDetail.tasks_planned_endDate;
            existingTask.tasks_planned_Hrs = taskDetail.tasks_planned_Hrs;
            existingTask.tasks_actual_startDate =
              taskDetail.tasks_actual_startDate;
            existingTask.tasks_actual_endDate = taskDetail.tasks_actual_endDate;
            existingTask.tasks_actual_hrs = taskDetail.tasks_actual_hrs;
            await existingTask.save();
          }

          // Handle subtasks
          for (const subTaskDetail of taskDetail.projectPlanning_task_subtasks_details) {
            let existingSubTask = await Project_planning_subTasks.findByPk(
              subTaskDetail.id
            );

            if (!existingSubTask) {
              existingSubTask = await Project_planning_subTasks.create({
                project_planning_tasks_id: existingTask.id,
                project_modules_subTasks:
                  subTaskDetail.project_modules_subTasks,
                subTasks_planned_startDate:
                  subTaskDetail.subTasks_planned_startDate,
                subTasks_planned_endDate:
                  subTaskDetail.subTasks_planned_endDate,
                subTasks_planned_Hrs: subTaskDetail.subTasks_planned_Hrs,
                subTasks_actual_startDate:
                  subTaskDetail.subTasks_actual_startDate,
                subTasks_actual_endDate: subTaskDetail.subTasks_actual_endDate,
                subTasks_actual_hrs: subTaskDetail.subTasks_actual_hrs,
                // Add other subtask details here
              });
            } else {
              // Update existing subtask
              existingSubTask.project_planning_tasks_id = existingTask.id;
              existingSubTask.project_modules_subTasks =
                subTaskDetail.project_modules_subTasks;
              existingSubTask.subTasks_planned_startDate =
                subTaskDetail.subTasks_planned_startDate;
              existingSubTask.subTasks_planned_endDate =
                subTaskDetail.subTasks_planned_endDate;
              existingSubTask.subTasks_planned_Hrs =
                subTaskDetail.subTasks_planned_Hrs;
              existingSubTask.subTasks_actual_startDate =
                subTaskDetail.subTasks_actual_startDate;
              existingSubTask.subTasks_actual_endDate =
                subTaskDetail.subTasks_actual_endDate;
              existingSubTask.subTasks_actual_hrs =
                subTaskDetail.subTasks_actual_hrs;
              // Update other subtask details here
              await existingSubTask.save();
            }

            // Handle activities
            for (const activitiesDetail of subTaskDetail.projectPlanning_subTasks_Activities_details) {
              let existingActivities =
                await Project_planning_activities.findByPk(activitiesDetail.id);
              if (!existingActivities) {
                existingActivities = await Project_planning_activities.create({
                  project_planning_subTasks_id: existingSubTask.id,
                  project_modules_activities:
                    activitiesDetail.project_modules_activities,
                  activities_planned_startDate:
                    activitiesDetail.activities_planned_startDate,
                  activities_planned_endDate:
                    activitiesDetail.activities_planned_endDate,
                  activities_planned_Hrs:
                    activitiesDetail.activities_planned_Hrs,
                  activities_actual_startDate:
                    activitiesDetail.activities_actual_startDate,
                  activities_actual_endDate:
                    activitiesDetail.activities_actual_endDate,
                  activities_actual_hrs: activitiesDetail.activities_actual_hrs,
                  assignedTo_employeeID: activitiesDetail.assignedTo_employeeID,
                  Project_ID: projectPlanning_id,
                  Status: activitiesDetail.Activity_Status
                  // Add activity details here
                });
              } else {
                existingActivities.project_planning_subTasks_id =
                  existingActivities.project_planning_subTasks_id;
                existingActivities.project_modules_activities =
                  activitiesDetail.project_modules_activities;
                existingActivities.activities_planned_startDate =
                  activitiesDetail.activities_planned_startDate;
                existingActivities.activities_planned_endDate =
                  activitiesDetail.activities_planned_endDate;
                existingActivities.activities_planned_Hrs =
                  activitiesDetail.activities_planned_Hrs;
                existingActivities.activities_actual_startDate =
                  activitiesDetail.activities_actual_startDate;
                existingActivities.activities_actual_endDate =
                  activitiesDetail.activities_actual_endDate;
                existingActivities.activities_actual_hrs =
                  activitiesDetail.activities_actual_hrs;
                existingActivities.assignedTo_employeeID =
                  activitiesDetail.assignedTo_employeeID;
                existingActivities.Project_ID = projectPlanning_id
                existingActivities.Activity_Status = activitiesDetail.Activity_Status
                await existingActivities.save();
              }
            }
          }
        }
      }

      // If the project is updated successfully, send a success response
      return res
        .status(200)
        .json({ message: "Purchase order updated successfully" });
    } catch (error) {
      console.error("Error updating project:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.put("/updateAssignedEmployee/:activitiesId", async (req, res) => {
  const { activitiesId } = req.params;
  const { assignedTo_employeeID, Project_ID, firstName, lastName } = req.body;

  const pro = await Project_planning.findByPk(Project_ID);
  // const client_ID = pro.client_ID;

  // const client = await ClientName.findByPk(client_ID);

  const clientName = firstName + " " + lastName;

  try {
    // Find the activity by id
    const activity = await Project_planning_activities.findByPk(activitiesId);

    if (!activity) {
      console.log(`Activity with ID ${activitiesId} not found`);
      return res.status(404).json({ error: "Activity not found" });
    }

    // Store the previous value of assignedTo_employeeID
    const previousEmployeeId = activity.assignedTo_employeeID;
    console.log("Previous employee ID:", previousEmployeeId);

    if (previousEmployeeId === null) {
      console.log("The previous employee ID is null.");
    }

    let previousEmployeeName = null;
    let newEmployeeName = null;
    let Change = null;
    let time;
    let date;
    let data;

    if (previousEmployeeId !== null && previousEmployeeId !== 0) {
      const previousEmployee = await Employee.findOne({ where: { id: previousEmployeeId } });
      const newEmployee = await Employee.findOne({ where: { id: assignedTo_employeeID } });
      if (previousEmployee && newEmployee) {
        previousEmployeeName = previousEmployee.firstName + " " + previousEmployee.lastName;
        newEmployeeName = newEmployee.firstName + " " + newEmployee.lastName;
        time = new Date().toLocaleTimeString();
        date = new Date().toLocaleDateString();
        Change = newEmployeeName + " " + "was assigned in place of " + previousEmployeeName;
        data = await ChangesMade.create({
          assigned_Employee: newEmployeeName,
          unassigned_Employee: previousEmployeeName,
          Activity_ID: req.params.activitiesId,
          Client: clientName,
          Change_Time: time
        });
      } else {
        console.log(`Employee with ID ${previousEmployeeId} or new employee not found`);
      }
    } else if (previousEmployeeId == null || previousEmployeeId == 0) {
      const newEmployee = await Employee.findOne({ where: { id: assignedTo_employeeID } });
      newEmployeeName = newEmployee.firstName + " " + newEmployee.lastName;
      time = new Date().toLocaleTimeString();
      Change = newEmployeeName + " " + "is assigned";
      data = await ChangesMade.create({
        assigned_Employee: newEmployeeName,
        Activity_ID: req.params.activitiesId,
        Change_Time: time,
        Client: clientName,
      });
    }

    // Update assignedEmployee
    activity.assignedTo_employeeID = assignedTo_employeeID;
    activity.Project_ID = Project_ID;
    await activity.save();


    const activitiesWithPreviousEmployee = await Project_planning_activities.findAll({
      where: {
        assignedTo_employeeID: previousEmployeeId,
        Project_ID: Project_ID
      }
    });

    const project = await Project_planning_employees.create({
      Project_ID: Project_ID,
      employee_ID: assignedTo_employeeID
    })
    await project.save();

    return res.status(200).json({
      previousEmployeeId: previousEmployeeId,
      message: "Assigned employee updated successfully",
      data: data,
      project: project
    });
  } catch (error) {
    console.error("Error updating assigned employee:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/updateAssignedEmployee2/:activitiesId", async (req, res) => {
  const { activitiesId } = req.params;
  const { assignedTo_employeeID, Project_ID, firstName, lastName } = req.body;

  const pro = await Project_planning.findByPk(Project_ID);
  // const client_ID = pro.client_ID;

  // const client = await ClientName.findByPk(client_ID);

  const clientName = firstName + " " + lastName;

  try {
    // Find the activity by id
    const activity = await Project_planning_activities.findByPk(activitiesId);

    if (!activity) {
      console.log(`Activity with ID ${activitiesId} not found`);
      return res.status(404).json({ error: "Activity not found" });
    }

    // Store the previous value of assignedTo_employeeID
    const previousEmployeeId = activity.assignedTo_employeeID;
    console.log("Previous employee ID:", previousEmployeeId);

    if (previousEmployeeId === null) {
      console.log("The previous employee ID is null.");
    }

    let previousEmployeeName = null;
    let newEmployeeName = null;
    let Change = null;
    let time;
    let date;
    let data;

    if (previousEmployeeId !== null && previousEmployeeId !== 0) {
      const previousEmployee = await Employee.findOne({ where: { id: previousEmployeeId } });
      const newEmployee = await Employee.findOne({ where: { id: assignedTo_employeeID } });
      if (previousEmployee && newEmployee) {
        previousEmployeeName = previousEmployee.firstName + " " + previousEmployee.lastName;
        newEmployeeName = newEmployee.firstName + " " + newEmployee.lastName;
        time = new Date().toLocaleTimeString();
        date = new Date().toLocaleDateString();
        Change = newEmployeeName + " " + "was assigned in place of " + previousEmployeeName;
        data = await ChangesMade.create({
          assigned_Employee: newEmployeeName,
          unassigned_Employee: previousEmployeeName,
          Activity_ID: req.params.activitiesId,
          Client: clientName,
          Change_Time: time
        });
      } else {
        console.log(`Employee with ID ${previousEmployeeId} or new employee not found`);
      }
    } else if (previousEmployeeId == null || previousEmployeeId == 0) {
      const newEmployee = await Employee.findOne({ where: { id: assignedTo_employeeID } });
      newEmployeeName = newEmployee.firstName + " " + newEmployee.lastName;
      time = new Date().toLocaleTimeString();
      Change = newEmployeeName + " " + "is assigned";
      data = await ChangesMade.create({
        assigned_Employee: newEmployeeName,
        Activity_ID: req.params.activitiesId,
        Change_Time: time,
        Client: clientName,
      });
    }

    // Update assignedEmployee
    activity.assignedTo_employeeID = assignedTo_employeeID;
    activity.Project_ID = Project_ID;
    await activity.save();

    // Check if the previous employee is still assigned to any activities in the project
    const activitiesWithPreviousEmployee = await Project_planning_activities.findAll({
      where: {
        assignedTo_employeeID: previousEmployeeId,
        Project_ID: Project_ID
      }
    });

    if (activitiesWithPreviousEmployee.length === 0) {
      await Project_planning_employees.destroy({
        where: {
          Project_ID: Project_ID,
          employee_ID: previousEmployeeId
        }
      });
    }

    const project = await Project_planning_employees.create({
      Project_ID: Project_ID,
      employee_ID: assignedTo_employeeID
    });
    await project.save();

    return res.status(200).json({
      previousEmployeeId: previousEmployeeId,
      message: "Assigned employee updated successfully",
      data: data,
      project: project
    });
  } catch (error) {
    console.error("Error updating assigned employee:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.put("/updateAssignedhrs/:activitiesId", async (req, res) => {
  const { activitiesId } = req.params;
  const { assignedHrs } = req.body;

  try {
    // Find the activity by id
    const activity = await Project_planning_activities.findByPk(activitiesId);

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    // Update assignedEmployee
    activity.assigned_hrs = assignedHrs;
    await activity.save();

    return res
      .status(200)
      .json({ message: "Assigned Hrs updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//////////////////////////////////////  for deleting modules ////////////////////////////////////////////////
router.delete("/delete_module/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the module with the provided ID exists
    const existingModule = await Project_planning_modules.findByPk(id);

    if (!existingModule) {
      return res.status(404).json({ message: "Module not found" });
    }

    // Delete the module
    await existingModule.destroy();

    // If the module has associated tasks, subtasks, and activities, delete them as well
    const associatedTasks = await Project_planning_tasks.findAll({
      where: { project_planning_module_id: id },
    });

    for (const task of associatedTasks) {
      // Delete subtasks associated with the task
      await Project_planning_subTasks.destroy({
        where: { project_planning_tasks_id: task.id },
      });

      // Delete activities associated with the subtasks
      await Project_planning_activities.destroy({
        where: { project_planning_subTasks_id: task.id },
      });

      // Delete the task
      await task.destroy();
    }

    return res.status(200).json({
      message:
        "Module and associated tasks, subtasks, and activities deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting module:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//////////////////////////////////////////// for deleting tasks ////////////////////////////////////////////////////

router.delete("/delete_task/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;

    // Check if the task with the provided ID exists
    const existingTask = await Project_planning_tasks.findByPk(taskId);

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Delete the task
    await existingTask.destroy();

    // If the task has associated subtasks and activities, delete them as well
    // Delete subtasks associated with the task
    await Project_planning_subTasks.destroy({
      where: { project_planning_tasks_id: taskId },
    });

    // Delete activities associated with the subtasks
    await Project_planning_activities.destroy({
      where: { project_planning_subTasks_id: taskId },
    });

    return res.status(200).json({
      message:
        "Task and associated subtasks and activities deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

////////////////////////////////////////////////////// for deleting subTask ///////////////////////////////////////////////////////////
// API for deleting subtasks
router.delete("/delete_subtask/:subtaskId", async (req, res) => {
  try {
    const { subtaskId } = req.params;

    // Check if the subtask with the provided ID exists
    const existingSubtask = await Project_planning_subTasks.findByPk(subtaskId);

    if (!existingSubtask) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    // Delete the subtask
    await existingSubtask.destroy();

    // If the subtask has associated activities, delete them as well
    await Project_planning_activities.destroy({
      where: { project_planning_subTasks_id: subtaskId },
    });

    return res.status(200).json({
      message: "Subtask and associated activities deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting subtask:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//////////////////////////////////////////////////// for deleting Activities //////////////////////////////////////////

// API for deleting activities
router.delete("/delete_activity/:activityId", async (req, res) => {
  try {
    const { activityId } = req.params;

    // Check if the activity with the provided ID exists
    const existingActivity = await Project_planning_activities.findByPk(
      activityId
    );

    if (!existingActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Delete the activity
    await existingActivity.destroy();

    return res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
//////////////////////////////////////////////////////// ACTIVITIES ///////////////////////////////////////////////////////////

router.get("/getAllActivities", async (req, res) => {
  try {
    const data = await Project_planning_activities.findAll();
    if (data) {
      res.status(200).json({
        status: "Success",
        activities: data
      })
    }
    else {
      res.status(400).json({
        status: "Error",
        message: "No activities found"
      })
    }
  }
  catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Internal Server Error"
    })
  }
})
router.put("/updateEmployeeID/:id", async (req, res) => {
  const { employee_ID } = req.body;

  try {
    const data = await Project_planning_employees.findByPk(req.params.id);

    if (data) {
      const initialEmployeeId = data.employee_ID; // Store the initial value

      if (data.employee_ID) {
        // Split the current employee_ID string into an array
        const employeeIds = data.employee_ID.split(",");

        // Check if the new employee_ID is already in the array
        if (!employeeIds.includes(employee_ID)) {
          // Append the new employee_ID
          employeeIds.push(employee_ID);
          data.employee_ID = employeeIds.join(",");
        }
      } else {
        // If data.employee_ID is null or undefined, initialize it
        data.employee_ID = employee_ID;
      }

      await data.save();

      // Check if initialEmployeeId is present in any activities
      const checkID = await Project_planning_activities.findAll({
        where: { assignedTo_employeeID: initialEmployeeId }
      });

      if (checkID.length === 0) {
        // If initialEmployeeId is not found in any activities, remove it
        const employeeIds = data.employee_ID.split(",");
        const index = employeeIds.indexOf(initialEmployeeId);
        if (index > -1) {
          employeeIds.splice(index, 1);
        }
        data.employee_ID = employeeIds.join(",");
        await data.save(); // Save the data again after modification
      }

      const updatedEmployeeId = data.employee_ID; // Store the updated value

      res.status(200).json({
        status: "Success",
        initialEmployeeId: initialEmployeeId,
        updatedEmployeeId: updatedEmployeeId,
        data: data
      });
    } else {
      res.status(400).json({
        status: "Error",
        message: "Something went wrong"
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

router.get("/getEmployeeName/:id", async (req, res) => {
  try {
    const data = await Employee.findOne({
      where: { id: req.params.id },
      attributes: ['firstName', 'lastName']
    });

    if (data) {
      res.status(200).json({
        empName: data
      });
    } else {
      res.status(400).json({
        status: "Error",
        message: "No employee found"
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

router.get("/getActivityStatus/:id", async (req, res) => {
  try {
    const data = await Time_tracking.findOne({
      where: { activity_ID: req.params.id },
      order: [['createdAt', 'DESC']]
    });

    if (data) {
      if (data.Status === " ") {
        res.json({
          data: data.Status,
          message: "Data fetched successfully but status is empty"
        });
      } else {
        res.json({
          data: data.Status,
          message: "Data fetched successfully"
        });
      }
    } else {
      res.status(400).json({
        message: "No timelog for this id"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Error",
      message: "Something went wrong please check backend"
    });
  }
});



router.get("/getActivitiesByUserId", async (req, res) => {
  try {
    const activities = await Project_planning_activities.findAll({
      order: [['createdAt', 'DESC']],


      include: [
        {
          model: Project_planning,
          as: 'projectPlanning', // This should match the `as` alias in your association
          attributes: ['id', 'project_name'] // Specify the attributes you want to fetch from Project_planning
        }
      ]
    });

    if (!activities || activities.length === 0) {
      return res.status(400).json({ message: "No activity assigned to the employee" });
    }


    res.status(200).json({
      data: activities,
      message: "Data fetched successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Something went wrong"
    });
  }
});



router.get("/getActivitiesByUserId/:id", async (req, res) => {
  try {
    const activities = await Project_planning_activities.findAll({
      order: [['createdAt', 'DESC']],
      where: { assignedTo_employeeID: req.params.id },
      include: [
        {
          model: Project_planning,
          as: 'projectPlanning',
          attributes: ['id', 'project_name'],
          where: { status: "Final Approval" } // Filter projects by status
        }
      ]
    });

    if (!activities || activities.length === 0) {
      return res.status(400).json({ message: "No activity assigned to the employee" });
    }

    res.status(200).json({
      data: activities,
      message: "Data fetched successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Something went wrong"
    });
  }
});


router.get("/getActivitiesByProjectID/:id", async (req, res) => {
  try {
    const activities = await Project_planning_activities.findAll({
      order: [
        ['Activity_Status', 'ASC'], // Sort by Activity_Status first
        [Sequelize.literal(`CASE WHEN "Activity_Status" = 'Pending' THEN 0 ELSE 1 END`), 'ASC'], // Custom ordering: "Pending" first
        ['createdAt', 'DESC'] // Sort by createdAt in descending order
      ],
      where: { Project_ID: req.params.id },
      include: [
        {
          model: Project_planning,
          as: 'projectPlanning',
          attributes: ['id', 'project_name']
        }
      ]
    });

    if (!activities || activities.length === 0) {
      return res.status(400).json({ message: "No activity assigned to the employee" });
    }

    res.status(200).json({
      data: activities,
      message: "Data fetched successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Something went wrong"
    });
  }
});


router.get("/getActivitiesForTester/:id", async (req, res) => {
  try {
    const activities = await Project_planning_activities.findAll({
      order: [
        ['Activity_Status', 'ASC'], // Sort by Activity_Status first
        [Sequelize.literal(`CASE WHEN "Activity_Status" = 'Pending' THEN 0 ELSE 1 END`), 'ASC'], // Custom ordering: "Pending" first
        ['createdAt', 'DESC'] // Sort by createdAt in descending order
      ],
      where: {
        Project_ID: req.params.id,
        Activity_Status: {
          [Op.in]: ['Completed', 'Issue/Bug Found', 'In Review', 'Closed']
        }
      },
      include: [
        {
          model: Project_planning,
          as: 'projectPlanning',
          attributes: ['id', 'project_name']
        }
      ]
    });

    if (!activities || activities.length === 0) {
      return res.status(400).json({ message: "No activity assigned to the employee" });
    }

    res.status(200).json({
      data: activities,
      message: "Data fetched successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Something went wrong"
    });
  }
});

router.get("/getActivitiesForTester", async (req, res) => {
  try {
    const activities = await Project_planning_activities.findAll({
      order: [
        ['Activity_Status', 'ASC'], // Sort by Activity_Status first
        [Sequelize.literal(`CASE WHEN "Activity_Status" = 'Pending' THEN 0 ELSE 1 END`), 'ASC'], // Custom ordering: "Pending" first
        ['createdAt', 'DESC'] // Sort by createdAt in descending order
      ],
      where: {
       
        Activity_Status: {
          [Op.in]: ['Completed', 'Issue/Bug Found', 'In Review', 'Closed']
        }
      },
      include: [
        {
          model: Project_planning,
          as: 'projectPlanning',
          attributes: ['id', 'project_name'],
          where: {
            status: 'Final Approval' // Filter by status in Project_planning
          }
        }
      ]
    });

    if (!activities || activities.length === 0) {
      return res.status(400).json({ message: "No activity assigned to the employee" });
    }

    res.status(200).json({
      data: activities,
      message: "Data fetched successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Something went wrong"
    });
  }
});


router.get("/getActivitiesByProjectID2/:id/:employeeID?", async (req, res) => {
  try {
    const { id, employeeID } = req.params;

    console.log("><><><><><><><><><><><><><><><",req.params.employeeID)

    // Fetch activities with the specified filter and include Project_planning details
    const activities = await Project_planning_activities.findAll({
      order: [['createdAt', 'DESC']],
      where: { assignedTo_employeeID: req.params.employeeID, Project_ID: id },
      include: [
        {
          model: Project_planning,
          as: 'projectPlanning', // This should match the `as` alias in your association
          attributes: ['id', 'project_name'] // Specify the attributes you want to fetch from Project_planning
        }
      ]
    });

    // Log the fetched activities for inspection
    console.log("Fetched Activities:", activities);

    // If no activities are found, return a 400 status with a message
    if (!activities || activities.length === 0) {
      return res.status(400).json({ message: "No activity assigned to the employee" });
    }

    // Return the fetched activities with a success message
    res.status(200).json({
      data: activities,
      message: "Data fetched successfully"
    });

  } catch (error) {
    console.error(error);

    // Return a 500 status with an error message if an exception occurs
    res.status(500).json({
      status: "Error",
      message: "Something went wrong"
    });
  }
});



router.get("/getProjectNames", async (req, res) => {
  const Project = await Project_planning.findAll({})
  if (Project) {
    const modifiedData = Project.map(employee => ({
      name: employee.project_name
    }));
    res.json({
      data: modifiedData
    });
  }
})

router.get("/getActivityNames", async (req, res) => {
  const Project = await Project_planning_activities.findAll({})
  if (Project) {
    const modifiedData = Project.map(employee => ({
      name: employee.project_modules_activities
    }));
    res.json({
      data: modifiedData
    });
  }
})

router.get("/getAllDesignations", async (req, res) => {
  const data = await Designations.findAll({});
  if (data) {
    const modifiedData = data.map(des => ({
      Designation: des.designation
    }))

    res.json({
      data: modifiedData
    })
  }
})

router.get("/getAllDesignations2", async (req, res) => {
  const data = await Designations.findAll({});
  if (data) {
    const modifiedData = data.map(des => ({
      Id: des.id,
      Designation: des.designation
    }))

    res.json({
      data: modifiedData
    })
  }
})

router.get("/getAllActivities2", async (req, res) => {
  try {
    const Project = await Project_planning_activities.findAll({
      include: [
        {
          model: Project_planning,
          as: 'projectPlanning', // Ensure this matches the alias in your association
          attributes: ['id', 'project_name'],
          where: { Status: 'Final Approval' }
        }
      ],
      order: [['createdAt', 'DESC']],
      where: {
        assignedTo_employeeID: {
          [Op.ne]: 0 // Use the Sequelize operator for "not equal"
        }
      }
    });
    if (Project.length > 0) {
      res.json({
        data: Project,
        message: "Data fetched successfully"
      });
    } else {
      res.status(400).json({
        message: "No activities found"
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong"
    });
  }
});


router.get("/getAssignedTesterLog/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await ChangesMade.findAll({
      where: {
        Activity_ID: id,
        Assigned_To_Tester: 1,
        Client: null
      },
      order: [['createdAt', 'DESC']]
    });
    if (data.length > 0) {
      res.status(200).json({
        data: data,
        message: "Data fetched successfully"
      });
    } else {
      res.status(400).json({
        message: "No data for this record"
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error
    });
  }
});

router.put("/assignToTester/:id", async (req, res) => {
  try {
    const { Assign_For_Testing, fullName, userID } = req.body;
    const data = await Project_planning_activities.findByPk(req.params.id);
    if (data) {
      data.Assign_For_Testing = Assign_For_Testing;
      await data.save();

      const newData = await ChangesMade.create({
        unassigned_Employee: fullName,
        assigned_Employee: "Tester",
        Assigned_To_Tester: Assign_For_Testing,
        Change_Time: new Date().toLocaleTimeString(),
        Activity_ID: req.params.id,
      });
      await newData.save();

      return res.json({
        data: data,
        message: "Success",
        newData: newData
      });
    } else {
      return res.status(400).json({
        message: "No record for this id"
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something Went Wrong",
      error: error.message // Ensure error message is sent for better debugging
    });
  }
});

router.get("/getProjectDetails/:id", async (req, res) => {
  try {
    const data = await Project_planning.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Purchase_order,
          as: 'purchaseOrder', // This should match the `as` alias in your association
          attributes: ['clientName_id', 'startDate', 'endDate'], // Specify the attributes you want to fetch
          include: [{ model: ClientName, as: "clientNameDetails", attributes: ['clientName'] }],
        }
      ]
    });

    if (data) {
      res.json({
        data: data
      });
    } else {
      res.status(404).json({
        message: "Project not found"
      });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({
      message: "Something went wrong"
    });
  }
});


module.exports = router;
