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
const customer_1 = __importDefault(require("../../model/customer"));
const router = express_1.default.Router();
router.get("/jobs", auth_check_1.default, getAllJobs);
function getAllJobs(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const definedStatus = {
            progress: "In progress",
            repaired: "Repaired",
            unrepaired: "Unrepaired",
            collected: true,
        };
        try {
            const totalCustomers = yield customer_1.default.find()
                .countDocuments().exec();
            const repaired = yield customer_1.default.find({
                status: definedStatus.repaired, isCollected: !definedStatus.collected
            }).sort("-createdAt")
                .limit(6).exec();
            const progress = yield customer_1.default.find({
                status: definedStatus.progress
            }).sort("-createdAt")
                .limit(6).exec();
            const unrepaired = yield customer_1.default.find({
                status: definedStatus.unrepaired
            }).sort("-createdAt")
                .limit(6).exec();
            const collected = yield customer_1.default.find({
                status: definedStatus.repaired, isCollected: definedStatus.collected
            }).sort("-createdAt")
                .limit(6).exec();
            res.status(200).json({
                totalWorks: totalCustomers,
                allRepaired: repaired,
                allInProgress: progress,
                allUnrepaired: unrepaired,
                allCollected: collected,
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
//# sourceMappingURL=works.js.map