# VPost

Short for virtual-post, an easy module for frontend engineer to create temporary API with node.js

本模块(virtual-post)适用于前端工程师创建临时接口用于调试代码。样例如下：

##example：
```javascript
var VPost = require("../lib/VPost");

var config = {
	rootPath:"/test",
	filePath: "",
	data:[
		{
			"req":"/getString",
			"res":'{"str":"aa"}',
			"code":"201"
		},
		{
			"req":"/getFunction?a=111",
			"res":function(url){
				return '{"function":"' + String(Math.random()) + '","a":"' + url.$query.a + '"}' 
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
		},
		{
			"req":/regExp/i,
			"res":"RegExp"
		}
	],
	default:"not found",
	port:"2048"
	
} 

var vPost = new VPost(config);
```

##用node运行起来，即可在127.0.0.1:2048访问到接口：
##run by node and visit in 127.0.0.1:2048:

VPost接收到请求时，优先匹配接口，假如没有成功匹配对应接口，则继续尝试匹配文件（默认放入www/文件夹内），二者都匹配失败时返回404

request：127.0.0.1:2048/test/getString<br>
response：{"str":"aa"}

request：127.0.0.1:2048/test/getFunction?a=111<br>
response：{"function":"0.2123435453534","a":"111"}

request：127.0.0.1:2048/test/getObject<br>
response：{"a":"a","b":"b1","c":"c","d":{"d1":"d1","d2":"d21","d3":"d3","d4":{"d41":"d41"}}}

request：127.0.0.1:2048/test/getRegExp<br>
response：RegExp

request：127.0.0.1:2048/index.html<br>
response：index.html file

request：127.0.0.1:2048/test/getMoney<br>
response：not found

##参数说明 para intro：
 >rootPath：根路径；<br>
 >filePath：文件根路径，默认为‘www/’；<br>
 >data：请求参数数组:<br>
 >>code为返回状态码，选填，默认200<br>
 >>req为请求路径,可以为字符串或正则表达式；<br>
 >>res为返回参数（接受字符串/数字/数组/函数/对象）；<br>
 
 >>>返回参数为数组时，随机返回数组中某一值，如需要返回数组，请用括号括起，如'[1,2,3]'<br>
 >>>为函数时，返回函数返回值，可在参数中传入一个url对象，包含$query和$search两个属性<br>
 >>>为对象时，会遍历该对象，对象中的value转换成对应的字符串；<br>
  
 >default：没有找到对应接口时返回的值；<br>
  
 >port：端口，选填，默认8888<br>
