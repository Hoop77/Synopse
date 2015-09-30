( function( $ )
{
	var Clipper = function()
	{
		var _ = this;

		//
		// callbacks
		//
		_.onExtendCallback = null;
		_.onCollapseCallback = null;

		_.init = function( el )
		{
			_.main = el;

			setupHtml();
			setupEvents();

			return _;
		}

		function setupHtml()
		{	
			_.collapsed = _.main.find( ".clipper-collapsed" );
			_.extended = _.main.find( ".clipper-extended" );
			_.dots = _.collapsed.find( ".clipper-dots" );
			_.x = _.extended.find( ".clipper-x" );

			_.collapsedWidth = _.collapsed.width();
			_.extendedWidth = _.extended.width();

			//
			// init state
			//
			/*
			_.extended.css( "max-width", _.extended.width() + "px" ); 
			_.extended.css( "display", "block" );
			_.collapsed.css( "max-width", 0 );
			_.collapsed.css( "display", "none" );
			*/

			_.extended.css( "max-width", 0 ); 
			_.extended.css( "display", "none" );
			_.collapsed.css( "max-width", _.collapsedWidth );
			_.collapsed.css( "display", "block" );
		}

		_.showCollapsed = function()
		{
			_.extended.animate(
			{
				"max-width": 0
			}, 
			250, 
			function()
			{
				_.extended.css( "display", "none" );
				_.collapsed.css( "display", "block" );

				if( _.onCollapseCallback != null ) _.onCollapseCallback();

				_.collapsed.animate(
				{
					"max-width": _.collapsedWidth + "px"
				},
				250 );
			});
		}

		_.showExtended = function()
		{
			_.collapsed.animate(
			{
				"max-width": 0
			}, 
			250, 
			function()
			{
				_.collapsed.css( "display", "none" );
				_.extended.css( "display", "block" );

				if( _.onExtendCallback != null ) _.onExtendCallback();

				_.extended.animate(
				{
					"max-width": _.extendedWidth + "px"
				},
				250 );
			});		
		}

		_.setOnExtend = function( onExtend )
		{
			_.onExtendCallback = onExtend;
		}

		_.setOnCollapse = function( onCollapse )
		{
			_.onCollapseCallback = onCollapse;
		}

		function setupEvents()
		{
			_.dots.click( function()
			{
				_.showExtended();
			});

			_.x.click( function()
			{
				_.showCollapsed();
			});
		}
	}

	//
	// register as jQuery funtion
	//
	$.fn.clipper = function()
	{
		var len = this.length;

		return this.each( function( index )
		{
			var me = $( this )
				key = "clipper" + ( len > 1 ? '-' + ++index : '' ),
				instance = ( new Clipper ).init( me );

			me.data( key, instance ).data( 'key', key );
		});
	}
}
)( jQuery );