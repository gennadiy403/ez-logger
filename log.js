var fs = require('fs');
var Log = function(pre, level, file, date, time, maxSize) {
  var self = this;
  self.maxSize = maxSize;
  self.pre = pre;
  self.level = level;
  self.file = file;
  self.time = time;
  self.date = date;
  self.dir = './log/';
  self.logging = function(msg, etc, logTemplateFile) {
    var self = this;
    self.generateLogTemplate(logTemplateFile, function(logTemplate) {
      if (typeof msg == 'object' || typeof msg == 'array') {
        msg = '\n' + JSON.stringify(msg);
      }
      if (etc) {
        if (typeof etc == 'object' || typeof etc == 'array') {
          etc = JSON.stringify(etc);
          msg = msg + '\n' + etc;
        } else {
          msg = msg + '\n' + etc;
        }
      }
      fs.exists(self.dir, function(exists) {
        var myPre = self.pre.toLowerCase();
        var re = new RegExp(myPre + '[0-9]*\.log', 'gim');
        var matchFiles = [];
        var currentLogFile = myPre + '.log';
        if (!exists) {
          fs.mkdir(self.dir);
        }
        
        fs.readdir(self.dir, function(err, files) {
          if (err) console.log(err);
          for (var i = 0; i < files.length; i++) {
            if (files[i].match(re)) {
              matchFiles.push(files[i]);
            } 
          }
          if (matchFiles.length) {
            currentLogFile = matchFiles[matchFiles.length-1];
            self.checkSize(currentLogFile, myPre, function(currentLogFile) {
              self.writeLog(currentLogFile, logTemplate, msg, function() {
              });
            });
          } else {
            self.writeLog(currentLogFile, logTemplate, msg, function() {
            });
          }
          /*fs.stat(self.dir + currentLogFile, function(err, stats) {
            if (err) console.log(err);
            console.log('=>>> See');
            console.log('>' + stats.size);
//Todo: if file id big - create new file to logging 
            var numLogFile;
            if (parseInt(stats.size) >= 500) {
              console.log('>>>>>>>>>>>>>> big file');
              numLogFile = currentLogFile.split(myPre)[1];
           fs.stat(self.dir + currentLogFile, function(err, stats) {
            console.log('=>>> See');
            console.log('>' + stats.size);
            if (err) return;
//Todo: if file id big - create new file to logging 
            var numLogFile;
            if (parseInt(stats.size) >= 500) {
              console.log('>>>>>>>>>>>>>> big file');
              numLogFile = currentLogFile.split(myPre)[1];
              numLogFile = numLogFile.split('.log');
              var newNumLogFile = Number(numLogFile[0]);
              newNumLogFile = newNumLogFile+1;
              currentLogFile = myPre + newNumLogFile +'.log';
              console.log('currentLogFile ' +currentLogFile);
            }
          });*/
              /*numLogFile = numLogFile.split('.log');
              var newNumLogFile = Number(numLogFile[0]);
              newNumLogFile = newNumLogFile+1;
              currentLogFile = myPre + newNumLogFile +'.log';
              console.log('currentLogFile ' +currentLogFile);
              }
            });
            self.writeLog(currentLogFile,logTemplate,msg, function(){
              console.log('Запись завершена в файл ' + currentLogFile);
            });
          fs.stat(self.dir + currentLogFile, function(err, stats) {
            console.log('=>>> See');
            console.log('>' + stats.size);
            if (err) return;
//Todo: if file id big - create new file to logging 
            var numLogFile;
            if (parseInt(stats.size) >= 500) {
              console.log('>>>>>>>>>>>>>> big file');
              numLogFile = currentLogFile.split(myPre)[1];
              numLogFile = numLogFile.split('.log');
              var newNumLogFile = Number(numLogFile[0]);
              newNumLogFile = newNumLogFile + 1;
              currentLogFile = myPre + newNumLogFile +'.log';
              console.log('currentLogFile ' + currentLogFile);
            }
          });*/
        });
      })
    })
  };
  self.checkSize = function(currentLogFile, myPre, cb) {
    fs.stat(self.dir + currentLogFile, function(err, stats) {
      if (err) return;
      var numLogFile;
      if (parseInt(stats.size) >= self.maxSize) {
        numLogFile = currentLogFile.split(myPre)[1].split('.log');
        var newNumLogFile = Number(numLogFile[0]);
        newNumLogFile = newNumLogFile + 1;
        currentLogFile = myPre + newNumLogFile +'.log';
        return cb(currentLogFile);
      }
      return cb(currentLogFile);
    });
  };
  self.writeLog = function(currentLogFile, logTemplate, msg, cb) {
    fs.open(self.dir + currentLogFile, "a", 0664, function(err, file_handle) {
      if (!err) {
        fs.write(file_handle, logTemplate + msg + '\n', null, 'utf8', function(err) {
          if (err) cb(err);
          fs.close(file_handle);
          return cb();
        });
      } else {
        return cb(err);
      }
    });
  };
  self.consoling = function(msg, etc, logTemplate) {
    var self = this;
    self.generateLogTemplate(logTemplate, function(logTemplate) {
      if (typeof msg == 'object' || typeof msg == 'array') {
        console.log(logTemplate);
        console.log(msg);
        if (etc) console.log(etc);
      } else {
        console.log(logTemplate + msg);
        if (etc) console.log(etc);
      }
    });
  };
  self.generateLogTemplate = function(logTemplate, cb) {
    var self = this;
    var date = new Date();
    var currentDate = date.getDate() + '.' + parseInt(date.getMonth()) + 1 + ' - ';
    var currentTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' - ';
    if (self.date == true || self.time == true) {
      if (self.date == false) {
        logTemplate = currentTime + logTemplate;
        return cb(logTemplate);
      } else if (self.time == false) {
        logTemplate = currentDate + logTemplate;
        return cb(logTemplate);
      } else {
        logTemplate = currentDate + currentTime + logTemplate;
        return cb(logTemplate);
      }
    }
  }
};
Log.prototype.ok = function(msg, etc) {
  var self = this;
  var logTemplate = '\x1b[32;1m[ ' + self.pre + ' | OK ]\x1b[0m ';
  var logTemplateFile = '[ ' + self.pre + ' | OK ] ';
  if (self.level > 2) {
    if (self.file == true) {
      self.logging(msg, etc, logTemplateFile);
    } else {
      self.consoling(msg, etc, logTemplate);
    }
  }

};
Log.prototype.err = function(msg, etc) {
  var self = this;
  var logTemplate = '\x1b[31;1m[ ' + self.pre + ' | ERR ]\x1b[0m ';
  var logTemplateFile = '[ ' + self.pre + ' | ERR ] ';
  if (self.level > 0) {
    if (self.file == true) {
      self.logging(msg, etc, logTemplateFile);
    } else {
      self.consoling(msg, etc, logTemplate);
    }
  }
};
Log.prototype.info = function(msg, etc) {
  var self = this;
  var logTemplate = '\x1b[1m[ ' + self.pre + ' | INFO ]\x1b[0m ';
  var logTemplateFile = '[ ' + self.pre + ' | INFO ] ';
  if (self.level > 2) {
    if (self.file == true) {
      self.logging(msg, etc, logTemplateFile);
    } else {
      self.consoling(msg, etc, logTemplate);
    }
  }
};
Log.prototype.warn = function(msg, etc) {
  var self = this;
  var logTemplate = '\x1b[33;1m[ ' + self.pre + ' | WARN ]\x1b[0m ';
  var logTemplateFile = '[ ' + self.pre + ' | WARN ] ';
  if (self.level > 1) {
    if (self.file == true) {
      self.logging(msg, etc, logTemplateFile);
    } else {
      self.consoling(msg, etc, logTemplate);
    }
  }
};
module.exports = Log;
