module.exports = (sequelize, DataTypes) => {
  const Project_planning_subTasks = sequelize.define(
    "project_planning_subTask",
    {
      project_planning_tasks_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      project_modules_subTasks: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      subTasks_planned_startDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      subTasks_planned_endDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      subTasks_planned_Hrs: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      subTasks_actual_startDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      subTasks_actual_endDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      subTasks_actual_hrs: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // Add any additional fields you have in your "login" table
    }
  );

  Project_planning_subTasks.associate = (models) => {
    Project_planning_subTasks.belongsTo(models.project_planning_task, {
      foreignKey: "project_planning_tasks_id",
      as: "projectPlanning_tasks",
    });

    Project_planning_subTasks.hasMany(models.project_planning_activitie, {
      foreignKey: "project_planning_subTasks_id",
      as: "projectPlanning_subTasks_Activities_details",
    });
  };

  return Project_planning_subTasks;
};
