# jhs_require
**'jhs_require' is a method for inserting not compiled text/code into the JHS script**
## Example
Suppose you have the following JHS script:
```smarty
<?jhs
var title ='List of fruits';
jhs_require './fruits.txt'
?>
<!DOCTYPE html> 
<head></head>
<body>
</body>
<h1><li><?jhs echo(title) ?></h1>
<ul>
<li><?jhs echo(a) ?></li>
<li><?jhs echo(b) ?></li>
</ul>
</html>
```
the result, once it is parsed, would be 
```html
<!DOCTYPE html> 
<head></head>
<body>
</body>
<h1>List of fruits</h1>
<ul>
<li>oranges</li>
<li>apples</li>
</ul>
</html>
```
because it is assumed there exists a file called 'fruits.txt'
in the same path of the JHS script, and its content is:
```javascript 
var a = 'oranges';
var b = 'apples';
```
There are lots of differences between the NODE.js require function and the method jhs_require.
Firstly, the content in the file called by jhs_require doesn't need to be javascript code.
jhs_require always inserts the content of the specified file, literally. So method jhs_require 
is actually a replacemnet. It replaces the statement jhs_require './path_to/file-1.raw' with the content of 
'file-1.raw'. 
