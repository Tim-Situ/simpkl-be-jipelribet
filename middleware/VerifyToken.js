var jwt = require("jsonwebtoken")

async function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
  
    if(token == null){

        return res.status(401).json({
            success: false,
            message: 'TTTTEEEEESSSSSSSS',
            token: token,
            authHeader
        });
        
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err){
            return res.status(403).json({
                success: false,
                message: 'Forbidden'
            });
        }
        
        req.userId = decoded.userId
        req.username = decoded.username
        req.role = decoded.role
        next()
    })
}

module.exports = {
    verifyToken
}

