module.exports = (sequelize, DataTypes) => {
  const PurchaseOrder = sequelize.define("purchaseOrder", {
    clientName_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    purchaseOrderNo: {
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

    // Add any additional fields you have in your "login" table
  });

  PurchaseOrder.associate = (models) => {
    PurchaseOrder.belongsTo(models.clientName, {
      foreignKey: "clientName_id",
      as: "clientNameDetails",
    });

    //     Task.belongsTo(models.project, {
    //       foreignKey: "project_id",
    //       as: "projectDetails",
    //     });

    PurchaseOrder.hasMany(models.purchase_order_milestone, {
      foreignKey: "purchaseOrder_id",
      as: "purchase_order_detail",
    });

    PurchaseOrder.hasMany(models.purchase_order_attachment, {
      foreignKey: "purchaseOrder_id",
      as: "purchase_order_attachment_detail",
    });

    PurchaseOrder.hasMany(models.project_planning, {
      foreignKey: "purchaseOrder_id",
      as: "purchase_order_details",
    });
  };

  return PurchaseOrder;
};
