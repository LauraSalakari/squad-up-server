const {Schema, model} = require("mongoose");

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Please enter your username"]
        },
        email: {
            type: String,
            required: [true, "Please enter your email"]
        },
        password: String,
        platforms: [String],
        games: [String],
        bio: String,
        image: String

    },
    {
        timestamps: true
    }
)

userSchema.index({"email": 1}, {unique: true});
userSchema.index({"username": 1}, {unique: true})

module.exports = model("User", userSchema)