const {Schema, model} = require("mongoose");

const postSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true 
        },
        imageContent: [String],
        upvotes: {
            type: Number
        }
    },
    {
        timestamps: true
    }
)

module.exports = model("Post", postSchema)

// author: ObjectId, ref: User
// title: string
// content: string
// imageContent: string[]
// (upvotes/likes)
// timestamps