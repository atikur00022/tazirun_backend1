import mongoose from 'mongoose';
import {ALL_DEFAULT_IMAGE} from "../../config/config.js";

const ColorVariantSchema = new mongoose.Schema({
    color: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 }
});

const DataSchema = new mongoose.Schema(
    {
        campaignId: { type: mongoose.Schema.Types.ObjectId, default: null },
        brandId: { type: mongoose.Schema.Types.ObjectId, default: null },
        categoryId: { type: mongoose.Schema.Types.ObjectId, default: null },
        subCategoryId: { type: mongoose.Schema.Types.ObjectId, default: null },
        subSubCategoryId: { type: mongoose.Schema.Types.ObjectId, default: null },
        name: { type: String, required: true },
        price: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        discountPrice: { type: Number, default: 0 },
        stock: { type: Number, default: 0 },
        colorVariants: [ColorVariantSchema],
        size: { type: String },
        remark: { type: String },
        unit: { type: String, required: true },
        videoUrl: { type: String },
        details: { type: String, required: true },
        specification: { type: String },
        image1: { type: String, default: ALL_DEFAULT_IMAGE },
        image2: { type: String, default: ALL_DEFAULT_IMAGE },
        image3: { type: String, default: ALL_DEFAULT_IMAGE },
        image4: { type: String, default: ALL_DEFAULT_IMAGE },
        image5: { type: String, default: ALL_DEFAULT_IMAGE },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const ProductsModel = mongoose.model('product', DataSchema);
export default ProductsModel;