// tslint:disable
import {
  findBoxCached,
  Remote,
  RemoteButton as VooRemoteButton,
  findChannel,
  Box,
} from "./voo";
import * as upnp from "./voo/upnp";
import {
  findTVCached,
  sendIRCC,
  ScalarWebAPIClient,
  RemoteButton as SonyRemoteButton,
} from "./sony";
import { setTimeoutAsync } from "./utils";

const testBox = async () => {
  const box = await findBoxCached();
  if (box) {
    const remote = new Remote(box);
    remote.sendKey(VooRemoteButton.STAND_BY);

    const mediaInfo = await upnp.getMediaInfo(box);
    const transportInfo = await upnp.getTransportInfo(box);
    console.log(mediaInfo, transportInfo);

    // INFO: rejected with Error: TRANSPORT IS LOCKED (705) if in stand by
    try {
      await upnp.setChannel(box, { id: "1:108:10805" } as any);
    } catch (err) {
      console.error(err.toString());
    }
  } else {
    console.log("box not found");
  }
};

//testBox();

const testTV = async () => {
  // const channels = await getChannels();
  // console.log({ channels });

  const tv = await findTVCached();
  if (tv) {
    // console.log(tv);
    // const VOLUME_DOWN = "AAAAAQAAAAEAAAATAw==";
    // const result = await sendIRCC(tv, VOLUME_DOWN);
    // console.log(result);
    // const client = new ScalarWebAPIClient(tv.location.IRCC);
    // const result = await client.getMethodTypes("system");
    // const buttons = await client.getRemoteControllerInfo();
    // console.log((await client.getPowerStatus()) === "active");
    // await sendIRCC(tv, SonyRemoteButton.Tv);
  } else {
    console.log("tv not found");
  }
};

// testTV();

const STANDBY_ERROR = "TRANSPORT IS LOCKED (705)";

async function setChannelSafe(
  box: Box,
  channel: Voo.http.Channel,
  maxTries = 10,
  currentTry = 0,
) {
  try {
    // rejected with Error: TRANSPORT IS LOCKED (705) if in stand by
    await upnp.setChannel(box, channel);
  } catch (err) {
    const lastTry = maxTries === currentTry;
    if (!lastTry && err instanceof Error && err.message === STANDBY_ERROR) {
      // if first try, turn on the box
      if (currentTry === 0) {
        const remote = new Remote(box);
        remote.sendKey(VooRemoteButton.STAND_BY);
      }
      await setTimeoutAsync(currentTry === 0 ? 3000 : 1000);
      await setChannelSafe(box, channel, maxTries, currentTry + 1);
    } else {
      throw err;
    }
  }
}

// const cachedBox = {
//   ip: "192.168.0.12",
//   location: {
//     RemoteUIServer: "http://192.168.0.12:49153/description1.xml",
//     MediaRenderer: "http://192.168.0.12:49153/description0.xml",
//   },
// };

async function setBoxChannel(name: string) {
  const [box, channel] = await Promise.all([
    findBoxCached(),
    findChannel(name),
  ]);
  if (!box) throw new Error(`Box .évasion not found`);
  if (!channel) throw new Error(`Channel ${name} not found`);

  await setChannelSafe(box, channel);
}

// const cachedTV = {
//   ip: "192.168.0.10",
//   location: { IRCC: "http://192.168.0.10/sony/webapi/ssdp/dd.xml" },
// };

async function setTvInput() {
  const tv = await findTVCached();
  if (!tv) throw new Error(`TV not found`);
  await sendIRCC(tv, SonyRemoteButton.Tv);
}

async function setChannel(name: string) {
  await Promise.all([setTvInput(), setBoxChannel(name)]);
}

const channelName = process.argv[2] || "tf1";

setChannel(channelName)
  .then(() => console.log("done"))
  .catch((err) => console.error(err));

// findChannel(channelName).then(console.log);
