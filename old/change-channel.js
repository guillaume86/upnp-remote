const channels = require('./voo-channels.json');

const DEVICE_TYPE = "urn:schemas-upnp-org:device:MediaRenderer:2";
const sAVTransportURI = "SetAVTransportURI";

function epgChannelIdToHexaId(id) {
  return 'dvb://' + id.split(':').map(str => parseInt(str, 10).toString(16)).join('.');
}

const box = { };
const channelId = epgChannelIdToHexaId(channels.Channels.Channel[0].id);

console.log(channelId);