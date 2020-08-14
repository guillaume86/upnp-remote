"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_fetch_1 = __importDefault(require("node-fetch"));
var xml2js_1 = require("../utils/xml2js");
var common_1 = require("./common");
var getNodeName = function (type) { return "av:X_ScalarWebAPI_" + type; };
var NODE_NAME_DEVICE_INFO = getNodeName("DeviceInfo");
var parseParamType = function (typeStr) {
    var array = false;
    if (typeStr.endsWith("*")) {
        array = true;
        typeStr = typeStr.slice(0, -1);
    }
    else if (typeStr.endsWith("[]")) {
        array = true;
        typeStr = typeStr.slice(0, -2);
    }
    if (typeStr.startsWith("{")) {
        var type = JSON.parse(typeStr);
        for (var prop in type) {
            type[prop] = parseParamType(type[prop]);
        }
        return { array: array, type: type };
    }
    else {
        var type = typeStr;
        return { array: array, type: type };
    }
};
var ScalarWebAPIClient = /** @class */ (function () {
    function ScalarWebAPIClient(url) {
        this.url = url;
    }
    ScalarWebAPIClient.prototype.getServicesDescription = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.description) {
                    this.description = this.getServicesDescriptionInternal();
                }
                return [2 /*return*/, this.description];
            });
        });
    };
    ScalarWebAPIClient.prototype.getMethodTypes = function (serviceType) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.callMethod(serviceType, "getMethodTypes", [
                            "1.0",
                        ])];
                    case 1:
                        data = (_a.sent());
                        return [2 /*return*/, data.map(function (_a) {
                                var name = _a[0], paramIn = _a[1], paramOut = _a[2], version = _a[3];
                                return ({
                                    name: name,
                                    paramIn: paramIn.map(parseParamType),
                                    paramOut: paramOut.map(parseParamType),
                                    version: version,
                                });
                            })];
                }
            });
        });
    };
    ScalarWebAPIClient.prototype.getRemoteControllerInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, codes, map, _i, codes_1, item;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.callMethod("system", "getRemoteControllerInfo")];
                    case 1:
                        _a = (_b.sent()), codes = _a[1];
                        map = {};
                        for (_i = 0, codes_1 = codes; _i < codes_1.length; _i++) {
                            item = codes_1[_i];
                            map[item.name] = item.value;
                        }
                        return [2 /*return*/, map];
                }
            });
        });
    };
    ScalarWebAPIClient.prototype.getPowerStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.callMethod("system", "getPowerStatus")];
                    case 1:
                        status = (_a.sent())[0].status;
                        return [2 /*return*/, status];
                }
            });
        });
    };
    ScalarWebAPIClient.prototype.callMethod = function (serviceType, method, params) {
        if (params === void 0) { params = []; }
        return __awaiter(this, void 0, void 0, function () {
            var description, url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getServicesDescription()];
                    case 1:
                        description = _a.sent();
                        if (!description.serviceTypes.includes(serviceType)) {
                            throw new Error("The service " + serviceType + " is not available on the device");
                        }
                        url = description.baseUrl + "/" + serviceType;
                        return [4 /*yield*/, node_fetch_1.default(url, {
                                method: "POST",
                                headers: __assign({ "Content-Type": "application/json" }, common_1.AUTH_HEADERS),
                                body: JSON.stringify({
                                    method: method,
                                    version: "1.0",
                                    params: params,
                                    id: 4694,
                                }),
                            })];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3: return [2 /*return*/, (_a.sent()).result];
                }
            });
        });
    };
    ScalarWebAPIClient.prototype.getServicesDescriptionInternal = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, xml, desc, device, deviceInfo, version, baseUrl, serviceList, serviceTypes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, node_fetch_1.default(this.url)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.text()];
                    case 2:
                        xml = _a.sent();
                        return [4 /*yield*/, xml2js_1.parseString(xml, { explicitRoot: false })];
                    case 3:
                        desc = _a.sent();
                        if (desc && desc.device) {
                            device = desc.device[0];
                            if (NODE_NAME_DEVICE_INFO in device) {
                                deviceInfo = device[NODE_NAME_DEVICE_INFO][0];
                                version = deviceInfo[getNodeName("Version")][0];
                                baseUrl = deviceInfo[getNodeName("BaseURL")][0];
                                serviceList = deviceInfo[getNodeName("ServiceList")][0];
                                serviceTypes = serviceList[getNodeName("ServiceType")];
                                return [2 /*return*/, {
                                        version: version,
                                        baseUrl: baseUrl,
                                        serviceTypes: serviceTypes,
                                    }];
                            }
                        }
                        throw new Error("The device at " + this.url + " do not provide ScalarWebAPI services.");
                }
            });
        });
    };
    return ScalarWebAPIClient;
}());
exports.default = ScalarWebAPIClient;
