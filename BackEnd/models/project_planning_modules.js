module.exports = (sequelize, DataTypes) => {
  const Project_planning_modules = sequelize.define(
    "project_planning_modules",
    {
      project_modules: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      project_planning_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      module_planned_startDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      module_planned_endDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      module_planned_Hrs: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      module_actual_startDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      module_actual_endDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      module_actual_hrs: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      // Add any additional fields you have in your "login" table
    }
  );

  Project_planning_modules.associate = (models) => {
    Project_planning_modules.belongsTo(models.project_planning, {
      foreignKey: "project_planning_id",
      as: "projectPlanning_modules",
    });

    Project_planning_modules.hasMany(models.project_planning_task, {
      foreignKey: "project_planning_module_id",
      as: "projectPlanning_module_tasks_details",
    });
  };

  return Project_planning_modules;
};
