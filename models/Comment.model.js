const {Schema, model} = require("mongoose");

const commentSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: {
            type: String,
            required: true 
        },
        upvotes: {
            type: Number
        },
        originalPost: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = model("Comment", commentSchema)