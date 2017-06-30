var intApp = (function(){

    var currentLat, currentLong;

    return {
        getLocation: function(){

            if(location.protocol != 'https:') {

                (function getLocation(){
                    if(navigator.geolocation){
                        navigator.geolocation.getCurrentPosition(savePosition);
                    }else {
                        console.log('Geolocation is not supported by this browser');
                    }
                })();

                function savePosition(position){
                    currentLat = position.coords.latitude;
                    currentLong = position.coords.longitude;
                }

            } else {

                var georequestOptions = {
                    method: 'GET'
                };

                var geoRequest = new Request('http://www.freegeoip.net/json/', georequestOptions);

                fetch(geoRequest).then(function(response){
                    response.json().then(function(geoData){
                        currentLat = geoData.latitude;
                        currentLong = geoData.longitude;
                    });
                });

            }

        },

        getRestaurants: function(options){

            // If no filters, use default lat, long and default options

            console.log(options);

        }
    }


}());