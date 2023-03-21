export default function handler(req, res) {
    return res.status(200).json({
        name: 'Test Clan Bingo',
        size: 3,
        tiles: [
            { id: 0, name: 'chompy', icon: '', completion: .33 },
            { id: 1, name: 'big fish', icon: '', completion: .5 },
            { id: 2, name: 'cooking', icon: '', completion: 1 },
            { id: 3, name: 'gwd', icon: '', completion: 1 },
            { id: 4, name: 'any pet', icon: '', completion: .9 },
            { id: 5, name: 'trouble brewing', icon: '', completion: 0 },
            { id: 6, name: 'giant mole', icon: '', completion: .1 },
            { id: 7, name: 'smithing', icon: '', completion: .1 },
            { id: 8, name: 'BA', icon: '', completion: .2 },
        ]
    });
}