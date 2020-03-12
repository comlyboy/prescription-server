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
const auth_check_1 = __importDefault(require("../../middleware/auth-check"));
const transaction_1 = __importDefault(require("../../model/transaction"));
const customer_1 = __importDefault(require("../../model/customer"));
const user_1 = __importDefault(require("../../model/user"));
const router = express_1.default.Router();
router.get("/customers/all", auth_check_1.default, (req, res, next) => {
    const customerPerPage = +req.query.pagesize;
    const currentPage = +req.query.page;
    let customerQuery = customer_1.default.find();
    let fetchedCustomers;
    if (customerPerPage && currentPage) {
        customerQuery = customer_1.default.find()
            .skip(customerPerPage * (currentPage - 1))
            .limit(customerPerPage);
    }
    customerQuery
        .sort("-createdAt")
        .then(documents => {
        fetchedCustomers = documents;
        return customer_1.default.countDocuments();
    }).then(count => {
        res.status(200).json({
            message: "Customers fetched!!!",
            allCustomers: fetchedCustomers,
            totalCustomers: count
        });
    });
});
router.get("/customer/:_id", auth_check_1.default, getCustomerById);
function getCustomerById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const limitParam = +req.query.limit;
        const definedStatus = {
            progress: "In progress",
            repaired: "Repaired",
            unrepaired: "Unrepaired",
            collected: true,
        };
        let transactions;
        let totalAmountSpent = 0;
        try {
            const customer = yield customer_1.default.findById({
                _id: req.params._id
            }).exec();
            const engineer_Id = customer.engineer;
            const engineer = yield user_1.default.findById({
                _id: engineer_Id
            }, { password: false }).exec();
            const customer_Id = customer._id;
            if (limitParam) {
                transactions = yield transaction_1.default.find({ customerId: customer_Id })
                    .sort("-transactionDate")
                    .limit(limitParam).exec();
            }
            else {
                transactions = yield transaction_1.default.find({ customerId: customer_Id })
                    .sort("-transactionDate").exec();
            }
            const totalTransactions = yield transaction_1.default.countDocuments({ customerId: customer_Id }).exec();
            const spent = yield transaction_1.default.find({ customerId: customer_Id })
                .select("advance").exec();
            spent.forEach(d => {
                totalAmountSpent += d.advance;
            });
            res.status(200).json({
                customer,
                engineer: {
                    _id: engineer._id,
                    firstName: engineer.firstName,
                    lastName: engineer.lastName,
                    userName: engineer.userName
                },
                transaction: {
                    totalTransactions: totalTransactions,
                    totalAmountSpent: totalAmountSpent,
                    transactions: transactions
                }
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Something went wrong!"
            });
        }
    });
}
exports.default = router;
//# sourceMappingURL=customers.js.map