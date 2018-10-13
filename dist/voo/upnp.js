"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var upnp_device_client_1 = __importDefault(require("upnp-device-client"));
function callActionAsync(box, serviceId, actionName, params) {
    return new Promise(function (resolve, reject) {
        var client = getUpnpClient(box.location.MediaRenderer);
        client.callAction(serviceId, actionName, params, {}, function (err, result) {
            if (err)
                reject(err);
            else
                resolve(result);
        });
    });
}
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
exports.getMediaInfo = function (box) {
    return callActionAsync(box, "AVTransport", "GetMediaInfo", {
        InstanceID: 0,
    });
};
exports.getTransportInfo = function (box) {
    return callActionAsync(box, "AVTransport", "GetTransportInfo", {
        InstanceID: 0,
    });
};
exports.setAVTransportURI = function (box, uri) {
    return callActionAsync(box, "AVTransport", "SetAVTransportURI", {
        InstanceID: 0,
        CurrentURI: uri,
        CurrentURIMetaData: "NOT_IMPLEMENTED",
    });
};
var epgChannelIdToHexaId = function (id) {
    return "dvb://" +
        id
            .split(":")
            .map(function (str) { return parseInt(str, 10).toString(16); })
            .join(".");
};
exports.setChannel = function (box, channel) {
    return exports.setAVTransportURI(box, epgChannelIdToHexaId(channel.id));
};
