// jwt is a token dependency for verifying user in middleware
// bcrypt prevent the password from saving as a plain text in d database
// 

//@ts-check

import express from 'express';
import User, { IUser } from '../model/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authCheck from '../middleware/auth-check';


const router = express.Router();


router.post("/user/signup", signupUser)
async function signupUser(req: express.Request, res: express.Response, next: express.NextFunction) {

    const user_req_body: IUser = req.body;

    try {

        const user = await User.findOne({ userName: req.body.userName }).exec();
        if (user) {
            return res.status(401).json({
                message: "Username already existing"
            });
        }

        const hash = await bcrypt.hash(req.body.password, 10)

        const new_user_obj = new User({
            firstName: user_req_body.firstName,
            lastName: user_req_body.lastName,
            userName: user_req_body.userName,
            password: hash
        });
        const result = await new_user_obj.save()

        res.status(201).json({
            message: "Success!",
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }

}


router.post('/user/login', loginUser)
async function loginUser(req: express.Request, res: express.Response, next: express.NextFunction) {

    try {
        const fetchedUser = await User.findOne({ userName: req.body.userName }).exec();
        if (!fetchedUser) {
            return res.status(401).json({
                message: 'Not a registered user'
            });
        }

        const hashResult = await bcrypt.compare(req.body.password, fetchedUser.password);
        if (!hashResult) {
            return res.status(401).json({
                message: "Invalid password!"
            });
        }

        const token = jwt.sign({
            userName: fetchedUser.userName,
            userId: fetchedUser._id
        },
            'is_a_secret_dont_tell_anybody'
        );


        res.status(200).json({
            message: `${fetchedUser.userName}, welcome `,
            token: token,
            userId: fetchedUser.id
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Something went wrong!"
        });
    }

}


// Getting one user for editing and details pages
router.get("/user/:_id", authCheck, getUserProfile);
async function getUserProfile(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const user = await User.findById({
            _id: req.params._id
        }, { password: false }).exec();

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User does not exist!" });
        }

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }

}

export default router;