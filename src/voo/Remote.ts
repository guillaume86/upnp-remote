import rfb, { RfbClient } from "../rfb2";
import { Box } from "./common";
import RemoteButton from "./RemoteButton";

/**
 * @internal
 */
export default class Remote {
  constructor(public box: Box) {}

  public async sendKey(key: RemoteButton) {
    const conn = await this.openConnection();
    conn.keyEvent(key, true);
    conn.keyEvent(key, false);
    conn.end();
  }

  public async sendKeys(...keys: RemoteButton[]) {
    const conn = await this.openConnection();
    for (const key of keys) {
      conn.keyEvent(key, true);
      conn.keyEvent(key, false);
    }
    conn.end();
  }

  private openConnection(): Promise<RfbClient> {
    return new Promise((resolve, reject) => {
      const rfbConnection = rfb.createConnection({
        host: this.box.ip,
        port: 5900,
        password: "",
      });

      const onConnect = () => {
        rfbConnection.removeListener("error", onError);
        resolve(rfbConnection);
      };

      const onError = (error: Error) => {
        reject(error);
      };

      rfbConnection.on("connect", onConnect);
      rfbConnection.on("error", onError);
    });
  }
}
