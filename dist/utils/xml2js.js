"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseString = void 0;
var xml2js_1 = require("xml2js");
/**
 * Promise version of xml2js parseString
 * @internal
 */
function parseString(xml, options) {
    return new Promise(function (resolve, reject) {
        var cb = function (err, result) {
            if (err)
                reject(err);
            else
                resolve(result);
        };
        options ? xml2js_1.parseString(xml, options, cb) : xml2js_1.parseString(xml, cb);
    });
}
exports.parseString = parseString;
