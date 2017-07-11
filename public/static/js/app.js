var internApplication = (function(){

    var currentLat,
        currentLong,
        responseData,
        currentRestaurant,
        currentRestaurantNum,
        initialSearchFinished;

    var options = {};

    var setOptions = function(){

        var radiusValue = document.getElementById('distanceFilter').querySelector('.selected').getAttribute('value');
        options.radius = (radiusValue * 1609.34).toFixed(0);

    }

    var getLocation = function(callback){

        console.log('getting location...');

        if(location.protocol == 'https:' && navigator.geolocation) {

            function getPosition(position){

                currentLat = position.coords.latitude.toFixed(8);
                currentLong = position.coords.longitude.toFixed(8);

                callback();

            }

            navigator.geolocation.getCurrentPosition(getPosition);


        } else {

            var georequestOptions = {
                method: 'GET',
                url: 'http://www.freegeoip.net/json/'
            };

            var geoRequest = new XMLHttpRequest();

            geoRequest.onload = function(){

                callback.apply(geoRequest);

            }

            geoRequest.open(georequestOptions.method, georequestOptions.url);
            geoRequest.send();

        }

    }

    var search = function(){

        // set search state
        initialSearchFinished = false;
        

        setOptions();

        if(location.protocol == 'https:' && navigator.geolocation) {

            getLocation(function(){

                // get data based on current search
                getZomatoData(0, 20, function(){

                    reroll();

                });

            });

        }else {

            getLocation(function(){

                var geoRequestRes = JSON.parse(this.response);

                currentLat = geoRequestRes.latitude;
                currentLong = geoRequestRes.longitude;

                // get data based on current search
                getZomatoData(0, 20, function(){

                    reroll();

                });

            });

        }

    }

    var reroll = function(){

        console.log('rerolling...');

        // get random restaurant number based on current search
        randomRestaurant(responseData);

        // get the chosen restaurant data
        getZomatoData(currentRestaurantNum, 1, function(){

            currentRestaurant = responseData;

            // populate result
            internApplicationView.populateResult(currentRestaurant.restaurants[0].restaurant.featured_image, currentRestaurant.restaurants[0].restaurant.name, currentRestaurant.restaurants[0].restaurant.location.address, currentRestaurant.restaurants[0].restaurant.price_range);

        });

        // if the initial search has finished...
        if(!initialSearchFinished){

            // search is finished
            initialSearchFinished = true;

            // hide loading screen
            $('#loadingScreen').animate({opacity: 0}, internApplicationView.filtersConfig.fadeTime, function(){

                this.style.display = 'none';

            });

        }

    }

    var getZomatoData = function(start, count, callback){

        console.log('getting Zomato response data...');

        var dataOptions = {
            start: start,
            count: count,
            currentLat: currentLat,
            currentLong: currentLong,
            radius: options.radius
        };

        $.ajax({
            url: 'http://localhost:6060/get-zomato-data/',
            type: 'GET',
            data: dataOptions,
            success: function(returnedData) {

                responseData = returnedData;
                callback();

            }
        }).done(function(returnedData) {

            console.log('returning data...');

        });

    }

    var randomRestaurant = function(responseData){

        console.log('picking random restaurant from results...');

        var max = responseData.results_found;

        currentRestaurantNum = getRandomInt(max);

    }

    var getRandomInt = function(maxVal) {
        var min = 0;
        var max = maxVal;

        if (max > 99){
            max = 99;
        }

        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    return {
        getLocation: getLocation,
        options: options,
        reroll: reroll,
        search: search,
        setOptions: setOptions
    }

}());