export function generateDrugId(length: number, initial?: string) {
    let _initial = initial;
    let _length = length;
    let timestamp = +new Date;
    let ts = timestamp.toString();
    let parts = ts.split("").reverse();
    let id = "";
    let _getRandomInt = function (min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    for (let i = 0; i < _length; ++i) {
        let index = _getRandomInt(0, parts.length - 1);
        id += parts[index];
    }

    if (_initial) {
        return `${_initial.toLowerCase()}${id}`;
    } else {
        return id
    }
}