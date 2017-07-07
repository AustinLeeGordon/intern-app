var internApplicationView = (function(){

    var windowH = document.documentElement.clientHeight;

    // home screen items
    var homeScreen = document.getElementById('homeScreen');
    var feedMeButton = document.getElementById('feedMe');

    var filtersButton = document.getElementById('filtersLabel');
    var filtersMenu = document.getElementById('filtersMenu');
    var filtersList = document.getElementById('filtersList');
    var distanceFilter = document.getElementById('distanceFilter');
    var distanceFilterListItems = distanceFilter.querySelectorAll('.filterOptionListItem');

    var filtersSettings = {
        state: true, // animation is running when set to false
        hidden: true,
        animationTime: 500,
        fadeTime: 250,
        menuHeight: windowH - 250 + 'px'
    };

    // result screen items
    var resultScreen = document.getElementById('resultScreen');
    var resultImage = document.getElementById('resultImage');
    var resultName = document.getElementById('resultName');
    var resultPrice = document.getElementById('resultPrice');


    // loading screen
    var loadingScreen = document.getElementById('loadingScreen');


    $(window).resize(function() {
        windowH = $(window).height();

        filtersSettings.menuHeight = windowH - 250 + 'px';
        if(!filtersSettings.hidden) {
            filterMenuToggle();
        }
    });

    var init = function(){

        // run the search after clicking on 'feed me' button
        feedMeButton.addEventListener('click', function(){

            // hide this filters menu if it is showing
            if(!filtersSettings.hidden) {
                filterMenuToggle();
            }

            // show the loading screen
            loadingScreen.style.display = 'block';
            $(loadingScreen).animate({opacity: 1}, filtersSettings.fadeTime);

            // hide the home screen
            $(homeScreen).animate({opacity: 0}, filtersSettings.fadeTime, function(){
                this.style.display = 'none';
            });
            
            // set options based on filters
            internApplication.setOptions();

            // run the search
            internApplication.search();

        });

        filtersButton.addEventListener('click', function(){
            filterMenuToggle();
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
        if(filtersSettings.state && filtersSettings.hidden){

            filtersSettings.state = false;

            $(feedMeButton).animate({top: '150px'}, filtersSettings.animationTime);
            $(filtersMenu).animate({height: filtersSettings.menuHeight}, filtersSettings.animationTime);
            $(filtersList).delay(filtersSettings.animationTime).animate({opacity: 1}, filtersSettings.fadeTime);
            $(filtersButton).animate({bottom: filtersSettings.menuHeight}, filtersSettings.animationTime, filterMenuCallback(true, false));

        // hide filters menu
        }else if(filtersSettings.state && !filtersSettings.hidden){

            filtersSettings.state = false;

            $(filtersList).animate({opacity: 0}, filtersSettings.fadeTime);
            $(feedMeButton).animate({top: '50%'}, filtersSettings.animationTime);
            $(filtersMenu).animate({height: '0'}, filtersSettings.animationTime);
            $(filtersButton).animate({bottom: '0'}, filtersSettings.animationTime, filterMenuCallback(true, true));

        }
        
    }

    var filterMenuCallback = function(state, hidden){

        setTimeout(function(){

            filtersSettings.state = state;
            filtersSettings.hidden = hidden;

        }, filtersSettings.animationTime + filtersSettings.fadeTime);

    }

    var populateResult = function(name, image, price){

        // display the result screen
        resultScreen.style.display = 'block';

        // check for featured image
        if( image == '') {

            console.log('set default image');

        }else {

            resultImage.setAttribute('src', image);

        }

        // populate info
        resultName.innerHTML = name;
        resultPrice.innerHTML = price;
    }

    return {
        filtersSettings: filtersSettings,
        populateResult: populateResult,
        init: init
    }

}())

internApplicationView.init();