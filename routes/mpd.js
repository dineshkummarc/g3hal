exports.routes = function(mpd) {

	var routes = {};

	routes.stop = function(req, res) {
		mpd.socket.setTimeout(60000, function() {
			res.send(408);
			console.log('MPD: timed out');
			onMPDFail();
		});
		mpd.send('stop', function(r) {
			if(!res._headerSent) res.json(r, r._OK ? 200 : 400);
			mpd.socket.setTimeout(0);
		});
	};

	routes.play = function(req, res) {
		mpd.socket.setTimeout(60000, function() {
			res.send(408);
			console.log('MPD: timed out');
			onMPDFail();
		});
		mpd.send('play', function(r) {
			if(!res._headerSent) res.json(r, r._OK ? 200 : 400);
			mpd.socket.setTimeout(0);
		});
	};

	routes.status = function(req, res) {
		mpd.socket.setTimeout(60000, function() {
			res.send(408);
			console.log('MPD: timed out');
			onMPDFail();
		});
		mpd.send('status', function(r) {
			if(!res._headerSent) res.json(r, r._OK ? 200 : 400);
			mpd.socket.setTimeout(0);
		});
	};

	routes.currentsong = function(req, res) {
		mpd.socket.setTimeout(60000, function() {
			res.send(408);
			console.log('MPD: timed out');
			onMPDFail();
		});
		mpd.send('currentsong', function(r) {
			if(!res._headerSent) res.json(r, r._OK ? 200 : 400);
			mpd.socket.setTimeout(0);
		});
	};

	routes.update = function(req, res) {
		mpd.socket.setTimeout(60000, function() {
			res.send(408);
			console.log('MPD: timed out');
			onMPDFail();
		});
		mpd.send('update', function(r) {
			if(!res._headerSent) res.json(r, r._OK ? 200 : 400);
			mpd.socket.setTimeout(0);
		});
	};

	return routes;

};