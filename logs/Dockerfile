FROM alpine

RUN apk add --no-cache docker-cli

WORKDIR /usr/logger

# COPY ./log_containers.sh log_containers.sh

# RUN chmod +x log_containers.sh

# CMD ["sh", "./log_containers.sh"]
ENTRYPOINT ["tail", "-f", "/dev/null"]