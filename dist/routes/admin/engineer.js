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
const user_1 = __importDefault(require("../../model/user"));
const branch_1 = __importDefault(require("../../model/admin/branch"));
const auth_check_1 = __importDefault(require("../../middleware/auth-check"));
const customer_1 = __importDefault(require("../../model/customer"));
const transaction_1 = __importDefault(require("../../model/transaction"));
const router = express_1.default.Router();
router.get("/engineer", auth_check_1.default, getEngineers);
function getEngineers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const definedRoles = {
            engineer: "engineer"
        };
        const branchQuery = req.query.branch;
        const positionQuery = req.query.position;
        const SearchQuery = req.query.search;
        let fetchedEngineers;
        let query;
        try {
            if (branchQuery) {
                query = user_1.default.find({ branch: branchQuery, role: definedRoles.engineer, isVerified: true }, { password: false });
            }
            else {
                query = user_1.default.find({ role: definedRoles.engineer, isVerified: true }, { password: false });
            }
            const engineersCount = yield user_1.default.countDocuments({ role: definedRoles.engineer, isVerified: true }).exec();
            const fetchedEngineers = yield query.sort("firstName").exec();
            const branchIds = fetchedEngineers.map((item) => item.branch);
            const branch = yield branch_1.default.find({ _id: { $in: branchIds } }).exec();
            const _fetchedEngineersPlain = JSON.parse(JSON.stringify(fetchedEngineers));
            const _branch = JSON.parse(JSON.stringify(branch));
            const _fetchedEngineers = _fetchedEngineersPlain.map((item) => {
                item["branch"] = _branch.find((br) => br._id === item.branch);
                return item;
            });
            res.status(200).json({
                message: "Engineers fetched!!!",
                allEngineers: _fetchedEngineers,
                totalEngineers: engineersCount
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Something went wrong!"
            });
        }
    });
}
router.get("/engineer/:_id", auth_check_1.default, getEngineerById);
function getEngineerById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const limitParam = +req.query.limit;
        const definedStatus = {
            progress: "In progress",
            repaired: "Repaired",
            unrepaired: "Unrepaired",
            collected: true,
        };
        let customers;
        try {
            const engineer = yield user_1.default.findById({
                _id: req.params._id
            }, { password: false }).exec();
            const branchId = engineer.branch;
            const branch = yield branch_1.default.findById({ _id: branchId }).exec();
            const totalCustomers = yield customer_1.default.countDocuments({
                engineer: engineer._id
            }).sort("-createdAt").exec();
            if (limitParam) {
                customers = yield customer_1.default.find({
                    engineer: engineer._id
                }).sort("-createdAt")
                    .limit(limitParam).exec();
            }
            else {
                customers = yield customer_1.default.find({
                    engineer: engineer._id
                }).sort("-createdAt").exec();
            }
            res.status(200).json({
                engineer,
                branch,
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
router.get("/engineer/customers/:_id", auth_check_1.default, getEngineerCustomer);
function getEngineerCustomer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const customerPerPage = +req.query.pagesize;
        const currentPage = +req.query.page;
        const definedStatus = {
            progress: "In progress",
            repaired: "Repaired",
            unrepaired: "Unrepaired",
            collected: true,
        };
        let customers;
        try {
            const engineer = yield user_1.default.findById({
                _id: req.params._id
            }, { password: false }).exec();
            const totalCustomers = yield customer_1.default.countDocuments({
                engineer: engineer._id
            }).sort("-createdAt").exec();
            if (customerPerPage && currentPage) {
                customers = yield customer_1.default.find({
                    engineer: engineer._id
                }).sort("-createdAt")
                    .skip(customerPerPage * (currentPage - 1))
                    .limit(customerPerPage).exec();
            }
            else {
                customers = yield customer_1.default.find({
                    engineer: engineer._id
                }).sort("-createdAt").exec();
            }
            res.status(200).json({
                engineer,
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
router.get("/engineer/transactions/:_id", auth_check_1.default, getEngineerTransactions);
function getEngineerTransactions(req, res, next) {
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
            const engineer = yield user_1.default.findById({
                _id: req.params._id
            }, { password: false }).exec();
            const customerId = yield customer_1.default.find({
                engineer: req.params._id
            }).select("_id").exec();
            const customer_Ids = customerId.map((item) => item._id);
            const totalTransactions = yield transaction_1.default.countDocuments({ _id: { $in: customer_Ids } }).exec();
            if (customerPerPage && currentPage) {
                transactions = yield transaction_1.default.find({ _id: { $in: customer_Ids } })
                    .sort("-transactionDate")
                    .skip(customerPerPage * (currentPage - 1))
                    .limit(customerPerPage).exec();
            }
            else {
                transactions = yield transaction_1.default.find({ _id: { $in: customer_Ids } })
                    .sort("-transactionDate").exec();
            }
            res.status(200).json({
                engineer,
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
router.get('/engineer/income', auth_check_1.default, getEngineerIncomeMetrics);
function getEngineerIncomeMetrics(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const engineerId = req.query.engineer;
        let totalAdvance = 0;
        try {
            const stats = yield customer_1.default.find({ engineer: engineerId })
                .select('advance').exec();
            console.log(stats);
            stats.forEach(d => {
                totalAdvance += d.advance;
                console.log(totalAdvance);
            });
            res.status(200).json({
                totalAdvance: totalAdvance,
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Something went wrong!"
            });
        }
    });
}
router.get('/engineer/summary/metrics', auth_check_1.default, getEngineerSummaryMetrics);
function getEngineerSummaryMetrics(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const startDate = +req.query.start_date;
        const endDate = +req.query.end_date;
        const engineerId = req.query.user;
        const definedStatus = {
            progress: "In progress",
            repaired: "Repaired",
            unrepaired: "Unrepaired",
            collected: true,
        };
        let totalCustomers;
        let totalEmployees;
        let totalBranches;
        let advance;
        let totalRepaired;
        let totalInProgress;
        let totalUnrepaired;
        let totalCollected;
        let totalAdvance = 0;
        let totalAmount = 0;
        try {
            if (startDate && endDate) {
                totalCustomers = yield customer_1.default.find({
                    engineer: engineerId
                }).countDocuments().exec();
                advance = yield customer_1.default.find({
                    engineer: engineerId
                }).select('advance').exec();
                totalRepaired = yield customer_1.default.find({
                    status: definedStatus.repaired,
                    isCollected: !definedStatus.collected,
                    engineer: engineerId
                }).countDocuments().exec();
                totalInProgress = yield customer_1.default.find({
                    status: definedStatus.progress,
                    engineer: engineerId
                }).countDocuments().exec();
                totalUnrepaired = yield customer_1.default.find({
                    status: definedStatus.unrepaired,
                    engineer: engineerId
                }).countDocuments().exec();
                totalCollected = yield customer_1.default.find({
                    status: definedStatus.repaired,
                    isCollected: definedStatus.collected,
                    engineer: engineerId
                }).countDocuments().exec();
                advance.forEach(d => {
                    totalAdvance += d.advance;
                });
            }
            else {
                totalCustomers = yield customer_1.default.find({
                    engineer: engineerId
                }).countDocuments().exec();
                advance = yield customer_1.default.find({
                    engineer: engineerId
                }).select('advance').exec();
                totalRepaired = yield customer_1.default.find({
                    status: definedStatus.repaired,
                    isCollected: !definedStatus.collected,
                    engineer: engineerId
                }).countDocuments().exec();
                totalInProgress = yield customer_1.default.find({
                    status: definedStatus.progress,
                    engineer: engineerId
                }).countDocuments().exec();
                totalUnrepaired = yield customer_1.default.find({
                    status: definedStatus.unrepaired,
                    engineer: engineerId
                }).countDocuments().exec();
                totalCollected = yield customer_1.default.find({
                    status: definedStatus.repaired,
                    isCollected: definedStatus.collected,
                    engineer: engineerId
                }).countDocuments().exec();
                advance.forEach(d => {
                    totalAdvance += d.advance;
                });
            }
            res.status(200).json({
                totalCustomers: totalCustomers,
                totalIncome: totalAdvance,
                totalRepaired: totalRepaired,
                totalInProgress: totalInProgress,
                totalUnrepaired: totalUnrepaired,
                totalCollected: totalCollected,
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Something went wrong!"
            });
        }
    });
}
router.get('/engineer/status/metrics', auth_check_1.default, getEngineerStatusMetrics);
function getEngineerStatusMetrics(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const startDate = +req.query.start_date;
        const endDate = +req.query.end_date;
        const engineerId = req.query.user;
        const definedStatus = {
            progress: "In progress",
            repaired: "Repaired",
            unrepaired: "Unrepaired",
            collected: true,
        };
        let totalRepaired;
        let totalInProgress;
        let totalUnrepaired;
        try {
            totalRepaired = yield customer_1.default.find({
                status: definedStatus.repaired,
                isCollected: !definedStatus.collected,
                engineer: engineerId
            }).countDocuments().exec();
            totalInProgress = yield customer_1.default.find({
                status: definedStatus.progress,
                engineer: engineerId
            }).countDocuments().exec();
            totalUnrepaired = yield customer_1.default.find({
                status: definedStatus.unrepaired,
                engineer: engineerId
            }).countDocuments().exec();
            res.status(200).json({
                totalRepaired: {
                    'name': 'Repaired',
                    'value': totalRepaired
                },
                totalInProgress: {
                    'name': 'In progress',
                    'value': totalInProgress
                },
                totalUnrepaired: {
                    'name': 'Unrepaired',
                    'value': totalUnrepaired
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
router.get('/engineer/device_type/metrics', auth_check_1.default, getEngineerDeviceTypeMetrics);
function getEngineerDeviceTypeMetrics(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const startDate = +req.query.start_date;
        const endDate = +req.query.end_date;
        const engineerId = req.query.user;
        const definedDevices = {
            android: "Android",
            ios: "IOS",
            pc: "Pc",
            electronics: "Electronics",
            windows_phone: "Window phone",
            others: "Others",
        };
        let androids;
        let computers;
        let ios;
        let electronics;
        let windows_phone;
        let others;
        try {
            androids = yield customer_1.default.find({
                deviceType: definedDevices.android,
                engineer: engineerId
            }).countDocuments().exec();
            computers = yield customer_1.default.find({
                deviceType: definedDevices.pc,
                engineer: engineerId
            }).countDocuments().exec();
            ios = yield customer_1.default.find({
                deviceType: definedDevices.ios,
                engineer: engineerId
            }).countDocuments().exec();
            electronics = yield customer_1.default.find({
                deviceType: definedDevices.electronics,
                engineer: engineerId
            }).countDocuments().exec();
            windows_phone = yield customer_1.default.find({
                deviceType: definedDevices.windows_phone,
                engineer: engineerId
            }).countDocuments().exec();
            others = yield customer_1.default.find({
                deviceType: definedDevices.others,
                engineer: engineerId
            }).countDocuments().exec();
            res.status(200).json({
                totalComputers: {
                    'name': 'Computers',
                    'value': computers
                },
                totalAndroids: {
                    'name': 'Android',
                    'value': androids
                },
                totalIos: {
                    'name': 'IOS',
                    'value': ios
                },
                totalElectronics: {
                    'name': 'Electronics',
                    'value': electronics
                },
                totalWindowsPhone: {
                    'name': 'Windows phone',
                    'value': windows_phone
                },
                totalOthers: {
                    'name': 'Others',
                    'value': others
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
router.get("/new/engineer_as_notifications", auth_check_1.default, getNotifications);
function getNotifications(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const definedRoles = {
            engineer: "engineer"
        };
        try {
            const fetchedNotifications = yield user_1.default.find({ role: "engineer", isVerified: false })
                .sort("-registeredAt").exec();
            const count = yield user_1.default.countDocuments({ role: definedRoles.engineer, isVerified: false }).exec();
            res.status(200).json({
                message: "Notifications fetched!!!",
                allNotifications: fetchedNotifications,
                totalNotifications: count
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Something went wrong!"
            });
        }
    });
}
router.put("/new/engineer_as_notifications/:_id", auth_check_1.default, userLastLogin);
function userLastLogin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield user_1.default.updateOne({
                _id: req.params._id
            }, {
                $set: {
                    isVerified: true
                }
            }).exec();
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
exports.default = router;
//# sourceMappingURL=engineer.js.map