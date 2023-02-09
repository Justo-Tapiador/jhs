'use strict';
/**
 * #n( ... #3(#1(#1(#()))))
 * A JHS module instantiator. It configures instances in hierarchical (nested) levels
 * 
 * Justo Tapiador García
 * https://github.com/Justo-Tapiador
 * justo.tapiador@yahoo.com
 * 
 **/
var	that,tmp_rank;
const MAX_LEVELS = 5;
const delimiter = function(n){
  return !n?['<?jhs','?>']:['<?#'+n+'jhs','?#'+n+'>'];
}
const JHS = require('./execjhs');
const fs = require('fs');
class instantiator{
  	#levels;#execjhs;#parsers;#rank;
	constructor(options) {
		options =(typeof options =='undefined')?{levels:2}:options;
		this.options = options;
		this.#levels = (typeof options.levels =='undefined')?2:options.levels;
		this.#rank	 = (typeof options.rank =='undefined')?0:options.rank;
		this.#rank   = isNaN(this.#rank)?0:this.#rank;
		this.#levels = isNaN(this.#levels)?1:this.#levels;
		this.#levels = this.#levels<1?1:this.#levels;
		this.#levels = this.#levels>MAX_LEVELS?MAX_LEVELS:this.#levels;
		this.#rank	 = this.#rank>this.#levels?this.#levels:this.#rank;
		this.#rank 	 = this.#rank<0?0:this.#rank;
		this.#execjhs	= [];
		for(var i=0;i<MAX_LEVELS;i++)
		this.#execjhs.push(new JHS({delimiters:delimiter(i)}));

		for(var i=0;i<this.#levels;i++){
			if(typeof this.options.options !='undefined'){
				if(typeof this.options.options[i]!='undefined'){
				var opt = this.options.options[i];
				this.#execjhs[i].options = JSON.parse(JSON.stringify(opt));	 
				}
			} 	
		  }

		this.#parsers = [];
		that = this;
		//////////////////////
		this.#parsers.push(
			function(data, source, options, callback){
				that.#rank==1 || options.rank==1?callback(!source?fs.readFileSync(data).toString():data, null):
				that.#execjhs[0].parseFile(data, source, options, function(jhsResult, err){  
					callback(jhsResult, err);
				});
			}
		);
		//////////////////////
		this.#parsers.push(
			function(data, source, options, callback){
				that.#rank==2 || options.rank==2?callback(!source?fs.readFileSync(data).toString():data, null):
				that.#execjhs[1].parseFile(data, source, options, function(jhsResult1, err){  
					that.#rank==1 || options.rank==1?callback(jhsResult1, err):
					that.#execjhs[0].parseFile(jhsResult1, true, options, function(jhsResult, err){  
						callback(jhsResult, err);
						});
				});
			}
		);
		//////////////////////
		this.#parsers.push(
			function(data, source, options, callback){
				that.#rank==3 || options.rank==3?callback(!source?fs.readFileSync(data).toString():data, null):
				that.#execjhs[2].parseFile(data, source, options, function(jhsResult2, err){  
					that.#rank==2 || options.rank==2?callback(jhsResult2, err):
					that.#execjhs[1].parseFile(jhsResult2, true, options, function(jhsResult1, err){  
						that.#rank==1 || options.rank==1?callback(jhsResult1, err):
						that.#execjhs[0].parseFile(jhsResult1, true, options, function(jhsResult, err){  
							callback(jhsResult, err);
						});
					});
				});
			}
		);
		//////////////////////
		this.#parsers.push(
			function(data, source, options, callback){
				that.#rank==4 || options.rank==4?callback(!source?fs.readFileSync(data).toString():data, null):
				that.#execjhs[3].parseFile(data, source, options, function(jhsResult3, err){  
					that.#rank==3 || options.rank==3?callback(jhsResult3, err):
					that.#execjhs[2].parseFile(jhsResult3, true, options, function(jhsResult2, err){  
						that.#rank==2 || options.rank==2?callback(jhsResult2, err):
						that.#execjhs[1].parseFile(jhsResult2, true, options, function(jhsResult1, err){  
							that.#rank==1 || options.rank==1?callback(jhsResult1, err):
							that.#execjhs[0].parseFile(jhsResult1, true, options, function(jhsResult, err){  
								callback(jhsResult, err);
							});
						});
					});
				});
			}
		);
		//////////////////////
		this.#parsers.push(
			function(data, source, options, callback){
				that.#rank==5 || options.rank==5?callback(!source?fs.readFileSync(data).toString():data, null):
				that.#execjhs[4].parseFile(data, source, options, function(jhsResult4, err){  
					that.#rank==4 || options.rank==4?callback(jhsResult4, err):
					that.#execjhs[3].parseFile(jhsResult4, true, options, function(jhsResult3, err){  
						that.#rank==3 || options.rank==3?callback(jhsResult3, err):
						that.#execjhs[2].parseFile(jhsResult3, true, options, function(jhsResult2, err){  
							that.#rank==2 || options.rank==2?callback(jhsResult2, err):
							that.#execjhs[1].parseFile(jhsResult2, true, options, function(jhsResult1, err){  
								that.#rank==1 || options.rank==1?callback(jhsResult1, err):
								that.#execjhs[0].parseFile(jhsResult1, true, options, function(jhsResult, err){  
									callback(jhsResult, err);
								});
							});
						});
					});
				});
			}
		);
	}

    parse(data, source, options, callback){
		tmp_rank = options.rank;
		tmp_rank = tmp_rank<0?0:tmp_rank;
		tmp_rank = tmp_rank>this.#levels?this.#levels:tmp_rank;
		options.rank = tmp_rank;
		return this.#parsers[this.#levels-1](data, source, options, callback);
	}
    setMaxLevel(n){
      	this.#levels = isNaN(n)?1:n;
		this.#levels = this.#levels<1?1:this.#levels;
		this.#levels = this.#levels>MAX_LEVELS?MAX_LEVELS:this.#levels;
    }
	setRank(n){
	  this.#rank = isNaN(n)?0:n;
	  this.#rank = this.#rank<0?0:this.#rank;
	  this.#rank = this.#rank>this.#levels?this.#levels:this.#rank;
	  this.#rank = this.#rank<0?0:this.#rank;
  }
  	getRank(){
		return this.#rank;
	}
	getLevels(){
		return this.#levels;
	}
    banModules(level,modules){
      	level = isNaN(level)?1:level;
		level = level<1?1:level;
		level = this.#levels<level?this.#levels:level;
      	var m = that.#execjhs[level-1];
      	m.banned_require.push(...modules);
		m.banned_require = [...new Set(m.banned_require)];
    }
	setOptions(level,options){
		level = isNaN(level)?1:level;
	  	level = level<1?1:level;
	  	level = this.#levels<level?this.#levels:level;
		var m = that.#execjhs[level-1];
		m.options = JSON.parse(JSON.stringify(options));	  	
   }
    getInfo(){
		var delimiters = [],options = [],banned_require = [];
		for(var i=0;i<this.#levels;i++){
			delimiters.push(that.#execjhs[i].delimiters);
			options.push(that.#execjhs[i].options);
			banned_require.push(that.#execjhs[i].banned_require);
		}
		return {
			version:'v' + require('../package.json').version,//global._jhs,
			max_levels:MAX_LEVELS,
			levels:this.#levels,
			rank:this.#rank,
			options:options,
			banned_require:banned_require		
		}
	}
	getRankWarning(base){
		var b = typeof base!='undefined'?base:'';
			b = b.length?`of '${b}'`:b;
		return `/**
 * WARNING:
 * This is a generated #${this.#rank || tmp_rank} rank file ${b}, from a ${this.#levels}-level JHS Module configuration. 
 * If you are looking for the generated HTML file, please set rank:0, or do not define any, in JHS options.
 * You can get the complete raw file '${base}' by setting rank:5, or to a higher value.
 **/
`;
	}


}
  
module.exports = instantiator;