import express from 'express';

import User, { IUser } from '../../model/user';
import adminCheck from '../../middleware/admin-check';
import Customer, { ICustomer } from "../../model/customer";
import Branch, { IBranch } from "../../model/admin/branch";
import Transaction, { ITransaction } from "../../model/transaction";


const router = express.Router();




// getting getting each Engneer statistics
router.get('/device_type/metrics', adminCheck, getDeviceTypeMetrics);
async function getDeviceTypeMetrics(req: express.Request, res: express.Response, next: express.NextFunction) {

    const startDate = +req.query.start_date;
    const endDate = +req.query.end_date;

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

    try {
        if (startDate && endDate) {
            androids = await Customer.find({
                deviceType: definedDevices.android, createdAt: { $lt: endDate }
            }).countDocuments().exec();

            computers = await Customer.find({
                deviceType: definedDevices.pc, createdAt: { $lt: endDate }
            }).countDocuments().exec();

            ios = await Customer.find({
                deviceType: definedDevices.ios, createdAt: { $lt: endDate }
            }).countDocuments().exec();

            electronics = await Customer.find({
                deviceType: definedDevices.electronics, createdAt: { $lt: endDate }
            }).countDocuments().exec();

            windows_phone = await Customer.find({
                deviceType: definedDevices.windows_phone, createdAt: { $lt: endDate }
            }).countDocuments().exec();
            console.log(windows_phone)

            others = await Customer.find({
                deviceType: definedDevices.others, createdAt: { $lt: endDate }
            }).countDocuments().exec();

        } else {
            androids = await Transaction.countDocuments({
                deviceType: definedDevices.android
            }).exec();

            computers = await Transaction.countDocuments({
                deviceType: definedDevices.pc
            }).exec();

            ios = await Transaction.countDocuments({
                deviceType: definedDevices.ios,
            }).exec();

            electronics = await Transaction.countDocuments({
                deviceType: definedDevices.electronics,
            }).exec();

            windows_phone = await Transaction.countDocuments({
                deviceType: definedDevices.windows_phone,
            }).exec();

            others = await Transaction.countDocuments({
                deviceType: definedDevices.others,
            }).exec();
        }


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



// getting getting each statistics
router.get('/summary/metrics', adminCheck, getAllMetrics);
async function getAllMetrics(req: express.Request, res: express.Response, next: express.NextFunction) {

    const startDate = +req.query.start_date;
    const endDate = +req.query.end_date;

    const definedStatus = {
        progress: "In progress",
        repaired: "Repaired",
        unrepaired: "Unrepaired",
        collected: true,
    };

    let advance: any;

    let totalCustomers: number;
    let totalEngineers: number;
    let totalBranches: number;
    let totalAdvance: number = 0;
    let totalTransactions: number


    let totalRepaired: number;
    let totalInProgress: number;
    let totalUnrepaired: number;
    let totalCollected: number;

    try {
        if (startDate && endDate) {

            totalCustomers = await Customer.countDocuments({ createdAt: { $lt: endDate } }).exec();

            totalEngineers = await User.countDocuments({ role: "engineer", isVerified: true }).exec();

            totalBranches = await Branch.countDocuments()
                .exec();

            advance = await Transaction.find({ createdAt: { $lt: endDate } })
                .select('advance').exec();

            totalRepaired = await Transaction.countDocuments({
                status: definedStatus.repaired,
                isCollected: !definedStatus.collected,
                createdAt: { $lt: endDate }
            }).exec();

            totalInProgress = await Transaction.countDocuments({
                status: definedStatus.progress,
                createdAt: { $lt: endDate }
            }).countDocuments().exec();

            totalUnrepaired = await Transaction.countDocuments({
                status: definedStatus.unrepaired,
                createdAt: { $lt: endDate }
            }).exec();

            totalCollected = await Transaction.countDocuments({
                status: definedStatus.repaired,
                isCollected: definedStatus.collected,
                createdAt: { $lt: endDate }
            }).exec();

            advance.forEach(d => {
                totalAdvance += d.advance
            });

        } else {
            totalCustomers = await Customer.countDocuments().exec();

            totalEngineers = await User.countDocuments({ role: "engineer", isVerified: true }).exec();

            totalBranches = await Branch.countDocuments().exec();

            advance = await Transaction.find()
                .select('advance').exec();
            advance.forEach(d => {
                totalAdvance += d.advance
            });

            totalTransactions = advance.length;

            totalRepaired = await Transaction.countDocuments({
                status: definedStatus.repaired,
                isCollected: !definedStatus.collected
            }).exec();

            totalInProgress = await Transaction.countDocuments({
                status: definedStatus.progress
            }).exec();

            totalUnrepaired = await Transaction.countDocuments({
                status: definedStatus.unrepaired
            }).exec();

            totalCollected = await Transaction.countDocuments({
                status: definedStatus.repaired,
                isCollected: definedStatus.collected
            }).exec();
        }

        const customers = await Customer.find()
            .limit(4)
            .sort('-createdAt').exec();

        const transactions = await Transaction.find()
            .limit(4)
            .sort('-transactionDate').exec();


        res.status(200).json({
            totalCustomers: totalCustomers,
            totalEngineers: totalEngineers,
            totalBranches: totalBranches,
            totalIncome: totalAdvance,
            totalTransactions: totalTransactions,

            customers: customers,
            transactions: transactions,

            totalRepaired: totalRepaired,
            totalInProgress: totalInProgress,
            totalUnrepaired: totalUnrepaired,
            totalCollected: totalCollected,
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }

}

export default router;