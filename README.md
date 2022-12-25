# JHS

**This is a fast and pure NODE.js server-side javascript module,  and a simple tool for making dynamic and interactive Web pages.**

## Principles

JHS code is just pure javascript code, processed on a NODE.js web server by a JHS interpreter implemented as a NODE.js module. On a web server, the result of the interpreted and executed JHS code – which may be any type of data, such as generated HTML or binary image data – would form the whole or part of an HTTP response.

## Get Started

```sh
npm install jhs
```

## Documentation
The complete docs are hosted here: [JHS Documentation](docs/) 

## Example

The simplest use of this middleware module involves two parts:
         
     1. Write a webpage file with your favorite text editor, and name it with extension '.jhs'. 
        Save it to your web server root directory (or any other folder inside the root).
        Use code delimiters <?jhs and ?> to insert javascript code into de html code (this code will be 
        executed in the server side, not in the client side). As you already know, code delimiters 
        <script> </script> are html tags where you can insert javascript code that will be executed 
        in the client side). There is a JHS 'echo' function which is similar to the PHP echo function. 
        Here it is a simple 'HELLO WORLD' page example, written with JHS [you may call it 'hello-world.jhs']:

        <?jhs 
            var str  = 'Hello world!';
            var date = new Date();
        ?>
        <!DOCTYPE html> 
        <html>
         <head>
            <meta charset="utf-8">
        </head>
        <body>
            <div style="text-align:center;">
                <h1><?jhs echo(str) ?></h1>
                <h2>Today is:</h2> <h3><?jhs echo(date.toString()) ?></h3>
            </div>
        </body>
        </html>

        2.  In your NODE.js server script, the JHS module must be required, instanciated and called, 
            like any other middleware engine:
            ...
            const   JHS  = require('jhs'),
                    options = {root:"./wwwroot"},
                    parse_options = {},
                    file = options.root+'\\hello-world.jhs',
                    notfilepath = false,
                    execJHS = new JHS(options);
            ...
        /*  Call execJHS.parseFile async function, in your server request event listener */

            server.on('request', function(request, response){
            ...
            /*  when a request for the 'hello-world.jhs' file is received, 
                you use the middleware JHS engine for the response 
            */
                execJHS.parseFile(file, notfilepath, parse_options, function(jhsResult, err){  
                    response.end(jhsResult);
                }); 
            ...
    });






## Security

We're using JHS in production, as are many others, but please use common sense when doing anything related to finances! We take no responsibility for your implementation decisions.
If you find a security issue, please email me,  justo.tapiador@gmail.com.

## Contributing

## License
Code released under the MIT license.

Copyright (c) 2022 Justo Tapiador García
