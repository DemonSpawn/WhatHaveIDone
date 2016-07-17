var express = require('express');
var app = express();
var fs = require('fs');
app.set('view engine','jade');

app.get('/send', function (req, res) {
    var activity = req.query['activityIn'];
    var date = new Date();
    console.log(activity);
    fs.appendFile('activity.txt',date.getTime() + ' : ' + activity + '\n',  function(err) {
   if (err) {
       return console.error(err);
   }});
    res.send('Done');
});

app.get('/', function(req,res) {
   res.sendFile('public/index.html', {root: __dirname});
});

app.listen(8081, function () {
  console.log('Example app listening on port 8081!');
});