"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateId(length) {
    let _length = length;
    let timestamp = +new Date;
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let charactersLength = characters.length;
    let ts = timestamp.toString();
    let parts = ts.split("").reverse();
    let id = "";
    let initial = '';
    let _getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    for (let i = 0; i < _length; ++i) {
        let index = _getRandomInt(0, parts.length - 1);
        id += parts[index];
    }
    for (let i = 0; i < 2; i++) {
        initial += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    let result = `${id}${initial}`;
    return result;
}
exports.generateId = generateId;
//# sourceMappingURL=unique-id.js.map