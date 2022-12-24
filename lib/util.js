'use strict';
var path =require('path');
var fs =require('fs');
var crypto = require('crypto');
const OUTPUT = 1;
const INPUT = 0;

function WM_Encrypt(buffer, mode){
    if(buffer.length){
           var puntero = 0;
           var size = buffer.length;
            while(puntero < size/2)
                 {
                   Traspuesta(puntero,size-puntero-1,mode,buffer);
                   puntero++;   
                 }
   }
   
   return buffer;
}
function Traspuesta(i, j, modo, buffer){ 
var nparam1,nparam2;
nparam1 = buffer.readUInt8(i);
if(modo)nparam1 = nparam1 - 10;
else nparam1 = nparam1 + 10;
nparam1 = nparam1<0?256+nparam1:nparam1;
nparam1 = nparam1>0xff?nparam1-256:nparam1;
nparam2 = buffer.readUInt8(j);//flujofichero.charCodeAt(j);
if(modo)nparam2 = nparam2 - 10;
else nparam2 = nparam2 + 10;
nparam2 = nparam2<0?256+nparam2:nparam2;
nparam2 = nparam2>0xff?nparam2-256:nparam2;
buffer.writeUInt8(nparam2, i);
buffer.writeUInt8(nparam1, j);
}
function wm_encode(buffer){
return WM_Encrypt(buffer, OUTPUT);
}
function wm_decode(buffer){
return WM_Encrypt(buffer, INPUT);
}


function UUUID(){
	return crypto.randomBytes(32).toString('hex');
}
function RIFI(min, max) { // min and max included  random Int From Interval
  return Math.floor(Math.random() * (max - min + 1) + min)
}
function saveUploadImage(data, WebKit, user, users, response){
	        var filename ='';
	   	 		 
    		 	     var n = data.indexOf("0d0a0d0a", 0, "hex");
    		 	     var h = data.slice(0, n+4);
    		 	     var a = h.toString().split("\r\n");
    		 	     		 a = a.slice(1,a.length-2);    		 	     
    		 	     var e = a[1].split(':')[1].split('/')[1].replace('jpeg','jpg');   		 	     
    		 	     var d = data.slice(n+4);
    		 		    var tail = "\r\n"+WebKit+"--\r\n";
    		 		    d = d.slice(0,d.length-tail.length+1);
    		 		    if(user.extension !=null && user.extension != e)
    		 		    try{fs.unlinkSync('./wwwroot/images/profiles/'+user.hash+'.'+ user.extension);
    		 		    } catch(err) {console.error(err)};
    		 		    user.extension = e;
    		 		    fs.writeFileSync('./wwwroot/images/profiles/'+user.hash+'.'+ e, d);
    		 		    var filename ='./images/profiles/'+user.hash+'.'+ e;
    		 		    var saved = false;
    		 		    for(var i=0;i < users.length;i++){
	  						if(users[i].email==user.email){
	  							 users[i]['extension']= e;
	  							 		saved = true;
	  				 					break;												
	  							}
	  						}
	  						
	  						
	  						if(saved) fs.writeFileSync('./users.json',JSON.stringify(users,null,8));
	  						
    		 		    response.writeHead(200, {
							 			'Content-Type': 'text/html', 
							 			'Content-Encoding':'utf-8'
										 });
									var json = {
										prompt:'saved with success', path:filename};
				    		 response.end(JSON.stringify(json));
    		 	      
   					
}


function queryStringToJSON(qs) {
  try{
	if(!qs || !qs.length) return {};
	if(typeof location!='undefined')
    qs = qs || location.search.slice(1);
    var pairs = qs.split('&');
    var result = {};
    pairs.forEach(function(p) {
        var pair = p.split('=');
        var key = pair[0];
        var value = decodeURIComponent(pair[1] || '');
        if( result[key] ) {
            if( Object.prototype.toString.call( result[key] ) === '[object Array]' ) {
                result[key].push( value );
            } else {
                result[key] = [ result[key], value ];
            }
        } else {
            result[key] = value;
        }
    });
    return JSON.parse(JSON.stringify(result));
  }catch(e){return {};}
};

function fileExists(file){
	 var p = path.resolve(__dirname, file);
		try {
  			if (fs.existsSync(p)) return true;
			} 
			catch(err) {
  		
		}
		return false;
};

function BufferSplit(b, k){
	var size = b.length;
	if(k >= size) return b;
	var y = null;
	var result = [];
	var p = Math.floor(size/k);
	for(var i = 0;i<size-k;i+=k){
		y = b.slice(i,i+k);
		result.push(y);
	}
	if(size>p*k){
		y=b.slice(p*k,size)
		result.push(y);
	}
	return result;
}

function dateTime(){
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	return date+' '+time;
}

function dateTimeFormated(){
	
	const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

		var dateObj = new Date();
		var month = dateObj.getUTCMonth() + 1; //months from 1-12
		var day = dateObj.getUTCDate();
		var year = dateObj.getUTCFullYear();
		
		return {month:monthNames[dateObj.getMonth()],day:day,year:year};
		
}

class prettify{
	
	constructor() {
		/*
		//tokens
		BRACE
		BRACKET
		COLON
		COMMA
		STRING_KEY
		STRING_LITERAL
		NUMBER_LITERAL
		BOOLEAN_LITERAL
		NULL_LITERAL
		
		*/
	this.colorize = require('json-colorizer');
	}	


	JSON(json) {
	
	return this.colorize(json,  {
	pretty:true,
  colors: {
    STRING_KEY: 'green',
    STRING_LITERAL: 'yellow',//'yellow.bold',
    NUMBER_LITERAL: '#FF0000',
    BOOLEAN_LITERAL:'gray',
    NULL_LITERAL:'blue',
  	}
		});
	}
}

const delay = ms => new Promise(res => setTimeout(res, ms));
const sequentialPrint = async (str, ms,pretty) => {
	
	if(typeof str =='object'){
		var p = new prettify();
		if(pretty)
	 	str = p.JSON(str);
	 	else{ 	
	 		str = JSON.stringify(str,null,8);
	 		str = str.replace(/"/g,'');
			str = str.replace(/\\u001b/g,'\x1b');
	 	}
	}
  for(var i=0;i<str.length;i++){
  	await delay(ms);
  	process.stdout.write(str.substring(i,i+1));
  }
   process.stdout.write("\r\nlocal:client>");
};

// Original: https://github.com/Marak/colors.js/blob/master/lib/styles.js

const styleCodes = {
    // Reset all styles.
    reset: [0, 0],
    
    // Text styles.
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29],
    
    // Foregound classic colours.
    fgBlack: [30, 39],
    fgRed: [31, 39],
    fgGreen: [32, 39],
    fgYellow: [33, 39],
    fgBlue: [34, 39],
    fgMagenta: [35, 39],
    fgCyan: [36, 39],
    fgWhite: [37, 39],
    fgGray: [90, 39],
    
    // Foreground bright colours.
    fgBrightRed: [91, 39],
    fgBrightGreen: [92, 39],
    fgBrightYellow: [93, 39],
    fgBrightBlue: [94, 39],
    fgBrightMagenta: [95, 39],
    fgBrightCyan: [96, 39],
    fgBrightWhite: [97, 39],

    // Background basic colours.
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    bgGray: [100, 49],
    bgGrey: [100, 49],
    
    // Background bright colours.
    bgBrightRed: [101, 49],
    bgBrightGreen: [102, 49],
    bgBrightYellow: [103, 49],
    bgBrightBlue: [104, 49],
    bgBrightMagenta: [105, 49],
    bgBrightCyan: [106, 49],
    bgBrightWhite: [107, 49],
};

/* A browser client-side function */
function calcScreenDPI() {
    const el = document.createElement('div');
    el.style = 'width: 1in;'
    document.body.appendChild(el);
    const dpi = el.offsetWidth;
    document.body.removeChild(el);
    return dpi;
}

function cmyk2rgb(a, normalized){
	
    var c = (a[0] / 100);
   	var m = (a[1] / 100);
  	var y = (a[2] / 100);
  	var k = (a[3] / 100);
    
    c = c * (1 - k) + k;
    m = m * (1 - k) + k;
    y = y * (1 - k) + k;
    
    var r = 1 - c;
    var g = 1 - m;
    var b = 1 - y;
    
    if(!normalized){
        r = Math.round(255 * r);
        g = Math.round(255 * g);
        b = Math.round(255 * b);
    }
    
    return {
        r: r,
        g: g,
        b: b
    }
}

function rgbToHex(r, g, b, o) {
	var f = [r,g,b,o].filter(i=>isNaN(i));
	if(f.length){throw 'RGB color components must be an integers from 0 to 255'; return '#000000';}
	function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
	}
	if(o)
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b) + componentToHex(o);
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {Array}           The HSL representation
 */
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

function makeHtmlHexColor(color){
	try{
	if(!Array.isArray(color))return null;
	if(color.length !=2)return null;
	if(typeof color[0] !='string')return null;
	var t   = color[0].toUpperCase().trim();
	if( t  !='RGB')return null;
	var r = 0,g=0,b=0;
	 r	=	color[1][0] = (color[1][0].indexOf('.')!=-1)?Math.floor(parseFloat(color[1][0])*255):parseInt(color[1][0]);
	 g	=	color[1][1] = (color[1][1].indexOf('.')!=-1)?Math.floor(parseFloat(color[1][1])*255):parseInt(color[1][1]);
	 b	=	color[1][2] = (color[1][2].indexOf('.')!=-1)?Math.floor(parseFloat(color[1][2])*255):parseInt(color[1][2]);
	 var rgb = rgbToHex(r, g, b);
	 //console.log(rgbToHex(r, g, b));
	 return rgb;
	}catch(e){
		};
		
	return null;
}
function toPx(s){
	var n = parseInt(s);
	if(isNaN(n)) return '';
	var z = s.split(''+n)[1].trim();
	var value ='';
	if(z.length){
		switch(z){
			case 'cm':
			value = Math.floor(n*37.8)+'px';
			break;
			case 'mm':
			value = Math.floor(n*37.8/10)+'px';
			break;
			case 'q':
			value = Math.floor(n*37.8/40)+'px';
			break;
			case 'in':
			value = n*96+'px';
			break;
			case 'pc':
			value = Math.floor(n*96/6)+'px';
			break;
			case 'pt':
			value = Math.floor(n*96/72)+'px';
			break;
			case 'px':
			value = n+'px';
			break;
		}
	}else value = n+'px';
	return value;
}
function roman (num,cas=true) {
    if (isNaN(num))
        return NaN;
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
   	if(!cas) 
   	return (Array(+digits.join("") + 1).join("M") + roman).toLowerCase();
    return  Array(+digits.join("") + 1).join("M") + roman;
}

function alph (num,cas=true){
	  var a = (num+9).toString(36);
		if(cas)
		return a.toUpperCase();
		return a
}

function roman2Int(str1) {
	function char_to_int(c){
		switch (c){
			case 'I': return 1;
			case 'V': return 5;
			case 'X': return 10;
			case 'L': return 50;
			case 'C': return 100;
			case 'D': return 500;
			case 'M': return 1000;
			default: return -1;
		}
	}
	if(str1 == null) return -1;
		 str1	=	str1.toUpperCase();
	var num = char_to_int(str1.charAt(0));
	var pre, curr;

	for(var i = 1; i < str1.length; i++){
	curr = char_to_int(str1.charAt(i));
	pre = char_to_int(str1.charAt(i-1));
	if(curr <= pre){
	num += curr;
	} else {
	num = num - pre*2 + curr;
	}
	}

return num;
}


function srt2webvtt(data) {
    // remove dos newlines
    var srt = data.replace(/\r+/g, '');
    // trim white space start and end
    srt = srt.replace(/^\s+|\s+$/g, '');
    // get cues
    var cuelist = srt.split('\n\n');
    var result = "";
    if (cuelist.length > 0) {
      result += "WEBVTT\n\n";
      for (var i = 0; i < cuelist.length; i=i+1) {
        result += convertSrtCue(cuelist[i]);
      }
    }
    return result;}

function convertSrtCue(caption) {
    // remove all html tags for security reasons
    //srt = srt.replace(/<[a-zA-Z\/][^>]*>/g, '');
    var cue = "";
    var s = caption.split(/\n/);
    // concatenate multi-line string separated in array into one
    while (s.length > 3) {
        for (var i = 3; i < s.length; i++) {
            s[2] += "\n" + s[i]
        }
        s.splice(3, s.length - 3);
    }
    var line = 0;
    // detect identifier
    if (!s[0].match(/\d+:\d+:\d+/) && s[1].match(/\d+:\d+:\d+/)) {
      cue += s[0].match(/\w+/) + "\n";
      line += 1;
    }
    // get time strings
    if (s[line].match(/\d+:\d+:\d+/)) {
      // convert time string
      var m = s[1].match(/(\d+):(\d+):(\d+)(?:,(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:,(\d+))?/);
      if (m) {
        cue += m[1]+":"+m[2]+":"+m[3]+"."+m[4]+" --> "
              +m[5]+":"+m[6]+":"+m[7]+"."+m[8]+"\n";
        line += 1;
      } else {
        // Unrecognized timestring
        return "";
      }
    } else {
      // file format error or comment lines
      return "";
    }
    // get cue text
    if (s[line]) {
      cue += s[line] + "\n\n";
    }
    return cue;
  }



module.exports =
{
	saveUploadImage,
	queryStringToJSON:queryStringToJSON,
	fileExists:fileExists,
	BufferSplit:BufferSplit,
	sequentialPrint:sequentialPrint,
	dateTime,dateTimeFormated,UUUID,RIFI,
	cmyk2rgb, makeHtmlHexColor, rgbToHex,
	toPx,roman, alph, roman2Int, rgbToHsl, 
	hslToRgb,srt2webvtt,
    wm_encode,wm_decode
};
