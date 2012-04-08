exports.routes = function(mpd) {

	var routes = {};

	routes.stop = function(req, res) {
		mpd.send('stop', function(r) {
			res.json(r, r._OK ? 200 : 400);
		});
	};

	routes.play = function(req, res) {
		mpd.send('play', function(r) {
			res.json(r, r._OK ? 200 : 400);
		});
	};

	routes.status = function(req, res) {
		mpd.send('status', function(r) {
			res.json(r, r._OK ? 200 : 400);
		});
	};

	routes.currentsong = function(req, res) {
		mpd.send('currentsong', function(r) {
			res.json(r, r._OK ? 200 : 400);
		});
	};

	routes.update = function(req, res) {
		mpd.send('update', function(r) {
			res.json(r, r._OK ? 200 : 400);
		});
	};

	return routes;

};