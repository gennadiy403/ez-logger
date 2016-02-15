var fs = require('fs');
var Log = function(pre, level, file) {
  var self = this;
  self.pre = pre;
  self.level = level;
  self.file = file;
  var date = new Date();
  self.time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  self.dir = './log/';
  self.logging = function(msg, etc, logTemplate) {
    var self = this;
    var date = new Date();
    var month = parseInt(date.getMonth() + 1);
    var currentTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    var time = date.getDate() + '.' + month + ' - ' + currentTime;
    logTemplate = time + logTemplate;
    if (typeof msg == 'object' || typeof msg == 'array') {
      msg = '\n' + JSON.stringify(msg);
    } 
    if (etc) {
      if (typeof etc == 'object' || typeof etc == 'array') {
        etc = JSON.stringify(etc);
        msg = msg + '\n' + etc;
      } else {
        msg = msg + '\n' + etc
      }
    }
    fs.exists(self.dir, function(exists) {
      if (!exists) {
        fs.mkdir(self.dir);
      }
      fs.open(self.dir + self.pre.toLowerCase() + '.log', "a", 0664, function(err, file_handle) {
        if (!err) {
          fs.write(file_handle, logTemplate + msg + '\n', null, 'utf8', function(err) {
            if (err) console.log(err);
            fs.close(file_handle);
          });
        } else {
          return console.log(err);
        }
      });
    })
  };
  self.consoling = function(msg, etc, logTemplate) {
    var self = this;
    var date = new Date();
    var month = parseInt(date.getMonth() + 1);
    var currentTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    var time = date.getDate() + '.' + month + ' - ' + currentTime;
    logTemplate = time + logTemplate;
    if (self.file == true) {
      self.logging(msg, etc, logTemplate);
    } else {
      if (typeof msg == 'object' || typeof msg == 'array') {
        console.log(logTemplate);
        console.log(msg);
        console.log(etc ? etc : '');
      } else {
        console.log(logTemplate + msg);
        console.log(etc ? etc : '');
      }
    }
  }
};
Log.prototype.ok = function(msg, etc) {
  var self = this;
  var logTemplate = ' - [ ' + self.pre + ' | OK ] ';
  if (self.level > 2) {
    if (self.file == true) {
      self.logging(msg, etc, logTemplate);
    } else {
      self.consoling(msg, etc, logTemplate);
    }
  }
  
};
Log.prototype.err = function(msg, etc) {
  var self = this;
  var logTemplate = ' - [ ' + self.pre + ' | ERR ] ';
  if (self.level > 0) {
    if (self.file == true) {
      self.logging(msg, etc, logTemplate);
    } else {
      self.consoling(msg, etc, logTemplate);
    }
  }
};
Log.prototype.info = function(msg, etc) {
  var self = this;
  var logTemplate = ' - [ ' + self.pre + ' | INFO ] ';
  if (self.level > 2) {
    if (self.file == true) {
      self.logging(msg, etc, logTemplate);
    } else {
      self.consoling(msg, etc, logTemplate);
    }
  }
};
Log.prototype.warn = function(msg, etc) {
  var self = this;
  var logTemplate = ' - [ ' + self.pre + ' | WARN ] ';
  if (self.level > 1) {
    if (self.file == true) {
      self.logging(msg, etc, logTemplate);
    } else {
      self.consoling(msg, etc, logTemplate);
    }
  }
};
module.exports = Log;
