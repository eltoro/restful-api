var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var mime = require('mime');
var Nedb = require('nedb')

var Datastore = require('nedb')
  , db = new Datastore({ filename: 'fileobjects', autoload: true });
  
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: false }))

/**
 *  @body {String} name
 *  @body {String} extension
 *  @return {String} id
 */
app.post('/files', hasAPIKey, function(req, res, next) {
  var name = req.body.name;
  var extension = req.body.extension;
  var newFile = {
    name: name,
    extension: extension
  }
  //save fileId
  db.insert(newFile, function (err, newDoc) {
    if (err) return next(err);
    res.send({id:newFile._id});
  });
});

/**
 *  @param {String} fileid
 *  @return {String} file details
 */
app.get('/files/:fileid', hasAPIKey, function(req, res, next) {
  var fileid  = req.params.fileid;
  db.findOne({_id: fileid}, function (err, file) {
    if (err) return next(err);
    res.contentType('application/json');
    res.send(file);
  });
});

/**
 *  @param {String} fileid
 *  @body {String} content
 *  @return {String} result
 */
app.put('/files/:fileid/data', hasAPIKey, function(req, res, next) {
  var fileid  = req.params.fileid;
  var content = req.body.content;
  var fileToWrite;
  var filePath = __dirname + '/data/';
  db.findOne({_id: fileid}, function (err, file) {
    if (err) return next(err);
    fileToWrite = filePath+file.name+'.'+file.extension;
    fs.writeFile(fileToWrite, content, function (err) {
      if (err) return next(err);
      res.contentType('application/json');
      res.send({msg:'success'});
    });
  });
});

/**
 *  @param {String} fileid
 *  @return file
 */
app.get('/files/:fileid/data', hasAPIKey, function(req, res, next) {
  var fileid  = req.params.fileid;
  var filePath = __dirname + '/data/';
  var fileToRead;
  db.findOne({_id: fileid}, function (err, file) {
    if (err) return next(err);
    fileToRead = filePath+file.name+'.'+file.extension;
    fs.stat(fileToRead);
    fs.readFile(fileToRead, {encoding: 'utf-8'}, function(err, file){
      if (err) return next(err);
      res.contentType(mime.lookup(fileToRead));
      res.send({file:file});
    });
  });
});

//check that api key exists
function hasAPIKey(req, res, next) {
  if (req.headers['x-api-key']) {
    return next();
  }
  res.send(404);
}

app.listen(18881);