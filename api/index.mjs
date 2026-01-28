import express from 'express';
import cors from 'cors';

import db from './src/database.mjs';
import auth from './src/auth.mjs';

import fs from 'fs';
import { marked } from 'marked';

// routers
import authRoute from './routes/auth_route.mjs';
import dashboardRoute from './routes/dashboard_route.mjs';
import tvRoute from './routes/tv_route.mjs';

const app = express();
const port = process.env.API_PORT || 9091;

const corsOptions = {
    origin: [
        "https://tv.petterssonhome.se",
        "https://petterssonhome.se",
        "https://www.petterssonhome.se",
        "http://localhost:3000",
        "http://localhost:5173"
    ],
    credentials: true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization"
};
app.use(cors(corsOptions));  // global CORS

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoute);
app.use('/dashboard', dashboardRoute);
app.use('/tv', tvRoute);

app.get('/', (req, res) => {
    let endpoints = [
        '/ => HERE',
        '/serve_md => ?',
        '/add_yser => params <username, password, name>',
        '/login => Login user',
    ];
    res.status(200).json({
        msg: "API",
        Endpoint: endpoints
    });
})


app.get('/serve_md', async (req, res) => {
    let file = "./public/serve.md";
    let output = fs.readFileSync(file, 'utf8');
    res.send(marked(output.toString()));
});

app.get('/add_user', async (req, res) => {
    let user = {
        username: req.body.username || null,
        password: req.body.password || null,
        name: req.body.name || null,
        role: "user"
    }


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


app.listen(port, '0.0.0.0', function () {
    console.log(`Listening on port: ${port}`);
})
