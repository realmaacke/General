import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.API_PORT || 9091;

app.get('/', (req, res) => {
    res.status(200).json({
      msg: "API"
    });
});

app.listen(port, '0.0.0.0', function () {
    console.log(`Listening on port: ${port}`);
})
