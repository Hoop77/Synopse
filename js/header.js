//
// This sets up a header which fades away after a certain amount of time and fades in
// if the user scrolls up or if the mouse hovers over it.
//
function setupDynamicHeader( wrapperElement, targetElement, opts ) 
{
	var wrapperElement = wrapperElement,
		targetElement = targetElement,

		timeWait = opts.wait,
		timeFadeIn = opts.fadeIn,
		timeFadeOut = opts.fadeOut,

		mobile = opts.mobile,
		stop = false,

		lastScrollTop,

		mouseover = false,
		fading = false,

		waitTimer,

		waiting = false,
		fadingOut = false,
		fadingIn = false;

	function init() 
	{
		checkSize();
		lastScrollTop = getScrollTop();
		fadeOut();
	}

	function getScrollTop() 
	{
		return $( window ).scrollTop();
	}

	function checkSize() 
	{
		if( viewport().width <= mobile ) 
		{
			if( !stop ) 
			{
				targetElement.css(
				{
					"opacity" : "1",
					"display" : "block"
				});								

				clearTimers();
			}

			stop = true;
			targetElement.stop();
			targetElement.show();
		}
		else 
		{
			if( stop ) 
			{
				targetElement.css(
				{
					"opacity" : "1",
					"display" : "block"
				});	
			}

			stop = false;
			fadeOut();
		}
	}

	function clearTimers() 
	{
		clearTimeout( waitTimer );
	}

	function fadeIn() 
	{
		if( stop ) return;

		if( fadingOut || waiting ) 
		{
			clearTimeout( waitTimer );
			fadingOut = false;
			targetElement.stop();
		}

		targetElement.fadeIn(timeFadeIn, function() 
		{
			fadeOut();
		});
	}

	function fadeOut() 
	{
		if ( stop ) return;

		clearTimeout(waitTimer);
		waiting = true;

		waitTimer = setTimeout(function() 
		{
			if( !mouseover ) 
			{
				targetElement.stop();
				fadingOut = true;

				targetElement.fadeOut( timeFadeOut, function() 
				{
					fadingOut = false;
				});
			}

			waiting = false;
		}, timeWait);
	}

	//
	// main
	//
	$( function() 
	{
		init();

		$( window ).resize( function() 
		{
			checkSize();
		});

		$( window ).scroll( function() 
		{
			if( lastScrollTop > getScrollTop()) 
			{
				fadeIn();
			}

			lastScrollTop = getScrollTop();
		});

		wrapperElement.hover( function() 
		{
			fadeIn();

			mouseover = true;
		}, 
		function() 
		{
			fadeOut();

			mouseover = false;
		});
	});
}