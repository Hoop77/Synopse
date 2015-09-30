//---------------------------------------------
//
// html data attributes:
// data-parallax-img-src		[ filename ]
// data-parallax-height			[ integer ]
// data-parallax-speed			[ between 0.0 and 1.0 ]
//
//---------------------------------------------	


( function( $ )
{
	var Parallax = function()
	{
		var _ = this;

		_.speed = 0.0;

		_.init = function( el )
		{
			_.container = el;

			//
			// get speed from data-speed
			//
			var speed = _.container.data( "parallax-speed" );
			if( speed != null )
				_.speed = parseFloat( speed );

			setupHtml();
			setupUpdate();

			return _;
		}

		function setupHtml()
		{
			//
			// add container
			//
			_.container.addClass( "parallax-container" );

			//
			// add parallax
			//
			_.parallax = $( "<div></div>" );
			_.parallax.addClass( "parallax-parallax" );

			//
			// attach image from data-prallax-img-src to parallax
			//
			var imgSrc = _.container.data( "parallax-img-src" );
			if( imgSrc != null )
			{
				_.parallax.css(
					{
						"background": 			"url(" + imgSrc + ") no-repeat"
					}
				);
			}

			//
			// attach height from data-parallax-height to parallax
			//
			_.heightData = _.container.data( "parallax-height" );

			//
			// prepend parallax to container
			//
			_.container.prepend( _.parallax );

			//
			// assign container height
			//
			_.ch = _.container.height();
		}

		function evaluateHeightData( value ) 
		{
			if( value.indexOf( "px" ) != -1 ) 
			{
				var str = value.substring( 0, value.indexOf( "px" ));
				px = new Number( str );
				return px;
			}
			else if( value.indexOf( "vh" ) != -1 ) 
			{
				var str = value.substring( 0, value.indexOf( "vh" ));
				vh = new Number( str );
				var px = viewport().height * ( vh / 100 );
				return px;
			}
			else if( value.indexOf( "%" ) != -1 )
			{
				var str = value.substring( 0, value.indexOf( "%" ));
				percent = new Number( str );
				var px = _.container.height() * ( percent / 100 ); 
				return px;
			}
			else 
			{
				return 0;
			}
		}

		function updateHtml()
		{
			if( _.heightData != null )
			{
				var height = evaluateHeightData( _.heightData );

				_.parallax.css(
					{
						"height": height
					 }
				);

				_.ph = height;					// if height is set -> assign ph to height
			}
			else
			{
				_.ph = _.container.height();	// if height is NOT set -> assign ph to the container height
			}
		}

		function updateValues()
		{
			var vh = viewport().height;

			//
			// parallax height greater than vh -> there's no minimum speed
			//
			if( _.ph >= vh )
			{
				_.r = _.speed;
			}

			//
			// parallax height less than vh -> must calculate minimum speed
			//
			else
			{
				_.c0 = vh - _.ch;
				_.p0 = vh - _.ph;

				var diff = _.c0 - _.p0;
				_.p0 += _.speed * diff;

				if( _.p0 == 0 )		// protect from division with 0
				{
					_.r = 0;
				}
				else
				{
					_.r =  _.p0 / _.c0;
				}

				if( _.r < 0 ) _.r = 0;
			}
		}

		function updatePosition()
		{
			//
			// get the scroll-top-position and the top-position of the container
			//
			var vt = $( window ).scrollTop();
	 		var ct = _.container.offset().top;

	 		//
	 		// calculate position of the fixed parallax div
	 		//
	 		var yPos = ( ct - vt ) * _.r;

	 		//
	 		// set css
	 		//
	 		_.parallax.css(
	 			{
	 				"top": yPos + "px"
	 			}
 			);
		}

		function setupUpdate()
		{
			updateHtml();
			updateValues();
			updatePosition();

			$( window ).resize( function()
			{
					updateHtml();
					updateValues();
			});

			$( window ).scroll( updatePosition );
		}
	}

	//
	// register as jQuery funtion
	//
	$.fn.parallax = function()
	{
		var len = this.length;

		return this.each( function( index )
		{
			var me = $( this )
				key = "parralax" + ( len > 1 ? '-' + ++index : '' ),
				instance = ( new Parallax ).init( me );

			me.data( 'key', key );
		} );
	}
}
)( jQuery );