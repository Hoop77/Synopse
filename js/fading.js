( function( $ )
{
	var Fading = function()
	{
		var _ = this;

		const POS_TYP_RELATIVE 	= 0;
		const POS_TYP_ABSOLUTE 	= 1;

		_.init = function( el )
		{
			_.el = el;

			//
			// start and end position
			//
			_.startPosData = _.el.data( "fading-start-position" );
			_.endPosData = _.el.data( "fading-end-position" );

			//
			// start and end positions
			//
			_.startValData = _.el.data( "fading-start-value" );
			_.endValData = _.el.data( "fading-end-value" );

			//
			// evaluate positioning type
			//
			_.positioningType = evaluatePositioningType( _.el.data( "fading-positioning" ));

			setupUpdate();

			return _;
		}

		function evaluatePositioningType( type )
		{
			if( type == null )
			{
				return POS_TYP_ABSOLUTE;
			}
			else
			{
				if( type == "relative" )
				{
					return POS_TYP_RELATIVE;
				}
				else
				{
					return POS_TYP_ABSOLUTE;
				}
			}
		}

		function evaluatePosition( position ) 
		{
			if( position.indexOf( "px" ) != -1 ) 
			{
				var str = position.substring( 0, position.indexOf( "px" ));
				px = new Number( str );
				return px;
			}
			else if( position.indexOf( "vh" ) != -1 ) 
			{
				var str = position.substring( 0, position.indexOf( "vh" ));
				vh = new Number( str );
				var px = viewport().height * ( vh / 100 );
				return px;
			}
			else if( position.indexOf( "%" ) != -1 )
			{
				var str = position.substring( 0, position.indexOf( "%" ));
				percent = new Number( str );
				var px = _.el.parent().height() * ( percent / 100 ); 
				return px;
			}
			else 
			{
				return 0;
			}
		}

		function evaluateValue( value )
		{
			if( value != null )
			{
				return parseFloat( value );	
			}
			else
			{
				return 0;
			}
		}

		function updateCurrValue()
		{
			var vh = viewport().height;

			var startPos = evaluatePosition( _.startPosData );
			var endPos = evaluatePosition( _.endPosData );

			if( _.positioningType == POS_TYP_RELATIVE )
			{
				startPos += _.el.offset().top;
				endPos += _.el.offset().top;
			}

			var posDiff = endPos - startPos;

			var currPos = $( window ).scrollTop();

			var r = ( currPos - startPos ) / posDiff;

			var startVal = evaluateValue( _.startValData );
			var endVal = evaluateValue( _.endValData );

			var valDiff;
			var currVal;

			//
			// fade in
			//
			if( endVal > startVal )
			{
				valDiff = endVal - startVal;
				currVal = startVal + ( r * valDiff );
			}

			//
			// fade out
			//
			else if( startVal > endVal )
			{
				valDiff = startVal - endVal;
				currVal = startVal - ( r * valDiff ); 
			}

			//
			// start and end values are equal -> no fading
			//
			else
			{
				currVal = 1.0;
			}

			_.el.css({ opacity: currVal });

/*
			console.log("--------------------------");
			console.log( "vh: " + vh );
			console.log( "startPos: " + startPos );
			console.log( "endPos: " + endPos );
			console.log( "posDiff: " + posDiff );
			console.log( "currPos: " + currPos );
			console.log( "startVal: " + startVal );
			console.log( "endVal: " + endVal );
			console.log( "valDiff: " + valDiff );
			console.log( "r: " + r );
			console.log( "currVal: " + currVal );
			console.log("--------------------------");
*/
		}

		function setupUpdate()
		{
			//
			// valid data check
			//
			if(    _.startPosData != null
				&& _.endPosData != null
				&& _.startValData != null
				&& _.endValData != null )
			{
				//
				// first update call and update on scroll
				//
				updateCurrValue();

				$( window ).resize( updateCurrValue );

				$( window ).scroll( updateCurrValue );
			}
		}
	}

	//
	// register as jQuery funtion
	//
	$.fn.fading = function()
	{
		var len = this.length;

		return this.each( function( index )
		{
			var me = $( this )
				key = "fading" + ( len > 1 ? '-' + ++index : '' ),
				instance = ( new Fading ).init( me );

			me.data( 'key', key );
		} );
	}
} 
)( jQuery );