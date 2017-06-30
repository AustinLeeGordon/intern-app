var internApplication = {

    init: function(){
        intApp.getLocation();
        intApp.getRestaurants(internApplication.options);
    },

    options: {
        radius: 400,
        price: '$$',
        type: 'Indian'
    }

};

internApplication.init();



/*

var myHeaders = new Headers({
  'user-key': config.ZOMATO_KEY,
  'Accept': 'application/json'
});

var options = {
  method: 'GET',
  headers: myHeaders
};

var myRequest = new Request('https://developers.zomato.com/api/v2.1/', options);

fetch(myRequest).then(function(response){
    response.json().then(function(data){

        console.log(data);

    });
});

*/