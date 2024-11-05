



export const userMiddleware = (req, res, next) => {
    console.log("inside user middleware")
    const {token }=req.headers;

    if(!token){
        return res.status(400).json({ error: 'Missing token' });
    }


    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.userId =decoded.userId;
        next()
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}