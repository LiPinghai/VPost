var http = require("http");
var url = require("url");
var util = require("util")

var VPost = function(config) {
	var port = config.port||8888;
	
	function onRequest(request, response) {
	    var pathname = url.parse(request.url).pathname;
	    if(config.rootPath){
	    	if (pathname.indexOf(config.rootPath) == 0){
	    		pathname = pathname.slice(config.rootPath.length);
	   	 	}else{
	   	 		response404(response);
	   	 		return;
	   	 	}
	    }
	    
	    console.log("Request :" + pathname + " received.");
	   	
	    for(var i in config.data){
    		if( pathname == config.data[i].req ){
    			//根据res对象的类型分别处理，字符串直接返回，函数返回返回值，数组随机返回一个子元素，对象遍历后返回
    			if(typeof config.data[i].res == "string" || typeof config.data[i].res == "number" ){
    				doResponse(response, config.data[i].res, config.data[i].code );
    			 	
    			}else if(typeof config.data[i].res == "function"){
    				var result = config.data[i].res();
    				doResponse(response, result, config.data[i].code );
					
    			}else if( util.isArray(config.data[i].res) ){
    				var randamNum = Math.floor(Math.random()*config.data[i].res.length)
    				var result = config.data[i].res[randamNum];
    			 	doResponse(response, result, config.data[i].code );
    			 	
    			}else if(typeof config.data[i].res == "object"){
    				doResponse(response, objectToString(config.data[i].res), config.data[i].code );
    			}
   		 		return;
    		}
	    }
	    response404(response);
	}
	
	var response404 = function(response){
		response.writeHead(404, {"Content-Type": "text/plain"});
	    response.write(config.default);
	    response.end();
	}
	
	var doResponse = function(response,result,code){
		response.writeHead(code||200, {"Content-Type": "text/plain"});
	    response.write(util.inspect(result));//统一转换成字符串返回
	    console.log("response:" + util.inspect(result) + ",code:" + (code||200))
	    response.end();
	}
	
	var objectToString = function(obj){
		var result = '{';
		for(var i in obj){
			if(typeof obj[i] == "function"){
				result += ('"' + i + '":"' + obj[i]() + '"');
			}else if(typeof obj[i] == "string" || typeof obj[i] == 'number' ){
				result += ('"' + i + '":"' + obj[i] + '"');
			}else if( util.isArray(obj[i]) ){
				var randamNum = Math.floor(Math.random()*obj[i].length)
				result += ('"' + i + '":"' + obj[i][randamNum] + '"');
			}else{
				result += ('"' + i + '":' + objectToString(obj[i])) ;
			}
			result += ','
		}
		result = result.slice(0,result.length-1);
		result += '}'
		return result ;
	}
	
	http.createServer(onRequest).listen(port);
	console.log("Server has started in port:" + port);
}

module.exports = VPost;