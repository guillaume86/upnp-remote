import * as Hapi from "hapi";
import { setChannel } from "../commands";

const PORT = process.env.PORT || 8001;

const server = new Hapi.Server({
  port: PORT,
});

server.route({
  method: "GET",
  path: "/",
  handler: (_request, _h) => {
    return "Hello, world!";
  },
});

server.route({
  method: "GET",
  path: "/set-channel",
  handler: (request) => {
    const { channel } = request.query as { channel: string };
    const cleanChannel = channel.replace(/^sur /gi, "");
    const result = setChannel(cleanChannel);
    return result;
  },
});

export const init = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);

  process.on("unhandledRejection", (err) => {
    console.log(err);
    process.exit(1);
  });

  //
  // need this in docker container to properly exit since node doesn't handle SIGINT/SIGTERM
  // this also won't work on using npm start since:
  // https://github.com/npm/npm/issues/4603
  // https://github.com/npm/npm/pull/10868
  // https://github.com/RisingStack/kubernetes-graceful-shutdown-example/blob/master/src/index.js
  // if you want to use npm then start with `docker run --init` to help, but I still don't think it's
  // a graceful shutdown of node process
  //

  // quit on ctrl-c when running docker in terminal
  process.on("SIGINT", function onSigint() {
    console.info(
      "Got SIGINT (aka ctrl-c in docker). Graceful shutdown ",
      new Date().toISOString(),
    );
    shutdown();
  });

  // quit properly on docker stop
  process.on("SIGTERM", function onSigterm() {
    console.info(
      "Got SIGTERM (docker container stop). Graceful shutdown ",
      new Date().toISOString(),
    );
    shutdown();
  });

  // shut down server
  async function shutdown() {
    try {
      await server.stop();
    } catch (err) {
      console.error(err);
      process.exitCode = 1;
    }

    process.exit();
  }
  //
  // need above in docker container to properly exit
  //
};
