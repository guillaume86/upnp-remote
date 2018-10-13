import UpnpClient from "upnp-device-client";
import { AUTH_HEADERS, TV } from "./common";

const clientCache: { [url: string]: UpnpClient } = {};
const getUpnpClient = (url: string): UpnpClient => {
  if (url in clientCache) {
    return clientCache[url];
  } else {
    const client = new UpnpClient(url);
    clientCache[url] = client;
    return client;
  }
};

function callActionAsync<T = any>(
  target: TV,
  serviceId: string,
  actionName: string,
  params: any,
  headers: {},
): Promise<T> {
  return new Promise((resolve, reject) => {
    const client = getUpnpClient(target.location.IRCC);
    client.callAction(serviceId, actionName, params, headers, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

export const sendIRCC = (tv: TV, irccCode: string) =>
  callActionAsync(
    tv,
    "urn:schemas-sony-com:serviceId:IRCC",
    "X_SendIRCC",
    { IRCCCode: irccCode },
    AUTH_HEADERS,
  );
