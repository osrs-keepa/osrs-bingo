export default function handler(req, res) {
    if(req.body.message.password != "password")
    {
        res.status(401).json({ error: 'unauthorized' });
    }
    res.status(200).json({ message: req.body });
}  