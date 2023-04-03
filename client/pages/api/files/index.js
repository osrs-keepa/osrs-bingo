// GET files by tile
export default async function handler(req, res) {
    console.log('token', req.headers.authorization);
    var headers = { "Authorization": req.headers.authorization };
    var response = await fetch(`${process.env.API_URL}/files?boardId=${req.query.boardId}&tileId=${req.query.tileId}`, { headers });
    var storageLink = await response.json();
    return res.status(200).json(storageLink.Item);
}