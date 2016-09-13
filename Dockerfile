FROM tutum/buildstep
RUN cat app/src/layouts/HomeLayout/FloatingArrow.js
RUN cd app && .heroku/node/bin/node node_modules/.bin/unv build
CMD ["./node_modules/.bin/unv", "serve"]

