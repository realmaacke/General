import app from './app.js';
import config from './configs/config.js';
const port = process.env.port || 8086;
// const port = 8086;
app.listen(8086, '0.0.0.0', () => {
    console.log(`Server running on port: ${port}`);
});
//# sourceMappingURL=server.js.map