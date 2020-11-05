const mongoose = require('mongoose');

let configOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true 
}

let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/squad-up-server'

mongoose.connect(MONGODB_URI, configOptions)
    .then(() => {
        console.log('Yayyy Database "squad-up-server" is connected');
    })
    .catch(() => {
        console.log('Something went wrong!');
    })