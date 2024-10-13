import 'reflect-metadata';
require('dotenv').config();
import cors from 'cors';
import bodyParser from 'body-parser';
import { createConnection } from 'typeorm';
import { Action, useExpressServer } from 'routing-controllers';
import { HttpErrorHandler } from './middlewares/error-handler.middleware';
import path from 'path';
import express from 'express';
const chalk = require('chalk');
const figlet = require('figlet');
import { slowDown } from 'express-slow-down';

var app = express();

const limiter = slowDown({
  windowMs: 60 * 1000, // 15 minutes
  delayAfter: 120, // Allow 5 requests per 15 minutes.
  delayMs: (hits) => hits * hits * 400 // Add 100 ms of delay to every request after the 5th one.
});

const sendCodeRouteLimiter = slowDown({
  windowMs: 10 * 1000, // 15 minutes
  delayAfter: 3, // Allow 5 requests per 15 minutes.
  delayMs: (hits) => hits * hits * 500 // Add 100 ms of delay to every request after the 5th one.
});

app.use(cors());
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
app.use(limiter);

useExpressServer(app, {
  controllers: [path.join(__dirname + '/controllers/*.controller.js')],
  defaultErrorHandler: false,
  routePrefix: '/api',
  middlewares: [HttpErrorHandler],
  currentUserChecker: async (action: Action) => {
    return action.request['user'];
  }
});

const port = process.env.PORT || 4500;

createConnection()
  .then(async () => {
    app.get('/api/version', (req, res) => {
      res.status(200).send({
        success: true,
        message: 'the api call is successfull',
        body: {
          version: process.env.VERSION
        }
      });
    });

    app.listen(port, () => {
      const message = figlet.textSync(' # Server Running #', {
        font: 'Slant',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      });

      console.log(chalk.green(message));
      console.log(chalk.blue(`🚀 Server is listening on port: ${port} 🚀`));
      console.log(chalk.yellow(`Visit: http://localhost:${port}`));
      console.log(chalk.cyan(`Press Ctrl + C to stop the server.`));
    });
  })
  .catch((error) => console.log(error));
