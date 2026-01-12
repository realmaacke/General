# SETUP

## Create a .env file containing the variables from below:

Different sevices:

- API : api.domain.se
- dashboard : domain.se
- database : db.domain.se
- tv : tv.domain.se
- cdn : cdn.domain.se
- tools : tools.domain.se

# PORTS

- Dashboard: 5173
- Database: 8081
- API: 9091
- TV: 9092
- CDN: 9093

# API DB usage

## SELECT

```
import { db } from './db.js';

const users = await db.select('users', ['id', 'name'], 'age > ?', [18]);
console.log(users);
```

## INSERT

```
await db.insert('users', {
  name: 'Marcus',
  email: 'marcus@example.com',
  age: 25
});
```

## UPDATE

```
await db.update('users', { name: 'Macke' }, 'id = ?', [1]);
```

## DELETE

```
await db.remove('users', 'id = ?', [5]);
```

## Docker (usefull commands)

- sudo docker compose restart "service"
- sudo docker compose up -d --force-recreate
- sudo docker compose build dashboard


## Create a new cert for a subdomain
```
sudo docker run -it --rm \
-p 80:80 \
-v /etc/letsencrypt:/etc/letsencrypt \
certbot/certbot certonly --standalone \
-d petterssonhome.se \
-d www.petterssonhome.se \
-d api.petterssonhome.se \
-d cdn.petterssonhome.se \
-d db.petterssonhome.se \
-d tv.petterssonhome.se \
-d discord.petterssonhome.se \
-d tools.petterssonhome.se \
-d grafana.petterssonhome.se \
-d plex.petterssonhome.se \
-d torrent.petterssonhome.se \
-d docker.petterssonhome.se \
-d prometheus.petterssonhome.se \
-d transmission.petterssonhome.se \
-d files.petterssonhome.se \
-d media.petterssonhome.se
```


## Curl a file into the cdn (Field path = {images, css, files, js})

```
curl -F "path=images" -F "file=@/mnt/c/Users/macka/Desktop/finished.png" https://cdn.petterssonhome.se/upload
```

## PROFILES

```
docker compose --profile core up -d
```