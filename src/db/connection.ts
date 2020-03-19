import mongoose from 'mongoose';


// const DB_URL = "mongodb+srv://corneliusDbUser:corneliusDbPassword@cluster0-qpx1v.mongodb.net/test?retryWrites=true&w=majority";

const DB_URL = "mongodb+srv://corneliusDbUser:corneliusDbPassword@cluster0-i5lsb.mongodb.net/test?retryWrites=true&w=majority";

const DB_URL_local = "mongodb://localhost:27017/Prescription_DB";


const connect_DB = async () => {
    try {
        const connect = await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        // console.log(connect);
        console.log('Connected to database ==> 100%');
    } catch (error) {
        console.log(error.message);
        console.log('Cannot connect to database');

    }

}

export default connect_DB;