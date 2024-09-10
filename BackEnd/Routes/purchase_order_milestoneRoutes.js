const db = require("../models");
const express = require("express");
const { Op, literal } = require("sequelize");
const PurchaseOrderMileStone = db.purchase_order_milestone;
const router = express.Router();

router.get("/getpurchase_order_milestones", async (req, res) => {
  try {
    const purchaseOrder_milestone = await PurchaseOrderMileStone.findAll({
      include: [
        {
          model: db.purchaseOrder,
          as: "purchaseOrder_Details",
        },
      ],
    });

    // Send the retrieved designations as a JSON response
    res.json({
      status: "Success",
      data: purchaseOrder_milestone,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});

module.exports = router;
