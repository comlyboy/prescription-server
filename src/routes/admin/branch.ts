import express from 'express';

import Branch, { IBranch } from '../../model/admin/branch';
import User, { IUser } from '../../model/user';
import Customer, { ICustomer } from "../../model/customer";
import Transaction, { ITransaction } from '../../model/transaction';
import adminCheck from '../../middleware/admin-check';

const router = express.Router();


// Saving new branch to the database
router.post("/branch", adminCheck, addBranch);
async function addBranch(req: express.Request, res: express.Response, next: express.NextFunction) {
    const _branch: IBranch = req.body;
    const new_branch_obj = new Branch({
        name: _branch.name,
        description: _branch.description

    });


    try {
        const result = await new_branch_obj.save();

        res.status(201).json({
            message: "$ added successfully!!!",
            branchName: result.name
        });

    } catch (error) {
        res.status(500).json({
            message: "Somethiing went wrong!"
        });
    }

}


// getting branches
router.get("/branch", getBranches);
async function getBranches(req: express.Request, res: express.Response, next: express.NextFunction) {
    const branchPerPage = +req.query.pagesize;
    const currentPage = +req.query.page;
    const search_input = +req.query.filter;

    let branches;

    try {
        const totalBranches: number = await Branch.countDocuments()
            .exec();

        if (branchPerPage && currentPage) {
            branches = await Branch.find()
                .skip(branchPerPage * (currentPage - 1))
                .limit(branchPerPage)
                .sort("name").exec();
        } else {
            branches = await Branch.find().sort("name").exec();

        }



        res.status(200).json({
            allBranches: branches,
            totalBranches: totalBranches,
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }

}


// Getting one branch for details pages
router.get("/branch/:_id", adminCheck, getBranchById);
async function getBranchById(req: express.Request, res: express.Response, next: express.NextFunction) {
    const startDate = +req.query.start_date;
    const endDate = +req.query.end_date;

    const limit = +req.query.customerLimit;

    const definedDevices = {
        android: "Android",
        ios: "IOS",
        pc: "Pc",
        electronics: "Electronics",
        windows_phone: "Windows phone",
        others: "Others"
    };

    let androids: number;
    let computers: number;
    let ios: number;
    let electronics: number;
    let windows_phone: number;
    let others: number;


    let customers: ICustomer[];


    try {
        const branch: IBranch = await Branch.findById({
            _id: req.params._id
        }).exec()
        // const branchId = branch._id

        // const engineers: IUser[] = await User.find({ role: "engineer", branch: branchId, isVerified: true }).exec()
        // const totalEngineers = engineers.length

        // const engineerIds = engineers.map((item) => item._id);

        // const totalCustomers: number = await Customer.countDocuments({ engineer: { $in: engineerIds } }).exec()

        // if (limit) {
        //     customers = await Customer.find({ engineer: { $in: engineerIds } })
        //         .limit(limit).exec()

        // } else {
        //     customers = await Customer.find({ engineer: { $in: engineerIds } }).exec()
        // }

        res.status(200).json({
            branch: branch
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }
}



// getting all engineers according to branch
router.get("/branch/engineer", adminCheck, getBranchEngineers);
async function getBranchEngineers(req: express.Request, res: express.Response, next: express.NextFunction) {

    const branchId = req.query.branch;

    try {

        const engineers: IUser[] = await User.find({ role: "engineer", branch: branchId })
            .sort("-registeredAt").exec();
        const totalEngineers: number = engineers.length

        res.status(200).json({
            message: "engineer fetched!!!",
            allEngneers: engineers,
            totalEngineers: totalEngineers
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }
}




// Editing branch details
router.put("/branch/:_id", adminCheck, (req, res, next) => {
    const _branch: IBranch = req.body;

    Branch.findById({
        _id: req.params._id
    })
        .then(branchDb => {
            if (branchDb) {
                const branchRealObj = JSON.parse(JSON.stringify(branchDb));

                // assigning the edited inputs to the branch object
                const branch = Object.assign({}, branchRealObj, {
                    name: _branch.name,
                    description: _branch.description
                });

                Branch.updateOne(
                    { _id: req.params._id },
                    branch
                )
                    .then(result => {
                        if (result.nModified > 0) {
                            res.status(200).json({ message: "Successfull!" });
                        }
                    });
            } else {
                res.status(404).json({ message: "can't find branch!" });
            }
        });
});


// Deleting a branch
router.delete("/branch/:_id", adminCheck, (req, res, next) => {
    Branch.deleteOne({
        _id: req.params._id
    })
        .then(result => {
            res.status(200).json({ message: 'Delete successfull!!!' });
        });
});




// Getting one branch's summary for details pages
router.get("/branch/summary/:_id", adminCheck, getBranchSummaryMetrics);
async function getBranchSummaryMetrics(req: express.Request, res: express.Response, next: express.NextFunction) {
    const startDate = req.query.start_date;
    const endDate = req.query.end_date;

    const branchId = req.params._id;

    const definedStatus = {
        progress: "In progress",
        repaired: "Repaired",
        unrepaired: "Unrepaired",
        collected: true,
    };
    let advance: any;

    let totalIncome: number;
    let totalCustomers: number;
    let totalTransactions: number;
    let totalEngineers: number

    let totalRepaired: number;
    let totalInProgress: number;
    let totalUnrepaired: number;
    let totalCollected: number;

    let totalAdvance: number = 0;


    try {
        const fetched_engineers: IUser[] = await User.find({
            branch: branchId, isVerified: true
        }).exec();
        totalEngineers = fetched_engineers.length;
        const engineers = fetched_engineers.slice(0, 4);

        const engineers_Ids = fetched_engineers.map((item) => item._id);

        totalCustomers = await Customer.countDocuments({
            engineer: { $in: engineers_Ids }
        }).exec();

        const fetched_customers: ITransaction[] = await Customer.find({
            engineer: engineers_Ids
        }).sort("-createdAt").exec();
        totalCustomers = fetched_customers.length;
        const customers = fetched_customers.slice(0, 4);

        const customer_Ids = fetched_customers.map((item) => item._id);


        totalTransactions = await Transaction.countDocuments({
            customerId: { $in: customer_Ids }
        }).exec();

        advance = await Transaction.find({
            customerId: { $in: customer_Ids }
        }).select('advance').exec();
        advance.forEach(d => {
            totalAdvance += d.advance
        });

        totalRepaired = await Transaction.countDocuments({
            status: definedStatus.repaired,
            isCollected: !definedStatus.collected,
            customerId: { $in: customer_Ids }
        }).exec();

        totalInProgress = await Transaction.countDocuments({
            status: definedStatus.progress,
            customerId: { $in: customer_Ids }
        }).exec();

        totalUnrepaired = await Transaction.countDocuments({
            status: definedStatus.unrepaired,
            customerId: { $in: customer_Ids }
        }).exec();

        totalCollected = await Transaction.countDocuments({
            status: definedStatus.repaired,
            isCollected: definedStatus.collected,
            customerId: { $in: customer_Ids }
        }).exec();


        res.status(200).json({
            totalIncome: totalAdvance,
            totalCustomers: totalCustomers,
            totalTransactions: totalTransactions,
            totalEngineers: totalEngineers,

            customers: customers,
            engineers: engineers,

            totalRepaired: totalRepaired,
            totalInProgress: totalInProgress,
            totalUnrepaired: totalUnrepaired,
            totalCollected: totalCollected
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }
}



// Getting one engineer for details pages
router.get("/branch/customers/:_id", adminCheck, getBranchCustomers);
async function getBranchCustomers(req: express.Request, res: express.Response, next: express.NextFunction) {
    const customerPerPage = +req.query.pagesize;
    const currentPage = +req.query.page;
    let customers: ICustomer[];

    try {
        const branch: IBranch = await Branch.findById({
            _id: req.params._id
        }).exec()

        const engineers: IUser[] = await User.find({
            branch: req.params._id
        }).select("_id").exec()

        const engineers_Ids = engineers.map((item) => item._id);

        const totalCustomers = await Customer.countDocuments({
            engineer: engineers_Ids
        }).exec();


        if (customerPerPage && currentPage) {
            customers = await Customer.find({
                engineer: engineers_Ids
            }).sort("-createdAt")
                .skip(customerPerPage * (currentPage - 1))
                .limit(customerPerPage).exec();
        } else {
            customers = await Customer.find({
                engineer: engineers_Ids
            }).sort("-createdAt").exec();
        }

        res.status(200).json({
            branch: branch,
            customer: {
                customers: customers,
                totalCustomers: totalCustomers
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }
}



// Getting one engineer for details pages
router.get("/branch/transactions/:_id", adminCheck, getBranchTransactions);
async function getBranchTransactions(req: express.Request, res: express.Response, next: express.NextFunction) {
    const customerPerPage = +req.query.pagesize;
    const currentPage = +req.query.page;

    const definedStatus = {
        progress: "In progress",
        repaired: "Repaired",
        unrepaired: "Unrepaired",
        collected: true,
    };

    let transactions: ITransaction[];
    try {
        const branch: IBranch = await Branch.findById({
            _id: req.params._id
        }).exec()

        const engineers: IUser[] = await User.find({
            branch: req.params._id
        }).select("_id").exec()
        const engineers_Ids = engineers.map((item) => item._id);

        const customers: ICustomer[] = await Customer.find({
            engineer: engineers_Ids
        }).exec();

        const customers_ids = customers.map((item) => item._id);

        const totalTransactions = await Transaction.countDocuments({
            customerId: customers_ids
        }).exec();

        if (customerPerPage && currentPage) {
            transactions = await Transaction.find({
                customerId: customers_ids
            }).sort("-transactionDate")
                .skip(customerPerPage * (currentPage - 1))
                .limit(customerPerPage).exec();
        } else {
            transactions = await Transaction.find({
                customerId: customers_ids
            }).sort("-transactionDate").exec();
        }

        res.status(200).json({
            branch: branch,
            transaction: {
                transactions: transactions,
                totalTransactions: totalTransactions
            }
        });


    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }
}


// getting branch device type stats
router.get('/branch/device_type/metrics/:_id', adminCheck, getEngineerDeviceTypeMetrics);
async function getEngineerDeviceTypeMetrics(req: express.Request, res: express.Response, next: express.NextFunction) {
    const startDate = +req.query.start_date;
    const endDate = +req.query.end_date;
    const branchId: string = req.params._id;

    const definedDevices = {
        android: "Android",
        ios: "IOS",
        pc: "Pc",
        electronics: "Electronics",
        windows_phone: "Windows phone",
        others: "Others",
    };


    let androids: number;
    let computers: number;
    let ios: number;
    let electronics: number;
    let windows_phone: number;
    let others: number;


    try {

        const engineers: IUser[] = await User.find({
            branch: branchId
        }).select('_id').exec();
        const engineer_Ids = engineers.map((item) => item._id);

        const customers: ICustomer[] = await Customer.find({
            engineer: { $in: engineer_Ids }
        }).select('_id').exec();
        const customer_Ids = customers.map((item) => item._id);

        androids = await Transaction.countDocuments({
            deviceType: definedDevices.android,
            customerId: { $in: customer_Ids }
        }).exec();

        computers = await Transaction.countDocuments({
            deviceType: definedDevices.pc,
            customerId: { $in: customer_Ids }
        }).exec();

        ios = await Transaction.countDocuments({
            deviceType: definedDevices.ios,
            customerId: { $in: customer_Ids }
        }).exec();

        electronics = await Transaction.countDocuments({
            deviceType: definedDevices.electronics,
            customerId: { $in: customer_Ids }
        }).exec();

        windows_phone = await Transaction.countDocuments({
            deviceType: definedDevices.windows_phone,
            customerId: { $in: customer_Ids }
        }).exec();

        others = await Transaction.countDocuments({
            deviceType: definedDevices.others,
            customerId: { $in: customer_Ids }
        }).exec();

        res.status(200).json({

            totalComputers: {
                'name': 'Computers',
                'value': computers
            },
            totalAndroids: {
                'name': 'Android',
                'value': androids
            },
            totalIos: {
                'name': 'IOS',
                'value': ios
            },
            totalElectronics: {
                'name': 'Electronics',
                'value': electronics
            },
            totalWindowsPhone: {
                'name': 'Windows phone',
                'value': windows_phone
            },
            totalOthers: {
                'name': 'Others',
                'value': others
            }

        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }
}




export default router;