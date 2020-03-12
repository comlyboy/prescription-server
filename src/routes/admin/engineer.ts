import express from 'express';
import mongoose from 'mongoose';

import User, { IUser } from '../../model/user';
import Branch, { IBranch } from '../../model/admin/branch';
import adminCheck from '../../middleware/admin-check';
import Customer, { ICustomer } from "../../model/customer";
import Transaction, { ITransaction } from '../../model/transaction';

const router = express.Router();



// getting all engineer list
router.get("/engineer", adminCheck, getEngineers);
async function getEngineers(req: express.Request, res: express.Response, next: express.NextFunction) {

    const definedRoles = {
        engineer: "engineer"
    };

    const engineersPerPage = +req.query.pagesize;
    const currentPage = +req.query.page;

    const SearchQuery = req.query.search;
    let engineers: mongoose.DocumentQuery<IUser[], any, {}> | Promise<any[]>;


    try {
        if (engineersPerPage && currentPage) {
            engineers = User.find({ role: definedRoles.engineer, isVerified: true }, { password: false })
                .skip(engineersPerPage * (currentPage - 1))
                .limit(engineersPerPage)
        } else {
            engineers = User.find({ role: definedRoles.engineer, isVerified: true }, { password: false })
        }
        const totalEngineers = await User.countDocuments({ role: definedRoles.engineer, isVerified: true }).exec();

        const fetchedEngineers = await engineers.sort("firstName").exec();
        const branchIds = fetchedEngineers.map((item) => item.branch);

        const branch: IBranch[] = await Branch.find({ _id: { $in: branchIds } }).exec();

        const _fetchedEngineersPlain: IUser[] = JSON.parse(JSON.stringify(fetchedEngineers));
        const _branch: any[] = JSON.parse(JSON.stringify(branch));

        const _fetchedEngineers = _fetchedEngineersPlain.map((item) => {
            item["branch"] = _branch.find((br) => br._id === item.branch);
            return item;
        });

        res.status(200).json({
            allEngineers: _fetchedEngineers,
            totalEngineers: totalEngineers
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }
}



// Getting one engineer for details pages
router.get("/engineer/:_id", adminCheck, getEngineerById);
async function getEngineerById(req: express.Request, res: express.Response, next: express.NextFunction) {
    const definedStatus = {
        progress: "In progress",
        repaired: "Repaired",
        unrepaired: "Unrepaired",
        collected: true,
    };

    try {
        const engineer: IUser = await User.findById({
            _id: req.params._id
        }, { password: false }).exec()

        const branchId = engineer.branch;
        const branch: IBranch = await Branch.findById({ _id: branchId }).exec();

        const totalCustomers: number = await Customer.countDocuments({
            engineer: engineer._id
        }).sort("-createdAt").exec();

        const customers: ICustomer[] = await Customer.find({
            engineer: engineer._id
        }).sort("-createdAt")
            .limit(3).exec();


        res.status(200).json({
            engineer,
            branch,
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
router.get("/engineer/customers/:_id", adminCheck, getEngineerCustomer);
async function getEngineerCustomer(req: express.Request, res: express.Response, next: express.NextFunction) {
    const customerPerPage = +req.query.pagesize;
    const currentPage = +req.query.page;

    let customers: ICustomer[];

    try {
        const engineer = await User.findById({
            _id: req.params._id
        }, { password: false }).exec()

        const totalCustomers = await Customer.countDocuments({
            engineer: engineer._id
        }).sort("-createdAt").exec();

        if (customerPerPage && currentPage) {
            customers = await Customer.find({
                engineer: engineer._id
            }).sort("-createdAt")
                .skip(customerPerPage * (currentPage - 1))
                .limit(customerPerPage).exec();
        } else {
            customers = await Customer.find({
                engineer: engineer._id
            }).sort("-createdAt").exec();
        }

        res.status(200).json({
            engineer,
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



// Getting one engineer transaction for details pages
router.get("/engineer/transactions/:_id", adminCheck, getEngineerTransactions);
async function getEngineerTransactions(req: express.Request, res: express.Response, next: express.NextFunction) {
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
        const engineer: IUser = await User.findById({
            _id: req.params._id
        }, { password: false }).exec()

        const customers: ICustomer[] = await Customer.find({
            engineer: req.params._id
        }).select("_id").exec()
        const customer_Ids: string[] = customers.map((item) => item._id);

        const totalTransactions: number = await Transaction.countDocuments({ customerId: { $in: customer_Ids } }).exec();

        if (customerPerPage && currentPage) {
            transactions = await Transaction.find({ customerId: { $in: customer_Ids } })
                .sort("-transactionDate")
                .skip(customerPerPage * (currentPage - 1))
                .limit(customerPerPage).exec();
        } else {
            transactions = await Transaction.find({ customerId: { $in: customer_Ids } })
                .sort("-transactionDate").exec();
        }


        res.status(200).json({
            engineer,
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



// getting getting each statistics
router.get('/engineer/summary/:_id', adminCheck, getEngineerSummaryMetrics);
async function getEngineerSummaryMetrics(req: express.Request, res: express.Response, next: express.NextFunction) {

    const startDate = req.query.start_date;
    const endDate = req.query.end_date;

    const engineerId = req.params._id;

    const definedStatus = {
        progress: "In progress",
        repaired: "Repaired",
        unrepaired: "Unrepaired",
        collected: true,
    };
    let advance: any;

    let totalTransactions: number;

    let totalRepaired: number;
    let totalInProgress: number;
    let totalUnrepaired: number;
    let totalCollected: number;

    let totalAdvance: number = 0;


    try {
        const customers: ITransaction[] = await Customer.find({
            engineer: engineerId
        }).select('_id').exec();
        const customer_Ids = customers.map((item) => item._id);

        totalTransactions = await Transaction.countDocuments({
            customerId: customer_Ids
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
            totalTransactions: totalTransactions,
            totalIncome: totalAdvance,

            totalRepaired: totalRepaired,
            totalInProgress: totalInProgress,
            totalUnrepaired: totalUnrepaired,
            totalCollected: totalCollected,
            forVisual: {
                repaired: {
                    name: "Repaired",
                    value: totalRepaired
                },
                progress: {
                    name: "In progress",
                    value: totalInProgress
                },
                unrepaired: {
                    name: "Unrepaired",
                    value: totalUnrepaired
                }
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }

}


// getting engineer devicr type stats
router.get('/engineer/device_type/metrics', adminCheck, getEngineerDeviceTypeMetrics);
async function getEngineerDeviceTypeMetrics(req: express.Request, res: express.Response, next: express.NextFunction) {
    const startDate = +req.query.start_date;
    const endDate = +req.query.end_date;
    const engineerId: string = req.query.engineer;

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
        const customers: ITransaction[] = await Customer.find({
            engineer: engineerId
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


// getting all newly registered engineers
router.get("/new/engineer_as_notifications", adminCheck, getNotifications);
async function getNotifications(req: express.Request, res: express.Response, next: express.NextFunction) {

    const definedRoles = {
        engineer: "engineer"
    };

    try {
        const fetchedNotifications = await User.find({ role: "engineer", isVerified: false })
            .sort("-registeredAt").exec();

        const count = await User.countDocuments({ role: definedRoles.engineer, isVerified: false }).exec();

        res.status(200).json({
            message: "Notifications fetched!!!",
            allNotifications: fetchedNotifications,
            totalNotifications: count
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }
}


router.put("/new/engineer_as_notifications/:_id", adminCheck, userLastLogin);
async function userLastLogin(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const result = await User.updateOne(
            {
                _id: req.params._id
            },
            {
                $set: {
                    isVerified: true
                }
            }).exec();

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