var zom = require('./zomato-data');

exports.webhookRoutes = function(router){
  router.get('/get-zomato-data', zom.getData);
};