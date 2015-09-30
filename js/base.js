//
// Gets the accurate viewport width and height.
//
function viewport() 
{
    var e = window, a = 'inner';

    if (!('innerWidth' in window )) 
    {
        a = 'client';
        e = document.documentElement || document.body;
    }

    var result =  
    {
        width   : e[ a + 'Width' ], 
        height  : e[ a + 'Height' ] 
    };

    return result;
}

//
// Scrolls to a given element.
//
function scrollTo( element, options ) 
{
    if(viewport().width <= 850)
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

//
// An Animation class to animate simple values.
//
var Animation = function()
{
    var _ = this;

    _.done = true;
    _.animationId = null;

    //
    // start animation
    //
    _.start = function( init, start, end, rate, duration, updateCallback, doneCallback )
    {
        var diff = end - init;
        var cycles = duration / rate;
        var fact = diff / cycles;
        var curr = start;

        _.done = false;

        _.animationId = setInterval( function()
        {
            curr += fact;

            if( end > start )
            {
                if( curr >= end )
                {
                    _.done = true;
                }
            }
            else
            {
                if( curr <= end )
                {
                    _.done = true;
                }   
            }

            if( _.done )
            {
                curr = end;

                updateCallback( curr );
                doneCallback();
                
                clearInterval( _.animationId );
            }
            else
            {
                updateCallback( curr );
            }
            
        }, rate );
    }

    //
    // stop animation
    //
    _.stop = function()
    {
        if( _.animationId != null )
        {
            clearInterval( _.animationId );
            _.done = true;
        }
    }

    //
    // checks whether the animation is done
    //
    _.isDone = function()
    {
        return _.done;
    }
}