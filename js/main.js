//
// fading header setup
//
header = new DynamicHeader($('.s-header-wrapper'), $('.s-header'), { 
    wait: 2000, 
    fadeIn: 750, 
    fadeOut: 1500,
    mobile: 960
});

//
// parallax
//
parallax = new Parallax();

parallax.add(new ParallaxObject($('#s-hero'), { init: "0%", range: "100%", value: "-70%" }, { init: "0.6", end: "0.0", range: "100%", value: "100%" }));
parallax.add(new ParallaxObject($('.s-jumbotron .s-heading'), { init: "0%", range: "100%", value: "-30%" }, { init: "1", end: "0", range: "100%", value: "200%" }));

$( '#s-hero' ).parallax(
    { 
        init: "0%", 
        range: "100%", 
        value: "-70%" 
    }, 
    { 
        init: "0.6", 
        end: "0.0", 
        range: "100%", 
        value: "100%" 
    }
);

$( '.s-jumbotron .s-heading' ).parallax(
    {
        init: "0%", 
        range: "100%", 
        value: "-30%" 
    }, 
    {
        init: "1", 
        end: "0", 
        range: "100%", 
        value: "200%" 
    }    
);

//
// next content button assignment
//
$('.s-btn').click(function() {
    var target = $(this).data("click-target");
    scrollTo($(target), { duration : 'slow' });
});

// image viewer
$('.image-viewer').imageViewer();

// coontent selector
$('.content-selector').contentSelector("content", 3, "content-heading", { hAlign : "left", vAlign : "center" });

//
// init slider
//
$('.s-main .s-content .s-container > .s-slider').unslider({
	speed		: 1000,
	autoplay	: false
});

//
// assigning next and prev buttons to slider
//
$('.s-main .s-content .s-container > .s-slider').each(function(){
    var $slider = $(this).unslider();
    $(this).siblings('.slider-arrow').click(function(event){
        event.preventDefault();
        if ($(this).hasClass('next')) {
            $slider.data('unslider')['next']();
        } 
        else {
            $slider.data('unslider')['prev']();
        };
    });
});

//
// burger button
//
$('.s-header .s-menu .s-menu-btn').click(function() {
    $('.s-header .s-menu nav').slideToggle("slow");
});

//
// collabsable menu
//
$(function() {
    var activeItem = -1;
    var menuItem = ".s-header .s-menu nav ul > li";

    $(menuItem).click(function(e) {

        if($(menuItem + ' ul').has(e.target).length !== 0) {
            return;
        }

        if(viewport()['width'] <= 960) {
            var index = $(menuItem).index(this);
            $(menuItem + ':eq(' + index + ') ul').slideToggle("slow");

            if(activeItem != -1 && activeItem != index) {
                $(menuItem + ':eq(' + activeItem + ') ul').slideToggle("slow");            
            }

            if(activeItem == index) {
                activeItem = -1;
            }
            else {
                activeItem = index;
            }
        }
    });

    $(window).resize(function() {
        if(viewport()['width'] > 960) {
            $('.s-header .s-menu nav').css({"display" : "block"});

            if(activeItem != -1) {
                $(menuItem + ':eq(' + activeItem + ') ul').slideToggle();                   
                activeItem = -1;
            }

            $(menuItem + ' ul').show();
        }
        else {
            $('.s-header .s-menu nav').css({"display" : "none"});   
            $(menuItem + ' ul').hide();   
        }
    });
});