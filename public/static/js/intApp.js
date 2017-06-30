var intApp = (function(){

    var currentLat, currentLong;

    var getLocation = function(){

        if(location.protocol != 'https:' && navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(savePosition);

            function savePosition(position){
                currentLat = position.coords.latitude.toFixed(8);
                currentLong = position.coords.longitude.toFixed(8);
            }

        } else {

            var georequestOptions = {
                method: 'GET'
            };

            var geoRequest = new Request('http://www.freegeoip.net/json/', georequestOptions);

            fetch(geoRequest).then(function(response){
                response.json().then(function(geoData){
                    currentLat = geoData.latitude.toFixed(8);
                    currentLong = geoData.longitude.toFixed(8);
                });
            });

        }

    }

    var getRestaurants = function(options){

        // If no filters, use default lat, long and default options

        console.log(currentLat);
        console.log(currentLong);

    }

    return {
        getLocation: getLocation,
        getRestaurants: getRestaurants
    }

}());