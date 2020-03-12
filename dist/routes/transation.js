"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const random_1 = __importDefault(require("random"));
const transaction_1 = __importDefault(require("../model/transaction"));
const auth_check_1 = __importDefault(require("../middleware/auth-check"));
const router = express_1.default.Router();
router.post("/transaction", auth_check_1.default, newTransaction);
function newTransaction(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const _transaction = req.body;
        let transactId = random_1.default.int(111111111, 999999999);
        const transactionOBJ = new transaction_1.default({
            deviceType: _transaction.deviceType,
            brandModel: _transaction.brandModel,
            imeiNumber: _transaction.imeiNumber,
            amount: _transaction.amount,
            advance: _transaction.advance,
            description: _transaction.description,
            customerId: _transaction.customerId,
            transactionId: transactId,
        });
        try {
            const result = yield transactionOBJ.save();
            console.log(result);
            res.status(201).json({
                message: "Successfully!",
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Somethiing went wrong!"
            });
        }
    });
}
//# sourceMappingURL=transation.js.map