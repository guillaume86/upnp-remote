declare module "rfb2" {
  import * as events from "events";
  import { Duplex } from "stream";

  export enum encodings {
    raw = 0,
    copyRect = 1,
    rre = 2,
    hextile = 5,
    zrle = 16,
    pseudoCursor = -239,
    pseudoDesktopSize = -223,
  }

  export enum security {
    None = 1,
    VNC = 2,
    ARD = 30,
  }

  export enum connectionFlag {
    Exclusive,
    Shared,
  }

  export enum clientMsgTypes {
    keyEvent,
  }

  export interface RfbClientArgs {
    host?: string;
    port?: number;
    password?: string;
    security?: Array<security>;
    credentialsCallback?(
      cli: RfbClient,
      callback: (password: string) => void,
    ): void;
    encodings?: Array<encodings>;
    stream?: Duplex;
    in?: boolean;
    out?: string;
    rfbfile?: string;
  }

  export class RfbClient extends events.EventEmitter {
    width: number;
    height: number;

    keyEvent(keyCode: number, isDown?: boolean): void;
    requestUpdate(
      incremental: boolean,
      x: number,
      y: number,
      width: number,
      height: number,
    ): void;
    end(): void;
  }

  const versionstring: any;

  export { versionstring };

  export function createConnection(args: RfbClientArgs): RfbClient;
}

declare module "rfb2/unpackstream" {
  import { Stream, Duplex } from "stream";

  class PackStream extends Duplex {
    serverBigEndian: boolean;
    clientBigEndian: boolean;
    pack(type: string, value: any[]): PackStream;
    unpack(type: string, cb: (result: any) => void): PackStream;
    unpackTo<T>(
      destination: T,
      namesFormat: string[],
      callback: (dest: T) => void,
    ): void;
    get(len: number, cb: (result: Buffer) => void): void;
    flush(): void;
  }

  export default PackStream;
}

declare module "rfb2/d3des" {
  function response(challenge: Buffer, password: string): void;
  export { response };
}
