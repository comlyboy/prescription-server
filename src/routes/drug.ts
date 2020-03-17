import express from "express";

import authCheck from "../middleware/auth-check";
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
        drugOBJ.save();

        res.status(201).json({
            message: "Successfully!",
        });

    } catch (error) {
        res.status(500).json({
            message: "Somethiing went wrong!"
        });
    }

}


router.get("/drug", authCheck, getDrugs);
async function getDrugs(req: express.Request, res: express.Response, next: express.NextFunction) {

    try {
        const drugs: IDrug[] = await Drug.find({
        }).sort('name').exec();
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

// Getting one customer for editing and details pages
router.get("/drug/:_id", authCheck, getDrugById);
async function getDrugById(req: express.Request, res: express.Response, next: express.NextFunction) {

    try {
        const drug: IDrug = await Drug.findById({
            _id: req.params._id,
        })

        res.status(200).json(drug);

    } catch (error) {
        res.status(500).json({
            message: "Somethiing went wrong!"
        });
    }
}


router.put("/drug/:_id", authCheck, updateDrug)
async function updateDrug(req: express.Request, res: express.Response, next: express.NextFunction) {
    const drug_req_body: IDrug = req.body;

    try {
        const drug_in_db: IDrug = await Drug.findById({
            _id: req.params._id,
        }).exec();

        if (!drug_in_db) {
            return res.status(404).json({ message: "Drug does not exist!" });
        };

        const drugRealObj = JSON.parse(JSON.stringify(drug_in_db));

        // assigning the edited inputs to the customer object
        const drug = Object.assign({}, drugRealObj, {
            name: drug_req_body.name,
            description: drug_req_body.description
        });

        const result = await Drug.updateOne(
            { _id: req.params._id },
            drug
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


// Deleting a patient
router.delete("/drug/:_id", authCheck, deleteDrug);
async function deleteDrug(req: express.Request, res: express.Response, next: express.NextFunction) {

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