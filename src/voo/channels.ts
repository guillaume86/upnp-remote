import Fuzzyset from "fuzzyset.js";
import fetch from "node-fetch";
import { cache } from "../utils";

const CHANNEL_LIST_URL =
  "https://publisher.voomotion.be/traxis/web/" +
  "Channels/Sort/LogicalChannelNumber/Props/LogicalChannelNumber,Name,Pictures,IsViewableOnCpe?output=json";

export async function getChannels() {
  const response = await fetch(CHANNEL_LIST_URL);
  const data = (await response.json()) as Voo.http.ChannelListResponse;
  return data.Channels.Channel;
}

export const getChannelsCached = cache.memoize(
  getChannels,
  "voo.channels.getChannels",
);

export async function findChannel(
  name: string,
): Promise<Voo.http.Channel | undefined> {
  const channels = await getChannelsCached();
  const names = channels.map((chan) => chan.Name);
  const search = Fuzzyset(names);
  const candidates = search.get(name);
  if (candidates) {
    const foundName = candidates[0][1];

    // try to find HD channel if possible
    const hdName = foundName + " HD";
    const hdChannel = channels.find((chan) => chan.Name === hdName);
    if (hdChannel) return hdChannel;

    return channels.find((chan) => chan.Name === foundName);
  }
}
