import 'reflect-metadata';
require('dotenv').config();
import express = require('express');
import cors from 'cors';
import bodyParser from 'body-parser';
import { createConnection } from 'typeorm';
import { useExpressServer } from 'routing-controllers';
import { HttpErrorHandler } from './middlewares/error-handler.middleware';
const path = require('path');

var app = express();

createConnection()
  .then(async () => {
    app.use(cors());
    app.use(bodyParser.json({ limit: '200mb' }));
    app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

    // get api version
    app.get(process.env.URL + '/version', (req, res) => {
      res.status(200).send({
        success: true,
        message: 'the api call is successfull',
        body: {
          version: process.env.VERSION
        }
      });
    });

    useExpressServer(app, {
      controllers: [path.join(__dirname + '/controllers/*.controller.js')],
      defaultErrorHandler: false,
      routePrefix: '/api',
      middlewares: [HttpErrorHandler]
    });

    const port = process.env.PORT || 4500;

    app.listen(port, () => {
      return console.log(`server is listening on ${port}`);
    });
  })
  .catch((error) => console.log(error));
