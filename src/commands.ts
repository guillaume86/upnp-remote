// tslint:disable
import {
  findBoxCached,
  Remote,
  RemoteButton as VooRemoteButton,
  findChannel,
  Box,
  setChannel as vooSetChannel,
} from "./voo";
import {
  findTVCached,
  sendIRCC,
  RemoteButton as SonyRemoteButton,
} from "./sony";
import { setTimeoutAsync } from "./utils";

const STANDBY_ERROR = "TRANSPORT IS LOCKED (705)";

async function setChannelSafe(
  box: Box,
  channel: Voo.http.Channel,
  maxTries = 10,
  currentTry = 0,
) {
  try {
    // rejected with Error: TRANSPORT IS LOCKED (705) if in stand by
    await vooSetChannel(box, channel);
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

async function setBoxChannel(name: string) {
  const [box, channel] = await Promise.all([
    findBoxCached(),
    findChannel(name),
  ]);
  if (!box) throw new Error(`Box .évasion not found`);
  if (!channel) throw new Error(`Channel ${name} not found`);

  await setChannelSafe(box, channel);
  return channel;
}

async function setTvInput() {
  const tv = await findTVCached();
  if (!tv) throw new Error(`TV not found`);
  await sendIRCC(tv, SonyRemoteButton.Tv);
}

export async function setChannel(name: string) {
  const [, channel] = await Promise.all([setTvInput(), setBoxChannel(name)]);
  return channel;
}
