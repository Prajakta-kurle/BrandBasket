const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    userId : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    cartId : String,
    cartItems : [
        {
            productId : String,
            title : String,
            image : String,
            price : String,
            quantity : Number
        }
    ],
    addressInfo : {
        addressId : String,
        address : String,
        city : String,
        pinCode : String,
        phone : String,
        notes : String
    },
    orderStatus : String,
    paymentMethod : String,
    paymentStatus : String,
    totalAmount : String,
    orderDate : String,
    orderUpdateDate : Date,
    paymentId : String,
    payerId : String
});

module.exports = mongoose.model("Order", OrderSchema);
