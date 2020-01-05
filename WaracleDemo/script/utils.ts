//--------------------------------------
{	// Create block scope
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

function params2KVP(sParams)
{
	let kvp = {};
	try
	{
		let asParams = sParams.split("&");
		for (let i=0; i < asParams.length; i++)
		{
			let sKVP = asParams[i].split("=");
			kvp[sKVP[0]] = sKVP[1].trim();
		}
	}
	catch(e)
	{
		console.error(e);
	}
	return (kvp);
}

//--------------------------------------

function btoa(input)
{
	let sKey = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
	let output = "";

	try
	{
		for (let i=0; i < input.length;)
		{
			let c1 = input[i++];
			let c2 = input[i++];
			let c3 = input[i++];

			let sE1 = sKey.charAt(c1 >> 2);
			let sE2;
			let sE3;
			let sE4;

			if (isNaN(c2))
			{
				sE2 = sKey.charAt((c1 & 0x03) << 4);
				sE3 = "=";
				sE4 = "=";
			}
			else if (isNaN(c3))
			{
				sE2 = sKey.charAt(((c1 & 0x03) << 4) | (c2 >> 4));
				sE3 = sKey.charAt((c2 & 0x0f) << 2);
				sE4 = "=";
			}
			else
			{
				sE2 = sKey.charAt(((c1 & 0x03) << 4) | (c2 >> 4));
				sE3 = sKey.charAt(((c2 & 0x0f) << 2) | (c3 >> 6));
				sE4 = sKey.charAt(c3 & 0x3f);
			}
			output += (sE1 + sE2 + sE3 + sE4);
		}
	}
	catch(e)
	{
		console.error(e);
	}
	return (output);
}

//--------------------------------------

exports.printObject = printObject;
exports.getItemKVP = getItemKVP;
exports.params2KVP = params2KVP;
exports.btoa = btoa;

//--------------------------------------
}
//--------------------------------------
