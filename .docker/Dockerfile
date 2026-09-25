ARG registry=docker.io
FROM ${registry}/nginxinc/nginx-unprivileged:alpine-slim

COPY ./../docs /usr/share/nginx/html
COPY ./../.docker/nginx.apps.conf /etc/nginx/conf.d/default.conf
COPY ./../.docker/entrypoint.sh /entrypoint.sh

USER root
RUN chmod 755 /entrypoint.sh

EXPOSE 8000

USER nginx

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
	CMD test -s /tmp/env.js || exit 1