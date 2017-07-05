var express = require('express');
var app = express();

app.use(express.static('public/static'));

app.listen(6060, function(req, res) {
    console.log('app listening on port 6060')
});