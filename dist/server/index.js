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
exports.init = void 0;
var Hapi = __importStar(require("hapi"));
var commands_1 = require("../commands");
var voo_1 = require("../voo");
var PORT = process.env.PORT || 8001;
var server = new Hapi.Server({
    port: PORT,
});
server.route({
    method: "GET",
    path: "/",
    handler: function () {
        return "upnp-remote";
    },
});
server.route({
    method: "GET",
    path: "/set-channel",
    handler: function (request) { return __awaiter(void 0, void 0, void 0, function () {
        var channel, cleanChannel, result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    channel = request.query.channel;
                    cleanChannel = channel.replace(/^sur /gi, "");
                    return [4 /*yield*/, commands_1.setChannel(cleanChannel)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
                case 2:
                    err_1 = _a.sent();
                    console.error(err_1);
                    return [2 /*return*/, err_1.toString()];
                case 3: return [2 /*return*/];
            }
        });
    }); },
});
server.route({
    method: "GET",
    path: "/box",
    handler: function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = {};
                    return [4 /*yield*/, voo_1.findBox()];
                case 1: return [2 /*return*/, (_a.box = _b.sent(), _a)];
                case 2:
                    err_2 = _b.sent();
                    console.error(err_2);
                    return [2 /*return*/, err_2.toString()];
                case 3: return [2 /*return*/];
            }
        });
    }); },
});
exports.init = function () { return __awaiter(void 0, void 0, void 0, function () {
    // shut down server
    function shutdown() {
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, server.stop()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        console.error(err_3);
                        process.exitCode = 1;
                        return [3 /*break*/, 3];
                    case 3:
                        process.exit();
                        return [2 /*return*/];
                }
            });
        });
    }
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, server.start()];
            case 1:
                _a.sent();
                console.log("Server running at: " + server.info.uri);
                process.on("unhandledRejection", function (err) {
                    console.log(err);
                    process.exit(1);
                });
                //
                // need this in docker container to properly exit since node doesn't handle SIGINT/SIGTERM
                // this also won't work on using npm start since:
                // https://github.com/npm/npm/issues/4603
                // https://github.com/npm/npm/pull/10868
                // https://github.com/RisingStack/kubernetes-graceful-shutdown-example/blob/master/src/index.js
                // if you want to use npm then start with `docker run --init` to help, but I still don't think it's
                // a graceful shutdown of node process
                //
                // quit on ctrl-c when running docker in terminal
                process.on("SIGINT", function onSigint() {
                    console.info("Got SIGINT (aka ctrl-c in docker). Graceful shutdown ", new Date().toISOString());
                    shutdown();
                });
                // quit properly on docker stop
                process.on("SIGTERM", function onSigterm() {
                    console.info("Got SIGTERM (docker container stop). Graceful shutdown ", new Date().toISOString());
                    shutdown();
                });
                return [2 /*return*/];
        }
    });
}); };
