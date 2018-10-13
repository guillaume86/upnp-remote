const { Client } = require("node-ssdp");
const rfb = require("rfb2");
const buttons = require("./buttons");

function raceTimeout(callback, timeout) {
  let done = false;
  const timer = setTimeout(function() {
    if (done) throw new Error("callback has already run once");
    done = true;

    callback();
  }, timeout);

  return function runNow() {
    if (done) throw new Error("callback has already run once");
    done = true;

    clearTimeout(timer);
    callback();
  };
}

function searchEvasionUpnp() {
  const client = new Client({
    ssdpIp: "239.255.255.250",
    ssdpPort: 1900
  });

  client.on("notify", function() {
    console.log("Got a notification.");
  });

  client.on("response", function inResponse(headers, code, rinfo) {
    // not a Voo Evasion
    if (!headers["01-NLS"]) return;

    const uuid = headers["USN"].split(":")[1];
    const macAddress = uuid
      .substring(uuid.length - 12)
      .replace(/([0-9A-Fa-f]{2})/g, "$1:")
      .substring(0, 17);
    console.log({
      USN: headers["USN"],
      UUID: uuid,
      MAC_RAW: uuid.substring(uuid.length - 12),
      MAC_REPLACED: uuid
        .substring(uuid.length - 12)
        .replace(/([0-9A-Fa-f]{2})/g, "$1:"),
      MAC_SUBSTR: macAddress
    });
    const boxIp = rinfo.address;
    // console.log(headers);
    // console.log('Got a response to an m-search:\n%d\n%s\n%s', code, JSON.stringify(headers, null, '  '), JSON.stringify(rinfo, null, '  '));

    stopClient();
    startRfbConnection(boxIp);
  });

  const stopClient = raceTimeout(function() {
    client.stop();
  }, 5000);

  client.search("urn:schemas-upnp-org:service:RemoteUIServer:1");
}

// searchEvasionUpnp();

startRfbConnection("192.168.0.12");

function startRfbConnection(boxIp) {
  console.log("startRfbConnection", boxIp);

  var rfbConnection = rfb.createConnection({
    host: boxIp,
    port: 5900,
    password: ""
  });

  function sendKey(keysim) {
    rfbConnection.keyEvent(keysim, true);
    rfbConnection.keyEvent(keysim, false);
  }

  rfbConnection.on("connect", function() {
    console.log("successfully connected and authorised");
    sendKey(buttons.REMOTE_7);
    rfbConnection.end();
  });

  rfbConnection.on("error", function(error) {
    throw new Error(error);
  });
}
