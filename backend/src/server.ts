import express from 'express';
import { ENV } from './config/env';
import userRouter from './routes/user.route';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api",userRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: 'Hello'})
})

app.listen(ENV.PORT, () => {
  console.log(`Server is running at http://localhost:${ENV.PORT}`)
})