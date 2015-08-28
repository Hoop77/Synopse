function ParallaxObject(el, scrollData, opacityData) {
	var _ = this;

	init();

	function init() {
		_.el = el;

		if(scrollData != null) {
			_.scrollEnabled = true;
			 // store input scroll data for later use
			_.scrollDataInitTop = scrollData['init'],
			_.scrollDataStepRange = scrollData['range'],
			_.scrollDataStepValue = scrollData['value'],

			// processed data
			_.scrollInitTop = evaluateData(_.scrollDataInitTop),
			_.scrollStepRange = evaluateData(_.scrollDataStepRange),
			_.scrollStepValue = evaluateData(_.scrollDataStepValue),
			_.scrollRatio = calcRatio(_.scrollStepRange, _.scrollStepValue);
		}
		else {
			_.scrollEnabled = false;
		}

		if(opacityData != null) {
			_.opacityEnabled = true;
			// store input opacity data for later use
			_.opacityDataInit = opacityData['init'],
			_.opacityDataEnd = opacityData['end'],
			_.opacityDataStepRange = opacityData['range'],
			_.opacityDataStepValue = opacityData['value'],
			// processed data
			_.opacityInit = _.opacityDataInit,
			_.opacityEnd = _.opacityDataEnd,
			_.opacityDiff = _.opacityInit - _.opacityEnd,
			_.opacityStepRange = evaluateData(_.opacityDataStepRange),
			_.opacityStepValue = evaluateData(_.opacityDataStepValue),
			_.opacityRatio = calcRatio(_.opacityStepRange, _.opacityStepValue);	
		}
		else {
			_.opacityEnabled = false;
		}
	}

	function evaluateData(value) {
		if(value.indexOf("px") != -1) {
			var str = value.substring(0, value.indexOf("px"));
			pixels = new Number(str);
			return pixels;
		}
		else if(value.indexOf("%") != -1) {
			var str = value.substring(0, value.indexOf("%"));
			percent = new Number(str);
			var pixels = viewport()['height'] * (percent / 100);
			return pixels;
		}
		else {
			return 0;
		}
	}

	function calcRatio(range, value) {
		if (range != 0 && value != 0) {
			var ratio = value / range;
			return ratio;
		}
		else {
			return 0;
		}
	}

	function getScrollTop() {
		return $(window).scrollTop();
	}

	function calcTop() {
		var newTop = _.scrollInitTop + getScrollTop() * _.scrollRatio;
		el.css({top: newTop + "px"});
	}

	function calcOpacity() {
		var scrollPos = getScrollTop() - _.scrollInitTop;
		if(scrollPos >= 0) {
			var factor =  (scrollPos / _.opacityStepRange) * _.opacityRatio;
			var newOpacity = (_.opacityInit - (factor * _.opacityDiff));
			el.css({opacity: newOpacity});		
		}
		else {
			el.css({opacity: _.opacityInit});
		}
	}

	$(function() {
		calcTop();
		calcOpacity();
		
		$(window).resize(function() {
			if(_.scrollEnabled) {
				_.scrollInitTop = evaluateData(_.scrollDataInitTop);
				_.scrollStepRange = evaluateData(_.scrollDataStepRange);
				_.scrollStepValue = evaluateData(_.scrollDataStepValue);
			}
			
			if(_.opacityEnabled) {
				_.opacityStepRange = evaluateData(_.opacityDataStepRange);
				_.opacityStepValue = evaluateData(_.opacityDataStepValue);
			}
		});

		$(window).scroll(function() {
			calcTop();
			calcOpacity();
		});
	});
}

function Parallax() {
	var objects = [];

	this.add = function(object) {
		objects.push(object);
	}

	this.scroll = function() {
		for (var i = 0; i < objects.length; i++) {
			objects[i].scroll();
		}
	}
}

( function( $ )
{
	var Parallax = function()
	{
		var _ = this;

		_.opts = 
		{
			scrollData :
			{

			}

			opacityData :
			{
				
			}
		}

		_.init = function( el, opts )
		{
			_.el = el;
			_.opts.extends( opts );
		}
	}

	//
	// register as jQuery funtion
	//
	$.fn.parallax = function( el, opts )
	{
		var len = this.length;

		return this.each( function( index )
		{
			var me = $( this )
				key = "parralax" + ( len > 1 ? '-' + ++index : '' ),
				instance = ( new Parallax ).init( 
					me,
					opts 
				);

			me.data( 'key', key );
		} );
	}
}
)( jQuery );