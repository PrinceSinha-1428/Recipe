import express from 'express';
import { PORT } from './config/env';

const app = express();



app.get("/", (req, res) => {
  res.status(200).json({ message: 'Hello'})
})

app.listen(PORT || 3000, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})