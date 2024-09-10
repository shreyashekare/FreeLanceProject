const db = require("../models");
const express = require("express");
const multer = require("multer");
const { Op } = require("sequelize");
const project_planning = require("../models/project_planning");

const PurchaseOrder = db.purchaseOrder;
const PurchaseOrderMileStone = db.purchase_order_milestone;
const Purchase_order_attachment = db.purchase_order_attachment;
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadStorage = multer({ storage: storage });

/////////////// add PurchaseOrder api ///////////////////
async function addAttachments(purchaseOrderId, attachment) {
  try {
    // Save each milestone detail to the database
    for (const files of attachment) {
      await Purchase_order_attachment.create({
        purchaseOrder_id: purchaseOrderId,
        attachment: files, // Accessing milestoneValue property correctly
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Function to add milestones
async function addMilestones(purchaseOrderId, milestones) {
  try {
    await PurchaseOrderMileStone.destroy({
      where: { purchaseOrder_id: purchaseOrderId },
    });

    // Save each milestone detail to the database
    for (const milestone of milestones) {
      await PurchaseOrderMileStone.create({
        purchaseOrder_id: purchaseOrderId,
        milestone: milestone.milestone, // Accessing milestone property correctly
        milestoneValue: milestone.milestoneValue, // Accessing milestoneValue property correctly
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

router.post(
  "/addPurchaseOrder",
  uploadStorage.array("file"),
  async (req, res) => {
    try {
      console.log("Received files:", req.files); // Log the files received by Multer

      // Extract form data
      const { clientName_id, purchaseOrderNo, startDate, endDate } = req.body;

      // Map the filenames of all uploaded files
      const attachment = req.files.map((file) => file.filename);

      // Create a new purchase order with the form data and attachments
      const newPurchaseOrder = await PurchaseOrder.create({
        clientName_id,
        purchaseOrderNo,
        startDate,
        endDate,
      });

      // Extract the newly created purchase order ID
      const purchaseOrderId = newPurchaseOrder.id;

      // Extract milestone details from the request body
      const mileStoneDetails = JSON.parse(req.body.milestones);
      console.log("milestonesdetails", req.body.milestones);

      // Add milestones for the newly created purchase order
      await addMilestones(purchaseOrderId, mileStoneDetails);
      await addAttachments(purchaseOrderId, attachment);

      return res
        .status(201)
        .json({ message: "Purchase order and milestones added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

////////////////////// get all purchase order ///////////////////////////
router.get("/getpurchase_order", async (req, res) => {
  try {
    const purchaseOrderDetails = await PurchaseOrder.findAll({
      include: [
        {
          model: db.purchase_order_milestone,
          as: "purchase_order_detail",
        },
        {
          model: db.clientName,
          as: "clientNameDetails",
        },
        {
          model: db.project_planning,
          as: "purchase_order_details",
          attributes: ['status'],  // Adjust attributes as needed
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Send the retrieved purchase order details as a JSON response
    res.json({
      status: "Success",
      data: purchaseOrderDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});

// router.get("/getpurchase_order", async (req, res) => {
//   try {
//     const purchaseOrder_milestone = await PurchaseOrder.findAll({
//       include: [
//         {
//           model: db.purchase_order_milestone,
//           as: "purchase_order_detail",
//         },
//         {
//           model: db.clientName,
//           as: "clientNameDetails",
//         },
//       ],
//       order: [['createdAt', 'ASC']] // or 'DESC' for descending order
//     });

//     // Send the retrieved designations as a JSON response
//     res.json({
//       status: "Success",
//       data: purchaseOrder_milestone,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       status: "Error",
//       message: "Internal server error",
//     });
//   }
// });


///////////////////////////////get purchase order by id//////////////////////////
router.get("/getPurchaseOrder/:id", async (req, res) => {
  try {
    const purchaseOrderId = req.params.id;

    // Find a designation by ID
    const purchaseOrder = await PurchaseOrder.findByPk(purchaseOrderId, {
      include: [
        {
          model: db.purchase_order_milestone,
          as: "purchase_order_detail",
        },
        {
          model: db.clientName,
          as: "clientNameDetails",
        },
        {
          model: db.purchase_order_attachment,
          as: "purchase_order_attachment_detail",
        },
      ],
    });

    if (!purchaseOrder) {
      return res.status(404).json({
        status: "Error",
        message: "purchaseOrder not found",
      });
    }

    // Send the retrieved designation as a JSON response
    res.json({
      status: "Success",
      data: purchaseOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
});

////////////////////////////////// Update api /////////////////////////////////////////

router.put(
  "/updatePurchaseOrder/:id",
  uploadStorage.array("file"),
  async (req, res) => {
    try {
      console.log("Received files:", req.files); // Log the files received by Multer

      // Extract form data
      const {
        clientName_id,
        purchaseOrderNo,
        startDate,
        endDate,
        removedAttachments,
      } = req.body;

      // Map the filenames of all uploaded files
      const attachment = req.files.map((file) => file.filename);

      // Extract milestone details from the request body
      const mileStoneDetails = JSON.parse(req.body.milestones);
      console.log("milestonesdetails", req.body.milestones);

      const purchaseOrderId = req.params.id;

      // Update purchase order details
      await PurchaseOrder.update(
        {
          clientName_id,
          purchaseOrderNo,
          startDate,
          endDate,
        },
        {
          where: { id: purchaseOrderId },
        }
      );

      // Delete existing milestones for the purchase order
      await PurchaseOrderMileStone.destroy({
        where: { purchaseOrder_id: purchaseOrderId },
      });

      // Add updated milestones for the purchase order
      for (const milestone of mileStoneDetails) {
        await PurchaseOrderMileStone.create({
          purchaseOrder_id: purchaseOrderId,
          milestone: milestone.milestone,
          milestoneValue: milestone.milestoneValue,
        });
      }

      // Parse removedAttachments if it's provided, otherwise, initialize as an empty array
      const removedAttachmentsArray = removedAttachments
        ? JSON.parse(removedAttachments)
        : [];

      // Delete existing attachments if removedAttachments are provided
      for (const removedAttachment of removedAttachmentsArray) {
        try {
          await Purchase_order_attachment.destroy({
            where: { id: removedAttachment.id },
          });

          console.log(
            `Attachment with ID ${removedAttachment.id} deleted successfully`
          );
        } catch (error) {
          console.error(
            `Error deleting attachment with ID ${removedAttachment.id}:`,
            error
          );
          // Handle the error as needed
        }
      }

      // Add updated attachments for the purchase order
      for (const file of attachment) {
        try {
          await Purchase_order_attachment.create({
            purchaseOrder_id: purchaseOrderId,
            attachment: file,
          });
          console.log(`Attachment ${file} added successfully`);
        } catch (error) {
          console.error(`Error adding attachment ${file}:`, error);
          // Handle the error as needed
        }
      }

      return res
        .status(200)
        .json({ message: "Purchase order updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
