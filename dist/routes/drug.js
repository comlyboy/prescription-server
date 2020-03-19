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
const drug_1 = __importDefault(require("../model/drug"));
const router = express_1.default.Router();
router.post("/drug", auth_check_1.default, addDrug);
function addDrug(req, res, next) {
    const _drug_req_body = req.body;
    const drugOBJ = new drug_1.default({
        name: _drug_req_body.name,
        description: _drug_req_body.description,
    });
    try {
        drugOBJ.save();
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
router.get("/drug", auth_check_1.default, getDrugs);
function getDrugs(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const drugs = yield drug_1.default.find({}).sort('name').exec();
            const totalDrugs = drugs.length;
            res.status(200).json({
                drugs: drugs,
                totalDrugs: totalDrugs
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Somethiing went wrong!"
            });
        }
    });
}
router.get("/drug/:_id", auth_check_1.default, getDrugById);
function getDrugById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const drug = yield drug_1.default.findById({
                _id: req.params._id,
            });
            res.status(200).json(drug);
        }
        catch (error) {
            res.status(500).json({
                message: "Somethiing went wrong!"
            });
        }
    });
}
router.put("/drug/:_id", auth_check_1.default, updateDrug);
function updateDrug(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const drug_req_body = req.body;
        try {
            const drug_in_db = yield drug_1.default.findById({
                _id: req.params._id,
            }).exec();
            if (!drug_in_db) {
                return res.status(404).json({ message: "Drug does not exist!" });
            }
            ;
            const drugRealObj = JSON.parse(JSON.stringify(drug_in_db));
            const drug = Object.assign({}, drugRealObj, {
                name: drug_req_body.name,
                description: drug_req_body.description
            });
            const result = yield drug_1.default.updateOne({ _id: req.params._id }, drug);
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
router.delete("/drug/:_id", auth_check_1.default, deleteDrug);
function deleteDrug(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield drug_1.default.deleteOne({
                _id: req.params._id,
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
//# sourceMappingURL=drug.js.map