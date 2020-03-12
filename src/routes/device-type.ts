import express from 'express';
import Customer, { ICustomer } from '../model/customer';
import authCheck from '../middleware/auth-check';

const router = express.Router();



// Getting computer
router.get('/device/computer', (req, res, next) => {

    let fetchedDevices;

    Customer.find({ deviceType: 'Pc' }).sort('-date').then(document => {
        if (document) {

            res.status(200).json({
                message: 'Device type fetched!!!',
                totalPc: document
            });
            console.log(document)
        } else {
            res.status(404).json({ message: "can't find customer!" });
        }
    })
});



// Getting Android devices
router.get('/device/android', (req, res, next) => {

    let fetchedDevices;

    Customer.find({ deviceType: "Android" }).sort('-date').then(document => {
        if (document) {

            res.status(200).json(document);
            console.log(document)
        } else {
            res.status(404).json({ message: "can't find customer!" });
        }
    });

});



// Getting IOS devices
router.get('/device/ios', (req, res, next) => {

    let fetchedDevices;

    Customer.find({ deviceType: "IOS" }).sort('-date').then(document => {
        if (document) {

            res.status(200).json(document);
            console.log(document)
        } else {
            res.status(404).json({ message: "can't find customer!" });
        }
    });

});



// Getting Window phones
router.get('/device/window', (req, res, next) => {

    let fetchedDevices;

    Customer.find({ deviceType: "Windows phone" }).sort('-date').then(document => {
        if (document) {

            res.status(200).json(document);
            console.log(document)
        } else {
            res.status(404).json({ message: "can't find customer!" });
        }
    });

});



// Getting electronics
router.get('/device/electronics', (req, res, next) => {

    let fetchedDevices;

    Customer.find({ deviceType: "Electronics" }).then(document => {
        if (document) {

            res.status(200).json(document);
            console.log(document)
        } else {
            res.status(404).json({ message: "can't find customer!" });
        }
    })
});



// Getting other devices
router.get('/device/others', (req, res, next) => {

    let fetchedDevices;

    Customer.find({ deviceType: "Others" }).then(document => {
        if (document) {

            res.status(200).json(document);
            console.log(document)
        } else {
            res.status(404).json({ message: "can't find customer!" });
        }
    })

});





export default router;