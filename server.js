var express = require('express');
var app = express();

require('dotenv').config();

app.use(express.static('public/static'));

// Configure application routes
var routes = require('./controllers/router');
var webhookRouter = express.Router();

routes.webhookRoutes(webhookRouter);

app.use(webhookRouter);

app.listen(6060, function(req, res) {
    console.log('app listening on port 6060')
});