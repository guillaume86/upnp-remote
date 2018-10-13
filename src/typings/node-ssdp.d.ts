/**
 * node.js SSDP client/server.
 * https://github.com/diversario/node-ssdp
 */
declare module "node-ssdp" {
  import { RemoteInfo } from "dgram";

  interface Headers {
    [name: string]: string;
  }

  interface ClientOptions {
    ssdpIp?: string;
    ssdpPort?: number;
  }

  type ResponseCallback = (
    headers: Headers,
    statusCode: number,
    rinfo: RemoteInfo,
  ) => void;

  export class Client {
    constructor(options: ClientOptions);

    /**
     * Start the listener for multicast notifications from SSDP devices
     * @param callback
     */
    start(callback?: (err: Error | undefined) => void): Promise<void>;

    /**
     * Close UDP socket.
     */
    stop(): void;

    /**
     * Start a search for a service type
     * @param serviceType The service type
     * ex. urn:schemas-upnp-org:service:ContentDirectory:1
     */
    search(serviceType: string): void;

    /**
     *
     */
    on(type: "response", callback: ResponseCallback): void;
  }
}
