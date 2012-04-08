var fs = require('fs'),
    config = JSON.parse(fs.readFileSync('./config.json', 'utf8')),
    crypto = require('crypto');

console.log(new Buffer(crypto.createHash('sha1').update(process.argv[2] + config.session_key).digest()).toString('base64'));
