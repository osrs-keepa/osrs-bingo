export default async function handler(req, res) {
    console.log(req.query);
    var response = await fetch(`${process.env.API_URL}/keys/${req.query.password}`);
    console.log(response);
    try {
        var user = await response.json();
        return res.status(200).json(user);
    } catch(err)
    {
        return res.status(401).json({message: "Unauthorized"});
    }
    
}