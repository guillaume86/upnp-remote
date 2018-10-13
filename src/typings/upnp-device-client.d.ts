declare module "upnp-device-client" {
  import { EventEmitter } from "events";

  type Callback<T = any> = (err: Error, result: T) => void;

  class Client extends EventEmitter {
    constructor(url: string);
    getDeviceDescription(callback: Callback): void;
    getServiceDescription(serviceId: string, callback: Callback): void;
    callAction(
      serviceId: string,
      actionName: string,
      params: any,
      headers: { [name: string]: string },
      callback: Callback,
    ): void;
  }

  export = Client;
}
