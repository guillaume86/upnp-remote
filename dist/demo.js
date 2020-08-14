"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable
var voo_1 = require("./voo");
var upnp = __importStar(require("./voo/upnp"));
var sony_1 = require("./sony");
var utils_1 = require("./utils");
var testBox = function () { return __awaiter(void 0, void 0, void 0, function () {
    var box, remote, mediaInfo, transportInfo, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, voo_1.findBoxCached()];
            case 1:
                box = _a.sent();
                if (!box) return [3 /*break*/, 8];
                remote = new voo_1.Remote(box);
                remote.sendKey(voo_1.RemoteButton.STAND_BY);
                return [4 /*yield*/, upnp.getMediaInfo(box)];
            case 2:
                mediaInfo = _a.sent();
                return [4 /*yield*/, upnp.getTransportInfo(box)];
            case 3:
                transportInfo = _a.sent();
                console.log(mediaInfo, transportInfo);
                _a.label = 4;
            case 4:
                _a.trys.push([4, 6, , 7]);
                return [4 /*yield*/, upnp.setChannel(box, { id: "1:108:10805" })];
            case 5:
                _a.sent();
                return [3 /*break*/, 7];
            case 6:
                err_1 = _a.sent();
                console.error(err_1.toString());
                return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 9];
            case 8:
                console.log("box not found");
                _a.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); };
//testBox();
var testTV = function () { return __awaiter(void 0, void 0, void 0, function () {
    var tv;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, sony_1.findTVCached()];
            case 1:
                tv = _a.sent();
                if (tv) {
                    // console.log(tv);
                    // const VOLUME_DOWN = "AAAAAQAAAAEAAAATAw==";
                    // const result = await sendIRCC(tv, VOLUME_DOWN);
                    // console.log(result);
                    // const client = new ScalarWebAPIClient(tv.location.IRCC);
                    // const result = await client.getMethodTypes("system");
                    // const buttons = await client.getRemoteControllerInfo();
                    // console.log((await client.getPowerStatus()) === "active");
                    // await sendIRCC(tv, SonyRemoteButton.Tv);
                }
                else {
                    console.log("tv not found");
                }
                return [2 /*return*/];
        }
    });
}); };
// testTV();
var STANDBY_ERROR = "TRANSPORT IS LOCKED (705)";
function setChannelSafe(box, channel, maxTries, currentTry) {
    if (maxTries === void 0) { maxTries = 10; }
    if (currentTry === void 0) { currentTry = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var err_2, lastTry, remote;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 7]);
                    // rejected with Error: TRANSPORT IS LOCKED (705) if in stand by
                    return [4 /*yield*/, upnp.setChannel(box, channel)];
                case 1:
                    // rejected with Error: TRANSPORT IS LOCKED (705) if in stand by
                    _a.sent();
                    return [3 /*break*/, 7];
                case 2:
                    err_2 = _a.sent();
                    lastTry = maxTries === currentTry;
                    if (!(!lastTry && err_2 instanceof Error && err_2.message === STANDBY_ERROR)) return [3 /*break*/, 5];
                    // if first try, turn on the box
                    if (currentTry === 0) {
                        remote = new voo_1.Remote(box);
                        remote.sendKey(voo_1.RemoteButton.STAND_BY);
                    }
                    return [4 /*yield*/, utils_1.setTimeoutAsync(currentTry === 0 ? 3000 : 1000)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, setChannelSafe(box, channel, maxTries, currentTry + 1)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5: throw err_2;
                case 6: return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// const cachedBox = {
//   ip: "192.168.0.12",
//   location: {
//     RemoteUIServer: "http://192.168.0.12:49153/description1.xml",
//     MediaRenderer: "http://192.168.0.12:49153/description0.xml",
//   },
// };
function setBoxChannel(name) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, box, channel;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        voo_1.findBoxCached(),
                        voo_1.findChannel(name),
                    ])];
                case 1:
                    _a = _b.sent(), box = _a[0], channel = _a[1];
                    if (!box)
                        throw new Error("Box .\u00E9vasion not found");
                    if (!channel)
                        throw new Error("Channel " + name + " not found");
                    return [4 /*yield*/, setChannelSafe(box, channel)];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// const cachedTV = {
//   ip: "192.168.0.10",
//   location: { IRCC: "http://192.168.0.10/sony/webapi/ssdp/dd.xml" },
// };
function setTvInput() {
    return __awaiter(this, void 0, void 0, function () {
        var tv;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sony_1.findTVCached()];
                case 1:
                    tv = _a.sent();
                    if (!tv)
                        throw new Error("TV not found");
                    return [4 /*yield*/, sony_1.sendIRCC(tv, sony_1.RemoteButton.Tv)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function setChannel(name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([setTvInput(), setBoxChannel(name)])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var channelName = process.argv[2] || "tf1";
setChannel(channelName)
    .then(function () { return console.log("done"); })
    .catch(function (err) { return console.error(err); });
// findChannel(channelName).then(console.log);
