var internApplication = (function(){

    var currentLat,
        currentLong,
        responseData,
        currentRestaurant,
        currentRestaurantNum,
        initialSearchFinished = false;

    var options = {};

    var setOptions = function(){
        options.radius = (0.5 * 1609.34).toFixed(0);
    }

    var getLocation = function(callback){

        console.log('getting location...');

        if(location.protocol != 'https:' && navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(searchRestaurants);

            function searchRestaurants(position){

                currentLat = position.coords.latitude.toFixed(8);
                currentLong = position.coords.longitude.toFixed(8);

                console.log('current location: lat ' + currentLat + ', long ' + currentLong);

                callback();

            }


        } else {

            var georequestOptions = {
                method: 'GET',
                url: 'http://www.freegeoip.net/json/'
            };

            var geoRequest = new XMLHttpRequest();

            geoRequest.onload = function(){

                geoRequest.onreadystatechange = function() {
                    if (geoRequest.readyState == 4) {
                        if (typeof callback == "function") {
                            callback.apply(geoRequest);
                        }
                    }
                }

            }

            geoRequest.open(georequestOptions.method, georequestOptions.url);
            geoRequest.send();

        }

    }

    var search = function(){

        setOptions();

        if(location.protocol != 'https:' && navigator.geolocation) {

            getLocation(function(){

                // get data based on current search
                getZomatoData(0, 20, function(){

                    responseData = JSON.parse(this.response);

                    console.log(responseData);

                    reroll();

                });

            });

        }else {

            getLocation(function(){

                var geoRequestRes = JSON.parse(geoRequest.response);

                currentLat = geoRequestRes.latitude;
                currentLong = geoRequestRes.longitude;

                console.log('current location: lat ' + currentLat + ', long ' + currentLong);

                // get data based on current search
                getZomatoData(0, 20, function(){

                    responseData = JSON.parse(this.response);

                    console.log(responseData);

                    reroll();

                });

            });

        }

    }

    var reroll = function(){

        console.log('rerolling...');

        // get random restaurant number based on current search
        randomRestaurant(responseData);

        console.log('lucky number: ' + currentRestaurantNum);

        // get the chosen restaurant data
        getZomatoData(currentRestaurantNum, 1, function(){

            currentRestaurant = JSON.parse(this.response);

            console.log(currentRestaurant.restaurants[0]);
            console.log(currentRestaurant.restaurants[0].restaurant.name);

            // populate result
            internApplicationView.populateResult(currentRestaurant.restaurants[0].restaurant.name, currentRestaurant.restaurants[0].restaurant.photos_url, currentRestaurant.restaurants[0].restaurant.price_range);
            console.log(currentRestaurant.restaurants[0].restaurant.photos_url);
        });

        // if the initial search has finished...
        if(!initialSearchFinished){

            // search is finished
            initialSearchFinished = true;

            // hide loading screen
            $('#loadingScreen').animate({opacity: 0}, internApplicationView.filtersSettings.fadeTime, function(){
                this.style.display = 'none';
            });

        }

    }

    var getZomatoData = function(start, count, callback){

        console.log('getting Zomato response data...');

        var zomatoRequestOptions = {
            method: 'GET',
            url: 'https://developers.zomato.com/api/v2.1/search?' + 'start="' + start + '"&count=' + count + '&lat=' + currentLat + '&lon=' + currentLong + '&radius=' + options.radius
        };

        var zomatoRequest = new XMLHttpRequest();

        zomatoRequest.onreadystatechange = function() {
            if (zomatoRequest.readyState == 4) {
                if (typeof callback == "function") {

                    callback.apply(zomatoRequest);

                }
            }
        }

        zomatoRequest.open(zomatoRequestOptions.method, zomatoRequestOptions.url);
        zomatoRequest.setRequestHeader('user-key', config.ZOMATO_KEY);
        zomatoRequest.send();

    }

    var randomRestaurant = function(responseData){
        console.log('picking random restaurant from results...');

        var max = responseData.results_found;

        currentRestaurantNum = getRandomInt(max);

    }

    var getRandomInt = function(max) {
        min = 0;
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    return {
        getLocation: getLocation,
        initialSearchFinished: initialSearchFinished,
        options: options,
        reroll: reroll,
        search: search
    }

}());