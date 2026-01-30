import app from './app.ts';
import config from './configs/config.ts';

app.listen(process.env.port || 123321, () => {
  console.log(`Server running on port: ${process.env.PORT}`);
});
