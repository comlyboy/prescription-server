import express from "express";

import authCheck from "../middleware/auth-check";
import Patient, { IPatient } from "../model/patient";
import Prescription from "../model/prescription";
import Drug from "../model/drug";


const router = express.Router();


router.get("/metrics", authCheck, getMetrics);
async function getMetrics(req: express.Request, res: express.Response, next: express.NextFunction) {

    try {

        const totalDrugs: number = await Drug.countDocuments({
        }).exec();

        const patients: IPatient[] = await Patient.find({
            userId: req["userData"].userId
        }).exec();
        const totalPatients = patients.length;

        const patientIds = patients.map((item) => item._id);

        const totalPrescriptions: number = await Prescription.countDocuments({
            patientId: { $in: patientIds }
        }).exec();

        res.status(200).json({
            totalDrugs: totalDrugs,
            totalPatients: totalPatients,
            totalPrescriptions: totalPrescriptions,
        });

    } catch (error) {
        res.status(500).json({
            message: "Somethiing went wrong!"
        });
    }
}


export default router;