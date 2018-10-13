import fetch from "node-fetch";
import { Client } from "node-ssdp";
import { cache } from "../utils";
import { TV } from "./common";

interface TVHeaders {
  LOCATION?: string;
  ST?: string;
  USN?: string;
}

const SEARCH_TIMEOUT = 5000;
const SERVICE_TYPE = "urn:schemas-sony-com:service:IRCC:1";

/**
 * @internal
 */
export function findTV(): Promise<TV | null> {
  return new Promise((resolve) => {
    const instance = new Client({});
    let found = false;

    instance.on("response", (headers: TVHeaders, _code, rinfo) => {
      if (found || rinfo.address === "127.0.0.1") return;

      if (headers.LOCATION && headers.ST === SERVICE_TYPE) {
        found = true;
        clearTimeout(timer);
        instance.stop();
        resolve({
          ip: rinfo.address,
          location: {
            IRCC: headers.LOCATION,
          },
        });
      }
    });

    const timer = setTimeout(() => {
      if (found) return;
      instance.stop();
      resolve(null);
    }, SEARCH_TIMEOUT);

    // instance.search(SERVICE_TYPE);
    instance.search("ssdp:all");
  });
}

async function checkTV(device: TV | null) {
  if (!device) return false;

  try {
    await fetch(device.location.IRCC, { timeout: 2000 });
    return true;
  } catch (err) {
    return false;
  }
}

export const findTVCached = cache.memoize(findTV, "sony.ssdp.findTV", checkTV);
