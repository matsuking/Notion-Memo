const User = require("../models/user");
const JWT = require("jsonwebtoken");
const CryptoJS = require("crypto-js");


exports.register = async (req, res) => {
    // パスワードの受け取り
    const password = req.body.password

    console.log(process.env.SECRET_KEY)
    try {
        // const secretKey = CryptoJS.enc.Utf8.parse(process.env.SECRET_KEY)
        // console.log(secretKey)
        // パスワードの暗号化
        req.body.password = CryptoJS.AES.encrypt(
            password,
            process.env.SECRET_KEY
        )
        
        // ユーザーの新規作成
        // req.bodyにあるpasswordはハッシュ化されている
        const user = await User.create(req.body)
        
        // JWT(Json Web Token)の発行
        // 許可証のようなもの。2回目以降のログインが簡単になる？
        const token = JWT.sign(
            {id: user._id}, 
            process.env.TOKEN_SECRET_KEY, 
            {expiresIn: "24h"}
        )

        console.log(user, token)
        return res.status(200).json({user, token})

    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}


// ユーザーログイン用API
exports.login =  async (req, res) => {
    const {username, password} = req.body

    try {
        // DBからユーザーが存在するか探してくる
        const user = await User.findOne({username: username})

        if (!user) {
            return res.status(401).json({
                errors: [{
                    param: "username",
                    msg: "ユーザー名が無効です"
                }]
            })
        }

        // パスワードが合っているか照合する。
        // DBに保存されているパスワードは暗号化されているので、復号化する必要がある
        const decryptedPassWord = CryptoJS.AES.decrypt(
            user.password,
            process.env.SECRET_KEY
        ).toString(CryptoJS.enc.Utf8)
        
        if (decryptedPassWord !== password) {
            return res.status(401).json({
                errors: [{
                    param: "password",
                    msg: "パスワードが無効です。"
                }]
            })
        }
        // JWT(Json Web Token)の発行
        // 許可証のようなもの。2回目以降のログインが簡単になる？
        const token = JWT.sign(
            {id: user._id}, 
            process.env.TOKEN_SECRET_KEY, 
            {expiresIn: "24h"}
        )
        
        return res.status(201).json({user, token})

    } catch (err){
        return res.status(500).json(err)
    }

}