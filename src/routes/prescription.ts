import express from "express";

import authCheck from "../middleware/auth-check";

import { generateId } from "../helper/unique-id";

import Prescription, { IPrescription } from "../model/prescription";
import Drug, { IDrug } from "../model/drug";
import Patient, { IPatient } from "../model/patient";
import User, { IUser } from "../model/user";

const router = express.Router();



router.post("/prescription", authCheck, addPrescription);
function addPrescription(req: express.Request, res: express.Response, next: express.NextFunction) {

    const _prescription_req_body: IPrescription = req.body;

    let prescriptionId = generateId(8);

    const prescriptionOBJ = new Prescription({
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

    } catch (error) {
        res.status(500).json({
            message: "Somethiing went wrong!"
        });
    }
}



router.get("/prescription", authCheck, getPrescriptions);
async function getPrescriptions(req: express.Request, res: express.Response, next: express.NextFunction) {

    try {
        const fetchedPrescriptions: IPrescription[] = await Prescription.find({
        }).sort('-createdAt').exec();
        const totalPrescriptions: number = fetchedPrescriptions.length;

        const patientIds = fetchedPrescriptions.map((item) => item.patientId);
        const drugIds = fetchedPrescriptions.map((item) => item.drugId);

        const patient: IPatient[] = await Patient.find({ _id: { $in: patientIds } }).exec();
        const drug: IDrug[] = await Drug.find({ _id: { $in: drugIds } }).exec();

        const _fetchedPrescriptionsPlain: IPrescription[] = JSON.parse(JSON.stringify(fetchedPrescriptions));

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

    } catch (error) {
        res.status(500).json({
            message: "Somethiing went wrong!"
        });
    }
}


router.get("/prescription/:_id", authCheck, getPrescriptionById);
async function getPrescriptionById(req: express.Request, res: express.Response, next: express.NextFunction) {

    try {
        const prescription: IPrescription = await Prescription.findById({
            _id: req.params._id
        }).exec();
        const patient_id = prescription.patientId;
        const drug_id = prescription.drugId;

        const drug: IDrug = await Drug.findById({
            _id: drug_id
        });

        const patient: IPatient = await Patient.findById({
            _id: patient_id
        });
        const doctor_id = patient.userId;

        const doctor: IUser = await User.findById({
            _id: doctor_id
        }, { password: false });

        res.status(200).json({
            prescription: prescription,
            patient: patient,
            drug: drug,
            doctor: doctor
        });

    } catch (error) {
        res.status(500).json({
            message: "Somethiing went wrong!"
        });
    }
}



router.put("/prescription/:_id", authCheck, updatePrescription)
async function updatePrescription(req: express.Request, res: express.Response, next: express.NextFunction) {
    const prescription_req_body: IPrescription = req.body;

    try {
        const prescription_in_db: IPrescription = await Prescription.findById({
            _id: req.params._id,
        }).exec();

        if (prescription_in_db) {
            res.status(404).json({ message: "Customer does not exist!" });
        }


        const prescriptionRealObj = JSON.parse(JSON.stringify(prescription_in_db));

        // assigning the edited inputs to the customer object
        const prescription = Object.assign({}, prescriptionRealObj, {
            formula: prescription_req_body.formula,
            duration: prescription_req_body.duration,
            drugId: prescription_req_body.drugId,
            patientId: prescription_req_body.patientId
        });

        const result = await Prescription.updateOne(
            { _id: req.params._id },
            prescription
        )

        if (result.nModified > 0) {
            res.status(200).json({ message: "Updated successfully!" });
        } else {
            res.status(401).json({ message: "Not successfull!" });
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }

}



router.delete("/prescription/:_id", authCheck, deletePrescription);
async function deletePrescription(req: express.Request, res: express.Response, next: express.NextFunction) {

    try {
        Prescription.deleteOne({
            _id: req.params._id,
        })

        res.status(201).json({
            message: "Successfully!",
        });

    } catch (error) {
        res.status(500).json({
            message: "Somethiing went wrong!"
        });
    }

}

export default router;