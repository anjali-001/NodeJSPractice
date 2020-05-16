const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var favouriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dish: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }]
    
})

var Favourite = mongoose.model('Favourite', favouriteSchema);
module.exports = Favourite;