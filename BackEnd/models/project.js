module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define("project", {
    project: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },

    // Add any additional fields you have in your "login" table
  });

  Project.associate = (models) => {
    Project.hasMany(models.task, {
      foreignKey: "project_id",
      as: "projectdata",
    });
  };

  return Project;
};
