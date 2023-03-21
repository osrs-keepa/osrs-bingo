export default function handler(req, res) {
    return res.status(200).json([
        {
            id: 0,
            tileId: 0,
            date: new Date(),
            name: '/crawlinghand.png',
            width: 773,
            height: 534
        },
        {
            id: 1,
            tileId: 0,
            date: new Date(),
            name: '/vorkathhead.png',
            width: 830,
            height: 499
        },
        {
            id: 2,
            tileId: 0,
            date: new Date(),
            name: '/hydrahead.png',
            width: 773,
            height: 534
        }
    ]);
}