// jwt is a token dependency for verifying user in middleware
// bcrypt prevent the password from saving as a plain text in d database
// 

//@ts-check

import express from 'express';
import User, { IUser, ISignup } from '../model/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authCheck from '../middleware/auth-check';


const router = express.Router();
let fetchedUser;


router.post("/user/signup", signupUser)
async function signupUser(req: express.Request, res: express.Response, next: express.NextFunction) {

    const user_req_body: ISignup = req.body;

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
            phoneNumber: user_req_body.phoneNumber,
            branch: user_req_body.branch,
            password: hash
        });
        const result = await new_user_obj.save()
        const totalUser = await User.countDocuments().exec();
        if (totalUser == 1) {
            await User.updateOne(
                { _id: result._id },
                {
                    $set: {
                        role: 'admin',
                        isVerified: true
                    }
                }).exec()
        }
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
            role: fetchedUser.role,
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




router.put("/user/last_login/:_id", authCheck, userLastLogin);
async function userLastLogin(req: express.Request, res: express.Response, next: express.NextFunction) {
    let lastLogin_date = Date.now()

    try {
        const result = await User.updateOne(
            {
                _id: req.params._id
            },
            {
                $set: {
                    lastLogin: lastLogin_date
                }
            }).exec();

        res.status(201).json({
            message: "Successfully!",
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }

}



// password change
router.post('/user/reset-password', (req, res, next) => {
    User.findOne({ userName: req.body.userName })
        .then(user => {
            // if (!user) {
            //     return res.status(401).json({
            //         message: 'Not a registered user'
            //     });
            // }
            console.log(user)
            if (user.role == "blocked") {
                return res.status(401).json({
                    message: "You have been blocked!"
                });
            }

            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password)
        })
        .catch(err => {
            return res.status(401).json({
                message: 'Not a registered user'
            });
        })
        .then(result => {
            if (!result) {
                console.log(result)
                return res.status(401).json({
                    message: "Invalid password!"
                });
            }

            const token = jwt.sign({
                userName: fetchedUser.userName,
                userId: fetchedUser._id
            },
                'is_a_secret_dont_tell_anybody', { expiresIn: '15h' }
            );
            res.status(200).json({
                message: `${fetchedUser.userName}, welcome `,
                role: fetchedUser.role,
                token: token,
                expiresIn: 54000,
                userData: fetchedUser.id
            });
        })
        .catch(err => {
            return res.status(500).json({
                message: "Something went wrong!"
            });
        });
});


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


router.put("/user/update_profile/:_id", authCheck, userUpdateProfile);
async function userUpdateProfile(req: express.Request, res: express.Response, next: express.NextFunction) {
    const _user: IUser = req.body;

    try {
        const user = await User.findById({
            _id: req.params._id
        }).exec();

        if (!user) {
            return res.status(404).json({ message: "User not existing!" });
        }
        // see original user object from database
        const userOriginalObject = await JSON.parse(JSON.stringify(user));

        // assigning new object to the user original user object
        const userr = await Object.assign({}, userOriginalObject, {
            firstName: _user.firstName,
            lastName: _user.lastName,
            email: _user.email,
            phoneNumber: _user.phoneNumber,
            address: _user.address
        });

        await User.updateOne(
            { _id: req.params._id },
            userr
        ).then(result => {
            if (result.nModified > 0) {
                res.status(200).json({ message: "Profile saved!" });
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }

}


export default router;