FROM node:boron
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
#RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
#UN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
#RUN apt-get update && apt-get install yarn
RUN yarn global add vdux vdux-ui vdux-containers unv babel-preset-es2015 babel-preset-stage-2
COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app
RUN yarn install
COPY . /usr/src/app
RUN npm run build
CMD ["npm", "start"]
