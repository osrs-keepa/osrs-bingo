export default async function handler(req, res) {
    const { bid } = req.query;
    const url = `${process.env.API_URL}/boards/${bid}`;
    const headers = {
        "Authorization": req.headers.authorization
    };
    var response = await fetch(url, {headers});
    var board = await response.json();
    return res.status(200).json(board);
}
