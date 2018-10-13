const fs = require('fs');
const ssdp = require('node-ssdp');
const http = require('http');

const filename = "./registry.json";

class BoxRegistry {
  constructor() {
    this.data = null;
    this.load();
    this.discover();
  }

  load() {
    if (!fs.existsSync(filename)) return;
    this.data = JSON.parse(fs.readFileSync(filename));
  }

  save() {
    fs.writeFileSync(filename, JSON.stringify(this.data, null, 2));
  }

  discover() {
    // TODO: use web API GetAllBoxes to filter out upnp results and name boxes
    if (this.data && this.data.length) {
      const headers = this.data[0];
      http.get(headers.LOCATION, function(res) {
        if (res.statusCode === 200) {
          console.log('box URL validated');
        }
      });
    } else {
      const results = {};
      const client = new ssdp.Client({
        ssdpIp: "239.255.255.250",
        ssdpPort: 1900,
      });
      
      client.search('urn:schemas-upnp-org:service:RemoteUIServer:1');
      
      client.on('response', function inResponse(headers, code, rinfo) {
        if (headers['LOCATION'] && headers['01-NLS']) {
          results[headers.LOCATION] = headers;
        }
      });
      
      setTimeout(() => {
        client.stop();
        this.data = Object.values(results);
        this.save();
      }, 2000);
    }
  }
}

const instance = new BoxRegistry();

//export default instance;