# if you're doing anything beyond your local machine, please pin this to a specific version at https://hub.docker.com/_/node/
FROM node:10.12-alpine

# install git to support git dependencies in package.json
RUN set -xe \
  && apk add --no-cache git

RUN mkdir -p /opt/app

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# default to port 8001 for node, and 5858 or 9229 for debug
ARG PORT=8001
ENV PORT $PORT
EXPOSE $PORT 5858 9229

# check every 30s to ensure this service returns HTTP 200 (only available from docker 1.12)
# HEALTHCHECK CMD curl -fs http://localhost:$PORT/health || exit 1

# install dependencies first, in a different location for easier app bind mounting for local development
WORKDIR /opt
COPY package.json yarn.lock /opt/
RUN yarn && yarn cache clean
ENV PATH /opt/node_modules/.bin:$PATH

# copy in our source code last, as it changes the most
WORKDIR /opt/app
COPY . /opt/app

# if you want to use npm start instead, then use `docker run --init in production`
# so that signals are passed properly. Note the code in index.js is needed to catch Docker signals
# using node here is still more graceful stopping then npm with --init afaik
# I still can't come up with a good production way to run with npm and graceful shutdown
CMD [ "node", "dist/index" ]