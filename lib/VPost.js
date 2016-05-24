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
	    
	    console.log("Request for " + pathname + " received.");
	    	    
	    for(var i in config.data){
    		if( pathname == config.data[i].req ){
    			if(typeof config.data[i].res == "function"){
    				var result = config.data[i].res();
    				doResponse(response, result, config.data[i].code );
					
    			}else if(typeof config.data[i].res == "string"){
    				doResponse(response, config.data[i].res, config.data[i].code );
    			 	
    			}else if( util.isArray(config.data[i].res) ){
    				var randamNum = Math.floor(Math.random()*config.data[i].res.length)
    				var result = config.data[i].res[randamNum];
    			 	doResponse(response, config.data[i].res, config.data[i].code );
    			 	
    			}else if(typeof config.data[i].res == "object"){
    				doResponse(response, JSON.stringify(config.data[i].res), config.data[i].code );
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
	    response.write(util.inspect(result));
	    response.end();
	}
	
	var objectToString = function(obj){
		
	}
	
	http.createServer(onRequest).listen(port);
	console.log("Server has started in port:" + port);
}

module.exports = VPost;