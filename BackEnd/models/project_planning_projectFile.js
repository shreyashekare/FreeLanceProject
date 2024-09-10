module.exports = (sequelize, DataTypes) => {
  const Project_planning_projectFile = sequelize.define(
    "project_planning_projectFile",
    {
      project_file: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      project_planning_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // Add any additional fields you have in your "login" table
    }
  );

  Project_planning_projectFile.associate = (models) => {
    Project_planning_projectFile.belongsTo(models.project_planning, {
      foreignKey: "project_planning_id",
      as: "projectPlanning",
    });
  };

  return Project_planning_projectFile;
};
