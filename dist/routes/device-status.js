"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customer_1 = __importDefault(require("../model/customer"));
const auth_check_1 = __importDefault(require("../middleware/auth-check"));
const router = express_1.default.Router();
router.get("/status/repaired", auth_check_1.default, (req, res, next) => {
    customer_1.default.find({ status: "Repaired", isCollected: false, createdBy: req["userData"].userId })
        .sort("-date")
        .then(documents => {
        if (documents) {
            res.status(200).json({
                message: "Repaired devices fetched!!!",
                allRepaired: documents
            });
        }
        else {
            res.status(404).json({ message: "can't find repaired Devices!" });
        }
    });
});
router.get("/status/progress", auth_check_1.default, (req, res, next) => {
    customer_1.default.find({ status: "In progress", createdBy: req["userData"].userId })
        .sort("-date")
        .then(documents => {
        if (documents) {
            res.status(200).json({
                message: "Customers fetched!!!",
                allInProgress: documents
            });
        }
        else {
            res.status(404).json({ message: "can't find status!" });
        }
    });
});
router.get("/status/unrepaired", auth_check_1.default, (req, res, next) => {
    customer_1.default.find({ status: "Unrepaired", createdBy: req["userData"].userId })
        .sort("-date")
        .then(documents => {
        if (documents) {
            res.status(200).json({
                message: "Repaired devices fetched!!!",
                allUnrepaired: documents
            });
        }
        else {
            res.status(404).json({ message: "can't find unrepaired Devices!" });
        }
    });
});
router.get("/status/delivered", auth_check_1.default, (req, res, next) => {
    customer_1.default.find({ isCollected: true, createdBy: req["userData"].userId })
        .sort("-date")
        .then(documents => {
        if (documents) {
            res.status(200).json({
                message: "Repaired devices fetched!!!",
                allDelivered: documents
            });
        }
        else {
            res.status(404).json({ message: "can't find delivered Devices!" });
        }
    });
});
exports.default = router;
//# sourceMappingURL=device-status.js.map