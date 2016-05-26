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
    		if( typeof  config.data[i].req  == "string" && pathname == config.data[i].req ){
    			//根据res对象的类型分别处理，字符串直接返回，函数返回返回值，数组随机返回一个子元素，对象遍历后返回
    			doResponse(response, dataToString(config.data[i].res), config.data[i].code);
   		 		return;
    		}else if(util.isRegExp(config.data[i].req) && pathname.search(config.data[i].req) >= 0){
    			doResponse(response, dataToString(config.data[i].res), config.data[i].code);
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
	    response.write(result);//统一转换成字符串返回
	    console.log("response:" + result + ",code:" + (code||200))
	    response.end();
	}
	
	var dataToString = function(obj){
		if(typeof obj == "string" || typeof obj == "number" ){
			return obj;
		}else if(typeof obj == "function"){
			return obj();
		}else if( util.isArray(obj) ){
			var randamNum = Math.floor(Math.random()*obj.length)
			return obj[randamNum];
		}else if(typeof obj == "object"){
			return objectToString(obj)
		}
	}
	
	var objectToString = function(obj){
		var result = '\{';
		for(var i in obj){
			var str = dataToString(obj[i]);
			var isObjOrArray = (str[0] == "{" && str[str.length-1] == "}") || (str[0] == "[" && str[str.length-1] == "]")//数组或对象无需加“”
			result += ('"' + i + '":' + (isObjOrArray ? '':'"') + str + (isObjOrArray ? '':'"') );
			result += ','
		}
		result = result.slice(0,result.length - 1);//去掉最后一个，
		result += '}'
		return result ;
	}
	
	http.createServer(onRequest).listen(port);
	console.log("Server has started in port:" + port);
}

module.exports = VPost;