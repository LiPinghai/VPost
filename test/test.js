var VPost = require("./lib/VPost");

var config = {
	rootPath:"",
	data:[
		{
			"req":"/getString",
			"res":"baobao"
		},
		{
			"req":"/getFuntion",
			"res":function(){
				return "{'id':'" + String(Math.random())+"'}" 
			},
			"code":"201"
		},
		{
			"req":"/getArray",
			"res":[1,2,3,4,5]
		},
		{
			"req":"/getObject",
			"res":{
				a:"1",
				b:[1,2,3,4],
				c:function(){
					return "c"
				}
			}
		}
	],
	default:"not found",
	code:[
		{404:"2222"},
		{201:"12321321"}
	],
	port:"2048"
	
} 


var vPost = new VPost(config);


