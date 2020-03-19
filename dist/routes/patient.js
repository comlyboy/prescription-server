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
router.post("/patient", auth_check_1.default, addPatient);
function addPatient(req, res, next) {
    const _patient_req_body = req.body;
    const patientOBJ = new patient_1.default({
        firstName: _patient_req_body.firstName,
        lastName: _patient_req_body.lastName,
        age: _patient_req_body.age,
        gender: _patient_req_body.gender,
        address: _patient_req_body.address,
        userId: req["userData"].userId,
    });
    try {
        const result = patientOBJ.save();
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
router.get("/patient", auth_check_1.default, getPatients);
function getPatients(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const patients = yield patient_1.default.find({
                userId: req["userData"].userId
            }).sort('firstName').exec();
            const totalPatients = yield patient_1.default.countDocuments({
                userId: req["userData"].userId
            }).exec();
            res.status(200).json({
                patients: patients,
                totalPatients: totalPatients
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Somethiing went wrong!"
            });
        }
    });
}
router.get("/patient/:_id", auth_check_1.default, getPatientById);
function getPatientById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const patient = yield patient_1.default.findById({
                _id: req.params._id,
            });
            const fetchedPrescriptions = yield prescription_1.default.find({
                patientId: req.params._id
            }).sort('-createdAt').exec();
            const drugIds = fetchedPrescriptions.map((item) => item.drugId);
            const drug = yield drug_1.default.find({ _id: { $in: drugIds } }).exec();
            const _fetchedPrescriptionsPlain = JSON.parse(JSON.stringify(fetchedPrescriptions));
            const _drug = JSON.parse(JSON.stringify(drug));
            const _fetchedPrescriptions = _fetchedPrescriptionsPlain.map((item) => {
                item["drugId"] = _drug.find((br) => br._id === item.drugId);
                return item;
            });
            res.status(200).json({
                patient: patient,
                prescriptions: _fetchedPrescriptions
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Somethiing went wrong!"
            });
        }
    });
}
router.put("/patient/:_id", auth_check_1.default, updatePatient);
function updatePatient(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const patient_req_body = req.body;
        try {
            const patient_in_db = yield patient_1.default.findById({
                _id: req.params._id,
            }).exec();
            if (patient_in_db) {
            }
            else {
                res.status(404).json({ message: "Customer does not exist!" });
            }
            const patientRealObj = JSON.parse(JSON.stringify(patient_in_db));
            const patient = Object.assign({}, patientRealObj, {
                firstName: patient_req_body.firstName,
                lastName: patient_req_body.lastName,
                age: patient_req_body.age,
                gender: patient_req_body.gender,
                address: patient_req_body.address
            });
            const result = yield patient_1.default.updateOne({ _id: req.params._id }, patient);
            if (result.nModified > 0) {
                res.status(200).json({ message: "Updated successfully!" });
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
router.delete("/patient/:_id", auth_check_1.default, deletePatient);
function deletePatient(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield patient_1.default.deleteOne({
                _id: req.params._id,
                userId: req["userData"].userId
            });
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
//# sourceMappingURL=patient.js.map