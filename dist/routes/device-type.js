"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customer_1 = __importDefault(require("../model/customer"));
const router = express_1.default.Router();
router.get('/device/computer', (req, res, next) => {
    let fetchedDevices;
    customer_1.default.find({ deviceType: 'Pc' }).sort('-date').then(document => {
        if (document) {
            res.status(200).json({
                message: 'Device type fetched!!!',
                totalPc: document
            });
            console.log(document);
        }
        else {
            res.status(404).json({ message: "can't find customer!" });
        }
    });
});
router.get('/device/android', (req, res, next) => {
    let fetchedDevices;
    customer_1.default.find({ deviceType: "Android" }).sort('-date').then(document => {
        if (document) {
            res.status(200).json(document);
            console.log(document);
        }
        else {
            res.status(404).json({ message: "can't find customer!" });
        }
    });
});
router.get('/device/ios', (req, res, next) => {
    let fetchedDevices;
    customer_1.default.find({ deviceType: "IOS" }).sort('-date').then(document => {
        if (document) {
            res.status(200).json(document);
            console.log(document);
        }
        else {
            res.status(404).json({ message: "can't find customer!" });
        }
    });
});
router.get('/device/window', (req, res, next) => {
    let fetchedDevices;
    customer_1.default.find({ deviceType: "Windows phone" }).sort('-date').then(document => {
        if (document) {
            res.status(200).json(document);
            console.log(document);
        }
        else {
            res.status(404).json({ message: "can't find customer!" });
        }
    });
});
router.get('/device/electronics', (req, res, next) => {
    let fetchedDevices;
    customer_1.default.find({ deviceType: "Electronics" }).then(document => {
        if (document) {
            res.status(200).json(document);
            console.log(document);
        }
        else {
            res.status(404).json({ message: "can't find customer!" });
        }
    });
});
router.get('/device/others', (req, res, next) => {
    let fetchedDevices;
    customer_1.default.find({ deviceType: "Others" }).then(document => {
        if (document) {
            res.status(200).json(document);
            console.log(document);
        }
        else {
            res.status(404).json({ message: "can't find customer!" });
        }
    });
});
exports.default = router;
//# sourceMappingURL=device-type.js.map