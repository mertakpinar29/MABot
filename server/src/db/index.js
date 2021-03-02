const mongoose = require('mongoose')

require('./bot')

mongoose.connect(`mongodb://${process.env.MONGO_HOST}/` , {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    dbName: process.env.MONGO_DBNAME,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

const {connection:db} = mongoose

db.on('connected' , ()=>{
    console.log('db connected')
})


db.on('disconnected' , ()=>{
    console.log('db disconnected')
})

db.on('error' , err => {
    console.log(err)
})

module.exports = db