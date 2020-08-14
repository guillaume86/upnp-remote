"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RfbClient = void 0;
var events_1 = require("events");
var net_1 = __importDefault(require("net"));
var rfb2_1 = __importDefault(require("rfb2"));
var unpackstream_1 = __importDefault(require("rfb2/unpackstream"));
/**
 * @internal
 */
var RfbClient = /** @class */ (function (_super) {
    __extends(RfbClient, _super);
    function RfbClient(stream, params) {
        var _this = _super.call(this) || this;
        _this.stream = stream;
        _this.params = params;
        _this.disconnectOthers = false;
        _this.packStream = new unpackstream_1.default();
        _this.packStream.on("data", function (data) {
            _this.stream.write(data);
        });
        stream.on("data", function (data) {
            _this.packStream.write(data);
        });
        // TODO: check if I need that at all
        _this.packStream.serverBigEndian = !true;
        _this.packStream.clientBigEndian = !true;
        _this.readServerVersion();
        return _this;
    }
    RfbClient.prototype.keyEvent = function (keysym, isDown) {
        var stream = this.packStream;
        stream.pack("CCxxL", [rfb2_1.default.clientMsgTypes.keyEvent, isDown, keysym]);
        stream.flush();
    };
    RfbClient.prototype.end = function () {
        this.stream.destroy();
        // this.stream.end()
    };
    RfbClient.prototype.readString = function (cb) {
        var stream = this.packStream;
        stream.unpack("L", function (res) {
            stream.get(res[0], function (strBuff) {
                cb(strBuff.toString());
            });
        });
    };
    RfbClient.prototype.readError = function () {
        var _this = this;
        this.readString(function (str) {
            _this.emit("error", str);
        });
    };
    RfbClient.prototype.readServerVersion = function () {
        var _this = this;
        var stream = this.packStream;
        stream.get(12, function (rfbver) {
            _this.serverVersion = rfbver.toString("ascii");
            stream.pack("a", [rfb2_1.default.versionstring.V3_008]).flush();
            if (_this.serverVersion === rfb2_1.default.versionstring.V3_003) {
                stream.unpack("L", function (secType) {
                    var type = secType[0];
                    console.error("3.003 security type: " + type);
                    if (type === 0) {
                        _this.readError();
                    }
                    else {
                        _this.securityType = type;
                        // 3.003 version does not send result for None security
                        if (type === rfb2_1.default.security.None)
                            _this.clientInit();
                        else
                            _this.processSecurity();
                    }
                });
                return;
            }
            // read security types
            stream.unpack("C", function (res) {
                var numSecTypes = res[0];
                if (numSecTypes === 0) {
                    console.error(["zero num sec types", res]);
                    _this.readError();
                }
                else {
                    stream.get(numSecTypes, function (secTypes) {
                        var securitySupported = [];
                        // tslint:disable-next-line
                        for (var s = 0; s < secTypes.length; ++s) {
                            securitySupported[secTypes[s]] = true;
                        }
                        if (!_this.params.security) {
                            throw new Error("this.params.security is not defined");
                        }
                        // tslint:disable-next-line
                        for (var s = 0; s < _this.params.security.length; ++s) {
                            var clientSecurity = _this.params.security[s];
                            if (securitySupported[clientSecurity]) {
                                _this.securityType = clientSecurity;
                                stream.pack("C", [_this.securityType]).flush();
                                return _this.processSecurity();
                            }
                        }
                        throw new Error("Server does not support any security provided by client");
                    });
                }
            });
        });
    };
    RfbClient.prototype.readSecurityResult = function () {
        var _this = this;
        var stream = this.packStream;
        stream.unpack("L", function (securityResult) {
            if (securityResult[0] === 0) {
                _this.clientInit();
            }
            else {
                _this.readString(function (message) {
                    _this.emit("error", message);
                });
            }
        });
    };
    RfbClient.prototype.processSecurity = function () {
        var _this = this;
        var stream = this.packStream;
        // TODO: refactor and move security to external file
        switch (this.securityType) {
            case rfb2_1.default.security.None:
                // do nothing
                this.readSecurityResult();
                break;
            case rfb2_1.default.security.VNC:
                var sendVncChallengeResponse_1 = function (challenge, password) {
                    var response = require("rfb2/d3des").response(challenge, password);
                    stream.pack("a", [response]).flush();
                    _this.readSecurityResult();
                };
                stream.get(16, function (challenge) {
                    if (_this.params.password) {
                        sendVncChallengeResponse_1(challenge, _this.params.password);
                    }
                    else if (_this.params.credentialsCallback) {
                        // @ts-ignore
                        _this.params.credentialsCallback.call(_this, function (password) {
                            sendVncChallengeResponse_1(challenge, password);
                        });
                    }
                    else {
                        throw new Error("Server requires VNC security but no password given");
                    }
                });
                break;
            default:
                throw new Error("unknown security type: " + this.securityType);
        }
    };
    RfbClient.prototype.clientInit = function () {
        var _this = this;
        var stream = this.packStream;
        var initMessage = this.disconnectOthers
            ? rfb2_1.default.connectionFlag.Exclusive
            : rfb2_1.default.connectionFlag.Shared;
        stream.pack("C", [initMessage]).flush();
        stream.unpackTo(this, [
            "S width",
            "S height",
            "C bpp",
            "C depth",
            "C isBigEndian",
            "C isTrueColor",
            "S redMax",
            "S greenMax",
            "S blueMax",
            "C redShift",
            "C greenShift",
            "C blueShift",
            "xxx",
            "L titleLength",
        ], function () {
            // TODO: remove next 3 lines
            stream.serverBigEndian = false; // this.isBigEndian;
            stream.clientBigEndian = false; // this.isBigEndian;
            // stream.bigEndian = false; //this.isBigEndian;
            if (!_this.titleLength) {
                _this.title = "";
                delete _this.titleLength;
                _this.emit("connect");
            }
            else {
                stream.get(_this.titleLength, function (titleBuf) {
                    _this.title = titleBuf.toString();
                    delete _this.titleLength;
                    // this.setPixelFormat();
                    _this.emit("connect");
                });
            }
        });
    };
    return RfbClient;
}(events_1.EventEmitter));
exports.RfbClient = RfbClient;
var fs_1 = __importDefault(require("fs"));
function createRfbStream(name) {
    var stream = new events_1.EventEmitter();
    var fileStream = fs_1.default.createReadStream(name);
    var pack = new unpackstream_1.default();
    fileStream.pipe(pack);
    var start = Date.now();
    function readData() {
        fileStream.resume();
        pack.unpack("L", function (size) {
            pack.get(size[0], function (databuf) {
                pack.unpack("L", function (timestamp) {
                    // tslint:disable-next-line:no-bitwise
                    var padding = 3 - ((size - 1) & 0x03);
                    pack.get(padding, function () {
                        if (!stream.ending) {
                            stream.emit("data", databuf);
                            var now = Date.now() - start;
                            var timediff = timestamp[0] - now;
                            stream.timeout = setTimeout(readData, timediff);
                            fileStream.pause();
                        }
                    });
                });
            });
        });
    }
    // @ts-ignore
    pack.get(12, function (fileVersion) {
        readData();
    });
    stream.end = function () {
        stream.ending = true;
        if (stream.timeout)
            clearTimeout(stream.timeout);
    };
    // @ts-ignore
    stream.write = function (buf) {
        // ignore
    };
    return stream;
}
/**
 * @internal
 */
function createConnection(params) {
    // first matched to list of supported by server will be used
    if (!params.security)
        params.security = [rfb2_1.default.security.VNC, rfb2_1.default.security.None];
    var stream;
    if (!params.stream) {
        if (params.in && params.rfbfile)
            stream = createRfbStream(params.rfbfile);
        else {
            if (!params.host)
                params.host = "127.0.0.1";
            if (!params.port)
                params.port = 5900;
            stream = net_1.default.createConnection(params.port, params.host);
        }
    }
    else {
        stream = params.stream;
    }
    // todo: move outside rfbclient
    if (params.out) {
        var start_1 = Date.now();
        var wstream_1 = fs_1.default.createWriteStream(params.out);
        wstream_1.write("FBS 001.001\n");
        stream
            .on("data", function (data) {
            var sizeBuf = new Buffer(4);
            var timeBuf = new Buffer(4);
            var size = data.length;
            sizeBuf.writeInt32BE(size, 0);
            wstream_1.write(sizeBuf);
            wstream_1.write(data);
            timeBuf.writeInt32BE(Date.now() - start_1, 0);
            wstream_1.write(timeBuf);
            // tslint:disable-next-line
            var padding = 3 - ((size - 1) & 0x03);
            var pbuf = new Buffer(padding);
            wstream_1.write(pbuf);
        })
            .on("end", function () {
            wstream_1.end();
        });
    }
    var client = new RfbClient(stream, params);
    stream.on("error", function (err) {
        client.emit("error", err);
    });
    return client;
}
exports.default = { createConnection: createConnection };
