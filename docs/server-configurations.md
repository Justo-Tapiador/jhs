# Some server configurations

## A simple 1-level hierarchy Server:

```javascript
const path = require('path'),
       JHS = require('jhs').instance,
      http = require("http"),
        fs = require("fs"),
      host = 'http://localhost',
      port = process.env.PORT || "4000",
      home = host+':'+port+'/';
  
var  flags    = {home: '.', path:'/',querystring:''},
     execJHS  = new JHS(),
     options  = {home:home,root:"./wwwroot",method:'GET'},
     server   = http.createServer();

server.listen(port, ()=>{
      console.log(`\t\x1b[0m\x1b[92mListening to Requests\ton \x1b[0m\x1b[93m${home}\x1b[0m`);
});
server.on('request', function(request, response) {
        options.path = request.url;
        options.method = request.method;
        switch(options.method){
          case 'GET':
          var p = options.path.split('?')[0];
          var file = options.root+p;
              p = path.parse(p);
          if(p.ext == '.jhs'){
              execJHS.parseFile(file,false, options, function(jhsResult, err){  
                response.end(jhsResult);
              });     
          }else {
            try{
              response.end(fs.readFileSync(file));             
            }catch(e){
              file = options.root+'/index.jhs';
              execJHS.parseFile(file,false, options, function(jhsResult, err){  
                response.end(jhsResult);
              }); 
          }
        }
          break;
          default:
          break;
         }
  });
```

## A simple 2-level hierarchy Server:

```javascript
const path = require('path'),
       JHS = require('jhs').instance,
      http = require("http"),
        fs = require("fs"),
      host = 'http://localhost',
      port = process.env.PORT || "4000",
      home = host+':'+port+'/';
  
var  flags    = {home: '.', path:'/',querystring:''},
     execJHS_1  = new JHS({delimiters:['<?#1jhs','?#1>']}),
     execJHS_2  = new JHS(),
     options  = {home:home,root:"./wwwroot",method:'GET'},
     server   = http.createServer();

server.listen(port, ()=>{
      console.log(`\t\x1b[0m\x1b[92mListening to Requests\ton \x1b[0m\x1b[93m${home}\x1b[0m`);
});
server.on('request', function(request, response) {
        options.path = request.url;
        options.method = request.method;
        switch(options.method){
          case 'GET':
          var p = options.path.split('?')[0];
          var file = options.root+p;
              p = path.parse(p);
          if(p.ext == '.jhs'){
              execJHS_1.parseFile(file,false, options, function(jhsResult_1, err){  
                execJHS_2.parseFile(jhsResult_1,true, options, function(jhsResult_2, err){  
                response.end(jhsResult_2);
              }); });     
          }else {
            try{
              response.end(fs.readFileSync(file));             
            }catch(e){
              execJHS_1.parseFile(file,false, options, function(jhsResult_1, err){  
                execJHS_2.parseFile(jhsResult_1,true, options, function(jhsResult_2, err){  
                response.end(jhsResult_2);
              }); });   
          }
        }
          break;
          default:
          break;
         }
  });
```

