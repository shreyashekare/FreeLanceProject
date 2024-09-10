module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define("task", {
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parentTask: {
      type: DataTypes.INTEGER,
    },
    task: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    taskDetail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estimatedHour: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    attachment: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Add any additional fields you have in your "login" table
  });

  // const Designation = require("./designation");

  // Employee.belongsTo(Designation, {
  //   foreignKey: "designation_id",
  // });

  Task.associate = (models) => {
    Task.belongsTo(models.employee, {
      foreignKey: "employee_id",
      as: "employeeDetails",
    });

    Task.belongsTo(models.project, {
      foreignKey: "project_id",
      as: "projectDetails",
    });

    Task.hasMany(models.assignTask, {
      foreignKey: "task_id",
      as: "taskdetail",
    });

    // Employee.hasMany(models.employee_Salary, {
    //   foreignKey: "employee_id",
    //   as: "employeeSalaries",
    // });
  };

  return Task;
};
