const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numberView:{
        type:Number,
        default: 0,
    },
    image: {
      type: String,
      default: 'https://st4.depositphotos.com/5927262/20739/i/450/depositphotos_207396570-stock-photo-happy-summer-time-freelancer-travel.jpg'
    },
    author: {
      type: String,
      default: 'Admin',
    }
}, {
      timestamps: true,
      toJSON: {virtuals:true},
      toObject: {virtuals:true}
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);