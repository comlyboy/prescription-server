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
const auth_check_1 = __importDefault(require("../middleware/auth-check"));
const patient_1 = __importDefault(require("../model/patient"));
const prescription_1 = __importDefault(require("../model/prescription"));
const drug_1 = __importDefault(require("../model/drug"));
const router = express_1.default.Router();
router.get("/metrics", auth_check_1.default, getMetrics);
function getMetrics(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const totalDrugs = yield drug_1.default.countDocuments({}).exec();
            const patients = yield patient_1.default.find({
                userId: req["userData"].userId
            }).exec();
            const totalPatients = patients.length;
            const patientIds = patients.map((item) => item._id);
            const totalPrescriptions = yield prescription_1.default.countDocuments({
                patientId: { $in: patientIds }
            }).exec();
            res.status(200).json({
                totalDrugs: totalDrugs,
                totalPatients: totalPatients,
                totalPrescriptions: totalPrescriptions,
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
//# sourceMappingURL=metrics.js.map