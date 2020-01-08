//--------------------------------------
const image2base64 = require("image-to-base64");
//const db = require("./mongo");	// already required
//--------------------------------------
function insertItemWithImage(coll, kvp, sUrl) {
    try {
        image2base64(sUrl)
            .then(img => {
            kvp["image"] = img;
            db.insertItem(coll, kvp);
        })
            .catch(err => {
            console.error("insertItemWithImage error = " + err);
        });
    }
    catch (e) {
        console.error(e);
    }
}
//--------------------------------------
function updateItemWithImage(coll, id, kvp, sUrl) {
    try {
        image2base64(sUrl)
            .then(img => {
            kvp["image"] = img;
            db.updateItem(coll, id, kvp);
        })
            .catch(err => {
            console.error("updateItemWithImage error = " + err);
        });
    }
    catch (e) {
        console.error(e);
    }
}
//--------------------------------------
exports.insertItemWithImage = insertItemWithImage;
exports.updateItemWithImage = updateItemWithImage;
//--------------------------------------
//# sourceMappingURL=helper.js.map