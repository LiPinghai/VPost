var http = require("http");
var url = require("url");
var util = require("util");
var fs = require("fs");
var querystring = require("querystring")
var contentType = require("./contentType")

var VPost = function(config) {
	var port = config.port || 8888;
	var filePath = config.filePath || 'www/';
	var _url = {};
	
	function onRequest(request, response) {
	    _url.pathname = url.parse(request.url).pathname;
	    _url.$query = querystring.parse(url.parse(request.url).query);
	    _url.$hash = querystring.parse(url.parse(request.url).hash);
	    
	    if(config.rootPath){
	    	if (_url.pathname.indexOf(config.rootPath) == 0){
    			_url.pathname = _url.pathname.slice(config.rootPath.length);
	   	 	}else{
	   	 		response404(response);
	   	 		return;
	   	 	}
	    }
	    
	    console.log("Request :" + _url.pathname + " received.");
	   	
	   	//优先匹配接口，找不到接口时尝试读取文件
	    for(var i in config.data){
    		if( typeof  config.data[i].req  == "string" && _url.pathname == config.data[i].req ){
    			//根据res对象的类型分别处理，字符串直接返回，函数返回返回值，数组随机返回一个子元素，对象遍历后返回
    			doResponse(response, {
    				data:dataToString(config.data[i].res),
    				code:config.data[i].code
    				});
   		 		return;
    		}else if(util.isRegExp(config.data[i].req) && _url.pathname.search(config.data[i].req) >= 0){
    			doResponse(response, {
    				data:dataToString(config.data[i].res), 
    				code:config.data[i].code});
   		 		return;
    		}
	    }
	    
	    //没有满足条件的接口时，尝试读取文件，失败返回404
	    try{
    	 	var data = fs.readFileSync( filePath + _url.pathname );
    	 	console.log("readFile: " + _url.pathname);
    		doResponse(response, {
    			data:data,
    			type:_url.pathname.split(".")[1]
    		});
    		
	    }catch(e){
	    	response404(response);
	    }
	}
	
	var response404 = function(response){
		doResponse(response,{
			code:404,
			data:config.default
		})
	}
	
	var doResponse = function(response,data){
		response.writeHead(data.code || 200, {"Content-Type": (data.type ? (contentType[data.type] || "text/plain") : "text/plain")});
	    
	    if(typeof data.data == "object"){
	    	response.write(util.inspect(data.data))
	    }else(
	    	response.write(data.data)
	    )
	    
	    console.log("response length:" + data.data.length);
	    if(data.data.length < 1000){
	    	console.log("response:" + data.data + ",code:" + (data.code || 200))
	    }
	    response.end();
	}
	
	//将数组/函数/对象等类型转成字符串返回
	var dataToString = function(obj){
		if(typeof obj == "string" || typeof obj == "number" ){
			return obj;
		}else if(typeof obj == "function"){
			return obj(_url);
		}else if( util.isArray(obj) ){
			var randamNum = Math.floor(Math.random()*obj.length)
			return obj[randamNum];
		}else if(typeof obj == "object"){
			return objectToString(obj)
		}
	}
	
	//对象转字符串
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