"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customer_1 = __importDefault(require("../model/customer"));
const auth_check_1 = __importDefault(require("../middleware/auth-check"));
const router = express_1.default.Router();
router.get("/metrics/repaired", auth_check_1.default, (req, res, next) => {
    customer_1.default.find({ status: "Repaired", isCollected: false, engineer: req["userData"].userId })
        .countDocuments()
        .then(documents => {
        res.status(200).json({
            message: "Customers fetched!!!",
            totalRepaired: documents
        });
    });
});
router.get("/metrics/progress", auth_check_1.default, (req, res, next) => {
    customer_1.default.find({ status: "In progress", engineer: req["userData"].userId })
        .countDocuments()
        .then(documents => {
        res.status(200).json({
            message: "Customers fetched!!!",
            totalProgress: documents
        });
    });
});
router.get("/metrics/unrepaired", auth_check_1.default, (req, res, next) => {
    customer_1.default.find({ status: "Unrepaired", engineer: req["userData"].userId })
        .countDocuments()
        .then(documents => {
        res.status(200).json({
            message: "Unrepaired devices fetched!!!",
            totalUnrepaired: documents
        });
    });
});
router.get("/metrics/delivered", auth_check_1.default, (req, res, next) => {
    customer_1.default.find({ status: "Repaired", isCollected: true, engineer: req["userData"].userId })
        .countDocuments()
        .then(documents => {
        res.status(200).json({
            message: "Customers fetched!!!",
            totalDelivered: documents
        });
    });
});
router.get("/metrics/ios", auth_check_1.default, (req, res, next) => {
    customer_1.default.find({ deviceType: "IOS", engineer: req["userData"].userId })
        .countDocuments()
        .then(documents => {
        res.status(200).json({
            message: "Customers fetched!!!",
            totalDelivered: documents
        });
    });
});
router.get("/metrics/android", auth_check_1.default, (req, res, next) => {
    customer_1.default.find({ deviceType: "Android", engineer: req["userData"].userId })
        .countDocuments()
        .then(documents => {
        res.status(200).json({
            message: "Customers fetched!!!",
            totalDelivered: documents
        });
    });
});
router.get("/metrics/pc", auth_check_1.default, (req, res, next) => {
    customer_1.default.find({ deviceType: "Pc", engineer: req["userData"].userId })
        .countDocuments()
        .then(documents => {
        res.status(200).json({
            message: "Customers fetched!!!",
            totalDelivered: documents
        });
    });
});
router.get("/metrics/window", auth_check_1.default, (req, res, next) => {
    customer_1.default.find({ deviceType: "Window phone" })
        .countDocuments()
        .then(documents => {
        res.status(200).json({
            message: "Customers fetched!!!",
            totalDelivered: documents
        });
    });
});
router.get("/metrics/electronics", auth_check_1.default, (req, res, next) => {
    customer_1.default.find({
        deviceType: "Electronics",
        engineer: req["userData"].userId
    })
        .countDocuments()
        .then(documents => {
        res.status(200).json({
            message: "Customers fetched!!!",
            totalDelivered: documents
        });
    });
});
router.get("/metrics/others", auth_check_1.default, (req, res, next) => {
    customer_1.default.find({ deviceType: "Others", engineer: req["userData"].userId })
        .countDocuments()
        .then(documents => {
        res.status(200).json({
            message: "Customers fetched!!!",
            totalDelivered: documents
        });
    });
});
router.get('/metrics/amount', auth_check_1.default, (req, res, next) => {
    customer_1.default.find({ engineer: req["userData"].userId })
        .select('amount')
        .then(result => {
        let totalCharge = 0;
        result.forEach(d => {
            totalCharge += d.amount;
        });
        res.json({
            message: 'Amounts fetched!!!',
            amounts: totalCharge
        });
    });
});
router.get('/metrics/advance', auth_check_1.default, (req, res, next) => {
    customer_1.default.find({ engineer: req["userData"].userId })
        .select('advance')
        .then(result => {
        let totalAdvance = 0;
        if (result) {
            result.forEach(d => {
                totalAdvance += d.advance;
            });
            res.json({
                message: 'Advances found!!!',
                amountPaid: totalAdvance
            });
        }
    });
});
exports.default = router;
//# sourceMappingURL=all-metrics.js.map