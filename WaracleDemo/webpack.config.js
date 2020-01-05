const path = require("path");
const webpack = require("webpack");

module.exports =
{
	mode: "development",
	externals:
	{
		"jquery": "jQuery",
	},
	entry:
	{
		"demo.js":
		[
			path.resolve(__dirname + "/public/libs/jquery-3.4.1.js"),
			path.resolve(__dirname + "/public/libs/jquery-ui.js"),
			path.resolve(__dirname + "/public/script/utils.js"),
			path.resolve(__dirname + "/public/script/sw.js"),
			path.resolve(__dirname + "/public/script/Page1.js"),
		]
	},
	output:
	{
		path: path.resolve(__dirname + "/public/dist"),
		filename: "demo.js",
	},
};
