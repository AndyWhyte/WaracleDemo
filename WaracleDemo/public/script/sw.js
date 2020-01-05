//--------------------------------------
// All PWA listener cache and network handling 

const bLOAD_INDIVIDUALLY = false;

const cacheName = "pwa-cache";

const aResources =
[
	"./",
	"./home",
	"./html/Page1.html",
	"./html/AjaxRes.html",
	"./images/logo.png",
	"./SS1.css",

	"./jquery-ui.css",
	"./jquery-3.4.1.js",
	"./jquery-ui.js",
	"./utils.js",
	"./sw.js",
	"./Page1.js",
	//"./demo.js",

	"./manifest.json",
	"./favicon.ico",
];

//--------------------------------------

self.addEventListener("install", async event =>
{
	console.log("install event");
	const cache = await caches.open(cacheName); 

	if (bLOAD_INDIVIDUALLY)
	{
		await cache.add("./");
		await cache.add("./home");

		// A mystery to me why some resurces need their paths
		await cache.add("./html/Page1.html");
		await cache.add("./html/AjaxRes.html");
		await cache.add("./images/logo.png");

		// and other's don't...
		await cache.add("./SS1.css");
		await cache.add("./jquery-ui.css");
		await cache.add("./jquery-3.4.1.js");
		await cache.add("./jquery-ui.js");
		await cache.add("./utils.js");
		await cache.add("./sw.js");
		await cache.add("./Page1.js");
		//await cache.add("./demo.js");
		await cache.add("./manifest.json");
		await cache.add("./favicon.ico");
	}
	else
	{
		await cache.addAll(aResources);
	}
});

//--------------------------------------

self.addEventListener("fetch", async event =>
{
	console.log("fetch event");

	const req = event.request;
	if (/.*(json)$/.test(req.url))
	{
		event.respondWith(tryNetwork(req));
	}
	else
	{
		event.respondWith(tryCache(req));
	}
});

//--------------------------------------

async function tryNetwork(req)
{
	const cache = await caches.open(cacheName);
	try
	{ 
		let networkRes = null;
		try
		{
			networkRes = await fetch(req);
		}
		catch (e)
		{ 
			console.error(e);
		}

		if (networkRes)
		{
			cache.put(req, networkRes.clone());
			console.log("network res");
			return (networkRes);
		}
		else
		{
			const cacheRes = await cache.match(req);
			console.log("cache res");
			return (cacheRes);
		}
	}
	catch (e)
	{ 
		console.error(e);
	}
	console.log("null res");
	return (null);
}

//--------------------------------------

async function tryCache(req)
{
	const cache = await caches.open(cacheName);
	try
	{ 
		const cacheRes = await cache.match(req);
		if (cacheRes)
		{
			console.log("cache res");
			return (cacheRes);
		}
		else
		{
			return (tryNetwork(req));
		}
	}
	catch (e)
	{ 
		console.error(e);
	}
	console.log("null res");
	return (null);
}

//--------------------------------------
