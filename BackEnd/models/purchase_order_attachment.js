module.exports = (sequelize, DataTypes) => {
  const Purchase_order_attachment = sequelize.define(
    "purchase_order_attachment",
    {
      purchaseOrder_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      attachment: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }
  );

  // Add any additional fields you have in your "login" table

  Purchase_order_attachment.associate = (models) => {
    Purchase_order_attachment.belongsTo(models.purchaseOrder, {
      foreignKey: "purchaseOrder_id",
      targetKey: "id",
      as: "purchaseOrder_attachment_Details",
    });
  };
  return Purchase_order_attachment;
};
