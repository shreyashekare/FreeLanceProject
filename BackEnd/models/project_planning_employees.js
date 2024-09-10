

module.exports = (sequelize, DataTypes) => {
  const Project_planning_employees = sequelize.define("Project_planning_employees", {
   Project_ID: {
    type: DataTypes.INTEGER,
    allowNull:true
   },
    employee_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
   
  });

  

  return Project_planning_employees;
};
