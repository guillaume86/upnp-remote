const { Client } = require('node-ssdp');

let client = new Client({
  ssdpIp: "239.255.255.250",
  //ssdpIp: "192.168.0.10",
  ssdpPort: 1900,
});

let results = {};
client.on('response', function inResponse(headers, code, rinfo) {
  if (rinfo.address.indexOf("127.0.0.1") !== -1) return;
  // console.log('Got a response to an m-search:\n%d\n%s\n%s', code, JSON.stringify(headers, null, '  '), JSON.stringify(rinfo, null, '  '));
  // console.log(headers);

  results[headers['USN']] = headers;
  const uuid = headers["USN"].split(':')[1];
  const macAddressRaw = uuid.substring(uuid.length - 12);
  const macAddress = macAddressRaw.replace(/([0-9A-Fa-f]{2})/g, "$1:").slice(0, -1);
  // console.log({
  //   USN: headers["USN"],
  //   UUID: uuid,
  //   MAC_SUBSTR: macAddress,
  // });
});


setTimeout(function() {
  client.stop();
  process.stdout.write(JSON.stringify(results, null, 4));
}, 3000);

client.search('ssdp:all');
//client.search('urn:schemas-upnp-org:device:MediaRenderer:2');
//client.search('urn:schemas-upnp-org:service:RemoteUIServer:1');