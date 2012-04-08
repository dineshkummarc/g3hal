exports.routes = function(mpd) {

	var routes = {};

	routes.index = function(req, res) {
  		res.render('index', { title: 'G3 HAL' })
	};

	routes.mpd = require('./mpd').routes(mpd);
	
	return routes;
};
/*
 * GET home page.
 */