"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const connection_1 = __importDefault(require("./db/connection"));
const device_status_1 = __importDefault(require("./routes/device-status"));
const customer_1 = __importDefault(require("./routes/customer"));
const works_1 = __importDefault(require("./routes/works"));
const income_1 = __importDefault(require("./routes/income"));
const user_1 = __importDefault(require("./routes/user"));
const all_metrics_1 = __importDefault(require("./routes/all-metrics"));
const branch_1 = __importDefault(require("./routes/admin/branch"));
const engineer_1 = __importDefault(require("./routes/admin/engineer"));
const works_2 = __importDefault(require("./routes/admin/works"));
const customers_1 = __importDefault(require("./routes/admin/customers"));
const metrics_1 = __importDefault(require("./routes/admin/metrics"));
const app = express_1.default();
app.use(cors_1.default());
app.use(body_parser_1.default.json());
connection_1.default();
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
});
app.use('/api/v1', device_status_1.default);
app.use('/api/v1', customer_1.default);
app.use('/api/v1', income_1.default);
app.use('/api/v1', works_1.default);
app.use('/api/v1', user_1.default);
app.use('/api/v1', all_metrics_1.default);
app.use('/api/v1/admin', engineer_1.default);
app.use('/api/v1/admin', branch_1.default);
app.use('/api/v1/admin', works_2.default);
app.use('/api/v1/admin', customers_1.default);
app.use('/api/v1/admin', metrics_1.default);
app.get('/', (req, res) => {
    return res.send(`<!DOCTYPE html>
    <html>
    <head>
        <title>Handyman v1 Server</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    </head>
    <body>
        <nav class="navbar navbar-light bg-success">
            <span class="navbar-brand text-light mb-0 h1">Handyman api server v.1</span>
        </nav>
        <div class="container pt-5">
            <div class="card text-center border-0">

                    <div class="card py-3 text-center">
                        <div class="h4 text-success">Present Day</div>
                        <div class="h6 mb-0 text-muted" id="div1"></div>
                    </div>
                <div class="card-body mt-5 pt-4">
                    <img src="https://image.flaticon.com/icons/png/128/202/202719.png" alt="welcome_img">

                    <h1 class="h5 mt-5 text-muted">Access through the right channel to explore all what this <span class="text-success font-weight-bold">api/v1</span> has to offer, that's if your are eligible.</h1>
                </div>

            </div>
        </div>
        <nav class="navbar fixed-bottom d-flex justify-content-center bg-secondary py-5">
            <span class="h6 mb-0 text-light">&#9400;2020. All right reserved</span>
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
exports.default = app;
//# sourceMappingURL=app.js.map