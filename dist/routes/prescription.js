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
const unique_id_1 = require("../helper/unique-id");
const prescription_1 = __importDefault(require("../model/prescription"));
const drug_1 = __importDefault(require("../model/drug"));
const patient_1 = __importDefault(require("../model/patient"));
const user_1 = __importDefault(require("../model/user"));
const router = express_1.default.Router();
router.post("/prescription", auth_check_1.default, addPrescription);
function addPrescription(req, res, next) {
    const _prescription_req_body = req.body;
    let prescriptionId = unique_id_1.generateId(8);
    const prescriptionOBJ = new prescription_1.default({
        formula: _prescription_req_body.formula,
        duration: _prescription_req_body.duration,
        drugId: _prescription_req_body.drugId,
        patientId: _prescription_req_body.patientId,
        prescriptionId: prescriptionId
    });
    try {
        prescriptionOBJ.save();
        res.status(201).json({
            message: "Successfully!",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Somethiing went wrong!"
        });
    }
}
router.get("/prescription", auth_check_1.default, getPrescriptions);
function getPrescriptions(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fetchedPrescriptions = yield prescription_1.default.find({}).sort('-createdAt').exec();
            const totalPrescriptions = fetchedPrescriptions.length;
            const patientIds = fetchedPrescriptions.map((item) => item.patientId);
            const drugIds = fetchedPrescriptions.map((item) => item.drugId);
            const patient = yield patient_1.default.find({ _id: { $in: patientIds } }).exec();
            const drug = yield drug_1.default.find({ _id: { $in: drugIds } }).exec();
            const _fetchedPrescriptionsPlain = JSON.parse(JSON.stringify(fetchedPrescriptions));
            const _patient = JSON.parse(JSON.stringify(patient));
            const _drug = JSON.parse(JSON.stringify(drug));
            const _fetchedPrescriptions = _fetchedPrescriptionsPlain.map((item) => {
                item["patientId"] = _patient.find((br) => br._id === item.patientId);
                item["drugId"] = _drug.find((br) => br._id === item.drugId);
                return item;
            });
            res.status(200).json({
                prescriptions: _fetchedPrescriptions,
                totalPrescriptions: totalPrescriptions
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Somethiing went wrong!"
            });
        }
    });
}
router.get("/prescription/:_id", auth_check_1.default, getPrescriptionById);
function getPrescriptionById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const prescription = yield prescription_1.default.findById({
                _id: req.params._id
            }).exec();
            const patient_id = prescription.patientId;
            const drug_id = prescription.drugId;
            const drug = yield drug_1.default.findById({
                _id: drug_id
            });
            const patient = yield patient_1.default.findById({
                _id: patient_id
            });
            const doctor_id = patient.userId;
            const doctor = yield user_1.default.findById({
                _id: doctor_id
            }, { password: false });
            res.status(200).json({
                prescription: prescription,
                patient: patient,
                drug: drug,
                doctor: doctor
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Somethiing went wrong!"
            });
        }
    });
}
router.put("/prescription/:_id", auth_check_1.default, updatePrescription);
function updatePrescription(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const prescription_req_body = req.body;
        try {
            const prescription_in_db = yield prescription_1.default.findById({
                _id: req.params._id,
            }).exec();
            if (!prescription_in_db) {
                return res.status(404).json({ message: "Prescription does not exist!" });
            }
            ;
            const prescriptionRealObj = JSON.parse(JSON.stringify(prescription_in_db));
            const prescription = Object.assign({}, prescriptionRealObj, {
                formula: prescription_req_body.formula,
                duration: prescription_req_body.duration,
                drugId: prescription_req_body.drugId,
                patientId: prescription_req_body.patientId
            });
            const result = yield prescription_1.default.updateOne({ _id: req.params._id }, prescription);
            if (result.nModified > 0) {
                res.status(200).json({ message: "Successfully!" });
            }
            else {
                res.status(401).json({ message: "Not successfull!" });
            }
        }
        catch (error) {
            res.status(500).json({
                message: "Something went wrong!"
            });
        }
    });
}
router.delete("/prescription/:_id", auth_check_1.default, deletePrescription);
function deletePrescription(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = prescription_1.default.deleteOne({
                _id: req.params._id,
            });
            res.status(201).json({
                message: "Update successfully!",
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
//# sourceMappingURL=prescription.js.map