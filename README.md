# SETUP

## Create a .env file containing the variables from below:


Different sevices:
 - API : api.domain.se
 - dashboard : domain.se
 - database : db.domain.se
 - tv : tv.domain.se

# PORTS
 - Dashboard: 5173
 - API: 9091
 - TV: 9092 (not done)
 - Database: 8081










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