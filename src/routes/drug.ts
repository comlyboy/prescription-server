import express from "express";

import authCheck from "../middleware/auth-check";
import Patient, { IPatient } from "../model/patient";
import Drug, { IDrug } from "../model/drug";

const router = express.Router();



router.post("/drug", authCheck, addDrug);
function addDrug(req: express.Request, res: express.Response, next: express.NextFunction) {

    const _drug_req_body: IDrug = req.body;

    const drugOBJ = new Drug({
        name: _drug_req_body.name,
        description: _drug_req_body.description,
    });

    try {
        const result = drugOBJ.save();

        res.status(201).json({
            message: "Successfully!",
        });

    } catch (error) {
        res.status(500).json({
            message: "Somethiing went wrong!"
        });
    }

}


router.get("/drug", authCheck, getPatients);
async function getPatients(req: express.Request, res: express.Response, next: express.NextFunction) {

    try {
        const drugs: IPatient[] = await Drug.find({
        }).sort('-addedAt').exec();
        const totalDrugs: number = drugs.length;

        res.status(200).json({
            drugs: drugs,
            totalDrugs: totalDrugs
        });

    } catch (error) {
        res.status(500).json({
            message: "Somethiing went wrong!"
        });
    }
}


router.put("/drug/:_id", authCheck, updateDrug)
async function updateDrug(req: express.Request, res: express.Response, next: express.NextFunction) {
    const drug_req_body: IPatient = req.body;

    try {
        const drug_in_db: IPatient = await Patient.findById({
            _id: req.params._id,
            userId: req["userData"].userId
        }).exec();

        if (!drug_in_db) {
            return res.status(404).json({ message: "Drug does not exist!" });
        };

        const custRealObj = JSON.parse(JSON.stringify(drug_in_db));

        // assigning the edited inputs to the customer object
        const drug = Object.assign({}, drug_req_body, {
            // firstName: customer_req_body.firstName,
            // lastName: customer_req_body.lastName,
            // phoneNumber: customer_req_body.phoneNumber
        });

        const result = await Patient.updateOne(
            { _id: req.params._id },
            drug
        )

        if (result.nModified > 0) {
            res.status(200).json({ message: "Updated successfully!" });
        } else {
            res.status(401).json({ message: "You are not authorised!" });
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }

}


// Deleting a patient
router.delete("/drug/:_id", authCheck, deletePatient);
async function deletePatient(req: express.Request, res: express.Response, next: express.NextFunction) {

    try {
        await Drug.deleteOne({
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