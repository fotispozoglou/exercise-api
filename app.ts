if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

import express, { Application, NextFunction, Request, Response } from "express";
import cors from 'cors';

const app : Application = express();
const port = 3000;

import authRoutes from './routes/auth.routes';

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', authRoutes);

app.use((err : any, req : Request, res : Response, next : NextFunction ) => {
  
  const { statusCode = 500 } = err;
  
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'

  console.log(err.message);
  
  res.status(statusCode).send();

});

app.listen(port, (): void => {

  console.log(`Connected successfully on port ${port}`);

});
