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
const auth_check_1 = __importDefault(require("../../middleware/auth-check"));
const customer_1 = __importDefault(require("../../model/customer"));
const branch_1 = __importDefault(require("../../model/admin/branch"));
const router = express_1.default.Router();
router.get('/device_type/metrics', auth_check_1.default, getDeviceTypeMetrics);
function getDeviceTypeMetrics(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const startDate = +req.query.start_date;
        const endDate = +req.query.end_date;
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
        try {
            if (startDate && endDate) {
                androids = yield customer_1.default.find({
                    deviceType: definedDevices.android, createdAt: { $lt: endDate }
                }).countDocuments().exec();
                computers = yield customer_1.default.find({
                    deviceType: definedDevices.pc, createdAt: { $lt: endDate }
                }).countDocuments().exec();
                ios = yield customer_1.default.find({
                    deviceType: definedDevices.ios, createdAt: { $lt: endDate }
                }).countDocuments().exec();
                electronics = yield customer_1.default.find({
                    deviceType: definedDevices.electronics, createdAt: { $lt: endDate }
                }).countDocuments().exec();
                windows_phone = yield customer_1.default.find({
                    deviceType: definedDevices.windows_phone, createdAt: { $lt: endDate }
                }).countDocuments().exec();
                others = yield customer_1.default.find({
                    deviceType: definedDevices.others, createdAt: { $lt: endDate }
                }).countDocuments().exec();
            }
            else {
                androids = yield customer_1.default.find({
                    deviceType: definedDevices.android
                }).countDocuments().exec();
                computers = yield customer_1.default.find({
                    deviceType: definedDevices.pc
                }).countDocuments().exec();
                ios = yield customer_1.default.find({
                    deviceType: definedDevices.ios,
                }).countDocuments().exec();
                electronics = yield customer_1.default.find({
                    deviceType: definedDevices.electronics,
                }).countDocuments().exec();
                windows_phone = yield customer_1.default.find({
                    deviceType: definedDevices.windows_phone,
                }).countDocuments().exec();
                others = yield customer_1.default.find({
                    deviceType: definedDevices.others,
                }).countDocuments().exec();
            }
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
router.get('/summary/metrics', auth_check_1.default, getAllMetrics);
function getAllMetrics(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const startDate = +req.query.start_date;
        const endDate = +req.query.end_date;
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
                totalCustomers = yield customer_1.default.find({ createdAt: { $lt: endDate } })
                    .countDocuments().exec();
                totalEmployees = yield user_1.default.find({ role: "engineer" })
                    .countDocuments().exec();
                totalBranches = yield branch_1.default.find()
                    .countDocuments().exec();
                advance = yield customer_1.default.find({ createdAt: { $lt: endDate } })
                    .select('advance').exec();
                totalRepaired = yield customer_1.default.find({
                    status: definedStatus.repaired,
                    isCollected: !definedStatus.collected,
                    createdAt: { $lt: endDate }
                }).countDocuments().exec();
                totalInProgress = yield customer_1.default.find({
                    status: definedStatus.progress,
                    createdAt: { $lt: endDate }
                }).countDocuments().exec();
                totalUnrepaired = yield customer_1.default.find({
                    status: definedStatus.unrepaired,
                    createdAt: { $lt: endDate }
                }).countDocuments().exec();
                totalCollected = yield customer_1.default.find({
                    status: definedStatus.repaired,
                    isCollected: definedStatus.collected,
                    createdAt: { $lt: endDate }
                }).countDocuments().exec();
                advance.forEach(d => {
                    totalAdvance += d.advance;
                });
            }
            else {
                totalCustomers = yield customer_1.default.find()
                    .countDocuments().exec();
                totalEmployees = yield user_1.default.find({ role: "engineer" })
                    .countDocuments().exec();
                totalBranches = yield branch_1.default.find()
                    .countDocuments().exec();
                advance = yield customer_1.default.find()
                    .select('advance').exec();
                totalRepaired = yield customer_1.default.find({
                    status: definedStatus.repaired,
                    isCollected: !definedStatus.collected
                }).countDocuments().exec();
                totalInProgress = yield customer_1.default.find({
                    status: definedStatus.progress
                }).countDocuments().exec();
                totalUnrepaired = yield customer_1.default.find({
                    status: definedStatus.unrepaired
                }).countDocuments().exec();
                totalCollected = yield customer_1.default.find({
                    status: definedStatus.repaired,
                    isCollected: definedStatus.collected
                }).countDocuments().exec();
                advance.forEach(d => {
                    totalAdvance += d.advance;
                });
            }
            res.status(200).json({
                totalCustomers: totalCustomers,
                totalEmployees: totalEmployees,
                totalBranches: totalBranches,
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
router.get('/status/metrics', getStatusMetrics);
function getStatusMetrics(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const startDate = +req.query.start_date;
        const endDate = +req.query.end_date;
        let totalRepaired;
        let totalInProgress;
        let totalUnrepaired;
        const definedStatus = {
            progress: "In progress",
            repaired: "Repaired",
            unrepaired: "Unrepaired",
            collected: true,
        };
        try {
            if (startDate && endDate) {
                totalRepaired = yield customer_1.default.find({
                    status: definedStatus.repaired, isCollected: !definedStatus.collected, createdAt: { $lt: endDate }
                }).countDocuments().exec();
                totalInProgress = yield customer_1.default.find({
                    status: definedStatus.progress, createdAt: { $lt: endDate }
                }).countDocuments().exec();
                totalUnrepaired = yield customer_1.default.find({
                    status: definedStatus.unrepaired, createdAt: { $lt: endDate }
                }).countDocuments().exec();
            }
            else {
                totalRepaired = yield customer_1.default.find({
                    status: definedStatus.repaired, isCollected: !definedStatus.collected
                }).countDocuments().exec();
                totalInProgress = yield customer_1.default.find({
                    status: definedStatus.progress
                }).countDocuments().exec();
                totalUnrepaired = yield customer_1.default.find({
                    status: definedStatus.unrepaired
                }).countDocuments().exec();
            }
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
                },
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
//# sourceMappingURL=metrics.js.map