#!/usr/bin/bash

PORTS="-p 80:80"
FLAGS="-it --rm"
VOLUME="-v /etc/letsencrypt:/etc/letsencrypt"
IMAGE="certbot/certbot certonly --standalone"

DB="./domains.txt"

# Last line, length of $DB to remove suffix 
N=$(wc -l < "$DB")
LAST=$(sed -n "${N}p" < "$DB")

# Concatenate domains from $DB
DOMAINS=""
while IFS= read -r line; do
	if [[ $line == $LAST ]]
	then
		DOMAINS+="-d $line \n"
	else
		DOMAINS+="-d $line \\ \n"
	fi
done < "$DB"

echo -e "$DOMAINS"


sudo docker run $FLAGS $PORTS $VOLUME $IMAGE $DOMAINS

