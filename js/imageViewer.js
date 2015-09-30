( function( $ ) 
{
	var ImageViewer = function() 
	{
		var _ = this;

		_.opts = 
		{
			paddingHor : 50,
			paddingVer : 100
		};

		_.init = function( el, opts ) 
		{
			_.el = el;
			
			_.opts = $.extend( _.opts, opts );

			setBackgroundImage();
			calcRatio();

			_.descriptionText = _.el.data( "img-description" );

			setup();

			return _;
		}

		function setBackgroundImage() 
		{
			_.imgSrc = _.el.data( "img-src" );
			_.el.css(
			{
				"background": 			"url(" + _.imgSrc + ")",
				"background-repeat": 	"no-repeat",
				"background-position": 	"top center",
				"background-size": 		"cover"
			});
		}

		function calcRatio() 
		{
			_.width = _.el.data( "img-width" );
			_.height = _.el.data( "img-height" );
			_.ratio = _.width / _.height;
		}

		function setup() 
		{
			var imgHover = $( "<div></div>" );
			imgHover.addClass( "iv-img" );
			imgHover.addClass( "hover-off" );

			var fullsizeIcon = $( "<div></div>" );
			fullsizeIcon.addClass( "iv-fullsize-icon" );
			imgHover.prepend( fullsizeIcon );

			imgHover.hover(function() 
			{
				imgHover.addClass( "hover-on" );
			}, 
			function() 
			{
				imgHover.removeClass( "hover-on" );
			});

			$( window ).resize( function() 
			{
				var h = _.el.height();

				imgHover.css( "height", h + "px" );
			});

			imgHover.click(function() 
			{
				$( "body" ).css( "overflow", "hidden" );
				
				var fullsizeImgContainer = $( "<div></div>" ).addClass( "iv-fullsize-img-container" );
				fullsizeImgContainer.css(
				{
					"padding-left"			: _.opts.paddingHor + "px",
					"padding-right"			: _.opts.paddingHor + "px",
					"padding-top"			: _.opts.paddingVer + "px",
					"padding-bottom"		: _.opts.paddingVer + "px",
				});

				var fullsizeImg = $( "<div></div>" ).addClass( "iv-fullsize-img" );
				fullsizeImg.css(
				{
					"background" 			: "url(" + _.imgSrc + ")",
					"background-repeat"		: "no-repeat",
					"background-position" 	: "top center",
					"background-size"		: "contain"
				});

				calcDimensions( fullsizeImg );

				$( window ).resize( function() 
				{
					calcDimensions( fullsizeImg );
				});

				var iconContainer = $( "<div></div>" );
				iconContainer.addClass( "iv-icon-container" );

				var closeIcon = $( "<div></div>" );
				closeIcon.addClass( "iv-icon" );
				closeIcon.addClass( "iv-icon-close" );
				closeIcon.addClass( "off" );

				var infoIcon = $( "<div></div>" );
				infoIcon.addClass( "iv-icon" );
				infoIcon.addClass( "iv-icon-info" );
				infoIcon.addClass( "off" );

				closeIcon.hover( function() 
				{
					$(this).addClass( "hover-on" );
				}, 
				function() 
				{
					$(this).removeClass( "hover-on" );
				});

				infoIcon.hover( function() 
				{
					$(this).addClass( "hover-on" );
				}, 
				function() 
				{
					$(this).removeClass( "hover-on" );
				});

				closeIcon.click( function() 
				{
					close();
				});

				var description = $( "<p></p>" );
				description.addClass( "iv-description" );
				description.addClass( "off" );
				description.text( _.descriptionText );

				var on = false;
				infoIcon.click( function() 
				{
					if( !on ) 
					{
						description.addClass( "on" );	
						on = true;
					}
					else 
					{
						description.removeClass( "on" );	
						on = false;	
					}
				});

				iconContainer.prepend( closeIcon );
				iconContainer.prepend( infoIcon );
				fullsizeImg.prepend( iconContainer );

				fullsizeImg.prepend( description );

				fullsizeImg.hover( function() 
				{
					closeIcon.addClass("on");
					infoIcon.addClass("on");
				}, 
				function() 
				{
					closeIcon.removeClass( "on" );
					infoIcon.removeClass( "on" );
				});

				fullsizeImgContainer.mouseup( function( e ) 
				{
					if( !fullsizeImg.is(e.target) &&
						fullsizeImg.has(e.target).length === 0) 
					{
						close();
					}
				});

				$( document ).keyup(function( e )
				{
					if( e.keyCode == 27 ) close();
				});

				fullsizeImgContainer.prepend( fullsizeImg );
				$( "body" ).prepend( fullsizeImgContainer );
				$( "body .iv-fullsize-img-container" ).show( "slow" );
				show();
			});

			_.el.prepend( imgHover );
		}

		function calcDimensions( element ) 
		{
			var w;
			var h;

			var vw = viewport().width - 2 * _.opts.paddingHor;
			var vh = viewport().height - 2 * _.opts.paddingVer;

			if( _.width > _.height )
			{
				w = vw;
				h = w / _.ratio;
			}
			else
			{
				h = vh;
				w = h * _.ratio;
			}

			element.css(
			{
				"width"		: w + "px",
				"height"	: h + "px"
			});
		}

		function show() 
		{
			$( "body .iv-fullsize-img-container" ).fadeIn( "slow" );
		}

		function close() 
		{
			$( "body .iv-fullsize-img-container" ).fadeOut( "slow", function() 
			{
				$( ".iv-fullsize-img-container" ).remove();
				$( "body" ).css( "overflow", "auto" );
			});
		}
	}

	$.fn.imageViewer = function( opts ) 
	{
		var len = this.length;

		// enable multiple-image-viewer support
		return this.each( function(index) 
		{
			// cache a copy of $(this)
			var me = $( this ),
				key = 'image-viewer' + ( len > 1 ? '-' + ++index : '' ),
				instance = ( new ImageViewer).init( me, opts );

			// set a key to each instance
			me.data( key, instance ).data( 'key', key );
		});
	}
}
)( jQuery );