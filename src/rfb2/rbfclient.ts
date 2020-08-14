import { EventEmitter } from "events";
import net from "net";
import rfb, { RfbClientArgs } from "rfb2";
import PackStream from "rfb2/unpackstream";
import { Writable } from "stream";

/**
 * @internal
 */
export class RfbClient extends EventEmitter {
  private packStream: PackStream;
  private serverVersion?: string;
  private securityType?: rfb.security;
  private disconnectOthers = false;
  private titleLength?: number;
  // @ts-ignore
  private title?: string;

  constructor(private stream: Writable, private params: RfbClientArgs) {
    super();

    this.packStream = new PackStream();
    this.packStream.on("data", (data) => {
      this.stream.write(data);
    });
    stream.on("data", (data) => {
      this.packStream.write(data);
    });

    // TODO: check if I need that at all
    this.packStream.serverBigEndian = !true;
    this.packStream.clientBigEndian = !true;
    this.readServerVersion();
  }

  public keyEvent(keysym: number, isDown: boolean) {
    const stream = this.packStream;

    stream.pack("CCxxL", [rfb.clientMsgTypes.keyEvent, isDown, keysym]);
    stream.flush();
  }

  public end() {
    this.stream.destroy();
    // this.stream.end()
  }

  private readString(cb: (result: string) => void): void {
    const stream = this.packStream;
    stream.unpack("L", (res) => {
      stream.get(res[0], (strBuff) => {
        cb(strBuff.toString());
      });
    });
  }

  private readError(): void {
    this.readString((str) => {
      this.emit("error", str);
    });
  }

  private readServerVersion() {
    const stream = this.packStream;
    stream.get(12, (rfbver) => {
      this.serverVersion = rfbver.toString("ascii");
      stream.pack("a", [rfb.versionstring.V3_008]).flush();
      if (this.serverVersion === rfb.versionstring.V3_003) {
        stream.unpack("L", (secType) => {
          const type = secType[0];
          console.error("3.003 security type: " + type);
          if (type === 0) {
            this.readError();
          } else {
            this.securityType = type;
            // 3.003 version does not send result for None security
            if (type === rfb.security.None) this.clientInit();
            else this.processSecurity();
          }
        });
        return;
      }

      // read security types
      stream.unpack("C", (res) => {
        const numSecTypes = res[0];
        if (numSecTypes === 0) {
          console.error(["zero num sec types", res]);
          this.readError();
        } else {
          stream.get(numSecTypes, (secTypes) => {
            const securitySupported = [];
            // tslint:disable-next-line
            for (let s = 0; s < secTypes.length; ++s) {
              securitySupported[secTypes[s]] = true;
            }
            if (!this.params.security) {
              throw new Error("this.params.security is not defined");
            }
            // tslint:disable-next-line
            for (let s = 0; s < this.params.security.length; ++s) {
              const clientSecurity = this.params.security[s];
              if (securitySupported[clientSecurity]) {
                this.securityType = clientSecurity;
                stream.pack("C", [this.securityType]).flush();
                return this.processSecurity();
              }
            }
            throw new Error(
              "Server does not support any security provided by client",
            );
          });
        }
      });
    });
  }

  private readSecurityResult() {
    const stream = this.packStream;
    stream.unpack("L", (securityResult) => {
      if (securityResult[0] === 0) {
        this.clientInit();
      } else {
        this.readString((message) => {
          this.emit("error", message);
        });
      }
    });
  }

  private processSecurity() {
    const stream = this.packStream;
    // TODO: refactor and move security to external file
    switch (this.securityType) {
      case rfb.security.None:
        // do nothing
        this.readSecurityResult();
        break;
      case rfb.security.VNC:
        const sendVncChallengeResponse = (
          challenge: Buffer,
          password: string,
        ) => {
          const response = require("rfb2/d3des").response(challenge, password);
          stream.pack("a", [response]).flush();
          this.readSecurityResult();
        };
        stream.get(16, (challenge) => {
          if (this.params.password) {
            sendVncChallengeResponse(challenge, this.params.password);
          } else if (this.params.credentialsCallback) {
            // @ts-ignore
            this.params.credentialsCallback.call(this, (password: string) => {
              sendVncChallengeResponse(challenge, password);
            });
          } else {
            throw new Error(
              "Server requires VNC security but no password given",
            );
          }
        });
        break;
      default:
        throw new Error("unknown security type: " + this.securityType);
    }
  }

  private clientInit() {
    const stream = this.packStream;

    const initMessage = this.disconnectOthers
      ? rfb.connectionFlag.Exclusive
      : rfb.connectionFlag.Shared;
    stream.pack("C", [initMessage]).flush();

    stream.unpackTo(
      this,
      [
        "S width",
        "S height",
        "C bpp", // 16-bytes pixel format
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
      ],

      () => {
        // TODO: remove next 3 lines
        stream.serverBigEndian = false; // this.isBigEndian;
        stream.clientBigEndian = false; // this.isBigEndian;
        // stream.bigEndian = false; //this.isBigEndian;

        if (!this.titleLength) {
          this.title = "";
          delete this.titleLength;
          this.emit("connect");
        } else {
          stream.get(this.titleLength, (titleBuf) => {
            this.title = titleBuf.toString();
            delete this.titleLength;
            // this.setPixelFormat();
            this.emit("connect");
          });
        }
      },
    );
  }
}

interface RfbStream extends EventEmitter {
  ending?: boolean;
  timeout?: NodeJS.Timer;
  end?: () => void;
  write?: (buf: Buffer) => void;
}

import fs from "fs";
function createRfbStream(name: string): RfbStream {
  const stream: RfbStream = new EventEmitter();
  const fileStream = fs.createReadStream(name);
  const pack = new PackStream();
  fileStream.pipe(pack);
  const start = Date.now();
  function readData() {
    fileStream.resume();
    pack.unpack("L", (size) => {
      pack.get(size[0], (databuf) => {
        pack.unpack("L", (timestamp) => {
          // tslint:disable-next-line:no-bitwise
          const padding = 3 - ((size - 1) & 0x03);
          pack.get(padding, () => {
            if (!stream.ending) {
              stream.emit("data", databuf);
              const now = Date.now() - start;
              const timediff = timestamp[0] - now;
              stream.timeout = setTimeout(readData, timediff);
              fileStream.pause();
            }
          });
        });
      });
    });
  }

  // @ts-ignore
  pack.get(12, (fileVersion) => {
    readData();
  });

  stream.end = () => {
    stream.ending = true;
    if (stream.timeout) clearTimeout(stream.timeout);
  };

  // @ts-ignore
  stream.write = (buf) => {
    // ignore
  };
  return stream;
}

/**
 * @internal
 */
function createConnection(params: RfbClientArgs): RfbClient {
  // first matched to list of supported by server will be used
  if (!params.security) params.security = [rfb.security.VNC, rfb.security.None];

  let stream: RfbStream;
  if (!params.stream) {
    if (params.in && params.rfbfile) stream = createRfbStream(params.rfbfile);
    else {
      if (!params.host) params.host = "127.0.0.1";
      if (!params.port) params.port = 5900;
      stream = net.createConnection(params.port, params.host);
    }
  } else {
    stream = params.stream;
  }

  // todo: move outside rfbclient
  if (params.out) {
    const start = Date.now();
    const wstream = fs.createWriteStream(params.out);
    wstream.write("FBS 001.001\n");
    stream
      .on("data", (data) => {
        const sizeBuf = new Buffer(4);
        const timeBuf = new Buffer(4);
        const size = data.length;
        sizeBuf.writeInt32BE(size, 0);
        wstream.write(sizeBuf);
        wstream.write(data);
        timeBuf.writeInt32BE(Date.now() - start, 0);
        wstream.write(timeBuf);
        // tslint:disable-next-line
        const padding = 3 - ((size - 1) & 0x03);
        const pbuf = new Buffer(padding);
        wstream.write(pbuf);
      })
      .on("end", () => {
        wstream.end();
      });
  }

  const client = new RfbClient(stream as any, params);
  stream.on("error", (err) => {
    client.emit("error", err);
  });
  return client;
}

export default { createConnection };
