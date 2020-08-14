"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendIRCC = void 0;
var upnp_device_client_1 = __importDefault(require("upnp-device-client"));
var common_1 = require("./common");
var clientCache = {};
var getUpnpClient = function (url) {
    if (url in clientCache) {
        return clientCache[url];
    }
    else {
        var client = new upnp_device_client_1.default(url);
        clientCache[url] = client;
        return client;
    }
};
function callActionAsync(target, serviceId, actionName, params, headers) {
    return new Promise(function (resolve, reject) {
        var client = getUpnpClient(target.location.IRCC);
        client.callAction(serviceId, actionName, params, headers, function (err, result) {
            if (err)
                reject(err);
            else
                resolve(result);
        });
    });
}
exports.sendIRCC = function (tv, irccCode) {
    return callActionAsync(tv, "urn:schemas-sony-com:serviceId:IRCC", "X_SendIRCC", { IRCCCode: irccCode }, common_1.AUTH_HEADERS);
};
