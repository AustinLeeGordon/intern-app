var express = require('express');
var app = express();
var http = require('http');
var https = require('https');
var config = require('./config');

app.use(express.static('public/static'));

app.get('/get-zomato-data', function(req, res){

    var requestOptions = {
        hostname: 'developers.zomato.com',
        path: '/api/v2.1/search?' + 'start=' + req.query.start + '&count=' + req.query.count + '&lat=' + req.query.currentLat + '&lon=' + req.query.currentLong + '&radius=' + req.query.radius + '&sort=real_distance&order=desc',
        protocol: 'https:',
        method: 'GET',
        headers: {
            'user-key': config.key
        }
    }

    var request = https.get(requestOptions, function(response){
        var rawData = '';

        response.on('data', function(chunk){

            rawData += chunk;

        });

        response.on('end', function(){

            res.send(JSON.parse(rawData));

        });

    });

});

app.listen(6060, function(req, res) {
    console.log('app listening on port 6060')
});