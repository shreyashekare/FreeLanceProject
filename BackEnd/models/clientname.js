module.exports = (sequelize, DataTypes) => {
  const ClientName = sequelize.define("clientName", {
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Add any additional fields you have in your "login" table
  });

  ClientName.associate = (models) => {
    // ClientName.hasMany(models.employee, {
    //   foreignKey: "clientName_id",
    //   as: "clientNameinfo",
    // });

    ClientName.hasMany(models.purchaseOrder, {
      foreignKey: "clientName_id",
      as: "clientName_details",
    });
  };

  return ClientName;
};
