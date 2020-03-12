"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customer_1 = __importDefault(require("../model/customer"));
const router = express_1.default.Router();
router.get('/income', (req, res, next) => {
    let fetchedIncome;
    customer_1.default.find()
        .select('amount')
        .then(documents => {
        if (documents) {
            res.status(200).json({
                message: 'amount fetched!!!',
                totalAmountIncome: documents
            });
            console.log(documents);
        }
        else {
            res.status(404).json({ message: "can't find device!" });
        }
    });
});
router.get('/amount', (req, res, next) => {
    customer_1.default.find()
        .select('amount')
        .then(result => {
        let totalAmount = 0;
        result.forEach(d => {
            totalAmount += d.amount;
            console.log("====inside====");
            console.log(totalAmount);
        });
        console.log("====Amount====");
        console.log(totalAmount);
        res.json({
            message: 'Amount fetched!!!',
            amounts: totalAmount
        });
    });
});
router.get('/advance', (req, res, next) => {
    customer_1.default.find()
        .select('advancePaid')
        .then(result => {
        let totalAmount = 0;
        result.forEach(d => {
            totalAmount += d.advancePaid;
        });
        console.log("====Advance====");
        console.log(totalAmount);
        res.json({
            message: 'Advances found!!!',
            advanceAmount: totalAmount
        });
    });
});
exports.default = router;
//# sourceMappingURL=income.js.map