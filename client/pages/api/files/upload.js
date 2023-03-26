export default async function handler(req, res) {
    var b = {
        fileName: req.query.fileName,
        fileType: req.query.fileType
    };
    const requestObject = {
        method:'POST' ,
        headers: { "Authorization": process.env.ADMIN_KEY },
        body: JSON.stringify(b)
    };
    var response = await fetch(`${process.env.API_URL}/files`, requestObject);
    var storageLink = await response.json();
    return res.status(200).json(storageLink.Item);
}