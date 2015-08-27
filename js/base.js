function viewport() {
    var e = window, a = 'inner';
    if (!('innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
}

function scrollTo(element, options) 
{
    if(viewport()['width'] <= 850)
    {
        $('html, body').animate(
        	{ scrollTop: ($(element).offset().top - 72) }, 
        	options
        );
    }
    else
    {
        $('html, body').animate(
        	{ scrollTop: ($(element).offset().top - 50) }, 
            options 
        );
    }
};