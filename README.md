# VPost

An easy module for frontend engineer to create temporary API with node.js

本模块适用于前端工程师创建临时接口用于调试代码。样例如下：

##example：
```javascript
var VPost = require("../lib/VPost");

var config = {
	rootPath:"/test",
	data:[
		{
			"req":"/getString",
			"res":'{"str":"aa"}',
			"code":"201"
		},
		{
			"req":"/getFuntion",
			"res":function(){
				return '{"funtion":"' + String(Math.random())+'"}' 
			}
		},
		{
			"req":"/getArray",
			"res":[1,2,3,4,5]
		},
		{
			"req":"/getObject",
			"res": {
				a:"a",
				b:["b1","b2","b3","b4","b5"],
				c:function(){
					return "c";
				},
				d:{
					d1:"d1",
					d2:["d21","d22","d23"],
					d3:function(){
						return "d3"
					},
					d4:{
						d41:"d41"
					}
				}
			}
		}
	],
	default:"not found",
	port:"2048"
	
} 

var vPost = new VPost(config);
```

##用node运行起来，即可在127.0.0.1:2048访问到接口：

请求：127.0.0.1:2048/test/getString<br>
返回：{"str":"aa"}

请求：127.0.0.1:2048/test/getObject<br>
返回：{"a":"a","b":"b1","c":"c","d":{"d1":"d1","d2":"d21","d3":"d3","d4":{"d41":"d41"}}}

##参数说明：
 ### rootPath：根路径；<br>
  
 ### data：请求参数数组，req为请求路径；<br>res为返回参数（接受字符串/数字/数组/函数/对象）；返回参数为数组时，随机返回数组中某一值，为函数时，返回函数返回值，为对象时，会遍历该对象，对象中的value转换成对应的字符串；code为返回状态码，选填，默认200<br>
  
 ### default：没有找到对应接口时返回的值；<br>
  
 ### port：端口，选填，默认8888<br>
