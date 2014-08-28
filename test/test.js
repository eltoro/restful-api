var superagent = require('superagent');
var chai = require('chai');
var expect = chai.expect;

var api = superagent('http://localhost:18881');

describe('test restful api', function(){
  var fileid;
  
  it('post file object', function(done){
    superagent.post('http://localhost:18881/files')
    .send({name: 'test', extension: 'xml'})
    .set('x-api-key', '0000000000')
    .set('Content-Type', 'application/json')
    .end(function(err,res){
      expect(err).to.eql(null);
      fileid = res.body.id;
      done();
    })    
  });
  
  it('get name and extension', function(done){
    superagent.get('http://localhost:18881/files/'+fileid)
    .set('x-api-key', '0000000000')
    .end(function(err,res){
      expect(err).to.eql(null);
      expect(res.body._id).to.eql(fileid)
      done();
    })    
  });
  
  it('put file content', function(done){
    superagent.put('http://localhost:18881/files/'+fileid+'/data')
    .set('x-api-key', '0000000000')
    .send({content: 'this is a test ok'})
    .end(function(err,res){
      expect(err).to.eql(null);
      done();
    })    
  });
  
  it('get file', function(done){
    superagent.get('http://localhost:18881/files/'+fileid+'/data')
    .set('x-api-key', '0000000000')
    .end(function(err,res){
      expect(err).to.eql(null);
      done();
    })    
  });
  
});
