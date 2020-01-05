//--------------------------------------
// Ensure the values in Page1.js are kept the same as these.

const IMAGE_WIDTH = 220;
const IMAGE_HEIGHT = 150;
const IMAGE_FILE_SIZE_LIMIT = 60000;	// bytes

//--------------------------------------

const PORT = 1234;
const sCAKES_COLLECTION = "Cakes";
const IGNORE_COMMENT_AND_YUM = {projection:{comment:0, yum:0}};
const IGNORE_ID = {projection:{_id:0}};

//--------------------------------------

const express = require("express");
const ejs = require("ejs");
const busboy = require("busboy");

//--------------------------------------

const app = express();

app.engine("html", ejs.renderFile);
app.set("view engine", "ejs");
app.set("views", __dirname + "/public/html");

//--------------------------------------

const utils = require("./script/utils");
const db = require("./script/mongo");
const helper = require("./script/helper");

//--------------------------------------

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/public/css"));

app.use(express.static(__dirname + "/public/libs"));	// css in here too
app.use(express.static(__dirname + "/public/script"));
//app.use(express.static(__dirname + "/public/dist"));

//--------------------------------------
// Routing for home page

app.get("/home", function(req, res)
{
	readAllItemsAndRender([res, renderPage1]);
});

//--------------------------------------

app.get("/", function(req, res)
{
	res.writeHead(200, {"Content-Type":"text/html"});
	res.write("Invalid Request.");
	res.end();
});

//--------------------------------------
// Reads all from db and calls to render page

function readAllItemsAndRender(aData)
{
	try
	{
		let res = aData[0];
		let page = aData[1];

		let params =
		{
			"imageWidth":	IMAGE_WIDTH,
			"imageHeight":	IMAGE_HEIGHT,
			"numItems":		0,
			"sItemNames":	"",
			"sItemIds":		"",
			"aItemImages" :	null,
		};
		db.readAllItems(sCAKES_COLLECTION, IGNORE_COMMENT_AND_YUM, page, [res, params]);
	}
	catch(e)
	{
		console.error(e);
	}
}

//--------------------------------------

function getHomePageParams(params, aItems)
{
	if (aItems.length == 0)
	{
		//aItems.push({name: "dummy data", image: "dummy data", _id: "0"});
	}

	let sItemNames = "";
	let sItemIds = "";

	for (let i=0; i < aItems.length; i++)
	{
		//sItemNames += aItems[i].name.replace(/"/g, '\'') + "&";
		sItemNames += aItems[i].name + "&";
		sItemIds += aItems[i]._id + "&";
	}
	sItemNames = sItemNames.substring(0, sItemNames.length - 1);
	sItemIds = sItemIds.substring(0, sItemIds.length - 1);

	params.numItems = aItems.length;
	params.sItemNames = sItemNames;
	params.sItemIds = sItemIds;

	params.aItemImages = [];
	for (let i=0; i < aItems.length; i++)
	{
		params.aItemImages.push(aItems[i].image);
	}
	return (params);
}

//--------------------------------------
// Render everything. Initially I wasn't sure if it would all be single page, hence Page1

function renderPage1(aData)
{
	try
	{
		let res = aData[0];
		let params = aData[1];
		let aItems = aData[2];
		params = getHomePageParams(params, aItems);

		res.render("Page1.html", params, function(err, data)
		{
			if (!err)
			{
				res.writeHead(200, {"Content-Type":"text/html"});
				res.write(data);
			}
			else
			{
				res.writeHead(404);
				res.write("Page not found.")
			}
			res.end();
		});
	}
	catch(e)
	{
		console.error(e);
	}
}

//--------------------------------------
// Partially render home page

function renderHomePageDiv(aData)
{
	try
	{
		let res = aData[0];
		let params = aData[1];
		let aItems = aData[2];

		params = getHomePageParams(params, aItems);
		res.render("AjaxPartialHomePageRes.html", params, function(err, data)
		{
			if (!err)
			{
				res.writeHead(200, {"Content-Type":"text/html"});
				res.write(data);
			}
			else
			{
				res.writeHead(404);
				res.write("Page not found.")
			}
			res.end();
		});
	}
	catch(e)
	{
		console.error(e);
	}
}

//--------------------------------------
// Partially render view page

function renderViewPageDiv(aData)
{
	try
	{
		let res = aData[0];
		let params = aData[1];
		let item = aData[2];

		params.itemInfo = {name: item.name, image: item.image, comment: item.comment, yum: item.yum};

		res.render("AjaxPartialViewPageRes.html", params, function(err, data)
		{
			if (!err)
			{
				res.writeHead(200, {"Content-Type":"text/html"});
				res.write(data);
			}
			else
			{
				res.writeHead(404);
				res.write("Page not found.")
			}
			res.end();
		});
	}
	catch(e)
	{
		console.error(e);
	}
}

//--------------------------------------
// Routing for home page partial render

app.get("/homeFromSubmit", function(req, res)
{
	let data = "";
	req.on("data", function(chunk)
	{
		data += chunk;
	}).on("end", function()
	{
		readAllItemsAndRender([res, renderHomePageDiv]);
	});

	req.on("error", function(err)
	{
		console.error(err);
		res.writeHead(200, {"Content-Type":"text/plain"});
		res.write("homeFromSubmit error")
		res.end();
	});
});

//--------------------------------------
// Routing for upload cake

app.put("/uploadItem", function(req, res)
{
	let data = "";
	req.on("data", function(chunk)
	{
		data += chunk;
	}).on("end", function()
	{
		try
		{
			if (data !== "")
			{
				res.writeHead(200, {"Content-Type":"text/plain"});
				res.write("uploadItem success")
				res.end();

				let kvp = utils.params2KVP(data);

				let index = 1;
				if (kvp["image"] == "")
				{
					index = (((kvp["name"] - 1) % 10) + 1);
				}

				helper.insertItemWithImage(sCAKES_COLLECTION, kvp, "C:/Projects/WebApp/Node/WaracleDemo/WaracleDemo/public/images/motogp" + index + ".jpg");
			}
			else
			{
				res.writeHead(200, {"Content-Type":"text/plain"});
				res.write("uploadItem error")
				res.end();
			}
		}
		catch(e)
		{
			console.error(e);
		}
	});

	req.on("error", function(err)
	{
		console.error(err);
		res.writeHead(200, {"Content-Type":"text/plain"});
		res.write("uploadItem error2")
		res.end();
	});
});

//--------------------------------------
// Routing for upload cake image

app.post("/uploadImage", function(req, res)
{
	let bb = new busboy({headers:req.headers, limits: {fields:3, files:1, fileSize:IMAGE_FILE_SIZE_LIMIT} });

	let image;
	let sName = "";
	let sComment = "";
	let sYum = "";

	bb.on("file", function(fieldname, file, filename, encoding, mimetype)
	{
		file.on("data", function(data)
		{
			image = data;	// May image need concatenated for larger files?
		});

		file.on("end", function()
		{
		});
	});

	bb.on("field", function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype)
	{
		if (fieldname == "name")
		{
			sName = val;
		}
		else if (fieldname == "comment")
		{
			sComment = val;
		}
		else if (fieldname == "yum")
		{
			sYum = val;
		}
	});
		
	bb.on("finish", function()
	{
		console.log("Done parsing form!");
		res.writeHead(303, { Connection: "close", Location: "/" });
		res.end();

		let sImage = "";
		if (image)
		{
			sImage = utils.btoa(image);
		}

		let kvp = utils.getItemKVP(sName, sImage, sComment, sYum);
		db.insertItem(sCAKES_COLLECTION, kvp);
	});

	req.pipe(bb);
});

//--------------------------------------
// Routing for view page partial render

app.get("/viewItem", function(req, res)
{
	try
	{
		if (req.query.id)
		{
			let params =
			{
				"imageWidth":	IMAGE_WIDTH,
				"imageHeight":	IMAGE_HEIGHT,
				"itemInfo":		null,
			};

			db.readItem(sCAKES_COLLECTION, req.query.id, IGNORE_ID, renderViewPageDiv, [res, params]);
		}
		else
		{
			res.writeHead(200, {"Content-Type":"text/plain"});
			res.write("viewItem error")
			res.end();
		}
	}
	catch(e)
	{
		console.error(e);
	}
});

//--------------------------------------
// Routing for delete cake and home page partial render

app.delete("/deleteItem", function(req, res)
{
	let data = "";
	req.on("data", function(chunk)
	{
		data += chunk;
	}).on("end", function()
	{
		try
		{
			if (data !== "")
			{
				let kvp = utils.params2KVP(data);
				db.deleteItem(sCAKES_COLLECTION, kvp["id"], readAllItemsAndRender, [res, renderHomePageDiv]);
			}
			else
			{
				res.writeHead(200, {"Content-Type":"text/plain"});
				res.write("deleteItem error")
				res.end();
			}
		}
		catch(e)
		{
			console.error(e);
		}
	});

	req.on("error", function(err)
	{
		console.error(err);
		res.writeHead(200, {"Content-Type":"text/plain"});
		res.write("deleteItem error2")
		res.end();
	});
});

//--------------------------------------

app.listen(PORT, function()
{
	console.log("Listening on port " + PORT);
/*
	let kvp =
	{
		name:"1",
		image:"",
		comment:"",
		yum:"",
	}
	helper.insertItemWithImage(sCAKES_COLLECTION, kvp, "C:/Projects/WebApp/Node/WaracleDemo/WaracleDemo/public/images/motogp1.jpg");
*/
	//db.insertItem(cakesCollection, cakeItem);
	//db.updateItem(cakesCollection, 2, cakeItem);
	//db.readItem(cakesCollection, 2);
	//db.readAllItems(cakesCollection, null);

	//db.deleteItem(cakesCollection, 5);
	//db.deleteItem(cakesCollection, 4);
	//db.deleteItem(cakesCollection, 3);
	//db.deleteItem(cakesCollection, 2);
	//db.deleteItem(cakesCollection, 1);
});

//--------------------------------------
