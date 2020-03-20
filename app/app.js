"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const connection_1 = __importDefault(require("./db/connection"));
const user_1 = __importDefault(require("./routes/user"));
const prescription_1 = __importDefault(require("./routes/prescription"));
const patient_1 = __importDefault(require("./routes/patient"));
const drug_1 = __importDefault(require("./routes/drug"));
const metrics_1 = __importDefault(require("./routes/metrics"));
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
app.use('/api/v1', user_1.default);
app.use('/api/v1', prescription_1.default);
app.use('/api/v1', patient_1.default);
app.use('/api/v1', drug_1.default);
app.use('/api/v1', metrics_1.default);
app.get('/', (req, res) => {
    return res.send(`<!DOCTYPE html>
    <html>
    <head>
        <title>Hospital v1 Server</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    </head>
    <body>
        <nav class="navbar navbar-light bg-primary">
            <span class="navbar-brand text-light mb-0 h1">Hospital api server v.1</span>
        </nav>
        <div class="container pt-5">
            <div class="card text-center border-0">

                    <div class="card border-0 py-3 text-center">
                        <div class="h4 text-primary">Present Day</div>
                        <div class="h6 mb-0 text-muted" id="div1"></div>
                    </div>
                <div class="card-body mt-5 pt-4">
                    <img src="https://image.flaticon.com/icons/png/128/202/202719.png" alt="welcome_img">

                    <h1 class="h5 mt-5 text-muted">Access through the right channel to explore all what this <span class="text-primary font-weight-bold">api/v1</span> has to offer, that's if your are eligible.</h1>
                </div>

            </div>
        </div>
        <nav class="navbar fixed-bottom d-flex justify-content-center bg-dark py-5">
            <span class="lead mb-0 text-light">Copyright  &#9400;2020. Hospital Plus Inc.</span>
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