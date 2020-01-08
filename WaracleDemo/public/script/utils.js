//--------------------------------------

function printObject(obj)
{
	for (let key in obj)
	{
		if (obj.hasOwnProperty(key))
		{
			console.log(key + " : " + obj[key]);
		}
	}
}

//--------------------------------------

function getItemKVP(sName, sImage, sComment, sYum)
{
	return ({name:sName, image:sImage, comment:sComment, yum:sYum});
}

//--------------------------------------

function getElements(sElements)
{
	let aElements = [];
	try
	{
		let asElements = sElements.split("\t");
		for (let i=0; i < asElements.length; i++)
		{
			aElements.push(asElements[i]);
		}
	}
	catch(e)
	{
		console.error(e);
	}
	return (aElements);
}

//--------------------------------------

function ShowDialog(sText, func, params)
{
	$("#dialogText").text(sText);

	$(function()
	{
		$("#dialog").dialog(
		{
			resizable:false,
			modal:true,
			dialogClass:"no-close",
			width:238,
			height:"auto",
			buttons:
			{
				"Yes, do it!":function()
				{
					$(this).dialog("close");
					if (func)
					{
						func(params);
					}
				},
				Cancel:function()
				{
					$(this).dialog("close");
				}
			}
		});
	});
}

//--------------------------------------
