import app from './app.ts';
import config from './configs/config.ts';

// const port = process.env.port || 8086;
const port = 8086;

app.listen(port, () => {
  console.log(`Server running on port: ${process.env.PORT}`);
});
