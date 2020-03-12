// cors gives permissin to  "GET, POST, PUT, PATCH, DELETE, OPTIONS" capability
// mongoose makes schema possible in mongo DB
// bodyparser exposes the body portion of an incoming request on "req.body"


import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import connect_DB from './db/connection';


import usersRoutes from './routes/user';

import customersRoutes from './routes/customer';
import metricsRoutes from './routes/metrics';
import transactionRoutes from './routes/transaction';


import branchRoutes from './routes/admin/branch';
import engineersRoutes from './routes/admin/engineer';
import adminWorksRoutes from './routes/admin/works';
import adminCustomersRoute from './routes/admin/customer';
import adminMetricsRoutes from './routes/admin/metrics';
import adminTransactionsRoutes from './routes/admin/transaction';


const app = express();

app.use(cors());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));


// Connecting to mongoDB database
connect_DB();


// permissions
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
});



// For various routes
app.use('/api/v1', customersRoutes);
app.use('/api/v1', usersRoutes);
app.use('/api/v1', metricsRoutes);
app.use('/api/v1', transactionRoutes);

// admin page
app.use('/api/v1/admin', engineersRoutes);
app.use('/api/v1/admin', branchRoutes);
app.use('/api/v1/admin', adminWorksRoutes);
app.use('/api/v1/admin', adminCustomersRoute);
app.use('/api/v1/admin', adminMetricsRoutes);
app.use('/api/v1/admin', adminTransactionsRoutes);


app.get('/', (req: express.Request, res: express.Response): express.Response => {
    return res.send(`<!DOCTYPE html>
    <html>
    <head>
        <title>Handyman v1 Server</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    </head>
    <body class="bg-light">
        <nav class="navbar navbar-light bg-success">
            <span class="navbar-brand text-light mb-0 h1">Handyman api server v.1</span>
        </nav>
        <div class="container pt-5">
            <div class="card text-center border-0">

                    <div class="card border-0 py-3 text-center">
                        <div class="h4 text-success">Present Day</div>
                        <div class="h6 mb-0 text-muted" id="div1"></div>
                    </div>
                <div class="card-body mt-5 pt-4">
                    <img src="https://image.flaticon.com/icons/png/128/202/202719.png" alt="welcome_img">

                    <h1 class="h5 mt-5 text-muted">Access through the right channel to explore all what this <span class="text-success font-weight-bold">api/v1</span> has to offer, that's if your are eligible.</h1>
                </div>

            </div>
        </div>
        <nav class="navbar fixed-bottom d-flex justify-content-center bg-dark py-5">
            <span class="lead mb-0 text-light">Copyright  &#9400;2020. Handyman Inc</span>
        </nav>
    </body>
    <script>
    var d = new Date()

    var para = document.createElement("p");
    var node = document.createTextNode(d);
    para.appendChild(node);
    var element = document.getElementById("div1");
    element.appendChild(para);    </script>
    </html>
`);
});
export default app;