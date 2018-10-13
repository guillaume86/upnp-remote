import UpnpClient from "upnp-device-client";
import { Box } from "./common";

function callActionAsync<T = any>(
  box: Box,
  serviceId: string,
  actionName: string,
  params: any,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const client = getUpnpClient(box.location.MediaRenderer);
    client.callAction(serviceId, actionName, params, {}, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

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

export const getMediaInfo = (box: Box) =>
  callActionAsync<Voo.upnp.MediaInfo>(box, "AVTransport", "GetMediaInfo", {
    InstanceID: 0,
  });

export const getTransportInfo = (box: Box) =>
  callActionAsync<Voo.upnp.TransportInfo>(
    box,
    "AVTransport",
    "GetTransportInfo",
    {
      InstanceID: 0,
    },
  );

export const setAVTransportURI = (box: Box, uri: string) =>
  callActionAsync(box, "AVTransport", "SetAVTransportURI", {
    InstanceID: 0,
    CurrentURI: uri,
    CurrentURIMetaData: "NOT_IMPLEMENTED",
  });

const epgChannelIdToHexaId = (id: string) =>
  "dvb://" +
  id
    .split(":")
    .map((str) => parseInt(str, 10).toString(16))
    .join(".");

export const setChannel = (box: Box, channel: Voo.http.Channel) =>
  setAVTransportURI(box, epgChannelIdToHexaId(channel.id));
