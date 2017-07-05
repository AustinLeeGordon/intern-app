var intApp = (function(){

    var currentLat = undefined,
        currentLong = undefined,
        responseData = undefined,
        currentRestaurantNum = undefined;

    var search = function(){
        
        getLocation();

        // wait for currentLat and currentLong to populate
        (function gettingLocation(){

            if(intApp.currentLat == undefined){
                setTimeout(function(){
                    gettingLocation();
                }, 1000);
            }else {

                console.log('current location: lat ' + intApp.currentLat + ', long ' + intApp.currentLong);

                // after currentLat and currentLong are found, get Zomato data
                getZomatoData(0, 20);

                // wait for responseData to populate
                (function gettingData(){

                    if(intApp.responseData == undefined){
                        setTimeout(function(){
                            gettingData();
                        }, 1000);
                    }else {

                        console.log(intApp.responseData);

                        // after responseData is found, get random restaurant
                        randomRestaurant();

                        console.log('lucky number: ' + intApp.currentRestaurantNum);

                        intApp.responseData = undefined;

                        getZomatoData(intApp.currentRestaurantNum, 1);

                        // wait for responseData to populate with new restaurant
                        (function gettingNewData(){

                            if(intApp.responseData == undefined){
                                setTimeout(function(){
                                    gettingNewData();
                                }, 1000);
                            }else {

                                console.log(intApp.responseData.restaurants[0]);

                            }

                        }());

                    }

                }());

            }

        }());

    }

    var getLocation = function(){

        console.log('getting location...');

        if(location.protocol != 'https:' && navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(searchRestaurants);

            function searchRestaurants(position){

                intApp.currentLat = position.coords.latitude.toFixed(8);
                intApp.currentLong = position.coords.longitude.toFixed(8);

            }


        } else {

            var georequestOptions = {
                method: 'GET',
                url: 'http://www.freegeoip.net/json/'
            };

            var geoRequest = new XMLHttpRequest();

            geoRequest.onload = function(){

                var geoRequestRes = JSON.parse(geoRequest.response);

                intApp.currentLat = geoRequestRes.latitude;
                intApp.currentLong = geoRequestRes.longitude;

            }

            geoRequest.open(georequestOptions.method, georequestOptions.url);
            geoRequest.send();

        }

    }

    var getZomatoData = function(start, count){

        console.log('getting Zomato response data...');

        var zomatoRequestOptions = {
            method: 'GET',
            url: 'https://developers.zomato.com/api/v2.1/search?' + 'start=' + start + '&count=' + count + '&lat=' + intApp.currentLat + '&lon=' + intApp.currentLong + '&radius=' + internApplication.options.radius
        };

        var zomatoRequest = new XMLHttpRequest();

        zomatoRequest.onload = function(){

            intApp.responseData = JSON.parse(zomatoRequest.response);

        }

        zomatoRequest.open(zomatoRequestOptions.method, zomatoRequestOptions.url);
        zomatoRequest.setRequestHeader('user-key', config.ZOMATO_KEY)
        zomatoRequest.send();

    }

    var randomRestaurant = function(){
        console.log('picking random restaurant from results...');

        var max = intApp.responseData.results_found;

        intApp.currentRestaurantNum = getRandomInt(max);

    }

    var getRandomInt = function(max) {
        min = 0;
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    return {
        search: search,
        currentLat: currentLat,
        currentLong: currentLong,
        responseData: responseData,
        currentRestaurantNum: currentRestaurantNum
    }

}());