"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appDir = void 0;
var fs_1 = __importDefault(require("fs"));
var os_1 = __importDefault(require("os"));
var path_1 = __importDefault(require("path"));
exports.appDir = path_1.default.join(os_1.default.homedir(), ".upnp-remote");
if (!fs_1.default.existsSync(exports.appDir)) {
    fs_1.default.mkdirSync(exports.appDir);
}
exports.default = exports.appDir;
