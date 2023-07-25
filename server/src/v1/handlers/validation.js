const { validationResult } = require("express-validator");


// バリデーションチェック
exports.validate = (req, res, next) => {
    const errors = validationResult(req)
    // エラーがあるときの処理
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    // nextを入れないと次の処理に走らない？
    next()
};

