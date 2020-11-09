const {Schema, model} = require("mongoose");

const squadSchema = new Schema(
    {
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        game: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required:true
        },
        description: {
            type: String,
            required: true
        },
        maxSize: {
            type: Number,
            required: true
        },
        members: {
            type: [Schema.Types.ObjectId],
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)

module.exports = model("Squad", squadSchema)