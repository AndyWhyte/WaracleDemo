//--------------------------------------
{	// Create block scope
//--------------------------------------
// These must be kept the same as in server.ts until a better method is found to take the values from server.ts

const IMAGE_WIDTH = 220;
const IMAGE_HEIGHT = 150;
const IMAGE_FILE_SIZE_LIMIT = 60000;	// bytes

//--------------------------------------

let gCurrIndex = 0;
var gaNames;
let gaIds;

let gbHaveSubmitted = false;

const SCROLL_PERIOD_MS = 20;

let gbScrollDone = true;
let gScrollTarget = 0;
let gScrollIncrement = 0;
let gScrollTimer = null;

//--------------------------------------
// Set up body. Intention was to have the page auto resizing if IMAGE_WIDTH or IMAGE_HEIGHT change.
// This idea ran into problems when partially reloading the home page div, so some vars are duplicated above...
// Also, I suspect there may be a better way to achieve auto resizing with css these days.
	
function InitBody(doc, imageWidth, imageHeight, numItems, currIndex, sNames, sIds)
{
	gCurrIndex = currIndex;

	gaNames = getElements(sNames);
	gaIds = getElements(sIds);

	let el = doc.getElementById("homeWrapper");
	el.style.width = (imageWidth * 3) + "px";
	el.style.height = imageHeight + "px";
	let borderHeight = ((el.offsetHeight - el.clientHeight) / 2);
	let borderWidth = ((el.offsetWidth - el.clientWidth) / 2);

	el = doc.getElementById("homeCarousel_ul");
	el.style.width = (imageWidth * numItems) + "px";
	el.style.height = imageHeight + "px";
	el.style.left = imageWidth + "px";

	el = doc.getElementById("homeSemitransL");
	el.style.width = imageWidth + "px";
	el.style.height = imageHeight + "px";
	el.style.left = borderWidth + "px";
	el.style.top = borderHeight + "px";

	el = doc.getElementById("homeSemitransR");
	el.style.width = imageWidth + "px";
	el.style.height = imageHeight + "px";
	el.style.left = ((imageWidth * 2) + borderWidth) + "px";
	el.style.top = borderHeight + "px";

	el = doc.getElementById("homeCakeName");
	el.style.width = imageWidth + "px";
	el.style.left = imageWidth + "px";
	el.style.top = (imageHeight + 8) + "px";
	el.value = gaNames[currIndex];

	el = doc.getElementById("homeButtonL");
	el.style.left = (((imageWidth * 3) / 2) - 25) + "px";
	el.style.top = (imageHeight + 45) + "px";

	el = doc.getElementById("homeButtonR");
	el.style.left = (((imageWidth * 3) / 2) + 5) + "px";
	el.style.top = (imageHeight + 45) + "px";

	el = doc.getElementById("homeMofN");
	el.style.left = (((imageWidth * 3) / 2) + 42) + "px";
	el.style.top = (imageHeight + 45) + "px";
	el.value = "(" + (gCurrIndex + 1) + " / " + numItems + ")";

	el = doc.getElementById("homeSubmitButton");
	el.style.left = imageWidth + "px";
	el.style.top = (imageHeight + 75) + "px";

	el = doc.getElementById("submitBackButton");
	el.style.left = imageWidth + "px";
	el.style.top = (imageHeight + 75) + "px";

	el = doc.getElementById("homeViewButton");
	el.style.left = (((imageWidth * 3) / 2) - 35) + "px";
	el.style.top = (imageHeight + 75) + "px";

	el = doc.getElementById("homeDeleteButton");
	el.style.left = ((imageWidth * 2) - 70) + "px";
	el.style.top = (imageHeight + 75) + "px";

	el = doc.getElementById("submitPage");
	el.style.visibility = "hidden";

	el = doc.getElementById("viewPage");
	el.style.visibility = "hidden";

	el = doc.getElementById("submitCakeNameLabel");
	el.style.left = ((imageWidth / 2) - 10) + "px";
	el.style.top = 0 + "px";

	el = doc.getElementById("submitCakeName");
	el.style.left = ((imageWidth / 2) + 110) + "px";
	el.style.top = (0 - borderHeight) + "px";

	el = doc.getElementById("submitSelectImageLabel");
	el.style.left = ((imageWidth / 2) - 10) + "px";
	el.style.top = 30 + "px";

	el = doc.getElementById("submitSelectImage");
	el.style.left = ((imageWidth / 2) + 110) + "px";
	el.style.top = (30 - borderHeight) + "px";

	el = doc.getElementById("submitCakeCommentLabel");
	el.style.left = ((imageWidth / 2) - 10) + "px";
	el.style.top = 60 + "px";

	el = doc.getElementById("submitCakeComment");
	el.style.left = ((imageWidth / 2) + 110) + "px";
	el.style.top = (60 - borderHeight) + "px";

	el = doc.getElementById("submitYumFactorLabel");
	el.style.left = ((imageWidth / 2) - 10) + "px";
	el.style.top = 128 + "px";

	el = doc.getElementById("submitYumFactor");
	el.style.left = ((imageWidth / 2) + 110) + "px";
	el.style.top = (128 - borderHeight) + "px";

	el = doc.getElementById("submitStatusLabel");
	el.style.left = ((imageWidth / 2) - 10) + "px";
	el.style.top = 158 + "px";

	el = doc.getElementById("submitStatus");
	el.style.left = ((imageWidth / 2) + 110) + "px";
	el.style.top = (158 - borderHeight) + "px";

	el = doc.getElementById("submitCakeButton");
	el.style.left = ((imageWidth / 2) + 110) + "px";
	el.style.top = (195 - borderHeight) + "px";

	InitViewDiv(doc, imageWidth, imageHeight);
}

function InitViewDiv(doc, imageWidth, imageHeight)
{
	let el = doc.getElementById("viewCakeName");
	el.style.left = ((imageWidth / 4) + 170) + "px";
	el.style.top = 0 + "px";

	el = doc.getElementById("viewYumFactorLabel");
	el.style.left = ((imageWidth / 4) + 440) + "px";
	el.style.top = 0 + "px";

	el = doc.getElementById("viewYumFactor");
	el.style.left = ((imageWidth / 4) + 425) + "px";
	el.style.top = 20 + "px";

	el = doc.getElementById("viewCakeCommentLabel");
	el.style.left = ((imageWidth / 4) + 20) + "px";
	el.style.top = 5 + "px";

	el = doc.getElementById("viewCakeComment");
	el.style.left = ((imageWidth / 4) + 20) + "px";
	el.style.top = 40 + "px";

	el = doc.getElementById("viewCakeImage");
	el.style.left = ((imageWidth / 4) + 145) + "px";
	el.style.top = 33 + "px";

	el = doc.getElementById("viewBackButton");
	el.style.left = (((imageWidth * 3) / 2) - 35) + "px";
	el.style.top = (imageHeight + 75) + "px";
}

//--------------------------------------

function ViewBack(doc)
{
	doc.getElementById("viewPage").style.visibility = "hidden";
	doc.getElementById("homePage").style.visibility = "visible";

	let img = new Image();
	doc.getElementById("viewCakeImage").src = img;
}

function Submit(doc)
{
	doc.getElementById("homePage").style.visibility = "hidden";
	doc.getElementById("submitPage").style.visibility = "visible";
	doc.getElementById("submitCakeName").value = "";
	doc.getElementById("submitCakeComment").value = "";
	doc.getElementById("submitYumFactor").value = "3";
	doc.getElementById("submitSelectImage").value = "";
	doc.getElementById("submitStatus").value = "";
	gbHaveSubmitted = false;
}

//--------------------------------------
// Uses JQuery Ajax to reload div so number of cakes is
// correct if new cakes have been submitted

function SubmitBack(doc)
{
	doc.getElementById("submitPage").style.visibility = "hidden";

	let el = doc.getElementById("homePage");
	el.style.visibility = "visible";

	if (gbHaveSubmitted)
	{
		gbHaveSubmitted = false;

		$.ajax(
		{
			type:"GET",
			url:"/homeFromSubmit",
			data:"",
			dataType:"html",
			success:function(result)
			{
				$(el).html(result);

				let numItems = doc.getElementById("homeHiddenNumItems").value;
				InitBody(doc, IMAGE_WIDTH, IMAGE_HEIGHT,
					numItems,
					numItems - 1,
					doc.getElementById("homeHiddenNames").value,
					doc.getElementById("homeHiddenIds").value);

				el = doc.getElementById("homeCarousel_ul");
				let left = parseInt(el.style.left, 10);
				left -= ((numItems - 1) * IMAGE_WIDTH);
				el.style.left = left + "px";

				console.log("SubmitBack success");
			},
			error:function(error)
			{
				console.log("SubmitBack error");
			}
		});
	}
}

//--------------------------------------
// Uses JQuery Ajax with FormData to submit a new cake

function SubmitCake(form, doc)
{
	let aElements = form.elements;
	if (aElements["submitCakeName"].value === "")
	{
		doc.getElementById("submitStatus").value = "Please enter a name for your cake.";
		return;
	}
	if (aElements["submitSelectImage"].value === "")
	{
		doc.getElementById("submitStatus").value = "Please upload an image for your cake.";
		return;
	}

	let fileSize = parseInt(aElements["submitSelectImage"].files[0].size, 10);
	if (fileSize > IMAGE_FILE_SIZE_LIMIT)
	{
		doc.getElementById("submitStatus").value = "File too big! File is " + ~~(fileSize / 1000) + "k. Limit is " + (IMAGE_FILE_SIZE_LIMIT / 1000) + "k.";
		return;
	}

	let fd = new FormData(form);
	fd.set("name", aElements["submitCakeName"].value);
	fd.set("comment", aElements["submitCakeComment"].value);
	fd.set("yum", aElements["submitYumFactor"].value);

	$.ajax(
	{
		type:"POST",
		url:"/uploadImage",
		data:fd,
		dataType:"text",
		cache:false,
		contentType:false,
		processData:false,

		xhr: function()
		{
			const myXhr = $.ajaxSettings.xhr();
			if (myXhr.upload)
			{
				gbHaveSubmitted = true;
				console.log("SubmitCake success");
				doc.getElementById("submitStatus").value = "SubmitCake success";
			}
			else
			{
				console.log("SubmitCake error");
				doc.getElementById("submitStatus").value = "SubmitCake error";
			}
			return (myXhr);
		}
	});
}

//--------------------------------------
// Uses JQuery Ajax to reload div to show cake info

function View(doc)
{
	doc.getElementById("homePage").style.visibility = "hidden";

	let el = doc.getElementById("viewPage");
	el.style.visibility = "visible";

	$.ajax(
	{
		type:"GET",
		url:"/viewItem?id=" + gaIds[gCurrIndex],
		data:"",
		dataType:"html",
		success:function(result)
		{
			$(el).html(result);

			InitViewDiv(doc, IMAGE_WIDTH, IMAGE_HEIGHT);

			console.log("View success");
		},
		error:function(error)
		{
			console.log("View error");
		}
	});
}

//--------------------------------------
// Uses JQuery Ajax to reload div so number of cakes is
// correct if cakes have been deleted

function DeleteItem(doc)
{
	ShowDialog("Are you sure you want to delete \"" + gaNames[gCurrIndex] + "\" ?", DoDeleteItem, doc);
}

function DoDeleteItem(doc)
{
	$.ajax(
	{
		type:"DELETE",
		url:"/deleteItem",
		data:{id:gaIds[gCurrIndex]},
		dataType:"html",
		success:function(result)
		{
			$(doc.getElementById("homePage")).html(result);

			InitBody(doc, IMAGE_WIDTH, IMAGE_HEIGHT,
				doc.getElementById("homeHiddenNumItems").value,
				0,
				doc.getElementById("homeHiddenNames").value,
				doc.getElementById("homeHiddenIds").value);

			console.log("DeleteItem success");
		},
		error:function(error)
		{
			console.log("DeleteItem error");
		}
	});
}

//--------------------------------------
// Initiates scroll to the right

function ScrollRight(doc, imageWidth, numItems)
{
	if (gbScrollDone)
	{
		let el = doc.getElementById("homeCarousel_ul");
		let left = parseInt(el.style.left, 10);
		left -= imageWidth;
		if (left >= (-imageWidth * (numItems - 2)))
		{
			gScrollTarget = left;
			gScrollIncrement = -20;
			gbScrollDone = false;
			gScrollTimer = setInterval(UpdateScroll, SCROLL_PERIOD_MS, doc, numItems);
		}
	}
}

//--------------------------------------
// Initiates scroll to the left

function ScrollLeft(doc, imageWidth, numItems)
{
	if (gbScrollDone)
	{
		let el = doc.getElementById("homeCarousel_ul");
		let left = parseInt(el.style.left, 10);
		left += imageWidth;
		if (left <= imageWidth)
		{
			gScrollTarget = left;
			gScrollIncrement = 20;
			gbScrollDone = false;
			gScrollTimer = setInterval(UpdateScroll, SCROLL_PERIOD_MS, doc, numItems);
		}
	}
}

//--------------------------------------
// Completes the scroll and updates (m/n) and the cake name

function UpdateScroll(doc, numItems)
{
	if (!gbScrollDone)
	{
		let el = doc.getElementById("homeCarousel_ul");
		let left = parseInt(el.style.left, 10);
		left += gScrollIncrement;
		el.style.left = left + "px";

		if (left === gScrollTarget)		// ???
		{
			clearInterval(gScrollTimer);
			gScrollTimer = null;
			gbScrollDone = true;
			if (gScrollIncrement > 0)
			{
				if (--gCurrIndex < 0)
				{
					gCurrIndex = 0;
				}
			}
			else
			{
				if (++gCurrIndex > (numItems - 1))
				{
					gCurrIndex = (numItems - 1);
				}
			}
			doc.getElementById("homeMofN").value = "(" + (gCurrIndex + 1) + " / " + numItems + ")";
			doc.getElementById("homeCakeName").value = gaNames[gCurrIndex];
		}
	}
	else
	{
		clearInterval(gScrollTimer);
		gScrollTimer = null;
	}
}

//--------------------------------------
//*
async function registerSW()
{ 
	if ("serviceWorker" in navigator)
	{ 
		try
		{
			await navigator.serviceWorker.register("./sw.js"); 
		}
		catch (e)
		{
			console.log("PWA ServiceWorker registration failed.");
		}
	}
	else
	{
		console.log("Browser not PWA capable. ServiceWorker is not supported.");
	}
}

//--------------------------------------
// Register the PWA service worker listener

window.addEventListener("load", e =>
{
	//registerSW(); 
});
//*/
//--------------------------------------
}
//--------------------------------------
