import express from 'express';
import mongoose from 'mongoose';
// import { Random } from "random-js";

import random from "random";

import User, { IUser } from '../../model/user';
import Branch, { IBranch } from '../../model/admin/branch';
import authCheck from '../../middleware/auth-check';
import Customer, { ICustomer } from "../../model/customer";

const router = express.Router();



const definedRoles = {
    engineer: "engineer"
};

export async function getEngineers(req: express.Request, res: express.Response, next: express.NextFunction) {
    const branchQuery = req.query.branch;
    const positionQuery = req.query.position;
    const SearchQuery = req.query.search;
    let fetchedEngineers;
    // let query;
    let query: mongoose.DocumentQuery<IUser[], any, {}>;
    if (branchQuery) {
        query = User.find({ branch: branchQuery, role: definedRoles.engineer })
    } else {
        query = User.find({ role: definedRoles.engineer }, { password: false })
    }

    try {
        const fetchedEngineers = await query.sort("firstName").exec();
        const branchIds = fetchedEngineers.map((item) => item.branch);
        const count = await User.countDocuments({ role: definedRoles.engineer }).exec();
        const branch = await Branch.find({ _id: { $in: branchIds } }).exec();

        const _fetchedEngineersPlain: IUser[] = JSON.parse(JSON.stringify(fetchedEngineers));
        const _branch: any[] = JSON.parse(JSON.stringify(branch));

        const _fetchedEngineers = _fetchedEngineersPlain.map((item) => {
            item["branch"] = _branch.find((br) => br._id === item.branch);
            return item;
        });

        // console.log({ _fetchedEngineersPlain });
        console.log({ fetchedEngineers });
        // console.log(JSON.stringify(_fetchedEngineers, null, 2));
        // console.log({ branch });
        // console.log({ count });

        res.status(200).json({
            message: "Engineers fetched!!!",
            allEngineers: _fetchedEngineers,
            totalEngineers: count
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }
}
