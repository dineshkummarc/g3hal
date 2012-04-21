exports.routes = function(mpd) {

	var routes = {};

	function doMPDCmd(cmd, req, res) {
		mpd.socket.setTimeout(60000, function() {
			res.send(408);
			console.log('MPD: timed out');
			onMPDFail();
		});
		mpd.send(cmd, function(r) {
			try { 
				res.json(r, r._OK ? 200 : 400); 
			} catch (e) {
				
			}
			mpd.socket.setTimeout(0);
		});
	}

	routes.stop = function(req, res) {
		doMPDCmd('stop', req, res);
	};

	routes.play = function(req, res) {
		doMPDCmd('play', req, res);
	};

	routes.status = function(req, res) {
		doMPDCmd('status', req, res);
	};

	routes.currentsong = function(req, res) {
		doMPDCmd('currentsong', req, res);
	};

	routes.update = function(req, res) {
		doMPDCmd('update', req, res);
	};

	return routes;

};