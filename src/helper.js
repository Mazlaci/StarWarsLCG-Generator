exports.fileNameFromPath = function (path) {
    var fileName = path.replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, "");
    return fileName;
}

exports.valueInRange = function (value, min, max) {
    return Math.min(Math.max(value, min), max)
}