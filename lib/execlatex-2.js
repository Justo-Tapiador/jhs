/**
	Justo Tapiador García
	justo.tapiador@gmail.com

*/

'use strict';
const fs = require('fs');

class ExecLATEX {
	constructor() {
	this.katex = require('katex');
	this.jk=[];
	this.ref_count=0;
	this.thereisLatex=false;
	}	
	
	parseFile(fileName, already=true,callback) { //parseFile
	
	if(fileName){
			var c = null;
			var error=null;
			
			
			try{
				if(already)
				c = fileName;
				else
		  	c = fs.readFileSync(fileName).toString();		
		  
			}catch(e){
		 		error=e;
		 		c = JSON.stringify(error,null,8);
		 	
				
			}
	if(c){ //c
		var tex = this.findBetween(c, ['<texparse>','</texparse>']);
		if(tex){//tex
		var pp = this.find('$$',tex[2]);
	  var cc=tex[2];
		const l1='[latex] \\displaystyle ', l2='[/latex]', l3 ='[latex]';
		if(pp)
		for(var i=0;i<pp.length-1;i+=2){
			var a = pp[i], b = pp[i+1];
			var k1 = tex[2].substring(a+2, b);
			var k2 = tex[2].substring(a, b+2);
			cc = cc.replace(k2, l1+k1+l2);
		}
		c=c.replace(tex[2],cc);
		////////////////////////////////
		pp = this.find('$',tex[2]);
		var cd=cc;
		if(pp)
		for(var i=0;i<pp.length-1;i+=2){
			var a = pp[i], b = pp[i+1];
			var k1 = tex[2].substring(a+1, b);
			var k2 = tex[2].substring(a, b+1);
			cd = cd.replace(k2, l3+k1+l2);
		}
		c = c.replace(cc,cd);
	
		////////////////////////////////
		}//-tex
	
		var p = this.pose(c,['[latex]','[/latex]']);
		if(p){
		this.thereisLatex=true;
		var a = p.latex,
		h = p.html;		
    
		for(var i=0;i<a.length;i++){	//1		
		var k = c.substring(a[i][0], a[i][1]+8);
		var k1 = k.substring(7, k.length-8);
		
		this.jk.push([k,k1]);		
		} //-1
		  //try{
			for(var i=0;i < this.jk.length;i++){	//2
				var pre = this.pre_stylize(this.jk[i][1]);
				var mode = this.jk[i][1].indexOf('\\displaystyle')!=-1;
				var element = this.katex.renderToString(pre.new_latex,{displayMode:mode});
				    element = this.getReferences(pre.new_latex,element);
				    element = this.stylize(pre, element);
				c=c.replace(this.jk[i][0],element);
			
				
				} //-2
			//}catch(e){};
	   }      		 		
		}//-c
					  
		}// -fileName
		if(this.thereisLatex){
			p = this.find('\\ref{',c);
			if(p.length)
			for(var i=0;i< p.length;i++)
			c =  this.setReferences(c)
	 	}
		
   callback(c);
}//-parseFile


  stylize(pre, element){
  var tip = 'class="katex-display" data-toggle="tooltip" data-placement="bottom" title="'+pre.new_latex+'"';
   var tip2 = 'class="katex" data-toggle="tooltip" data-placement="bottom" title="'+pre.new_latex+'"';
   var style ='style="background-color:'+pre.style.bg+';color:'+pre.style.fg+ ';"';
    if(element.indexOf('class="katex-display"')!=-1){
    element = element.replace('class="katex-display"', tip);
     element = element.replace('class="katex-display"', style +' '+'class="katex-display"');
  	}
    else  if(element.indexOf('class="katex"')!=-1){
    element = element.replace('class="katex"', tip2);
    element = element.replace('class="katex"', style +' '+'class="katex"');
  	}
    return element;
  }
  pre_stylize(latex){
  	const colorbox = '\\colorbox';
  	const color = '\\color';
  	var style ={bg:'#ffffff',fg:'#000000'};
  	var start = latex.indexOf(colorbox);
  	var set = start!=-1;
  	var new_latex = latex;
  	if(set){
  		var sub = latex.substring(start+colorbox.length);
  		var a = this.findBetween(sub,['{','}']);
			if(a){
			style.bg = a[2];
			new_latex = latex.replace(latex.substring(start,start+colorbox.length+a[1]+1),'');
			}
  	}
  	start = new_latex.indexOf(color);
  	set = start!=-1;
  	if(set){
  		var sub = new_latex.substring(start+color.length);
  		var a = this.findBetween(sub,['{','}']);
			if(a){
			style.fg = a[2];
			new_latex = new_latex.replace(new_latex.substring(start,start+color.length+a[1]+1),'');
			}
  	}

    return {style:style, new_latex:new_latex};
  }
  getReferences(latex,element){
  	 var count=1;
  	 const tag ='<class="tag';
  	 const eqn_num ='class="eqn-num';
  	if(latex.indexOf('\\displaystyle')!=-1){
  	var a = this.find('<span '+eqn_num, element);
  	if(a.length){
  		for(var i=0;i < a.length;i++){
  		 var mod = 'id="ref-tex-'+(++this.ref_count)+'"'+ ' '+eqn_num;
  		 element = element.replace('<span '+eqn_num, '<span '+mod);
  		
  		}
  	 }
  	 
  	}
  	return element;
  }
  
  setReferences(cad){
  	const ref ='\\ref';
  	var start = cad.indexOf(ref);
  	if(start!=-1){
  		var sub = cad.substring(start+ref.length);
  		var a = this.findBetween(sub,['{','}']);
			if(a){
				var num = parseInt(a[2]);
				if(isNaN(num)) num ='???';
				cad = cad.replace(cad.substring(start,start+ref.length+a[1]+1),'<a href="#ref-tex-'+num+'"><b>'+ num +'</b></a>');
			}
  	}
  	return cad;
  }
	pose(str, delimiter){
	var start = this.find(delimiter[0], str); 	
	var end = this.find(delimiter[1], str); 
	var a =[]; 
	if(!start.length)return null;
	for(var i=0;i<start.length;i++){
	var b =[];
	b.push(start[i]);
	b.push(end[i]);
	a.push(b);
	}
	var h =[];
	for(var i=0;i<start.length-1;i++){
	var b =[];
	b.push(end[i]+2);
	b.push(start[i+1]);
	h.push(b);
	}
					
	if(start[0]!=0)h.unshift([0,start[0]]);			
	var last = a[a.length-1][1]+2;
	if(last<str.length)h.push([last,str.length]);
	return {latex:a,html:h};
}
  findBetween(str, delimiter){
	var start = str.indexOf(delimiter[0]);
	var end = str.indexOf(delimiter[1]);
	if(start ==-1 || end ==-1) return null;
	var sub = str.substring(start + delimiter[0].length, end);
	if(sub.length) return [start,end,sub.trim()];
	return null;
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
 ReplaceAll(latex){
 	 	const find1 = '\\begin{equation}';
		const find2 = '\\end{equation}';	 
		const l1='GGGGGGGGG[latex] \\displaystyle ', l2=' [/latex]', l3 ='[latex]';
	 	return latex;
	}
}

module.exports = function() {
	return new ExecLATEX();
};