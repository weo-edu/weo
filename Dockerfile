FROM node:carbon
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN yarn global add node-gyp
RUN yarn global add vdux vdux-ui vdux-containers weo-edu/unv
RUN node -v
COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app
RUN yarn install
COPY . /usr/src/app
RUN export NODE_ENV=production && unv build --production
CMD ["npm", "start"]
