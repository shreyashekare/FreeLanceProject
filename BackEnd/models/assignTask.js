module.exports = (sequelize, DataTypes) => {
  const AssignTask = sequelize.define("assignTask", {
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Add any additional fields you have in your "login" table
  });

  AssignTask.associate = (models) => {
    AssignTask.belongsTo(models.employee, {
      foreignKey: "employee_id",
      as: "employeeDetails",
    });

    AssignTask.belongsTo(models.task, {
      foreignKey: "task_id",
      as: "taskDetails",
    });
  };
  return AssignTask;
};
