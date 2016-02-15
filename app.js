var fs = require('fs');
var Log = require('./log');
var settings = require('./settings');
var log = new Log('MJR-SERVER', settings.logLevel, settings.file, settings.date, settings.time);
var obj = {object: 'asd', wer: 123};

//var obj = [{object: 'asd'}, {wer: 123}];
//var obj = 'object';
var etc = {etc: 'asd', wer: 123};
//var etc = [{etc: 'asd'}, {wer: 123}];
//var etc = 'etc';
log.err('123123', {qwe:'werwer', ert : 123});

