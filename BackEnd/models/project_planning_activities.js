// module.exports = (sequelize, DataTypes) => {
//   const Project_planning_activities = sequelize.define(
//     "project_planning_activitie",
//     {
//       project_planning_subTasks_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//       project_modules_activities: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       activities_planned_startDate: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       activities_planned_endDate: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       activities_planned_Hrs: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       activities_actual_startDate: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       activities_actual_endDate: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       activities_actual_hrs: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       assignedTo_employeeID: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//       },
//       Project_ID: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//       },
//       Activity_Status: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },
//       assigned_hrs: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },

const { STRING } = require("sequelize");

//       // Add any additional fields you have in your "login" table
//     }
//   );

//   Project_planning_activities.associate = (models) => {
//     Project_planning_activities.belongsTo(models.project_planning_subTask, {
//       foreignKey: "project_planning_subTasks_id",
//       as: "projectPlanning_subTasks",
//     });

//     Project_planning_activities.belongsTo(models.employee, {
//       foreignKey: "assignedTo_employeeID",
//       as: "employee_details",
//     });
//   };

//   return Project_planning_activities;
// };

module.exports = (sequelize, DataTypes) => {
  const Project_planning_activities = sequelize.define("project_planning_activities", {
      project_planning_subTasks_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
      },
      project_modules_activities: {
          type: DataTypes.STRING,
          allowNull:true
      },
      activities_planned_startDate: {
          type: DataTypes.STRING,
          allowNull:true
      },
      activities_planned_endDate: {
          type: DataTypes.STRING,
          allowNull:true
      },
      activities_planned_Hrs: {
          type: DataTypes.STRING,
          allowNull:true,
      },
      activities_actual_startDate: {
          type: DataTypes.STRING,
          allowNull:true
      },
      activities_actual_endDate: {
          type: DataTypes.STRING,
          allowNull:true
      },
      activities_actual_hrs: {
          type: DataTypes.STRING,
          allowNull:true
      },
      assignedTo_employeeID: {
          type: DataTypes.INTEGER,
          allowNull: true,
      },
      Assign_For_Testing: {
        type: DataTypes.STRING,
        allowNull:true
      },
      Project_ID: {
          type: DataTypes.INTEGER,
          allowNull: true,
      },
      Activity_Status: {
          type: DataTypes.STRING,
          allowNull: true,
      },
      assigned_hrs: {
          type: DataTypes.STRING,
          allowNull: true,
      },
  });

  Project_planning_activities.associate = (models) => {
      Project_planning_activities.belongsTo(models.project_planning_subTask, {
          foreignKey: "project_planning_subTasks_id",
          as: "projectPlanning_subTasks",
      });

      Project_planning_activities.belongsTo(models.employee, {
          foreignKey: "assignedTo_employeeID",
          as: "employee_details",
      });

      Project_planning_activities.belongsTo(models.project_planning, {
          foreignKey: 'Project_ID',
          as: 'projectPlanning',
      });

      Project_planning_activities.hasMany(models.activity_time_tracking, {
          foreignKey: 'activity_ID',
          as: 'activityTimeTrackings',
      });
  };

  return Project_planning_activities;
};
