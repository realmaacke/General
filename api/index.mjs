import express from 'express';

const app = express();
const port = process.env.PORT || 9091;

app.get('/', (req, res) => {
    res.status(200).json({
        msg: "API",
        Endpoint: "/ HEJ"
    });
})

app.listen(port, function () {
    console.log(`Listening on port: ${port}`);
})