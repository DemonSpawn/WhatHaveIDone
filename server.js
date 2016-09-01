var optimist = require('optimist')
		.options('o', {
			alias : 'output',
			default : 'activity.txt',
			describe : 'path to the output log file'
		})
		.string('o')
		.options('p', {
			alias : 'port',
			default : '8081',
			describe : 'server port'
		})
		.options('f', {
			alias : 'frequent',
			default : 'frequent.txt',
			describe : 'a list of activities done most frequently, every line a single one. This file will be read again for every request.'
		})
		.options('h', {
			describe : 'Display this message',
			alias : 'help'
		});

var argv = optimist.argv;
if (argv.help) {
	optimist.showHelp();
	process.exit(0);
}
var outputPath = argv.o;
var frequentPath = argv.f;

var fs = require('fs');
fs.access(outputPath, fs.R_OK | fs.W_OK, function(err) {
	if (err) {
		var tmp = new Date();
		fs.appendFile(outputPath, pad(tmp.getFullYear()) + '-' + pad(tmp.getMonth()+1) + '-' + pad(tmp.getDate()) + ' ' + 
								  pad(tmp.getHours()) + ':' + pad(tmp.getMinutes()) + ' : start\n', function(err) {
			if (err) {
				console.error('file ' + outputPath + ' not writable.');
				process.exit(1);
			} else {
				console.log('initialized new activities file ' + outputPath);
			}
		});
	} else {
		console.log('writing activities into ' + outputPath);
	}
});

var port = argv.port;
if (port > 65535 || port < 0) {
	console.error('not a valid port');
	process.exit(2);
}

var express = require('express');
var app = express();

//public serves as static file dir
app.use(express.static('public'));
app.set('view engine','jade');

app.get('/send', function (req, res) {
    var activity = req.query['activityIn'];
    var time = req.query['timeIn'];
    var date = req.query['dateIn'];
    var dateString = '';
   
    if (time === '' || typeof time == 'undefined') {
        var tmp = new Date();
        time = pad(tmp.getHours()) + ':' + pad(tmp.getMinutes());
    }

	if (date === '' || typeof date == 'undefined') {
		var tmp = new Date();
		date = tmp.getFullYear() + '-' + pad(tmp.getMonth()+1) + '-' + pad(tmp.getDate());
	}
    
    dateString = date + ' ' + time;
    
    fs.appendFile(outputPath, dateString + ' : ' + activity + '\n',  function(err) {
	    if (err) {
			res.send('{ "success": false, "message": "error. check log." }');
			return console.error(err);
		} else {
			var message = dateString + ' : ' + activity;
		    res.send('{ "success": true,  "message": "' + message + '" }');
			console.log('logged ' + message);
		}
	});
});

app.get('/', function(req,res) {
   res.sendFile('public/index.html', {root: __dirname});
});

app.get('/last', function(req, res) {
	fs.readFile(outputPath, function(err, data) {
		if (!err)  {
			var lines = data.toString().trim().split('\n');
			var lastLines = lines.slice(-1).reverse();			
			res.send(lastLines);
		}
	});
});

app.get('/frequent', function(req, res) {
	var amount = parseInt(req.query['amount']);
	if (isNaN(amount) || amount == 0) {
		amount = 6;
	}
	fs.readFile(frequentPath, function(err, data) {
		if (!err)  {
			var lines = data.toString().trim().split('\n');
			var lastActivities = lines.slice(0, amount);
			res.send(lastActivities);
		} else {
			res.send([]);
		}
	});
});

app.listen(port, function () {
  console.log('WhatHaveIDone server listening on port ' + port  + '!');
});

function pad(number) {
	return (number < 10) ? '0' + number : number;
}
