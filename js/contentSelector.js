//-----------------------------------------------------------------------------------------------------
// HTML DOM Layout
//
//	<div class="cs-main>
//		<div class="cs-symbol"></div>
//		<ul>
//			<li>
//				<div class="cs-heading"></div>
//			</li>
//		</ul>
//	</div>
//		
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// example with 3 steps:
//
//	position		state0	state1	state2		opactiy
//  --------        ------  ------	------		-------
//
//	-2								el0
//	-1						el0		el1
//  0 (center)		el0		el1		el2			100%
//	1				el1		el2					
//	2				el2
//
//-----------------------------------------------------------------------------------------------------

( function($) 
{
	var OffsetController = function()
	{
		var _ = this;

		_.init = null;
		_.curr = null;
		_.onValueChangeEvent = null;
		_.range = 
		{ 
			min : Number.MIN_VALUE,
			max : Number.MAX_VALUE
		};

		_.setInitValue = function( initValue )
		{
			// set init value
			_.init = initValue;

			// set also curr if not initialized yet
			if(_.curr == null) _.curr = initValue;
		}

		//
		// simply sets the current value to the input value
		//
		_.setCurrentValue = function( currentValue )
		{
			// update current value
			_.curr = currentValue;

			callOnValueChangeEvent();
		}

		//
		// sets the current value to the addition of init and the input value
		//
		_.updateCurrentValue = function( updateValue )
		{
			_.curr = _.init + updateValue;

			callOnValueChangeEvent();
		}

		_.setRange = function( min, max )
		{
			_.range.min = min;
			_.range.max = max;
		}

		_.getInitValue = function()
		{
			return _.init;
		}

		_.getCurrentValue = function()
		{
			return _.curr;
		}

		// returns the distance between init and curr
		// example: init = 20, curr = -30
		// 			--> returns -50
		_.getDistance = function()
		{
			return ( _.curr - _.init );
		}

		// returns a value in range between 0 and 1 if distance of the current and init value 
		// is between range.min and range.max
		// example: min = -100, max = 100, curr = 50
		// 			--> returns 0.75 
		_.getDistanceInRange = function()
		{
			var minToDist = _.getDistance() - _.range.min;
			var minToMax = _.range.max - _.range.min;

			if( minToMax == 0 ) return 0;	// protect against division with 0			

			return minToDist / minToMax;
		}

		_.bindOnValueChangeEvent = function( ev )
		{
			_.onValueChangeEvent = ev;
		}

		function callOnValueChangeEvent()
		{
			// trigger set event
			if( _.onValueChangeEvent != null )
				_.onValueChangeEvent( _ );
		}
	}

	var ContentSelector = function() 
	{
		var _ = this;

		_.opts = 
		{
			hAlign 			: "left",
			vAlign 			: "top",
			symbolWidth		: 20,
			elHeight		: 50,
			steps			: 3			// how many elements should be displayed by default at a time
		};

		//
		// main intit function
		//
		_.init = function( el, contentIdStr, contentCount, contentHeadingAttr, opts ) 
		{
			//
			// setting members
			//
			_.el = el;
			_.contentIdStr = contentIdStr;  
			_.contentCount = contentCount;
			_.contentHeadingAttr = contentHeadingAttr;
			_.opts = $.extend(_.opts, opts);

			//
			// total width and height
			//
			_.totalHeight = _.opts.elHeight * (2 * _.opts.steps - 1);				// calculate total height
			_.totalWidth = _.el.width();

			//
			// setup functions
			//
			setUpHtml();				// dom elements
			setUpOffsets();				// offset controllers

			_.activeElementIndex = 0;	// index of element which is in the center of the selection
			_.activeOffset = 0;			// offset of the elements (value "0" means element with index 0 is in the center)

			_.scrollingToHeading = false;

			setUpUpdate();				// configures events
		}

		//
		// set up dom elements
		//
		function setUpHtml()
		{
			// store li elements
			_.contentElements = [];

			// main
			_.main = $( "<div></div>" );
			_.main.addClass( "cs-main" );
			_.main.css({ height : _.totalHeight + "px" });	// set total height

			// horizontal align
			if( _.opts.hAlign == "right" ) _.main.addClass( "cs-h-right" ); 
			else if ( _.opts.hAlign == "center" ) _.main.addClass( "cs-h-center" ); 
			else _.main.addClass( "cs-h-left" );

			// vertical align
			if( _.opts.vAlign == "bottom" ) _.main.addClass( "cs-v-bottom" ); 
			else if ( _.opts.vAlign == "center" ) _.main.addClass( "cs-v-center" );
			else _.main.addClass( "cs-v-top" );

			// ul
			_.ul = $( "<ul></ul>" );

			// loop through every element
			for( var i = _.contentCount; i > 0; i-- ) 
			{
				// li
				var li = $( "<li></li>" );
				li.css({ height : _.opts.elHeight + "px" });
				li.data( "index", i - 1 );

				// heading
				var heading = $( "<div></div>" );
				heading.addClass( "cs-heading" );

				// add heading text and append to heading element
				var headingText = $( "#" + _.contentIdStr + "-" + ( i )).data( _.contentHeadingAttr );
				heading.append( headingText );

				// li.heading
				li.prepend( heading );

				// ul.li
				_.ul.prepend( li );

				_.contentElements.unshift( li );		// pushes element to first position in array
			}

			_.ul.css({ width : ( _.totalWidth - _.opts.symbolWidth ) + "px" });		// calculate rest width

			_.main.prepend( _.ul );

			// symbol
			var symbol = $( "<div></div>" );
			symbol.addClass( "cs-symbol" );
			symbol.css({ width : _.opts.symbolWidth + "px" });    	// set symbol width
			symbol.append( "&#9656;" );    							// kind of selection character

			// main.symbol
			_.main.prepend( symbol );

			// el.main
			_.el.prepend( _.main );
		}

		//
		// setting up offset controllers
		//
		function setUpOffsets()
		{
			//
			// offsets
			//
			var initMarginTop 	= _.opts.elHeight * ( _.opts.steps - 1 );	 		// init margin that has to be set to center the first element

			_.marginTopController = new OffsetController();							// controller to set the ul margin top value to move all elements up and down
			_.marginTopController.setInitValue( initMarginTop );					// set initial value
			_.marginTopController.bindOnValueChangeEvent( setUlMarginTop );			// bind function to control css attribute of ul element (margin-top)

			_.opacityController = new OffsetController();							// controller to controls the opacity
			_.opacityController.setInitValue( initMarginTop );						// set init value to inital center position of content selector
			_.opacityController.bindOnValueChangeEvent( setElementOpacity );		// bind function to control css attribute of li element (opacity)
			_.opacityController.setRange( 0, ( _.totalHeight / 2 ) );				// range origin is in the center --> total height / 2

			_.marginTopController.updateCurrentValue( 0 );							// activate
		}

		//
		// callback for the margin top controller for assigning the margin top value in css
		//
		function setUlMarginTop( controller )
		{
			_.ul.css({ "margin-top" : controller.getCurrentValue() + "px" });
			updateOpacity();														// update Opacity
		}

		//
		// callback for opacity controller to assign the opacity value in css
		//
		function setElementOpacity( controller )
		{
			var opacity = 1 - Math.abs( controller.getDistanceInRange() );
			_.currElement.css({ opacity : opacity });		
		}

		//
		// updates the opacity value for each element
		//
		function updateOpacity()
		{
			for( var i = 0; i < _.contentCount; i++ )
			{
				_.currElement = _.contentElements[i];			// current li element

				var top = _.currElement.offset().top - _.main.offset().top;		// top position relative to main element

				_.opacityController.setCurrentValue( top );		// trigger setElementOpacity()
			}
		}

		//
		// updates the elements position according to the active element
		//
		function updateElementsPosition()
		{
			clearInterval( _.timer );				// clear running timer

			//
			// animation setup
			//
			var time = 500;							// number of milliseconds the animation lasts
			var rate = 16;							// number of milliseconds between each update cycle
			var steps = time / rate;				// number of update cycles

			var start = _.activeOffset;				// animation start value
			var end = getTargetElementOffset();		// animation end value
			var span = end - start;					// span between start and end values

			var fact = span / steps;				// factor added to activeOffset each update cycle

			_.timer = setInterval( function() 		// timer function
			{
				_.activeOffset += fact;
				_.marginTopController.updateCurrentValue( _.activeOffset );		// change positions

				var over = false;					// indicates if animation is over

				//
				// check direction of animated value
				// and check if animation is going to be over
				//
				if( end > start )
				{
					if( _.activeOffset >= end ) over = true;
				}
				else if( end < start )
				{
					if( _.activeOffset <= end ) over = true;
				}
				else
				{
					clearInterval();
				}

				if( over )
				{
					_.activeOffset = end;											// assign accurate end value
					_.marginTopController.updateCurrentValue( _.activeOffset );		// position
					clearInterval( _.timer );										// clear interval
				}
			}, rate );	// timer function end
		}

		//
		// returns the offset value for the selection of the active element
		//
		function getTargetElementOffset()
		{
			return -( _.activeElementIndex * _.opts.elHeight );		// negative offset value
		}

		//
		// sets the current selected element to the heading currently displayed in the document
		//
		function trackHeadings()
		{
			//
			// if already scrolling to element don't do anything
			//
			if( _.scrollingToHeading )
			{
				return;
			}

			var currScroll = $( window ).scrollTop() + ( $( window ).height() / 2 );	// center of viewport
			var resultIndex = 0;

			for( var i = 1; i < _.contentCount; i++ )
			{
				var headingElement = $( "#" + _.contentIdStr + "-" + ( i + 1 ));		// get heading element
				var headingScrollTop = headingElement.offset().top;
				
				if( currScroll >= headingScrollTop )
				{
					resultIndex = i;
				}
				else
				{
					break;
				}
			}

			if( _.activeElementIndex != resultIndex )
			{
				_.activeElementIndex = resultIndex;			// set new active element index
				updateElementsPosition();					// update positions
			}
		}

		//
		// set up all interaction functionalities
		//
		function setUpUpdate()
		{
			//
			// window resized
			//
			$(window).resize( function() 
			{
				trackHeadings();
			} );

			//
			// window scrolling
			//
			$(window).scroll(function()
			{
				trackHeadings();
			} );

			//
			// element is clicked
			//
			for( var i = 0; i < _.contentCount; i++ )
			{
				var element = _.contentElements[i];
				element.click( function()
				{
					_.activeElementIndex = $( this ).data( "index" );

					_.scrollingToHeading = true;
					scrollTo( 
						$( "#" + _.contentIdStr + "-" + ( _.activeElementIndex + 1 )),
						{
							duration : 'slow',
							complete : function()
							{
								_.scrollingToHeading = false;
								updateElementsPosition();
							}
						}
					);
				} );
			}
		}
	}

	//
	// register as jQuery funtion
	//
	$.fn.contentSelector = function(contentIdStr, contentCount, contentHeadingAttr, opts)
	{
		var len = this.length;

		return this.each( function( index )
		{
			var me = $( this )
				key = "content-selector" + ( len > 1 ? '-' + ++index : '' ),
				instance = ( new ContentSelector ).init( me, 
														 contentIdStr, 
														 contentCount, 
														 contentHeadingAttr, 
														 opts );

			me.data( 'key', key );
		} );
	}
} 
) (jQuery);
