import mongoose from "mongoose";

const ProductTag = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    tagId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tag', required: true },
}, { timestamps: true })

export {ProductTag}