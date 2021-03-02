const axios = require('axios')
require('dotenv').config()

const authBaseUrl = 'https://id.twitch.tv/oauth2'
const authAPI = axios.create({
	baseURL: authBaseUrl
})

const helixBaseUrl = 'https://api.twitch.tv/helix'
const helix = axios.create({
    baseURL: helixBaseUrl
})
async function getUser({ token } = {}) {
	const { data: { data } } = await helix.get('/users', {
		headers: {
			'Authorization': `Bearer ${token}`,
            'Client-Id': process.env.TWITCH_CLIENT_ID
		}
	});
	return data[0] || null;
}

async function getUsers({id = [], token}){
	if(!id.length) return []
	
	const qs = new URLSearchParams()
	for(const n of id){
		qs.append('id' , n)
	}
	const {data: {data}} = await helix.get(`/users?${qs}`, {
		headers:{
			Authorization: `Bearer ${token}`,
			'Client-Id': process.env.TWITCH_CLIENT_ID
		}
	})
	return data
}

async function getAcessToken(refresh_token){
	const qs = new URLSearchParams({
		grant_type: 'refresh_token',
		refresh_token,
		client_id: process.env.TWITCH_CLIENT_ID,
		client_secret: process.env.TWITCH_CLIENT_SECRET,
		
	})
	const {data} = await authAPI.post(`token?${qs}`)
	return data
}

module.exports = {
    authAPI,
	getUser,
	getUsers,
	getAcessToken
}