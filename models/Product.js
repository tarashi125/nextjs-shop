import {Schema} from "mongoose";

const mongoose = require("mongoose");
const slugify = require("slugify");

function createSlug(str) {
    return str
        .toLowerCase()
        .normalize("NFD")                     // tách dấu tiếng Việt
        .replace(/[\u0300-\u036f]/g, "")     // xoá dấu
        .replace(/[^a-z0-9\s-]/g, "")        // loại bỏ ký tự đặc biệt
        .trim()                              // loại bỏ khoảng trắng đầu/cuối
        .replace(/\s+/g, "-")                // thay khoảng trắng bằng -
        .replace(/-+/g, "-");                // loại bỏ dấu - liên tiếp
}

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    price: {
        type: Number,
        default: null,
    },
    category: {
        type: [Schema.Types.ObjectId],
    },
}, {
    timestamps: true, // ✅ createdAt & updatedAt
});

// Tạo slug tự động trước khi lưu
ProductSchema.pre("save", async function (next) {
    if (!this.isModified("name") || this.slug) return next();

    let baseSlug = slugify(this.name, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    // Kiểm tra slug đã tồn tại chưa
    while (await mongoose.models.Product.findOne({ slug })) {
        slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
    next();
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
