#!/bin/bash

APPNAME=<%= appName %>
APP_PATH=/opt/$APPNAME
BUNDLE_PATH=$APP_PATH/current
ENV_FILE=$APP_PATH/config/env.list
PORT=<%= port %>
USE_LOCAL_MONGO=<%= useLocalMongo? "1" : "0" %>
USE_LETSENCRYPT=<%= typeof letsEncrypt === "object"? "1" : "0" %>

# Remove previous version of the app, if exists
docker rm -f $APPNAME

# Remove frontend container if exists
docker rm -f $APPNAME-frontend

# Remove lets encrypt containers
docker rm -f nginx
docker rm -f nginx-gen
docker rm -f letsencrypt-companion

# We don't need to fail the deployment because of a docker hub downtime
set +e
docker pull abernix/meteord:base
set -e


<% if(typeof sslConfig !== "object" && typeof letsEncrypt === "object")  { %>
  LETSENCRYPT_HOST=<%= letsEncrypt.domain %>
  LETSENCRYPT_EMAIL=<%= letsEncrypt.email %>

  set +e
  docker pull nginx:latest
  set -e

  docker run -d -p 80:80 -p 443:443 \
    --name nginx \
    --restart=always \
    -v /etc/nginx/conf.d  \
    -v /etc/nginx/vhost.d \
    -v /usr/share/nginx/html \
    -v $APP_PATH/config/certs:/etc/nginx/certs:ro \
    nginx

  set +e
  docker pull jwilder/docker-gen:latest
  set -e

  docker run -d \
    --name nginx-gen \
    --restart=always \
    --volumes-from nginx \
    -v $APP_PATH/tmp/nginx.tmpl:/etc/docker-gen/templates/nginx.tmpl:ro \
    -v /var/run/docker.sock:/tmp/docker.sock:ro \
    jwilder/docker-gen \
    -notify-sighup nginx -watch -only-exposed -wait 5s:30s /etc/docker-gen/templates/nginx.tmpl /etc/nginx/conf.d/default.conf

  set +e
  docker pull jrcs/letsencrypt-nginx-proxy-companion:latest
  set -e

  docker run -d \
    --name letsencrypt-companion \
    --restart=always \
    -e "NGINX_DOCKER_GEN_CONTAINER=nginx-gen" \
    --volumes-from nginx \
    -v $APP_PATH/config/certs:/etc/nginx/certs:rw \
    -v /var/run/docker.sock:/var/run/docker.sock:ro \
    jrcs/letsencrypt-nginx-proxy-companion

  if [ "$USE_LOCAL_MONGO" == "1" ]; then
    docker run \
      -d \
      --restart=always \
      --expose=$PORT \
      --volume=$BUNDLE_PATH:/bundle \
      --env-file=$ENV_FILE \
      --link=mongodb:mongodb \
      --hostname="$HOSTNAME-$APPNAME" \
      --env=MONGO_URL=mongodb://mongodb:27017/$APPNAME \
      --name=$APPNAME \
      -e "VIRTUAL_HOST=$LETSENCRYPT_HOST" \
      -e "LETSENCRYPT_HOST=$LETSENCRYPT_HOST" \
      -e "LETSENCRYPT_EMAIL=$LETSENCRYPT_EMAIL" \
      abernix/meteord:base
  else
    docker run \
      -d \
      --restart=always \
      --expose=$PORT \
      --volume=$BUNDLE_PATH:/bundle \
      --hostname="$HOSTNAME-$APPNAME" \
      --env-file=$ENV_FILE \
      --name=$APPNAME \
      -e "VIRTUAL_HOST=$LETSENCRYPT_HOST" \
      -e "LETSENCRYPT_HOST=$LETSENCRYPT_HOST" \
      -e "LETSENCRYPT_EMAIL=$LETSENCRYPT_EMAIL" \
      abernix/meteord:base
  fi
<% } %>

<% if(typeof letsEncrypt !== "object")  { %>
  if [ "$USE_LOCAL_MONGO" == "1" ]; then
    docker run \
      -d \
      --restart=always \
      --publish=$PORT:80 \
      --volume=$BUNDLE_PATH:/bundle \
      --env-file=$ENV_FILE \
      --link=mongodb:mongodb \
      --hostname="$HOSTNAME-$APPNAME" \
      --env=MONGO_URL=mongodb://mongodb:27017/$APPNAME \
      --name=$APPNAME \
      abernix/meteord:base
  else
    docker run \
      -d \
      --restart=always \
      --publish=$PORT:80 \
      --volume=$BUNDLE_PATH:/bundle \
      --hostname="$HOSTNAME-$APPNAME" \
      --env-file=$ENV_FILE \
      --name=$APPNAME \
      abernix/meteord:base
  fi
<% } %>


<% if(typeof sslConfig === "object")  { %>
  # We don't need to fail the deployment because of a docker hub downtime
  set +e
  docker pull meteorhacks/mup-frontend-server:latest
  set -e
  docker run \
    -d \
    --restart=always \
    --volume=/opt/$APPNAME/config/bundle.crt:/bundle.crt \
    --volume=/opt/$APPNAME/config/private.key:/private.key \
    --link=$APPNAME:backend \
    --publish=<%= sslConfig.port %>:443 \
    --name=$APPNAME-frontend \
    meteorhacks/mup-frontend-server /start.sh
<% } %>
