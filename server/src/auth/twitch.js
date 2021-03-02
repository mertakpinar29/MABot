const axios = require('axios')
const express = require('express')


const twitchAPI = require('../lib/twitch-api')
const botModel = require('../db/bot')
const userModel = require('../db/user')
const channelModel = require('../db/channel')
const jwt = require('../lib/jwt')

const redirect_uri = `${process.env.TWITCH_CLIENT_REDIR_HOST}/auth/twitch/callback`
const authBaseUrl = 'https://id.twitch.tv/oauth2'

const authAPI = axios.create({
    baseURL: authBaseUrl,
})


const router = express.Router()
// GET "/auth/twitch"
router.get('/' , (req,res)=>{
    const qs = new URLSearchParams({
        client_id: process.env.TWITCH_CLIENT_ID,
        redirect_uri: redirect_uri,
        response_type: 'code',
        scope: req.query.scope
    })

    const redirectUrl = `${twitchAPI.authAPI.defaults.baseURL}/authorize?${qs}`
    
    res.redirect(redirectUrl)
})

// if user authorizes,page gets redirected to the /callback,we are making a post request there to get the access token
router.get('/callback', async(req,res)=>{
    const {code} = req.query

    const qs = new URLSearchParams({
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirect_uri 
    })


    try {
        const { 
            data: { access_token: token, refresh_token } 
        } = await authAPI.post(`/token?${qs}`)
        const { id: twitchId, } = await twitchAPI.getUser({ token })
        const query = { twitchId }
        const options = {
            new: true,
            upsert: true
        }
        const[ user, channel ] = await Promise.all([
             userModel.findOneAndUpdate(query, {twitchId, refresh_token}, options),
             channelModel.findOneAndUpdate(query, query, options)
        ])
        
        const loginToken = await jwt.sign({twitchId})
        res.json({
            loginToken,
            user,
            channel
        })

    } catch (error) {
        res.json({
            message: error.message,
            body: error.response.data
        })
    }
})

module.exports = router

