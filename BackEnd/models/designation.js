module.exports = (sequelize, DataTypes) => {
  const Designation = sequelize.define("designation", {
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },

    // Add any additional fields you have in your "login" table
  });

  Designation.associate = (models) => {
    Designation.hasMany(models.employee, {
      foreignKey: "designation_id",
      as: "employees",
    });
  };

  return Designation;
};
