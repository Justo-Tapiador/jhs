# Examples
## JHS scripts
**Some examples of usage of the JHS module**
* [A hello world! page 🢡 1-level configuration](simple-server/wwwroot/hello-world.jhs) `hello-world.jhs`
* [Parsing query strings 🢡 2-level configuration](simple-server/wwwroot/unicode-ducklings.jhs) `unicode-ducklings.jhs`
* [A hello world! page 🢡 2-level configuration](simple-server/wwwroot/multilevel-hierarchy.jhs) `multilevel-hierarchy.jhs`
* [Load templates 🢡 1-level configuration](simple-server/wwwroot/dmca.jhs) `dmca.jhs`
* [The start page itself 🢡 1-level configuration](simple-server/wwwroot/index.jhs) `index.jhs`

## Test / Watch 
In order to test/watch all these examples, run simple-server.js from command line in the path `node_modules\jhs\examples\simple-server`:
```sh
node simple-server
```
also, you can test them, putting into listening these two example servers:
```sh
node 2-level-server
```
```sh
node 2-level-instantiator-server
```
and then visit
* http://localhost:4000  in your browser, in order to test `simple-server.js`, or visit secure
* https://localhost:4000 , in order to test `2-level-server.js` or `2-level-instantiator-server.js`
