var VPost = require("../lib/VPost");

var config = {
		rootPath: "",
		data: [{
				"req": "getString",
				"res": "string",
			}, {
				"req": "/getFuntion",
				"res": function() {
					return '{"funtion":"' + String(Math.random()) + '"}'
				}
			}, {
				"req": "/getArray",
				"res": [1, 2, 3, 4, 5]
			}, {
				"req": "/getObject",
				"res": {
					a: "a",
					b: ["b1", "b2", "b3"],
						c: function() {
							return "c";
						},
						d: {
							d1: "d1",
							d2: ["d21", "d22", "d23"],
							d3: function() {
								return "d3"
							},
							d4: {
								d41: "d41"
							}
						}
					}
				},
				{
					"req":/regExp/i,
					"res":"RegExp"
				}
			],
			default: "not found",
			code: [{
				404: ""
			}, {
				201: ""
			}],
			port: "2048"

		}

			var vPost = new VPost(config);