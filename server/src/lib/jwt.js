const jwt = require('jsonwebtoken')
require('dotenv').config()

const secret = Buffer.from(process.env.JWT_SECRET , 'base64')

function sign({ twitchId }){
    return new Promise((resolve,reject)=>{
        jwt.sign({ twitchId } , 
            secret,
            {
                expiresIn: '1h'
            },
            (err,token) => {
                if(err) return reject(err)
                resolve(token)
            }
        )
    }) 
}

function verify(token){
    return new Promise((resolve,reject) => {
        jwt.verify(
            token,
            secret,
            (err,decoded) => {
                if (err) return reject(err)
                return resolve(decoded)
            }
        )
    })
}

module.exports = {
    sign,
    verify
}