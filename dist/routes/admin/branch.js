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
const branch_1 = __importDefault(require("../../model/admin/branch"));
const auth_check_1 = __importDefault(require("../../middleware/auth-check"));
const user_1 = __importDefault(require("../../model/user"));
const customer_1 = __importDefault(require("../../model/customer"));
const transaction_1 = __importDefault(require("../../model/transaction"));
const router = express_1.default.Router();
router.post("/branch", auth_check_1.default, addBranch);
function addBranch(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const _branch = req.body;
        const branch = new branch_1.default({
            name: _branch.name,
            description: _branch.description
        });
        try {
            const result = yield branch.save();
            res.status(201).json({
                message: " added successfully!!!",
                branchName: result.name
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Somethiing went wrong!"
            });
        }
    });
}
router.get("/branch", getBranches);
function getBranches(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const branchPerPage = +req.query.pagesize;
        const currentPage = +req.query.page;
        let allBranches;
        let totalBranches;
        try {
            if (branchPerPage && currentPage) {
                totalBranches = yield branch_1.default.countDocuments()
                    .exec();
                allBranches = yield branch_1.default.find()
                    .skip(branchPerPage * (currentPage - 1))
                    .limit(branchPerPage)
                    .sort("name").exec();
            }
            else {
                totalBranches = yield branch_1.default.countDocuments()
                    .exec();
                allBranches = yield branch_1.default.find().sort("name").exec();
            }
            res.status(200).json({
                message: "Branches fetched!!!",
                allBranches: allBranches,
                totalBranches: totalBranches,
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Something went wrong!"
            });
        }
    });
}
router.get("/branch/:_id", auth_check_1.default, getBranchById);
function getBranchById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const startDate = +req.query.start_date;
        const endDate = +req.query.end_date;
        const limit = +req.query.customerLimit;
        const definedDevices = {
            android: "Android",
            ios: "IOS",
            pc: "Pc",
            electronics: "Electronics",
            windows_phone: "Windows phone",
            others: "Others"
        };
        let androids;
        let computers;
        let ios;
        let electronics;
        let windows_phone;
        let others;
        let customers;
        try {
            const branch = yield branch_1.default.findById({
                _id: req.params._id
            }).exec();
            const branchId = branch._id;
            const engineers = yield user_1.default.find({ role: "engineer", branch: branchId, isVerified: true }).exec();
            const totalEngineers = engineers.length;
            const engineerIds = engineers.map((item) => item._id);
            const totalCustomers = yield customer_1.default.countDocuments({ engineer: { $in: engineerIds } }).exec();
            if (limit) {
                customers = yield customer_1.default.find({ engineer: { $in: engineerIds } })
                    .limit(limit).exec();
            }
            else {
                customers = yield customer_1.default.find({ engineer: { $in: engineerIds } }).exec();
            }
            res.status(200).json({
                branch: branch,
                engineer: {
                    engineers: engineers,
                    totalEngineers: totalEngineers
                },
                customer: {
                    customers: customers,
                    totalCustomers: totalCustomers
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
router.get("/branch/engineer", auth_check_1.default, getBranchEngineers);
function getBranchEngineers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const branchId = req.query.branch;
        try {
            const engineers = yield user_1.default.find({ role: "engineer", branch: branchId })
                .sort("-registeredAt").exec();
            const totalEngineers = engineers.length;
            res.status(200).json({
                message: "engineer fetched!!!",
                allEngneers: engineers,
                totalEngineers: totalEngineers
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Something went wrong!"
            });
        }
    });
}
router.put("/branch/:_id", auth_check_1.default, (req, res, next) => {
    const _branch = req.body;
    branch_1.default.findById({
        _id: req.params._id
    })
        .then(branchDb => {
        if (branchDb) {
            const branchRealObj = JSON.parse(JSON.stringify(branchDb));
            const branch = Object.assign({}, branchRealObj, {
                name: _branch.name,
                description: _branch.description
            });
            branch_1.default.updateOne({ _id: req.params._id }, branch)
                .then(result => {
                if (result.nModified > 0) {
                    res.status(200).json({ message: "Successfull!" });
                }
            });
        }
        else {
            res.status(404).json({ message: "can't find branch!" });
        }
    });
});
router.delete("/branch/:_id", auth_check_1.default, (req, res, next) => {
    branch_1.default.deleteOne({
        _id: req.params._id
    })
        .then(result => {
        res.status(200).json({ message: 'Delete successfull!!!' });
    });
});
router.get("/branch/customers/:_id", auth_check_1.default, getBranchCustomers);
function getBranchCustomers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const customerPerPage = +req.query.pagesize;
        const currentPage = +req.query.page;
        let customers;
        try {
            const branch = yield branch_1.default.findById({
                _id: req.params._id
            }).exec();
            const engineers = yield user_1.default.find({
                branch: req.params._id
            }, { password: false }).sort("firstName").exec();
            const engineers_Ids = engineers.map((item) => item._id);
            const totalCustomers = yield customer_1.default.countDocuments({
                engineer: engineers_Ids
            }).exec();
            if (customerPerPage && currentPage) {
                customers = yield customer_1.default.find({
                    engineer: engineers_Ids
                }).sort("-createdAt")
                    .skip(customerPerPage * (currentPage - 1))
                    .limit(customerPerPage).exec();
            }
            else {
                customers = yield customer_1.default.find({
                    engineer: engineers_Ids
                }).sort("-createdAt").exec();
            }
            res.status(200).json({
                branch: branch,
                engineers: engineers,
                customer: {
                    customers: customers,
                    totalCustomers: totalCustomers
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
router.get("/branch/transactions/:_id", auth_check_1.default, getBranchTransactions);
function getBranchTransactions(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const customerPerPage = +req.query.pagesize;
        const currentPage = +req.query.page;
        const definedStatus = {
            progress: "In progress",
            repaired: "Repaired",
            unrepaired: "Unrepaired",
            collected: true,
        };
        let transactions;
        try {
            const branch = yield branch_1.default.findById({
                _id: req.params._id
            }).exec();
            const engineers = yield user_1.default.find({
                branch: req.params._id
            }, { password: false }).sort("firstName").exec();
            const engineers_Ids = engineers.map((item) => item._id);
            const customers = yield customer_1.default.find({
                engineer: engineers_Ids
            }).exec();
            const customers_ids = customers.map((item) => item._id);
            const totalTransactions = yield transaction_1.default.countDocuments({
                customerId: engineers_Ids
            }).exec();
            if (customerPerPage && currentPage) {
                transactions = yield transaction_1.default.find({
                    customerId: customers_ids
                }).sort("-transactionDate")
                    .skip(customerPerPage * (currentPage - 1))
                    .limit(customerPerPage).exec();
            }
            else {
                transactions = yield transaction_1.default.find({
                    customerId: customers_ids
                }).sort("-transactionDate").exec();
            }
            res.status(200).json({
                branch: branch,
                engineers: engineers,
                transaction: {
                    transactions: transactions,
                    totalTransactions: totalTransactions
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
//# sourceMappingURL=branch.js.map