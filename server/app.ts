import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import './database/connection';
import userRouter from './routers/userRouter';
import destinationRouter from './routers/destinationRouter';
import countryRouter from './routers/countryRouter';
import storageRouter from './routers/storageRouter';

const app = express();

app.use(
  cors({
    origin: true,
  }),
);
app.use(express.json());

const VERSIONED_API_PATH = '/api/v1';

app.use(VERSIONED_API_PATH, userRouter);
app.use(VERSIONED_API_PATH, destinationRouter);
app.use(VERSIONED_API_PATH, countryRouter);
app.use(VERSIONED_API_PATH, storageRouter);

const PORT = process.env.PORT ?? 8080;

const server = app.listen(PORT, () => {
  const address = server.address();
  const port = typeof address === 'string' ? address : address.port;
  console.log('\nExpress is running on:\n');
  console.log(`\x1b[36mhttp://localhost:${port}\x1b[0m\n`);
});
