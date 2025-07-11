import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        required: true,
        default: 'processing',
    },
    total: {
        type: Number,
        required: true,
        default: 0.0,
        min: 0,
    },
    totalDiscount:{
        type: Number,
        default: 0,
    },
    totalTax:{
        type: Number,
        default: 0,
    },
    items: [
        {
            type: Schema.Types.ObjectId,
            ref: 'OrderItem',
        },
    ],
}, {
    timestamps: true,
});

export default models.Order || model('Order', OrderSchema);