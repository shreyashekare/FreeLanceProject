module.exports = (sequelize, DataTypes) => {
  const Project_planning_tasks = sequelize.define("project_planning_task", {
    project_planning_module_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    project_modules_tasks: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tasks_planned_startDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tasks_planned_endDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tasks_planned_Hrs: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tasks_actual_startDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tasks_actual_endDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tasks_actual_hrs: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Add any additional fields you have in your "login" table
  });

  Project_planning_tasks.associate = (models) => {
    Project_planning_tasks.belongsTo(models.project_planning_modules, {
      foreignKey: "project_planning_module_id",
      as: "projectPlanning_modules",
    });

    Project_planning_tasks.hasMany(models.project_planning_subTask, {
      foreignKey: "project_planning_tasks_id",
      as: "projectPlanning_task_subtasks_details",
    });
  };

  return Project_planning_tasks;
};
