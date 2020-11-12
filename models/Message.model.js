const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
    {
        senderId: {
            type: String,
            required: true
        },
        senderName: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        room: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = model("Message", messageSchema)