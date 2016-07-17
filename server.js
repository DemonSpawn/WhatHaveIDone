var optimist = require('optimist')
		.usage('Usage: $0 -o <output file>')
		.options('o', {
			alias : 'output',
			default : 'activity.csv',
			describe : 'path to the output log file'
		})
		.string('o')
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

var fs = require('fs');
fs.access(outputPath, fs.W_OK, function(err) {
	if (err) {
		console.error('file ' + outputPath + ' not writable.');
		process.exit(1);
	}
});

var express = require('express');
var app = express();
app.set('view engine','jade');

console.log('writing output to ' + outputPath);

app.get('/send', function (req, res) {
    var activity = req.query['activityIn'];
    var date = new Date();
    console.log(date.getTime() + ': ' + activity);
    fs.appendFile(outputPath,date.getTime() + ',"' + activity + '"\n',  function(err) {
    if (err) {
       return console.error(err);
    }});
    res.send('Done');
});

app.get('/', function(req,res) {
   res.sendFile('public/index.html', {root: __dirname});
});

app.listen(8081, function () {
  console.log('Day Tracker app listening on port 8081!');
});
