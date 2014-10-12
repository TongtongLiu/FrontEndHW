function PicturesSlide() {
	var pictureWidth = 1000;
	var pictureNum = 7;
	var current = parseInt(localStorage['current_picture']) || 0;
	var interval = 5000;
	var autoplay;

	$('#pictures-view').css('width', pictureWidth * pictureNum + 'px');

	function setCurrent(index) {
		var pic = $('#pictures-view div');
		var txt = $('#pictures-text div');
		current = index;
		localStorage['current_picture'] = current + '';
		for (i = 0; i < pictureNum; i++) {
			if (i < current) {
				$(pic[i]).css({
					'transform': 'translateX(-' + pictureWidth * (i + 1) + 'px)',
					'-webkit-transform': 'translateX(-' + pictureWidth * (i + 1) + 'px)',
					'-moz-transform': 'translateX(-' + pictureWidth * (i + 1) + 'px)',
					'-o-transform': 'translateX(-' + pictureWidth * (i + 1) + 'px)',
					'-ms-transform': 'translateX(-' + pictureWidth * (i + 1) + 'px)'
				});
			}
			else if (i == current) {
				$(pic[i]).css({
					'transform': 'translateX(-' + pictureWidth * i + 'px)',
					'-webkit-transform': 'translateX(-' + pictureWidth * i + 'px)',
					'-moz-transform': 'translateX(-' + pictureWidth * i + 'px)',
					'-o-transform': 'translateX(-' + pictureWidth * i + 'px)',
					'-ms-transform': 'translateX(-' + pictureWidth * i + 'px)'
				});
			}
			else {
				$(pic[i]).css({
					'transform': 'translateX(-' + pictureWidth * (i - 1) + 'px)',
					'-webkit-transform': 'translateX(-' + pictureWidth * (i - 1) + 'px)',
					'-moz-transform': 'translateX(-' + pictureWidth * (i - 1) + 'px)',
					'-o-transform': 'translateX(-' + pictureWidth * (i - 1) + 'px)',
					'-ms-transform': 'translateX(-' + pictureWidth * (i - 1) + 'px)'
				});
			}
		}
	}

	setCurrent(current);
	autoplay = setInterval(function() {
		$('#slide-right a').trigger('click');
	}, interval);

	$('#slide-left a').click(function(event) {
		event.preventDefault();
		clearInterval(autoplay);

		if (current == 0) {
			setCurrent(pictureNum - 1);
		}
		else {
			setCurrent(current - 1);
		}

		autoplay = setInterval(function() {
			$('#slide-right a').trigger('click');
		}, interval);
	});
	$('#slide-right a').click(function(event) {
		event.preventDefault();
		clearInterval(autoplay);

		if (current == pictureNum - 1) {
			setCurrent(0);
		}
		else {
			setCurrent(current + 1);
		}

		autoplay = setInterval(function() {
			$('#slide-right a').trigger('click');
		}, interval);
	});

	$('#pictures-view').mouseover(function(event) {
		$('#pictures-view div p').css('font-size', '120%');
	});
	$('#pictures-view').mouseout(function(event) {
		$('#pictures-view div p').css('font-size', '100%');
	});
}

PicturesSlide();
  