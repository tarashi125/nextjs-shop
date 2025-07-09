import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username already exists"],
        match: [
            /^[a-zA-Z0-9_]+$/,
            "Username can only contain letters, numbers, and underscores",
        ],
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    password: String, // Hash this in production!
}, {
    timestamps: true,
});

export default models.User || model("User", UserSchema);