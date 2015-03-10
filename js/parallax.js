function viewport() {
    var e = window, a = 'inner';
    if (!('innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
}

function ParallaxObject(element, scrollData, opacityData) {
	var element = element,

	// store input scroll data for later use
	scrollDataInitTop = scrollData['init'],
	scrollDataStepRange = scrollData['range'],
	scrollDataStepValue = scrollData['value'],
	// processed data
	scrollInitTop = evaluateData(scrollDataInitTop),
	scrollStepRange = evaluateData(scrollDataStepRange),
	scrollStepValue = evaluateData(scrollDataStepValue),
	scrollRatio = calcRatio(scrollStepRange, scrollStepValue),

	// store input opacity data for later use
	opacityDataInit = opacityData['init'],
	opacityDataEnd = opacityData['end'],
	opacityDataStepRange = opacityData['range'],
	opacityDataStepValue = opacityData['value'],
	// processed data
	opacityInit = opacityDataInit,
	opacityEnd = opacityDataEnd,
	opacityDiff = opacityInit - opacityEnd,
	opacityStepRange = evaluateData(opacityDataStepRange),
	opacityStepValue = evaluateData(opacityDataStepValue),
	opacityRatio = calcRatio(opacityStepRange, opacityStepValue);	

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
		var newTop = scrollInitTop + getScrollTop() * scrollRatio;
		element.css({top: newTop + "px"});
	}

	function calcOpacity() {
		var scrollPos = getScrollTop() - scrollInitTop;
		if(scrollPos >= 0) {
			var factor =  (scrollPos / opacityStepRange) * opacityRatio;
			var newOpacity = (opacityInit - (factor * opacityDiff));
			element.css({opacity: newOpacity});		
		}
		else {
			element.css({opacity: opacityInit});
		}
	}

	$(function() {
		calcTop();
		calcOpacity();
		
		$(window).resize(function() {
			scrollInitTop = evaluateData(scrollDataInitTop);
			scrollStepRange = evaluateData(scrollDataStepRange);
			scrollStepValue = evaluateData(scrollDataStepValue);
			opacityStepRange = evaluateData(opacityDataStepRange);
			opacityStepValue = evaluateData(opacityDataStepValue);
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