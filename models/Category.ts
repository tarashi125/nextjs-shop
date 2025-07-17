import {Schema, model, models, Document} from "mongoose";

export interface ICategory extends Document {
    _id: string;
    name: string;
    description: string;
}


const CategorySchema = new Schema<ICategory>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
}, {
    timestamps: true,
});

export default models.Category || model('Category', CategorySchema);