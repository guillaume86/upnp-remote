var Client = require('upnp-device-client');

// Instanciate a client with a device description URL (discovered by SSDP)
var client = new Client('http://192.168.0.12:49153/description0.xml'); // VOO Evasion
var clientTV = new Client('http://192.168.0.10:52323/MediaRenderer.xml'); // TV Sony

// // Get the device description
// client.getDeviceDescription(function(err, description) {
//   if(err) throw err;
//   console.log(description);
// });

// // Get the device's AVTransport service description
// client.getServiceDescription('AVTransport', function(err, description) {
//   if(err) throw err;
//   console.log(description);
// });

// // Call GetMediaInfo on the AVTransport service
// client.callAction('AVTransport', 'GetMediaInfo', { 
//   InstanceID: 0,
// }, function(err, result) {
//   if(err) throw err;
//   console.log(result); // => { NrTracks: '1', MediaDuration: ... }
// });

// clientTV.callAction('AVTransport', 'GetTransportInfo', { 
//   InstanceID: 0,
// }, function(err, result) {
//   if(err) throw err;
//   console.log(result);
// });

// client.callAction('AVTransport', 'SetAVTransportURI', { 
//   InstanceID: 0,
//   CurrentURI: "dvb://1.6c.2a31",
//   CurrentURIMetaData: "NOT_IMPLEMENTED",
// }, function(err, result) {
//   if(err) throw err;
//   console.log(result); // => { NrTracks: '1', MediaDuration: ... }
// });

// var listener;
// client.subscribe('AVTransport', listener = function(e) {
//   // Will receive events like { InstanceID: 0, TransportState: 'PLAYING' } when playing media
//   console.log(e); 
// });

// setTimeout(function() {
//   client.unsubscribe('AVTransport', listener);
// }, 30000);
