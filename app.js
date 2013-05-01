var http = require('http');
var express = require('express');

var app = express();
var server = http.createServer(app);
var sys = require('sys');

var FFI = require("node-ffi");
var libc = new FFI.Library(null, {
  "system": ["int32", ["string"]]
});

var run = libc.system;

var actions = {
  saySomething: function(){
    console.log('saying');
    run('say Hello Manc J S, how are you doing?');
  },
  volumeUp: function(){
    run('sudo osascript -e "set Volume 10"');
  },
  volumeMid: function(){
    run('sudo osascript -e "set Volume 4"');
  },
  mute: function(){
    run('sudo osascript -e "set Volume 0"');
  },
  prev: function(){
    run('sudo osascript -e \'tell application "iTunes"\' -e "previous track" -e "end tell"');
  },
  next: function(){
    run('sudo osascript -e \'tell application "iTunes"\' -e "next track" -e "end tell"');
  },
  play: function(){
    run('sudo osascript -e \'tell application "iTunes"\' -e "play" -e "end tell"');
  },
  pause: function(){
    run('sudo osascript -e \'tell application "iTunes"\' -e "pause" -e "end tell"');
  }
};

app.get('/remote_actions', function(req, res){
  var action = req.query["action"];
  console.log('got action: ' + action);

  if(actions[action]){
    actions[action]();
  } else {
    console.log('action: ' + action + ' does not exist');
  }
  res.send('ok');
});

var fs = require('fs');

app.get('/', function(req, res){
  var remoteLayout = null;
  //probably stupid way to serve static file
  fs.readFile('remote.html', function(err, data) {
      if(!err) {
          remoteLayout = data;
          res.setHeader('Content-Type', 'text/html');
          res.setHeader('Content-Length', remoteLayout.length);
          res.end(remoteLayout);
      } else {
        res.send('Error!');
      }
  });
});

server.listen(1234);
