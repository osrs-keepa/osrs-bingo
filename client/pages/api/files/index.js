export default async function handler(req, res) {
    var headers = { "Authorization": process.env.ADMIN_KEY };
    var response = await fetch(`${process.env.API_URL}/files?boardId=${req.query.boardId}&tileId=${req.query.tileId}`, { headers });
    var storageLink = await response.json();
    return res.status(200).json(storageLink.Item);
}