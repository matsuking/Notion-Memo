const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const app = express();
const PORT = 5050;


// これがないと、envファイルを読み込めない
require('dotenv').config();

app.use(cors({
    // フロントエンド側のポート番号3000はCORSエラーが発生しないようにする。
    origin: "http://localhost:3000"
}))

// jsonオブジェクトとして認識させる。
// postやgetするときに使用する。
app.use(express.json())

// localhost:5050/api/v1/registerのapi/v1の部分を設定
app.use("/api/v1", require("./src/v1/routes"))

// DB接続
try {
    mongoose.connect("mongodb+srv://matsuking0428:matsuking0428@cluster0.57qcjqf.mongodb.net/?retryWrites=true&w=majority")
    console.log("DB接続")
} catch (error) {
    console.log(error)
}


app.listen(PORT, ()=> {
    console.log("ローカルサーバー起動中・・・")
})