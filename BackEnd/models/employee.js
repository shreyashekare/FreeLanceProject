// module.exports = (sequelize, DataTypes) => {
//   const Employee = sequelize.define("employee", {
//     firstName: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     midName: {
//       type: DataTypes.STRING,
//     },
//     lastName: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     contact: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     address: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     panCard: {
//       type: DataTypes.STRING,
//     },
//     adhar: {
//       type: DataTypes.INTEGER,
//     },

//     dob: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     joiningDate: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     relievingDate: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     gender: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     status: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//     },
//     designation_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     // Add any additional fields you have in your "login" table
//   });

//   // const Designation = require("./designation");

//   // Employee.belongsTo(Designation, {
//   //   foreignKey: "designation_id",
//   // });

//   Employee.associate = (models) => {
//     Employee.belongsTo(models.designation, {
//       foreignKey: "designation_id",
//       as: "employeeDesignation",
//     });

//     // // Association with DailyExpenses model
//     Employee.hasMany(models.task, {
//       foreignKey: "employee_id",
//       as: "employee",
//     });

//     Employee.hasMany(models.assignTask, {
//       foreignKey: "employee_id",
//       as: "employeedetail",
//     });

//     Employee.hasMany(models.project_planning_activitie, {
//       foreignKey: "assignedTo_employeeID",
//       as: "employeeDetail",
//     });
//   };

//   return Employee;
// };
module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define("employee", {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    midName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    panCard: {
      type: DataTypes.STRING,
    },
    adhar: {
      type: DataTypes.INTEGER,
    },

    dob: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    joiningDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    relievingDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    designation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Add any additional fields you have in your "login" table
  });

  // const Designation = require("./designation");

  // Employee.belongsTo(Designation, {
  //   foreignKey: "designation_id",
  // });

  Employee.associate = (models) => {
    Employee.belongsTo(models.designation, {
      foreignKey: "designation_id",
      as: "employeeDesignation",
    });

    // // Association with DailyExpenses model
    Employee.hasMany(models.task, {
      foreignKey: "employee_id",
      as: "employee",
    });

    Employee.hasMany(models.assignTask, {
      foreignKey: "employee_id",
      as: "employeedetail",
    });
    

    Employee.hasMany(models.project_planning_activitie, {
      foreignKey: "assignedTo_employeeID",
      as: "employeeDetail",
    });

    Employee.hasMany(models. activity_time_tracking, {
      foreignKey: 'AddedBy_EmployeeID',
      as: 'employeeName',
    });

  };

  return Employee;
};