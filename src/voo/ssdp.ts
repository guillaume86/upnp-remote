import fetch from "node-fetch";
import { Client } from "node-ssdp";
import { cache, parseString } from "../utils";
import { Box } from "./common";

interface BoxHeaders {
  LOCATION?: string;
  USN?: string;
}

const SEARCH_TIMEOUT = 5000;
const BOX_SERVICE_TYPE = "urn:schemas-upnp-org:service:RemoteUIServer:1";
// const BOX_SERVICE_TYPE = "urn:schemas-upnp-org:service:MediaRenderer:2";

async function deviceIsBox(location: string): Promise<boolean> {
  const response = await fetch(location);
  const descriptionXml = await response.text();
  const description = await parseString(descriptionXml, {
    explicitRoot: false,
  });

  if (description && description.device) {
    const [device] = description.device;
    if (device && device.modelDescription) {
      const [modelDescription] = device.modelDescription;
      if (modelDescription === "VOO Remote") {
        return true;
      }
    }
  }
  return false;
}

/**
 * @internal
 */
export function findBox(): Promise<Box | null> {
  return new Promise((resolve, reject) => {
    const instance = new Client({});
    let found = false;

    instance.on("response", async (headers: BoxHeaders, _code, rinfo) => {
      // if (rinfo.address === "192.168.0.12") {
      //   console.log({ headers, _code, rinfo });
      // }

      if (found || rinfo.address === "127.0.0.1") return;

      if (headers.LOCATION && (await deviceIsBox(headers.LOCATION))) {
        found = true;
        clearTimeout(timer);
        instance.stop();

        // MediaRenderer is description{n-1}.xml
        const locationMatch = /\/description(\d+)\.xml$/.exec(headers.LOCATION);
        if (locationMatch?.length !== 2) {
          return reject(
            new Error("Location format not recognized: " + headers.LOCATION),
          );
        }
        const path = locationMatch[0];
        const descIndex = parseInt(locationMatch[1], 10);

        resolve({
          ip: rinfo.address,
          location: {
            RemoteUIServer: headers.LOCATION,
            MediaRenderer: headers.LOCATION.replace(
              path,
              `/description${descIndex - 1}.xml`,
            ),
          },
        });
      }
    });

    const timer = setTimeout(() => {
      if (found) return;
      instance.stop();
      resolve(null);
    }, SEARCH_TIMEOUT);

    instance.search(BOX_SERVICE_TYPE);
  });
}

async function checkBox(device: Box | null) {
  if (!device) return false;

  try {
    await fetch(device.location.RemoteUIServer, { timeout: 2000 });
    return true;
  } catch (err) {
    return false;
  }
}

export const findBoxCached = cache.memoize(
  findBox,
  "voo.ssdp.findBox",
  checkBox,
);
