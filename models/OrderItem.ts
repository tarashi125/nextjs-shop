import { Schema, model, models } from "mongoose";

const OrderItemSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        default: null,
    },
    name: {
        type: String,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
        default: 0.0,
        min: 0,
    },
    price: {
        type: Number,
        required: true,
        default: 0.0,
        min: 0,
    },
    discount:{
        type: Number,
        default: 0,
    },
    tax:{
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

export default models.OrderItem || model('OrderItem', OrderItemSchema);