import express from 'express';
import cors from 'cors';
import { routes } from './routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(routes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
