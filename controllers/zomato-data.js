var http = require('http');
var https = require('https');

exports.getData = function(req, res){

        var requestOptions = {
            hostname: 'developers.zomato.com',
            path: '/api/v2.1/search?' + 'start=' + req.query.start + '&count=' + req.query.count + '&lat=' + req.query.currentLat + '&lon=' + req.query.currentLong + '&radius=' + req.query.radius + '&sort=real_distance&order=desc',
            protocol: 'https:',
            method: 'GET',
            headers: {
                'user-key': process.env.ZOMATO_KEY
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

}