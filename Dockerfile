FROM node:10

ENV HOST=0.0.0.0
ENV PORT=80

WORKDIR /src

COPY package.json /src/package.json
COPY package-lock.json /src/package-lock.json
RUN npm install

COPY nuxt.config.js /src/nuxt.config.js

COPY assets /src/assets
COPY components /src/components
COPY layouts /src/layouts
COPY middleware /src/middleware
COPY pages /src/pages
COPY plugins /src/plugins
COPY static /src/static
COPY store /src/store

RUN npm run build

EXPOSE 80

CMD ["npm", "start"]
