var internApplicationView = (function(){

    var windowH = document.documentElement.clientHeight;

    // home screen items
    var homeScreen = document.getElementById('homeScreen');
    var feedMeButton = document.getElementById('feedMe');

    var filtersButton = document.getElementById('filtersLabel');
    var filtersText = document.getElementsByClassName('addFiltersText');
    var filtersMenu = document.getElementById('filtersMenu');
    var filtersList = document.getElementById('filtersList');
    var distanceFilter = document.getElementById('distanceFilter');
    var distanceFilterListItems = distanceFilter.querySelectorAll('.filterOptionListItem');

    var filtersConfig = {
        state: true, // animation is running when set to false
        hidden: true,
        animationTime: 500,
        fadeTime: 250,
        menuHeight: 150 + 'px'
    };

    // result screen items
    var resultScreen = document.getElementById('resultScreen');
    var resultImage = document.getElementById('resultImage');
    var resultName = document.getElementById('resultName');
    var resultAddress = document.getElementById('resultAddress');
    var resultPrice = document.getElementById('resultPrice');
    var resultHomeButton = document.getElementById('resultHomeButton');
    var resultRerollButton = document.getElementById('reroll');


    // loading screen
    var loadingScreen = document.getElementById('loadingScreen');

    var init = function(){

        // run the search after clicking on 'feed me' button
        feedMeButton.addEventListener('click', function(){

            // hide this filters menu if it is showing
            if(!filtersConfig.hidden) {
                filterMenuToggle();
            }

            // show the loading screen
            loadingScreen.style.display = 'block';
            $(loadingScreen).animate({opacity: 1}, filtersConfig.fadeTime);

            // hide the home screen
            $(homeScreen).animate({opacity: 0}, filtersConfig.fadeTime, function(){
                this.style.display = 'none';
            });

            // run the search
            internApplication.search();

        });

        filtersButton.addEventListener('click', function(){

            filterMenuToggle();
            
        });
        
        resultHomeButton.addEventListener('click', function(){

            // show the home screen
            homeScreen.style.display = 'block';
            $(homeScreen).animate({opacity: 1}, filtersConfig.fadeTime);

            // hide the result screen
            $(resultScreen).animate({opacity: 0}, filtersConfig.fadeTime, function(){
                this.style.display = 'none';
            });

        });

        resultRerollButton.addEventListener('click', function(){

            internApplication.reroll();

        });

        distanceFilterListItems.forEach(function(e, i){
            e.addEventListener('click', function(){
                
                // remove selected class from currently selected option
                distanceFilter.querySelector('.selected').classList.remove('selected');

                // add selected class to newly selected option
                this.classList.add('selected');

            });
        });

    }

    var filterMenuToggle = function(){

        // show filters menu
        if(filtersConfig.state && filtersConfig.hidden){

            filtersConfig.state = false;

            // hide add filters text
            $(filtersText).animate({opacity: 0}, filtersConfig.fadeTime);

            // slide up menu, fade in filters
            $(filtersMenu).animate({height: filtersConfig.menuHeight}, filtersConfig.animationTime);
            $(filtersList).delay(filtersConfig.animationTime).animate({opacity: 1}, filtersConfig.fadeTime);

            // move filters button up
            $(filtersButton).animate({bottom: filtersConfig.menuHeight}, filtersConfig.animationTime, filterMenuCallback(true, false));

        // hide filters menu
        }else if(filtersConfig.state && !filtersConfig.hidden){

            filtersConfig.state = false;

            // show add filters text
            $(filtersText).delay(filtersConfig.fadeTime).animate({opacity: 1}, filtersConfig.fadeTime);

            // fade out filters, slide down menu
            $(filtersList).animate({opacity: 0}, filtersConfig.fadeTime);
            $(filtersMenu).animate({height: '0'}, filtersConfig.animationTime);

            // move filters button down
            $(filtersButton).animate({bottom: '50px'}, filtersConfig.animationTime, filterMenuCallback(true, true));

        }
        
    }

    var filterMenuCallback = function(state, hidden){

        setTimeout(function(){

            filtersConfig.state = state;
            filtersConfig.hidden = hidden;

        }, filtersConfig.animationTime + filtersConfig.fadeTime);

    }

    var populateResult = function(image, name, address, price){

        // </span> is injected in priceArray index based on price
        var priceArray = ['<span style="color: #0072b0">', '$', '$', '$', '$'];
        var priceMarkup = '';

        var imageType = image.split('.').pop().toLowerCase();

        // display the result screen
        resultScreen.style.display = 'block';
        $(resultScreen).animate({opacity: 1}, filtersConfig.fadeTime);

        // check for featured image
        if( imageType == 'jpg' || imageType == 'png' ) {

            resultImage.setAttribute('src', image);

        }else {

            resultImage.setAttribute('src', 'assets/images/default.jpg');

        }

        // reset resultPrice
        resultPrice.innerHTML = '';

        // link address to google search
        resultAddress.setAttribute('href', 'https://www.google.com/maps/dir/current+location/' + address);

        // insert </span> at index depending on price
        priceArray.splice(price + 1, 0, '</span>');
        priceMarkup = priceArray.join('');

        // populate info
        resultName.innerHTML = name;
        resultAddress.innerHTML = address;
        resultPrice.insertAdjacentHTML('afterbegin', priceMarkup);
    }

    return {
        filtersConfig: filtersConfig,
        populateResult: populateResult,
        init: init
    }

}())

internApplicationView.init();