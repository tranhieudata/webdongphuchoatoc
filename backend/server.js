import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { connect } from './src/config/db.js';
import { router } from './src/routes/indexRouter.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'


connect();
//const port = 3030
const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: process.env.URL_FRONTEND,
  credentials :true

}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
router(app)
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});