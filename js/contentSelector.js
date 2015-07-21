//-----------------------------------------------------------------------------------------------------
// HTML Layout
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
			_.init = initValue;														// set init value
			if(_.curr == null) _.curr = initValue;									// set also curr if not initialized yet
		}

		// simply sets the current value to the input value
		_.setCurrentValue = function( currentValue )
		{
			// update current value
			_.curr = currentValue;

			callOnValueChangeEvent();
		}

		// sets the current value to the addition of init and the input value
		_.updateCurrentValue = function( updateValue )
		{
			_.curr = _.init + updateValue;

			callOnValueChangeEvent
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
			if( minToMax == 0 ) return 0;																					// protect against division with 0			
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
			steps			: 3																							// how many elements should be displayed by default at a time
		};

		_.init = function(el, contentId, contentCount, contentHeadingAttr, opts) 
		{
			//
			// setting members
			//
			_.el = el;
			_.contentId = contentId;  
			_.contentCount = contentCount;
			_.contentHeadingAttr = contentHeadingAttr;
			_.opts = $.extend(_.opts, opts);

			//
			// setup functions
			//
			setUpHtml();
			setUpDimensionsAndOffsets();
			
			updateOpacity();
		}

		function setUpHtml()
		{
			_.contentElements = [];																						// store li elements

			// main
			var main = $("<div></div>");
			main.addClass("cs-main");
			main.css({ height : _.totalHeight + "px" });																// set total height

			// horizontal align
			if(_.opts.hAlign == "right") main.addClass("cs-h-right"); 
			else if (_.opts.hAlign == "center") main.addClass("cs-h-center"); 
			else main.addClass("cs-h-left");

			// vertical align
			if(_.opts.vAlign == "bottom") main.addClass("cs-v-bottom"); 
			else if (_.opts.vAlign == "center") main.addClass("cs-v-center");
			else main.addClass("cs-v-top");

			// ul
			_.ul = $("<ul></ul>");

			// loop through every element
			for(var i = 0; i < _.contentCount; i++) 
			{
				// li
				var li = $("<li></li>");
				li.css({ height : _.opts.elHeight + "px" });

				// heading
				var heading = $("<div></div>");
				heading.addClass("cs-heading");

				// add heading text and append to heading element
				var headingText = $("#" + _.contentId + "-" + (_.contentCount - i)).data(_.contentHeadingAttr);
				heading.append(headingText);

				// li.heading
				li.prepend(heading);

				// ul.li
				_.ul.prepend(li);

				_.contentElements.unshift(li);																			// pushes element to first position in array
			}

			_.ul.css({ width : (_.totalWidth - _.opts.symbolWidth) + "px" });											// calculate rest width

			main.prepend(_.ul);

			// symbol
			var symbol = $("<div></div>");
			symbol.addClass("cs-symbol");
			symbol.css({ width : _.opts.symbolWidth + "px" });															// set symbol width
			symbol.append("&#9656;");																					// kind of selection character

			// main.symbol
			main.prepend(symbol);

			// el.main
			_.el.prepend(main);
		}

		function setUpDimensionsAndOffsets()
		{
			//
			// total width and height
			//
			_.totalHeight = _.opts.elHeight * (2 * _.opts.steps - 1);													// calculate total height
			_.totalWidth = _.el.width();

			//
			// offsets
			//
			var initMarginTop 	= _.opts.elHeight * (_.opts.steps - 1);													// init margin that has to be set to center the first element
			var initPositionTop = _.ul.offset().top;																	// init top position of ul element

			_.marginTopController = new OffsetController();																// controller to set the ul margin top value to move all elements up and down
			_.marginTopController.setInitValue( initMarginTop );														// set initial value
			_.marginTopController.bindOnValueChangeEvent( setUlMarginTop );												// bind function to control css attribute of ul element (margin-top)
			_.marginTopController.updateCurrentValue( 0 );																// activate

			_.positionController = new OffsetController();																// controller to control the position and calculate the corresponding opacity
			_.positionController.setInitValue( initMarginTop + initPositionTop );										// set init value to inital center position of content selector
			_.positionController.bindOnValueChangeEvent( setElementOpacity );											// bind function to control css attribute of li element (opacity)
			_.positionController.setRange( 0, ( _.totalHeight / 2 ) );													// range origin is in the center --> total height / 2
		}

		function setUlMarginTop( controller )
		{
			_.ul.css({ "margin-top" : controller.getCurrentValue() + "px" });
		}

		function setElementOpacity( controller )
		{
			var opacity = Math.abs( controller.getDistanceInRange() );
			_.currElement.css({ opacity : opacity });		
		}

		function updateOpacity() 
		{
			for(var i = 0; i < _.contentCount; i++)
			{
				_.currElement = _.contentElements[i];
				_.positionController.setCurrentValue( _.currElement.offset().top );
			}
		}

		function setUpUpdate()
		{
			$(window).resize( function() 
			{
			} );
		}
	}


	$.fn.contentSelector = function(contentId, contentCount, contentHeadingAttr, opts)
	{
		var len = this.length;

		return this.each( function(index)
		{
			var me = $(this)
				key = "content-selector" + (len > 1 ? '-' + ++index : ''),
				instance = (new ContentSelector).init(	me, 
														contentId, 
														contentCount, 
														contentHeadingAttr, 
														opts);

			me.data('key', key);
		} );
	}
} 
) (jQuery);
