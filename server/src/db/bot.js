const {Schema,model} = require('mongoose')

const BotSchema = new Schema({
    name:{
        type: String,
        unique: true
    },
    refresh_token: {
        type: String,
        required: true
    }
})

const botModel = model('Bot' , BotSchema)
module.exports = botModel