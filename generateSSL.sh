#!/usr/bin/bash

PORTS="-p 80:80"
FLAGS="-it --rm"
VOLUME="-v /etc/letsencrypt:/etc/letsencrypt"
IMAGE="certbot/certbot certonly --standalone"

ADD=false
ADD_DOMAIN=""

DB="./domains.txt"

# Last line, length of $DB to remove suffix
# Not used anymore, but keept incase further development would happen.
N=$(wc -l < "$DB")
LAST=$(sed -n "${N}p" < "$DB")

# Concatenate domains from $DB
DOMAINS=()
while IFS= read -r line; do
	if [[ -z "$line" ]]
	then
		continue
	else
		DOMAINS+=(-d "$line")
	fi
done < "$DB"

# Checks if --add is an args, if so add to db instead.
while [[ "$#" -gt 0 ]] do
	case "$1" in
	     --add)
			ADD=true
			ADD_DOMAIN="$2"
			shift 2
			;;
		*)
			shift
			;;
	esac
done

# IF not add then do command.
if $ADD && [[ -n "$ADD_DOMAIN" ]] then
 echo -e "$ADD_DOMAIN" >> "$DB"
 echo "$ADD_DOMAIN added to $DB"
else

 docker compose down nginx -v

 sudo docker run $FLAGS $PORTS $VOLUME $IMAGE "${DOMAINS[@]}"

 docker compose up -d nginx
fi
