'use strict';
/**
 * 
 * * * * * * * * JHS MODULE * * * * * * * *
 * A NODEjs middleware for making dynamic and 
 * interactive Web pages
 * 
 * Justo Tapiador García
 * https://github.com/Justo-Tapiador/jhs
 * justo.tapiador@yahoo.com
 * 
 **/
const vm = require('vm');
const fs = require('fs');
var ABSPATH = __dirname.replace(/\\/g,'\\\\');
class JHS{
	static count = 0;
	constructor(options) {
		this.die_hash = require('crypto').randomBytes(16).toString('hex');
		this.rank = !(JHS.count)?'':'#'+JHS.count;JHS.count++;
		this.options = (typeof options !='undefined')?JSON.parse(JSON.stringify(options)):{};
		this.error = null;
		//this.jhs_require = this.jhs_require.bind(this);
		this.require_filter = this.require_filter.bind(this);
		this.delimiters =['<?jhs','?>'];
		this.banned_require = ['vm','jhs'];
		if(typeof options!='undefined'){
			
				if(typeof options.delimiters!='undefined'){
					this.delimiters[0]=options.delimiters[0];
					this.delimiters[1]=options.delimiters[1];
				}
				if(typeof options.banned_require!='undefined'){
					this.banned_require.push(...options.banned_require);
					this.banned_require = [...new Set(this.banned_require)];
				}				

				
		}
		
		this.queryString = "";
		this.echo_str = '\n\n'+
		'function echo(s){\n'+
		'var str ="";if(typeof s === \'object\' && s !== null)\n'+
		'str +=JSON.stringify(s);\n'+
		'else {\n'+
		'if(s==null)cadena +=null;'+
		'else str += s.toString();} if(!DIE)cadena += str;};\n'+ 
		'cadena = cadena.split(\''+this.die_hash+'\')[0];\n'+
		'return cadena;\n\n';
		this.die_str = '\n\n'+
		'function die(s){\n'+
			'echo(s);\n'+
			'echo(\''+this.die_hash+'\');\n'+
			'DIE = true;'+
		 '}\n\n';
		    

		};		
	
	parseFile(data,source,flags,callback) {
		this.options.scriptname = flags.scriptname;
	if(data){
			var c = null;
			var error=null;
			try{
		        if(source)
		            c = data;
		        else
		  	        c = fs.readFileSync(data).toString();		
			}catch(e){
		 		error=e;
		 		c = e.toString();
		 		console.log(e);
		 		flags.error = error;
				
			}
	if(c){
		c += '\n';
		//c = c.replace(/jhs_require[\s]+(.*?);/g,this.jhs_require);
		const trim = (str, chars) => str.split(chars).filter(Boolean).join(chars);
		
		c = c.replace( /\\/gm, "\\\\");
		
		/*remove comments*/
		c = c.replace( /\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, "");
		
		if(flags.error!=null && flags.pagename!=null)
		 c = this.delimiters[0]+" var pagename =\""+ flags.pagename+"\";" + this.delimiters[1]+ c;
		 c = this.delimiters[0]+" var flags ="+ JSON.stringify(flags)+";" + this.delimiters[1]+ c;
		 c = this.delimiters[0]+" const __DIR__ =\""+ (this.options.cms_root || './jhs-cms')+"\";" + this.delimiters[1]+ c;
		 c = this.delimiters[0]+" const ABSPATH =\""+ ABSPATH +"\";" + this.delimiters[1]+ c;
		 c = this.delimiters[0]+" var DIE = false;"+ this.delimiters[1]+ c;



		var p = this.pose(c);
		var a = p.jhs,
		h = p.html;		
		for(var i=0;i<h.length;i++){							
		var html_1 = c.substring(h[i][0], h[i][1]);
		var html_3 = html_1.replace(/\"/gm,'\\"');
		html_3 = html_3.replace(/\'/gm,"\\'");
		c = this.replace(c, h[i][0], html_1, html_3);	    						    
		p = this.pose(c);
		a = p.jhs,
		h = p.html;	
		 
		var html_4 = html_3.replace(/\n/gm,'\\n');
		html_4 = html_4.replace(/\r/gm,"\\r");
		c = this.replace(c, h[i][0], html_3, html_4);	    						    
		p = this.pose(c);
		a = p.jhs,
		h = p.html;	

		/////////////////////////////////////////////
		var html_5 = trim(html_4,"\\r\\n");	
		c = this.replace(c, h[i][0], html_4, html_5);	    						    
		p = this.pose(c);
		a = p.jhs,
		h = p.html;
		html_4=html_5;

		///////////////////////////////////////////		  				  				 
		var html_2 = 'cadena +="'+ html_4 + '";';						
		c = this.replace(c, h[i][0], html_4, html_2);
		p = this.pose(c);
		a = p.jhs,
		h = p.html;	
					
		}
	    var 	_start0 = new RegExp(this.delimiters[0].replace(/[#.*+?^${}()|[\]\\]/g, '\\$&'),'gm'); //To escape the RegExp		
		var 	_end0   = new RegExp(this.delimiters[1].replace(/[#.*+?^${}()|[\]\\]/g, '\\$&'),'gm');

		c =  c.replace(_start0,"");c = c.replace(_end0,'\n');
		c = trim(c,"\r\n");c = c.trim();
		var cadena ='var cadena="";';
		c = cadena+c;
		c = c + this.die_str + this.echo_str;  
		c = c.replace(/&slash;/g,'');
		
		 ////////////////////////////////////////////////////////
		 /////////// JHS has been sanboxed in context  //////////
		 ///////// require(package) is included now /////////////
		 ////// 	but 'vm' packages is excluded 	   //////////
		 /////////  and Buffer is in context too   //////////////
		 ////////////////////////////////////////////////////////
		 
		 		var sandbox = vm.createContext( {
						require:this.require_filter,
						Buffer:Buffer
					});
				var code = ' var jhs = function(){'+c+'}';
       	try{
				var script = new vm.Script(code);	
			 	script.runInContext(sandbox);
				callback(sandbox.jhs(),error);					 			
			}catch(e){callback(e.toString(),true)}
	  ////////////////////////////////////////
	} //if(c)					  
	} //if(data)
	} //parseFile
	
	require_filter(pack){
	 //if(/*pack == 'jhs'  || */ pack == 'vm') 
	 	if(this.banned_require.indexOf(pack)+1){
			this.error = {error:true,file:this.options.scriptname,banned_require:pack};
			throw JSON.stringify(this.error);
	 	//return {};
		}
    return require(pack);
	
	}
	
	
	pose(str){
	var start = this.find(this.delimiters[0], str); 	
	var end = this.find(this.delimiters[1], str); 
	var a =[]; 
	for(var i=0;i<start.length;i++){
	var b =[];
	b.push(start[i]);
	b.push(end[i]);
	a.push(b);
	}
	var h =[];
	for(var i=0;i<start.length-1;i++){
	var b =[];
	b.push(end[i]+this.delimiters[1].length);
	b.push(start[i+1]);
	h.push(b);
	}
					
	if(start[0]!=0)h.unshift([0,start[0]]);			
	var last = a[a.length-1][1]+this.delimiters[1].length;
	if(last<str.length)h.push([last,str.length]);
	return {jhs:a,html:h};
}

	find(needle, haystack) {
    var results = [];
    var idx = haystack.indexOf(needle);
    while (idx != -1) {
        results.push(idx);
        idx = haystack.indexOf(needle, idx + 1);
    }
    return results;
}

	remove(s, i, length){
	return s.slice(0,i)+s.slice(i+length);
}

	insert(s, i, w){
	return s.slice(0,i)+w+s.slice(i);
}
	replace(s, i, w, t){
	if(s.substring(i,i+w.length)!==w)
	return s;
	var st = this.remove(s, i, w.length);
	return this.insert(st, i, t);;
	}

  findEnvironment(str){
  	var f =	/\?(.*?)>/.exec(str);
  	if(f)
  		return ['<?'+f[1]+'jhs',f[0]]
  		return ['','']
  }
  
	jhs_require(match, p1,offset,string){
		var file ='';
 		try{
 		var delimiters = this.findEnvironment(string.substring(offset+match.length));
		if(!delimiters[1].length) return match;
 		p1	=	p1.replace(/['"]/g,'');
 		p1	=	p1.replace(/__DIR__[\s]*\.[\s]*/,this.options.cms_root || './jhs-cms');
 		p1	=	p1.replace(/ABSPATH[\s]*\.[\s]*/,__dirname);
 		p1	=	p1.replace(/JHSCONTENT[\s]*\.[\s]*/,this.options.jhscontent);
 		p1	=	p1.replace(/JHSINC[\s]*\.[\s]*/,this.options.jhsinc ||  './jhs-cms/jhs-includes');
 		p1	=	p1.replace(/CURRENTTHEME[\s]*\.[\s]*/,this.options.CURRENTTHEME);
		p1	=	p1.trim();
 		file = fs.readFileSync(p1).toString();
 		file = deleteComments(file)
 		file = file.replace(/jhs_require[\s]+(.*?)[\s]*[;\r\n]/,this.jhs_require);
 		return delimiters[1]+file +delimiters[0];
		}catch(e){
		console.log(e);
		return '';
		}
	}

}


function deleteComments(str){
		str = str.replace(/(?<!\\)%.*/gm,'');
		str = str.replace(/[\r\n]{3,}/gm,'');
		return str;
}


module.exports = JHS;


