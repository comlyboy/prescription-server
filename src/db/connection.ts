import mongoose from 'mongoose';


// const DB_URL = "mongodb+srv://corneliusDbUser:corneliusDbPassword@cluster0-qpx1v.mongodb.net/test?retryWrites=true&w=majority";
const DB_URL = "mongodb+srv://corneliusDbUser:corneliusDbPassword@cluster0-qpx1v.mongodb.net/test?retryWrites=true&w=majority";
const DB_URL2 = "mongodb+srv://corneliusDbUser:corneliusDbPassword@handymanapp-qpx1v.mongodb.net/test?retryWrites=true&w=majority";

const DB_URL_local = "mongodb://localhost:27017/Prescription_DB";


const connect_DB = async () => {
    // try {
    //     const conne = await mongoose.connect(DB_URL_local, {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true,
    //         useCreateIndex: true
    //     });
    //     // console.log(conne);
    // } catch (error) {
    //     console.log(error);
    //     console.log('Cannot connect to database');

    // };
    console.log('Connected to database ==> 100%');

}

export default connect_DB;