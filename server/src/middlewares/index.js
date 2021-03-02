const jwt = require('../lib/jwt')

async function decodeAuthHeader(req,res,next){
    const authHeader = req.get('Authorization')
    if(authHeader){
        const token = authHeader.split(' ')[1]
        if(token){
            try {
                const user = await jwt.verify(token) 
                req.user = user
            } catch (error) {
                console.error('Error valitadting token' , token)
            }   
        }
    }
    next()
}

module.exports = {
    decodeAuthHeader
}