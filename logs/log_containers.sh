#!/usr/bin/bash


    # command:
# sh -c 'apk add --no-cache docker-cli
# && mkdir -p /logs
# && docker ps --format "{{.Names}}" | grep -v general-logger-1 |

# while read c; do echo Logging $c; docker logs -f "$c" >> /logs/"$c".log 2>&1 & done; wait'

while true;
do
    docker ps --filter label=com.docker.compose.project --format "{{.Names}}"| while read c; do
    [ -z "$c" ] && continue;

    echo "docker logs -f $c"
    docker logs -f --since 4s "$c" >> ./log_folder/"$c".log 2>&1 &
    done
    sleep 10s;
done


# while true; do
#   docker ps --filter label=com.docker.compose.project --format "{{.Names}}" |
#   while read -r c; do
#     [ -z "$c" ] && continue
#     docker logs -f --since 0s "$c" >> ./log_folder/"$c".log 2>&1 &
#   done

#   sleep 1
# done


# TEST asd