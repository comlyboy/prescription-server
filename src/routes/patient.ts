import express from "express";

import authCheck from "../middleware/auth-check";
import Patient, { IPatient } from "../model/patient";
import Prescription, { IPrescription } from "../model/prescription";

const router = express.Router();



router.post("/patient", authCheck, addPatient);
function addPatient(req: express.Request, res: express.Response, next: express.NextFunction) {

    const _patient_req_body: IPatient = req.body;

    const patientOBJ = new Patient({
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

    } catch (error) {
        res.status(500).json({
            message: "Somethiing went wrong!"
        });
    }

}


router.get("/patient", authCheck, getPatients);
async function getPatients(req: express.Request, res: express.Response, next: express.NextFunction) {

    try {
        const patients: IPatient[] = await Patient.find({
            userId: req["userData"].userId
        }).sort('-addedAt').exec();

        const totalPatients: number = await Patient.countDocuments({
            userId: req["userData"].userId
        }).exec();

        res.status(200).json({
            patients: patients,
            totalPatients: totalPatients
        });

    } catch (error) {
        res.status(500).json({
            message: "Somethiing went wrong!"
        });
    }
}





router.put("/patient/:_id", authCheck, updatePatient)
async function updatePatient(req: express.Request, res: express.Response, next: express.NextFunction) {
    const patient_req_body: IPatient = req.body;

    try {
        const patient_in_db: IPatient = await Patient.findById({
            _id: req.params._id,
        }).exec();

        if (patient_in_db) {


        } else {
            res.status(404).json({ message: "Customer does not exist!" });
        }
        const patientRealObj = JSON.parse(JSON.stringify(patient_in_db));

        // assigning the edited inputs to the customer object
        const patient = Object.assign({}, patientRealObj, {
            firstName: patient_req_body.firstName,
            lastName: patient_req_body.lastName,
            age: patient_req_body.age,
            gender: patient_req_body.gender,
            address: patient_req_body.address
        });

        const result = await Patient.updateOne(
            { _id: req.params._id },
            patient
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


// Getting one customer for editing and details pages
router.get("/patient/:_id", authCheck, getPatientById);
async function getPatientById(req: express.Request, res: express.Response, next: express.NextFunction) {

    try {
        const patient: IPatient = await Patient.findById({
            _id: req.params._id,
        })

        const prescriptions: IPrescription[] = await Prescription.find({
            patientId: req.params._id
        })

        res.status(200).json({
            patient: patient,
            prescriptions: prescriptions
        });

    } catch (error) {
        res.status(500).json({
            message: "Somethiing went wrong!"
        });
    }
}


// Deleting a patient
router.delete("/patient/:_id", authCheck, deletePatient);
async function deletePatient(req: express.Request, res: express.Response, next: express.NextFunction) {

    try {
        await Patient.deleteOne({
            _id: req.params._id,
            userId: req["userData"].userId
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