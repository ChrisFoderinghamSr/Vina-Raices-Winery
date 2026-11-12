FROM node:24-alpine
WORKDIR /srv/winery
COPY --chown=node:node index.html server.mjs ./
COPY --chown=node:node assets ./assets
COPY --chown=node:node css ./css
COPY --chown=node:node js ./js
RUN mkdir /data && chown node:node /data
USER node
ENV HOST=0.0.0.0 PORT=8080 NEWSLETTER_DB=/data/newsletter.sqlite
VOLUME /data
EXPOSE 8080
CMD ["node", "server.mjs"]
