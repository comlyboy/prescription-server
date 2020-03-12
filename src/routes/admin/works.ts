import express from 'express';
import User, { IUser } from '../../model/user';
import authCheck from '../../middleware/auth-check';
import Customer, { ICustomer } from "../../model/customer";


const router = express.Router();

// Getting customers from database
router.get("/jobs", authCheck, getAllJobs);

async function getAllJobs(req: express.Request, res: express.Response, next: express.NextFunction) {
    const definedStatus = {
        progress: "In progress",
        repaired: "Repaired",
        unrepaired: "Unrepaired",
        collected: true,
    };

    try {
        const totalCustomers = await Customer.find()
            .countDocuments().exec();

        const repaired = await Customer.find({
            status: definedStatus.repaired, isCollected: !definedStatus.collected
        }).sort("-createdAt")
            .limit(6).exec();

        const progress = await Customer.find({
            status: definedStatus.progress
        }).sort("-createdAt")
            .limit(6).exec();

        const unrepaired = await Customer.find({
            status: definedStatus.unrepaired
        }).sort("-createdAt")
            .limit(6).exec();

        const collected = await Customer.find({
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

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }

}



export default router;