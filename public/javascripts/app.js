$(function() {
	function throttle(func, wait) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			if (!timeout) {
				// the first time the event fires, we setup a timer, which 
				// is used as a guard to block subsequent calls; once the 
				// timer's handler fires, we reset it and create a new one
				timeout = setTimeout(function() {
					timeout = null;
					func.apply(context, args);
				}, wait);
			}
		}
	}

	var error_timer = null;
	function showErrors(error) {
		clearTimeout(error_timer);
		var error_alert = $('#controls .alert');
		if(error_alert.length > 0) {
			error_alert.text(error);
		} else {
			$('#controls').append('<div class="alert alert-error">' + error + '</div>');
		}
		error_timer = setTimeout(function() {
			$('#controls .alert').fadeOut('slow', function() {
				$(this).remove();
			});
		}, 2000);
	}

	var last_song_id;
	var updateSongInfo = throttle(function() {
		$.getJSON('/mpd/status')
		.success(function(data) {
			if(data && data._OK) {
				if(data.state === 'stop') {
					$('#state').text('Stopped');
					$('#stop').addClass('disabled');
					$('#play').removeClass('disabled');
				}

				if(data.state === 'pause') {
					$('#stop').removeClass('disabled');
					$('#play').removeClass('disabled');
					$('#state').text('Paused');
				}

				if(data.updating_db) {
					$('#update').addClass('disabled');
					$('#update').button('loading');
				} else {
					$('#update').removeClass('disabled');
					$('#update').button('reset');
				}

				var song_length = data.time.split(':')[1],
					progress = Math.round((data.elapsed / song_length) * 100);
				if(progress > 100) progress = 100;

				$('#progress .bar').css({ width: progress + '%' });

				if(data.state === 'play') {
					$('#play').addClass('disabled');
					$('#stop').removeClass('disabled');
					$('#state').text('Playing');
				}

				if(data.state === 'play' || data.state === 'pause' && data.songid !== last_song_id) {
					last_song_id = data.songid;
					$.getJSON('/mpd/currentsong')
					.success(function(data) {
						if(data._OK) {
							$('#song').text(data.Title + ' by ' + data.Artist);
						}
					})
					.fail(function(a,b,error) {
						showErrors('Something went wrong trying to get the latest status from the server');
					});
				}

				if(data.error) {
					showErrors('MPD ERROR: ' + data.error);
				}
			}
		})
		.fail(function(a,b,error) {
			showErrors('Something went wrong trying to get the latest status from the server');
		})
		.always(function() {
			updateSongInfo();
		});
	}, 10000);

	$('#play').click(function(e) {
		var btn = $(e.target);
		if(btn.hasClass('disabled')) return;
		btn.button('loading');
		$.post('/mpd/play', function() {
			updateSongInfo();
		})
		.fail(function() {
			showErrors('Something went wrong trying to send the play request to the server');
		})
		.always(function() {
			btn.button('reset');
		});
	});

	$('#stop').click(function(e) {
		var btn = $(e.target);
		if(btn.hasClass('disabled')) return;
		btn.button('loading');
		$.post('/mpd/stop', function() {
			updateSongInfo();
		})
		.fail(function() {
			showErrors('Something went wrong trying to send the stop request to the server');
		})
		.always(function() {
			btn.button('reset');
		});
	});

	$('#update').click(function(e) {
		var btn = $(e.target);
		if(btn.hasClass('disabled')) return;
		btn.button('loading');
		$.post('/mpd/update', function() {
			updateSongInfo();
		})
		.fail(function(a,b,error) {
			showErrors('Something went wrong trying to send the update request to the server');
			btn.button('reset');
		});
	});

	if($('#play').length > 0) {
		updateSongInfo();
		setTimeout(updateSongInfo, 10000);
	}

})