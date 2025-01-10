import express from 'express';
import { connect } from './src/config/db.js';
import { router } from './src/routes/indexRouter.js';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'


connect();
const port = 3030
const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin:"http://localhost:3000",
  credentials :true

}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
dotenv.config();
router(app)
app.listen(port, () => {
  })