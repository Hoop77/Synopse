// --------------------------------------------------------------------------------------
// HTML Layout
/*
	<div class="cs-main>
		<div class="cs-symbol"></div>
		<ul>
			<li>
				<div class="cs-heading"></div>
			</li>
		</ul>
	</div>
*/		
// --------------------------------------------------------------------------------------

( function($) 
{
	var ContentSelector = function() 
	{
		var _ = this;

		_.opts = 
		{
			hAlign 			: "left",
			vAlign 			: "top",
			symbolWidth		: 20,
			elHeight		: 50,
			stepsShown		: 3
		};

		_.init = function(el, contentId, contentCount, contentHeadingAttr, opts) 
		{
			// setting members
			_.el = el;
			_.contentId = contentId;  
			_.contentCount = contentCount;
			_.contentHeadingAttr = contentHeadingAttr;
			_.opts = $.extend(_.opts, opts);

			// calculate total height
			_.totalHeight = _.opts.elHeight * (2 * _.opts.stepsShown - 1);	// calculate total height
			_.totalWidth = _.el.width();

			setUpHtml();
			setUpOffsets();
			
			updateOpacity();

			setTopOffset(-0);
			updateOpacity();
		}

		function setUpHtml()
		{
			_.contentElements = [];		// store li elements

			// main
			var main = $("<div></div>");
			main.addClass("cs-main");
			main.css({ height : _.totalHeight + "px" });		// set total height

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

				// add heading text
				var headingText = $("#" + _.contentId + "-" + (_.contentCount - i)).data(_.contentHeadingAttr);
				
				heading.append(headingText);

				li.prepend(heading);

				_.ul.prepend(li);

				_.contentElements.unshift(li);
			}

			_.ul.css({ width : (_.totalWidth - _.opts.symbolWidth) + "px" });	// calculate rest width

			main.prepend(_.ul);

			// symbol
			var symbol = $("<div></div>");
			symbol.addClass("cs-symbol");
			symbol.css({ width : _.opts.symbolWidth + "px" });	// set symbol width
			symbol.append("&#9656;");							// kind of selection character
			main.prepend(symbol);

			_.el.prepend(main);

			_.initTop = _.ul.offset().top;
		}

		function setUpOffsets()
		{
			_.initMarginTopOffset = _.opts.elHeight * (_.opts.stepsShown - 1);	// calculate offset for first element
			setTopOffset(0);
			_.posCenter = _.initTop + _.initMarginTopOffset;			// calculate center position
		}

		function setTopOffset(offset)
		{
			_.ul.css({ "margin-top" : (_.initMarginTopOffset + offset) + "px" });
		}

		function updateOpacity () {
			for(var i = 0; i < _.contentCount; i++)
			{
				var element = _.contentElements[i];
				var topOffset = _.posCenter - element.offset().top;	// how far the top of element is away from the center
				var opacity = 1.0;

				console.log("center: " + _.posCenter);
				console.log("topOffset: " + topOffset);
				console.log(_.currentMarginTopOffset);

				if(topOffset >= 0)
					opacity = 1 - (topOffset / (_.totalHeight / 2) );	// topOffset positive 
				else
					opacity = 1 - (-topOffset / (_.totalHeight / 2) );	// topOffset negative
				
				element.css({ opacity : opacity });
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