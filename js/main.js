header = new DynamicHeader($('.s-header-wrapper'), $('.s-header'), { 
    wait: 2000, 
    fadeIn: 750, 
    fadeOut: 1500,
    mobile: 960
});

function viewport() {
    var e = window, a = 'inner';
    if (!('innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
}

parallax = new Parallax();

parallax.add(new ParallaxObject($('#s-hero'), { init: "0%", range: "100%", value: "-70%" }, { init: "0.6", end: "0.2", range: "100%", value: "100%" }));
parallax.add(new ParallaxObject($('.s-jumbotron .s-heading'), { init: "0%", range: "100%", value: "-30%" }, { init: "1", end: "0", range: "100%", value: "200%" }));

function scrollTo(element){
    if(viewport()['width'] <= 850) {
        $('html, body').animate({ scrollTop: ($(element).offset().top - 72) }, 'slow');
    }
    else {
        $('html, body').animate({ scrollTop: ($(element).offset().top - 50)}, 'slow');
    }
};

$('.image-viewer').imageViewer();

$('.s-main .s-content .s-container > .s-slider').unslider({
	speed		: 1000,
	autoplay	: false
});

$('.s-main .s-content .s-container > .s-slider').each(function(){
    var $slider = $(this).unslider();
    $(this).siblings('.slider-arrow').click(function(event){
        event.preventDefault();
        if ($(this).hasClass('next')) {
            $slider.data('unslider')['next']();
            } else {
            $slider.data('unslider')['prev']();
        };
    });
});

$('.s-header .s-menu .s-menu-btn').click(function() {
    $('.s-header .s-menu nav').slideToggle("slow");
});

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
