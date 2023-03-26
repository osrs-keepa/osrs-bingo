export default async function handler(req, res) {
    console.log('get board')
    const { bid } = req.query;
    const url = `${process.env.API_URL}/boards/${bid}`;
    const headers = {
        "Authorization": process.env.ADMIN_KEY,
    };
    var response = await fetch(url, {headers});
    var board = await response.json();
    return res.status(200).json(board);
}
