// --------------------------------------------------------------------------------------
// HTML Layout
/*
	<div class="cs-main cs-container">
		<ul>
			<li>
				<div class="cs-symbol"></div>
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
			hAlgin 		: "left",
			vAlign 		: "center",
			elHeight	: 50
		};

		_.init = function(el, contentId, contentCount, contentHeadingAttr, opts) 
		{
			_.el = el;
			_.contentId = contentId;  
			_.contentCount = contentCount;
			_.contentHeadingAttr = contentHeadingAttr;
			_.opts = $.extend(_.opts, opts);

			setUpHtml();
		}

		function setUpHtml()
		{
			var contentElements = [];

			// main
			var main = $("<div></div>");
			main.addClass("cs-main");
			main.addClass("cs-container");

			// ul
			var ul = $("<ul></ul>");
			ul.css( {height : _.opts.elHeight * _.contentCount + "px"});

			for(var i = 0; i < _.contentCount; i++) 
			{
				// li
				var li = $("<li></li>");
				li.css( {height : _.opts.elHeight + "px"} );

				// symbol
				var symbol = $("<span></span>");
				symbol.addClass("cs-symbol");
				// heading
				var heading = $("<div></div>");
				heading.addClass("cs-heading");

				// add heading text
				var headingText = $("#" + _.contentId + "-" + (i + 1)).data(_.contentHeadingAttr);
				
				heading.append(headingText);

				li.prepend(heading);
				li.prepend(symbol);

				ul.prepend(li);
			}

			main.prepend(ul);

			_.el.prepend(main);
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