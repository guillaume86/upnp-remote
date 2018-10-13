import { Box } from "./common";
export declare const getMediaInfo: (box: Box) => Promise<Voo.upnp.MediaInfo>;
export declare const getTransportInfo: (box: Box) => Promise<Voo.upnp.TransportInfo>;
export declare const setAVTransportURI: (box: Box, uri: string) => Promise<any>;
export declare const setChannel: (box: Box, channel: Voo.http.Channel) => Promise<any>;
