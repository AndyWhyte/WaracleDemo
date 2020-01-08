//--------------------------------------

//const utils = require("./utils");	// Already required

const DB_NAME = "WaracleDemo";
const MONGO_URI = "mongodb+srv://Test:aMN5QBBUqDpabyGt@cluster0-if8i0.azure.mongodb.net/test?retryWrites=true&w=majority";

const mongo_params =
{
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const client = new MongoClient(MONGO_URI, mongo_params);

//--------------------------------------

let bClientConnected = false;

async function connectClient()
{
	if (!bClientConnected)
	{
		await client.connect();
		bClientConnected = true;
	}
}

//--------------------------------------

async function readItem(sColl, id, choose, func, aData)
{
	try
	{
		await connectClient();
		await client.db(DB_NAME).collection(sColl).findOne({ _id: new mongodb.ObjectId(id)}, choose, function(err, item)
		{
			if (!err)
			{
				console.log("readItem success");

				if (func)
				{
					aData.push(item);
					func(aData);
				}
				else
				{
					//utils.printObject(item);
				}
			}
			else
			{
				console.error("readItem error = " + err);
			}
		});
	}
	catch(e)
	{
		console.error(e);
	}
}

//--------------------------------------

async function readAllItems(sColl, choose, func, aData)
{
	try
	{
		await connectClient();
		await client.db(DB_NAME).collection(sColl).find({}, choose).toArray(function(err, aItems)
		{
			try
			{
				if (!err)
				{
					console.log("readAllItems success. Length = " + aItems.length);

					if (func)
					{
						aData.push(aItems);
						func(aData);
					}
					else
					{
						//for (let item of aItems)
						{
							//utils.printObject(item);
						}
					}
				}
				else
				{
					console.error("readAllItems error = " + err);
				}
			}
			catch (e)
			{
				console.error(e);
			}
		});
	}
	catch(e)
	{
		console.error(e);
	}
}

//--------------------------------------

async function insertItem(sColl, kvp)
{
	try
	{
		await connectClient();
		await client.db(DB_NAME).collection(sColl).insertOne(kvp, function(err, data)
		{
			if (!err)
			{
				console.log("insertItem success");
			}
			else
			{
				console.error("insertItem error = " + err);
			}
		});
	}
	catch(e)
	{
		console.error(e);
	}
}

//--------------------------------------

async function updateItem(sColl, id, kvp)
{
	try
	{
		await connectClient();
		await client.db(DB_NAME).collection(sColl).updateOne({ _id: new mongodb.ObjectId(id)}, { $set: kvp}, function(err, data)
		{
			if (!err)
			{
				console.log("updateItem success");
			}
			else
			{
				console.error("updateItem error = " + err);
			}
		});
	}
	catch(e)
	{
		console.error(e);
	}
}

//--------------------------------------

async function deleteItem(sColl, id, func, aData)
{
	try
	{
		await connectClient();
		await client.db(DB_NAME).collection(sColl).deleteOne({ _id: new mongodb.ObjectId(id)}, function(err, data)
		{
			if (!err)
			{
				console.log("deleteItem success");

				if (func)
				{
					func(aData);
				}
			}
			else
			{
				console.error("deleteItem error = " + err);
			}
		});
	}
	catch(e)
	{
		console.error(e);
	}
}

//--------------------------------------

exports.connectClient = connectClient;
exports.readItem = readItem;
exports.readAllItems = readAllItems;
exports.insertItem = insertItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;

//--------------------------------------
