import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    customerId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    divisionId: {
        type: mongoose.Types.ObjectId,
        required: false
    },
    districtId: {
        type: mongoose.Types.ObjectId,
        required: false
    },
    thanaId: {
        type: mongoose.Types.ObjectId,
        required: false
    },
    regionId: {
        type: mongoose.Types.ObjectId,
        required: false
    },
    items: [{
        productId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        productName: {
            type: String,
            required: true
        },
        qty: {
            type: Number,
            required: true
        },
        unitCost: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        }
    }],
    vatTax: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    otherCost: {
        type: Number,
        default: 0
    },
    shippingCost: {
        type: Number,
        default: 0
    },
    grandTotal: {
        type: Number,
        required: true
    },
    note: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
});

// For backward compatibility with existing data
SaleSchema.virtual('productId').get(function() {
    return this.items.length > 0 ? this.items[0].productId : null;
});

SaleSchema.virtual('productName').get(function() {
    if (this.items.length === 1) {
        return this.items[0].productName;
    } else if (this.items.length > 1) {
        return `${this.items[0].productName} + ${this.items.length - 1} more`;
    }
    return null;
});

SaleSchema.set('toJSON', { virtuals: true });

const SaleModel = mongoose.model('sales', SaleSchema);
export default SaleModel;