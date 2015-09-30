//
// fading header setup
//
setupDynamicHeader( 
    $( '.s-header-wrapper' ), $( '.s-header' ), 
    { 
        wait: 2000, 
        fadeIn: 750, 
        fadeOut: 1500,
        mobile: 960
    }
);

//
// parallax
//
$( '.parallax' ).parallax();

//
// fading
//
$( '.fading' ).fading();

//
// clip
//
var clipper = $( '.clipper' ).clipper(); 

//
// coontent selector
//
var contentSelector = $('.content-selector').contentSelector( "content", 3, "content-heading", { hAlign : "left", vAlign : "top" });

var clipperInstance = clipper.data( 'clipper' ),
    contentSelectorInstance = contentSelector.data( 'contentSelector' );

clipperInstance.setOnExtend( function()
{
    contentSelectorInstance.refresh();
});

//
// image viewer
//
$('.image-viewer').imageViewer();

//
// next content button assignment
//
$('.s-btn').click(function() 
{
    var target = $( this ).data( "click-target" );
    scrollTo( $( target ), { duration : 'slow' });
});

//
// init slider
//
$( '.s-main .s-content .s-container > .s-slider' ).unslider(
{
	speed		: 1000,
	autoplay	: false
});

//
// assigning next and prev buttons to slider
//
$( '.s-main .s-content .s-container > .s-slider' ).each( function()
{
    var slider = $( this ).unslider();

    $( this ).siblings( '.slider-arrow' ).click( function( event )
    {
        event.preventDefault();

        if( $( this ).hasClass( 'next')) 
        {
            slider.data( 'unslider' )[ 'next' ]();
        } 
        else 
        {
            slider.data( 'unslider' )[ 'prev' ]();
        }
    });
});

//
// menu configuration (responsive etc.)
//
setupMenu();