const mongoose = require("mongoose")

const memoSchema = new mongoose.Schema({
    user: {
        // {
        //  _id: ----,
        //  username: ----,
        //  password: ----,
        // -v: ----,
        // }
        // の_id部分をObjectIdで定義。
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    icon: {
        type: String,
        default: "✍"
    },
    title: {
        type: String,
        default: "無題"
    },
    description: {
        type: String,
        default: "ここに自由に記入してください"
    },
    position: {
        type: Number
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    favoritePosition: {
        type: Number,
        default: 0
    }

})

module.exports = mongoose.model("memo", memoSchema)