"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DB_URL = "mongodb+srv://corneliusDbUser:corneliusDbPassword@cluster0-qpx1v.mongodb.net/test?retryWrites=true&w=majority";
const DB_URL2 = "mongodb+srv://corneliusDbUser:corneliusDbPassword@handymanapp-qpx1v.mongodb.net/test?retryWrites=true&w=majority";
const DB_URL_local = "mongodb://localhost:27017/Handymann_DB";
const connect_DB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conne = yield mongoose_1.default.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Connected to database ===>');
    }
    catch (error) {
        console.log('Cannot connect to database');
    }
});
exports.default = connect_DB;
//# sourceMappingURL=connection.js.map