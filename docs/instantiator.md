# The JHS Instantiator
## A built-in instantiator and configurator 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;It arranges the new intances in a standardized and controlled hierarchical mode.

## Examples 
### A 3-level hierarchy Server:

```javascript
const path = require('path'),
       JHS = require('jhs').instantiator,
      http = require("http"),
        fs = require("fs"),
      host = 'http://localhost',
      port = process.env.PORT || "4000",
      home = host+':'+port+'/';
  
var  flags    = {home: '.', path:'/',querystring:''},
     execJHS  = new JHS({levels:3}),
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
              execJHS.parse(file,false, options, function(jhsResult, err){  
                response.end(jhsResult);
              });     
          }else {
            try{
              response.end(fs.readFileSync(file));             
            }catch(e){
              execJHS.parse(file,false, options, function(jhsResult, err){  
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
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;As you can see, there is only one asynchronous function (the **execJHS.parse** function), not the hierarchical nested ones, because the **instantiator** nests them for you. A difference between the JHS members **intance** and **instantiator** is the name of the parser function. For the member **instance** that function is called **parseFile**, whereas for **instantiator** it is just **parse** . Another remarkable difference between both members is that in **instantiator** you can't directly define delimiters for the new instances, because they are private members.

### Some Auxiliary Functions

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You can tell a specific JHS instance to ban cetain modules by means this instantiator function:
```javascript 
execJHS.banModules(3,['attila','bitcore-lib']);
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;In this case your are banning modules 'attila' and 'bitcore-lib' in the level #3 instance. That means those two libraries can't be required  by any 
JHS page where #3 level namespace is being used. For instance: if you arrange the following JHS page, after you have banned those modules, 
```javascript 
<?#3jhs
var a = require('attila');
var b = require('bitcore-lib');
<?#3jhs
?>
<html><head</head><body>
hello world!
</body><html>
</html>
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;It would throw an error, because those two libraries are not allowed to be required in level #3 namespace, but they could be successfully required in other levels
