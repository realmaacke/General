import express from 'express';
import db from './src/database.mjs';

const app = express();
const port = process.env.API_PORT || 9091;

app.get('/add_user', async (req, res) => {
    let database = await db.insert('users', {
        name: "Marcus Pettersson",
        email: "Mackan.pettersson1@outlook.com",
        password: "password",
        token: "new_token"
    });

    res.status(200).json({
        msg: JSON.stringify(database)
    });
});


app.get('/login', async (req, res) => {
    let database = await db.select('users');
    res.json({
        msg: JSON.stringify(database)
    });
});

app.get('/', (req, res) => {
    res.status(200).json({
        msg: "API",
        Endpoint: "/ HEJ"
    });
})

app.listen(port, function () {
    console.log(`Listening on port: ${port}`);
})