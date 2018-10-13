"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var node_ssdp_1 = require("node-ssdp");
var utils_1 = require("../utils");
var SEARCH_TIMEOUT = 5000;
var BOX_SERVICE_TYPE = "urn:schemas-upnp-org:service:RemoteUIServer:1";
// const BOX_SERVICE_TYPE = "urn:schemas-upnp-org:service:MediaRenderer:*";
function deviceIsBox(location) {
    return __awaiter(this, void 0, void 0, function () {
        var response, descriptionXml, description, device, modelDescription;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, node_fetch_1.default(location)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 2:
                    descriptionXml = _a.sent();
                    return [4 /*yield*/, utils_1.parseString(descriptionXml, {
                            explicitRoot: false,
                        })];
                case 3:
                    description = _a.sent();
                    if (description && description.device) {
                        device = description.device[0];
                        if (device && device.modelDescription) {
                            modelDescription = device.modelDescription[0];
                            if (modelDescription === "VOO Remote") {
                                return [2 /*return*/, true];
                            }
                        }
                    }
                    return [2 /*return*/, false];
            }
        });
    });
}
/**
 * @internal
 */
function findBox() {
    var _this = this;
    return new Promise(function (resolve) {
        var instance = new node_ssdp_1.Client({});
        var found = false;
        instance.on("response", function (headers, _code, rinfo) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (found || rinfo.address === "127.0.0.1")
                            return [2 /*return*/];
                        _a = headers.LOCATION;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, deviceIsBox(headers.LOCATION)];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        if (_a) {
                            console.log("findBox", headers.LOCATION, headers);
                            found = true;
                            clearTimeout(timer);
                            instance.stop();
                            resolve({
                                ip: rinfo.address,
                                location: {
                                    RemoteUIServer: headers.LOCATION,
                                    MediaRenderer: headers.LOCATION.replace("description1.xml", "description0.xml"),
                                },
                            });
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        var timer = setTimeout(function () {
            if (found)
                return;
            instance.stop();
            resolve(null);
        }, SEARCH_TIMEOUT);
        instance.search(BOX_SERVICE_TYPE);
    });
}
exports.findBox = findBox;
function checkBox(device) {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!device)
                        return [2 /*return*/, false];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, node_fetch_1.default(device.location.RemoteUIServer, { timeout: 2000 })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, true];
                case 3:
                    err_1 = _a.sent();
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.findBoxCached = utils_1.cache.memoize(findBox, "voo.ssdp.findBox", checkBox);
