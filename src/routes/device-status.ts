import express from "express";
import Customer, { ICustomer } from "../model/customer";
import authCheck from "../middleware/auth-check";

const router = express.Router();


// getting repaired Status
router.get("/status/repaired", authCheck, (req, res, next) => {
  Customer.find({ status: "Repaired", isCollected: false, createdBy: req["userData"].userId })
    .sort("-date")
    .then(documents => {
      if (documents) {
        res.status(200).json({
          message: "Repaired devices fetched!!!",
          allRepaired: documents
        });

      } else {
        res.status(404).json({ message: "can't find repaired Devices!" });
      }
    });
});


// getting in-progress Status
router.get("/status/progress", authCheck, (req, res, next) => {
  Customer.find({ status: "In progress", createdBy: req["userData"].userId })
    .sort("-date")
    .then(documents => {
      if (documents) {
        res.status(200).json({
          message: "Customers fetched!!!",
          allInProgress: documents
        });

      } else {
        res.status(404).json({ message: "can't find status!" });
      }
    });
});


// getting unrepaired Status
router.get("/status/unrepaired", authCheck, (req, res, next) => {
  Customer.find({ status: "Unrepaired", createdBy: req["userData"].userId })
    .sort("-date")
    .then(documents => {
      if (documents) {
        res.status(200).json({
          message: "Repaired devices fetched!!!",
          allUnrepaired: documents
        });

      } else {
        res.status(404).json({ message: "can't find unrepaired Devices!" });
      }
    });
});


// getting unrepaired Status
router.get("/status/delivered", authCheck, (req, res, next) => {
  Customer.find({ isCollected: true, createdBy: req["userData"].userId })
    .sort("-date")
    .then(documents => {
      if (documents) {
        res.status(200).json({
          message: "Repaired devices fetched!!!",
          allDelivered: documents
        });

      } else {
        res.status(404).json({ message: "can't find delivered Devices!" });
      }
    });
});

export default router;
