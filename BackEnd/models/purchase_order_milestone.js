module.exports = (sequelize, DataTypes) => {
  const Purchase_order_milestone = sequelize.define(
    "purchase_order_milestone",
    {
      purchaseOrder_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      milestone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      milestoneValue: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }
  );

  // Add any additional fields you have in your "login" table

  Purchase_order_milestone.associate = (models) => {
    Purchase_order_milestone.belongsTo(models.purchaseOrder, {
      foreignKey: "purchaseOrder_id",
      targetKey: "id",
      as: "purchaseOrder_Details",
    });
  };
  return Purchase_order_milestone;
};
