FROM node:boron
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN yarn global add yarn@0.16.0
#RUN npm install yarn -g
RUN ls /root/.config/yarn/global/node_modules/node-gyp/bin
RUN yarn global add farmhash
RUN yarn global add node-gyp
RUN yarn global add vdux vdux-ui vdux-containers unv babel-preset-es2015 babel-preset-stage-2
COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app
RUN yarn install
COPY . /usr/src/app
RUN npm run build
CMD ["npm", "start"]

