import mongoose from 'mongoose';

const DataSchema = new mongoose.Schema(
    {
        productId:{type:mongoose.Schema.Types.ObjectId,required:true},
        userId:{type:mongoose.Schema.Types.ObjectId,required:true},
        color:{type:String},
        qty:{type:Number,required:true},
        size:{type:String},
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const CartModel = mongoose.model('cart', DataSchema);

export default CartModel;