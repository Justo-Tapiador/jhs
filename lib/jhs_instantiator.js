'use strict';
/**
	Justo Tapiador García
	justo.tapiador@gmail.com
 **/
var	that;
const MAX_LEVELS = 5;
const delimiter = function(n){
  return !n?['<?jhs','?>']:['<?#'+n+'jhs','?#'+n+'>'];
}
const JHS = require('./execjhs');
class instantiator{
  #levels;#execjhs;#parsers;
	constructor(options) {
		this.#levels = (typeof options.levels =='undefined')?1:options.levels;
		this.#levels = isNaN(this.#levels)?1:this.#levels;
		this.#levels = this.#levels<1?1:this.#levels;
		this.#levels = this.#levels>MAX_LEVELS?MAX_LEVELS:this.#levels;
    this.#execjhs	= [];
    for(var i=0;i<MAX_LEVELS;i++){
		this.#execjhs.push(new JHS({delimiters:delimiter(i)}));
	 }
	  this.#parsers = [];
	  that = this;
    //////////////////////
	  this.#parsers.push(
		function(data, source, options, callback){
			that.#execjhs[0].parseFile(data, source, options, function(jhsResult, err){  
			callback(jhsResult, err);
			});}
		);
    //////////////////////
    this.#parsers.push(
			function(data, source, options, callback){
			that.#execjhs[1].parseFile(data, source, options, function(jhsResult1, err){  
				that.#execjhs[0].parseFile(jhsResult1, true, options, function(jhsResult, err){  
					callback(jhsResult, err);
					});
				});
			}
		);
    //////////////////////
    this.#parsers.push(
			function(data, source, options, callback){
			that.#execjhs[2].parseFile(data, source, options, function(jhsResult2, err){  
				that.#execjhs[1].parseFile(jhsResult2, true, options, function(jhsResult1, err){  
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
			that.#execjhs[3].parseFile(data, source, options, function(jhsResult3, err){  
				that.#execjhs[2].parseFile(jhsResult3, true, options, function(jhsResult2, err){  
					that.#execjhs[1].parseFile(jhsResult2, true, options, function(jhsResult1, err){  
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
			that.#execjhs[4].parseFile(data, source, options, function(jhsResult4, err){  
				that.#execjhs[3].parseFile(jhsResult4, true, options, function(jhsResult3, err){  
					that.#execjhs[2].parseFile(jhsResult3, true, options, function(jhsResult2, err){  
            that.#execjhs[1].parseFile(jhsResult2, true, options, function(jhsResult1, err){  
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
			return this.#parsers[this.#levels-1](data, source, options, callback);
	 }
     setMaxLevel(n){
      this.#levels = isNaN(n)?1:n;
		  this.#levels = this.#levels<1?1:this.#levels;
		  this.#levels = this.#levels>MAX_LEVELS?MAX_LEVELS:this.#levels;
     }

     banModules(level,modules){
      	level = isNaN(level)?1:level;
		level = level<1?1:level;
		level = this.#levels<this.#levels?this.#levels:level;
      	var m = that.#execjhs[level-1];
      	m.banned_require.push(...modules);
		m.banned_require = [...new Set(m.banned_require)];
     }
	 setOptions(level,options){
		level = isNaN(level)?1:level;
	  	level = level<1?1:level;
	  	level = this.#levels<this.#levels?this.#levels:level;
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
			max_levels:MAX_LEVELS,
			levels:this.#levels,
			options:options,
			banned_require:banned_require
		}
	

	}

  }
  module.exports = instantiator;