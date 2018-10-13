import fs from "fs";
import os from "os";
import path from "path";

export const appDir = path.join(os.homedir(), ".upnp-remote");

if (!fs.existsSync(appDir)) {
  fs.mkdirSync(appDir);
}

export default appDir;
